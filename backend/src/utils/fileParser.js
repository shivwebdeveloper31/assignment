const XLSX = require('xlsx');

const parsePrice = (value) => {
  if (!value) return null;
  const cleaned = String(value).replace(/[₹$,\s]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const parseDiscount = (value) => {
  if (!value) return null;
  const cleaned = String(value).replace(/[%\s]/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
};

const parseRating = (value) => {
  if (!value) return null;
  const num = parseFloat(String(value).trim());
  return isNaN(num) ? null : Math.min(5, Math.max(0, num));
};

const parseRatingCount = (value) => {
  if (!value) return null;
  const cleaned = String(value).replace(/[,\s]/g, '').trim();
  const num = parseInt(cleaned);
  return isNaN(num) ? null : num;
};

const normalizeRow = (row) => {
  const keys = Object.keys(row);
  const normalized = {};
  keys.forEach(k => {
    normalized[k.toLowerCase().replace(/\s+/g, '_')] = row[k];
  });
  return normalized;
};

const KNOWN_COLUMNS = [
  'product_id','product_name','category','discounted_price','actual_price',
  'discount_percentage','rating','rating_count','about_product',
  'user_id','user_name','review_id','review_title','review_content',
  'img_link','product_link'
];

const parseFileBuffer = (buffer, mimetype) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Get raw rows as arrays to detect header row manually
  const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

  // Find which row contains the actual column headers
  // (handles files with extra title rows like "amazon" on row 1)
  let headerRowIndex = 0;
  for (let i = 0; i < Math.min(5, allRows.length); i++) {
    const rowLower = allRows[i].map(c => String(c).toLowerCase().trim());
    if (rowLower.includes('product_id') || rowLower.includes('product_name')) {
      headerRowIndex = i;
      break;
    }
  }

  // Re-parse using detected header row
  const headers = allRows[headerRowIndex].map(c => String(c).toLowerCase().trim());
  const dataRows = allRows.slice(headerRowIndex + 1);

  const result = dataRows
    .filter(row => row.some(cell => cell !== ''))
    .map(row => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i] ?? ''; });
      return obj;
    });

  return result;
};

const transformProductRow = (row) => {
  const n = normalizeRow(row);

  return {
    product_id:          String(n.product_id  || n.id    || '').trim(),
    product_name:        String(n.product_name || n.name  || n.title || '').trim(),
    category:            String(n.category     || n.categories || '').trim(),
    discounted_price:    parsePrice(n.discounted_price  || n.sale_price || n.price),
    actual_price:        parsePrice(n.actual_price      || n.original_price || n.mrp),
    discount_percentage: parseDiscount(n.discount_percentage || n.discount),
    rating:              parseRating(n.rating    || n.avg_rating),
    rating_count:        parseRatingCount(n.rating_count || n.no_of_ratings || n.reviews_count),
    about_product:       String(n.about_product || n.description || n.about || '').trim(),
    img_link:            String(n.img_link  || n.image || n.image_url || '').trim(),
    product_link:        String(n.product_link || n.url || n.link || '').trim(),
    user_id:             String(n.user_id   || '').trim(),
    user_name:           String(n.user_name || n.reviewer || '').trim(),
    review_id:           String(n.review_id || '').trim(),
    review_title:        String(n.review_title   || n.review_header || '').trim(),
    review_content:      String(n.review_content || n.review || n.review_body || '').trim(),
  };
};

module.exports = { parseFileBuffer, transformProductRow };