const pool = require('../db/pool');
const { parseFileBuffer, transformProductRow } = require('../utils/fileParser');

// Import products from CSV/Excel
const importProducts = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  try {
    const rawRows = parseFileBuffer(req.file.buffer, req.file.mimetype);

    if (!rawRows || rawRows.length === 0) {
      return res.status(400).json({ success: false, message: 'File is empty or unreadable' });
    }

    const transformed = rawRows.map(transformProductRow);
    const validProducts = transformed.filter(r => r.product_id && r.product_name);

    if (validProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid rows found. Ensure product_id and product_name columns exist.'
      });
    }

    let inserted = 0;
    let updated = 0;
    let reviewsInserted = 0;
    const errors = [];

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const row of validProducts) {
        try {
          const result = await client.query(
            `INSERT INTO products (product_id, product_name, category, discounted_price, actual_price,
              discount_percentage, rating, rating_count, about_product, img_link, product_link)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
             ON CONFLICT (product_id) DO UPDATE SET
               product_name = EXCLUDED.product_name,
               category = EXCLUDED.category,
               discounted_price = EXCLUDED.discounted_price,
               actual_price = EXCLUDED.actual_price,
               discount_percentage = EXCLUDED.discount_percentage,
               rating = EXCLUDED.rating,
               rating_count = EXCLUDED.rating_count,
               about_product = EXCLUDED.about_product,
               img_link = EXCLUDED.img_link,
               product_link = EXCLUDED.product_link,
               updated_at = CURRENT_TIMESTAMP
             RETURNING (xmax = 0) AS inserted`,
            [
              row.product_id, row.product_name, row.category,
              row.discounted_price, row.actual_price, row.discount_percentage,
              row.rating, row.rating_count, row.about_product,
              row.img_link, row.product_link
            ]
          );

          if (result.rows[0]?.inserted) inserted++;
          else updated++;

          // Insert review if present
          if (row.review_id || row.review_content) {
            await client.query(
              `INSERT INTO reviews (product_id, user_id, user_name, review_id, review_title, review_content)
               VALUES ($1,$2,$3,$4,$5,$6)
               ON CONFLICT DO NOTHING`,
              [row.product_id, row.user_id, row.user_name, row.review_id, row.review_title, row.review_content]
            );
            reviewsInserted++;
          }
        } catch (rowErr) {
          errors.push({ product_id: row.product_id, error: rowErr.message });
        }
      }

      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }

    return res.status(200).json({
      success: true,
      message: 'Import completed',
      stats: { total: validProducts.length, inserted, updated, reviewsInserted, errors: errors.length },
      errors: errors.slice(0, 10)
    });
  } catch (err) {
    console.error('Import error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get all products with pagination, search, filter
const getProducts = async (req, res) => {
  try {
    const {
      page = 1, limit = 20, search = '', category = '', minRating = '', maxRating = '',
      sortBy = 'product_name', sortOrder = 'ASC'
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const params = [];
    const conditions = [];

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`p.product_name ILIKE $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`p.category = $${params.length}`);
    }
    if (minRating) {
      params.push(parseFloat(minRating));
      conditions.push(`p.rating >= $${params.length}`);
    }
    if (maxRating) {
      params.push(parseFloat(maxRating));
      conditions.push(`p.rating <= $${params.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const allowedSortFields = ['product_name', 'category', 'rating', 'rating_count', 'discounted_price', 'discount_percentage'];
    const safeSortBy = allowedSortFields.includes(sortBy) ? `p.${sortBy}` : 'p.product_name';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const countResult = await pool.query(
      `SELECT COUNT(*) FROM products p ${whereClause}`, params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit));
    params.push(offset);

    const result = await pool.query(
      `SELECT p.*, 
        (SELECT COUNT(*) FROM reviews r WHERE r.product_id = p.product_id) as review_count
       FROM products p
       ${whereClause}
       ORDER BY ${safeSortBy} ${safeSortOrder} NULLS LAST
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total, page: parseInt(page), limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    console.error('getProducts error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get categories list
const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT DISTINCT category, COUNT(*) as count
       FROM products WHERE category IS NOT NULL AND category != ''
       GROUP BY category ORDER BY count DESC`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Analytics: products per category
const getProductsPerCategory = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, COUNT(*) as count
       FROM products
       WHERE category IS NOT NULL AND category != ''
       GROUP BY category ORDER BY count DESC LIMIT 20`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Analytics: top reviewed products
const getTopReviewedProducts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit || '10');
    const result = await pool.query(
      `SELECT p.product_name, p.rating, p.rating_count, p.category,
        COUNT(r.id) as review_count
       FROM products p
       LEFT JOIN reviews r ON r.product_id = p.product_id
       WHERE p.rating_count IS NOT NULL
       GROUP BY p.id, p.product_name, p.rating, p.rating_count, p.category
       ORDER BY p.rating_count DESC NULLS LAST
       LIMIT $1`,
      [limit]
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Analytics: discount distribution (histogram buckets)
const getDiscountDistribution = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        CASE
          WHEN discount_percentage < 10 THEN '0-10%'
          WHEN discount_percentage < 20 THEN '10-20%'
          WHEN discount_percentage < 30 THEN '20-30%'
          WHEN discount_percentage < 40 THEN '30-40%'
          WHEN discount_percentage < 50 THEN '40-50%'
          WHEN discount_percentage < 60 THEN '50-60%'
          WHEN discount_percentage < 70 THEN '60-70%'
          WHEN discount_percentage < 80 THEN '70-80%'
          WHEN discount_percentage < 90 THEN '80-90%'
          ELSE '90-100%'
        END as bucket,
        COUNT(*) as count,
        MIN(discount_percentage) as min_val
       FROM products
       WHERE discount_percentage IS NOT NULL
       GROUP BY bucket, min_val
       ORDER BY min_val`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Analytics: category-wise average rating
const getCategoryAvgRating = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, 
        ROUND(AVG(rating)::numeric, 2) as avg_rating,
        COUNT(*) as product_count
       FROM products
       WHERE category IS NOT NULL AND category != '' AND rating IS NOT NULL
       GROUP BY category
       HAVING COUNT(*) >= 1
       ORDER BY avg_rating DESC LIMIT 20`
    );
    return res.json({ success: true, data: result.rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Summary stats
const getSummaryStats = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        COUNT(*) as total_products,
        COUNT(DISTINCT category) as total_categories,
        ROUND(AVG(rating)::numeric, 2) as avg_rating,
        SUM(rating_count) as total_ratings,
        ROUND(AVG(discount_percentage)::numeric, 2) as avg_discount
      FROM products
    `);
    const reviewCount = await pool.query('SELECT COUNT(*) as total_reviews FROM reviews');
    return res.json({
      success: true,
      data: { ...stats.rows[0], total_reviews: reviewCount.rows[0].total_reviews }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM reviews WHERE product_id = $1', [productId]
    );
    const result = await pool.query(
      `SELECT * FROM reviews WHERE product_id = $1
       ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
      [productId, parseInt(limit), offset]
    );

    return res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page: parseInt(page), limit: parseInt(limit)
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  importProducts, getProducts, getCategories,
  getProductsPerCategory, getTopReviewedProducts,
  getDiscountDistribution, getCategoryAvgRating,
  getSummaryStats, getProductReviews
};
