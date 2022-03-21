const http = require('http');

const { v4: uuidv4 } = require('uuid');

const headers = require('./headers');

const { handleSuccess,  handleError } = require('./helpers');

const todos = [];

const handleServer = (req, res) => {
  let body = '';
  
  req.on('data', chunk => {
    body += chunk;
  });

	if (req.url == '/todos' && req.method == 'GET') {
    handleSuccess(res, todos);
	} else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        
        if (title == undefined) throw error;

        const todo = {
          title: title,
          id: uuidv4()
        };

        todos.push(todo);

        handleSuccess(res, todos);
      } catch (error) {
        handleError(res);
      };
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    handleSuccess(res, todos);
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(el => el.id == id);

    if (index == -1) {
      handleError(res);
      return;
    };

    todos.splice(index, 1);

    handleSuccess(res, todos);
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        const id = req.url.split('/').pop();
        const index = todos.findIndex(el => el.id == id);
  
        if (index == -1 || title == undefined) throw error;
  
        todos[index].title = title;
  
        handleSuccess(res, todos);
      } catch (error) {
        handleError(res);
      };
    });
  } else if (req.method == 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status: 'false',
      message: '網站無此路由'
    }));
    res.end();
  };
};

const server = http.createServer(handleServer);

server.listen(process.env.PORT || 3000);

