function success(res, message, data = null, code = 200) {
  return res.status(code).json({
    success: true,
    code,
    message,
    data
  });
}

module.exports = {
  success
};
