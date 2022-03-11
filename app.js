const http = require('http');

const uuid = require('uuid');

const handleError = require('./handleError');

const todos = [];

const handleServer = (req, res) => {
	const headers = {
		'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
	};

  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });

	if (req.url == '/todos' && req.method == 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
	} else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        
        if (title == undefined) throw error;

        const todo = {
          title: title,
          id: uuid.v4()
        };

        todos.push(todo);

        res.writeHead(200, headers);
        res.write(JSON.stringify({
          status: 'success',
          data: todos
        }));
        res.end();
      } catch (error) {
        handleError(res);
      };
    });
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(el => el.id == id);

    if (index == -1) {
      handleError(res);
      return;
    };

    todos.splice(index, 1);

    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        const id = req.url.split('/').pop();
        const index = todos.findIndex(el => el.id == id);
  
        if (index == -1 || title == undefined) throw error;
  
        todos[index].title = title;
  
        res.writeHead(200, headers);
        res.write(JSON.stringify({
          status: 'success',
          data: todos
        }));
        res.end();
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

