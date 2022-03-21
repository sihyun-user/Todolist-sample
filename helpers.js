const headers = require('./headers');

function handleSuccess(res, paramData) {
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    status: 'success',
    data: paramData,
  }));
  res.end();
};

function handleError(res) {
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    status: 'false',
    message: '欄位未填寫正確，或無此todo id'
  }));
  res.end();
};

module.exports = {
  handleSuccess,
  handleError
};