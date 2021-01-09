const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).send({
    message: err.message || 'Внутренняя ошибка сервера',
  });

  next();
};

module.exports = {
  errorHandler,
};
