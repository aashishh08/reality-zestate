const errorHandler = (err, req, res, next) => {
  const { status = 500, message = 'Internal Server Error' } = err;

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export default errorHandler;
