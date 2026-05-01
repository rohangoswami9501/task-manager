const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    console.error('[Error Details]:', err.stack);
  }
  
  res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
    ...(isDev && { error: err.message })
  });
};

module.exports = errorHandler;
