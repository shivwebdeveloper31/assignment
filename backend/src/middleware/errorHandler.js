const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'File too large' });
  }

  if (err.message && err.message.includes('Only CSV')) {
    return res.status(400).json({ success: false, message: err.message });
  }

  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
