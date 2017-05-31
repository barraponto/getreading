class FormError extends Error {
  constructor(...args){
    super(...args);
    Error.captureStackTrace(this, FormError);
  }
}

const formErrorMiddleware = (err, req, res, next) => {
  if (err instanceof FormError) {
    req.flash('error', err.message);
    res.redirect(req.originalUrl);
  } else {
    next();
  }
};

// error handler
const genericErrorMiddleware = function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
};

module.exports = {
  FormError,
  formErrorMiddleware,
  genericErrorMiddleware
};
