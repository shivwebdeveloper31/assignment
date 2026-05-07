const pool = require('./pool');

const initializeDatabase = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(100) UNIQUE NOT NULL,
        product_name VARCHAR(500) NOT NULL,
        category VARCHAR(200),
        discounted_price DECIMAL(12, 2),
        actual_price DECIMAL(12, 2),
        discount_percentage DECIMAL(5, 2),
        rating DECIMAL(3, 2),
        rating_count INTEGER,
        about_product TEXT,
        img_link TEXT,
        product_link TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id VARCHAR(100) REFERENCES products(product_id) ON DELETE CASCADE,
        user_id VARCHAR(200),
        user_name VARCHAR(300),
        review_id VARCHAR(200),
        review_title TEXT,
        review_content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
      CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
      CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
    `);

    await client.query('COMMIT');
    console.log('✅ Database schema initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Database initialization error:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { initializeDatabase };
