import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as ws from 'ws';

const indexFilePath = path.resolve(__dirname, 'index.html');

const httpServer = http.createServer(async (req, res) => {
  switch (req.url) {
    case '/': {
      return fs.createReadStream(indexFilePath).pipe(res);
    }

    case '/startBoss': {
      return handleStartBoss(req, res);
    }

    case '/endBoss': {
      return handleEndBoss(req, res);
    }
  }

  res.end();
});

httpServer.addListener('listening', () => {
  console.log('Server is ready');
});

httpServer.listen(3883);

const wsServer = new ws.WebSocketServer({
  server: httpServer,
});

wsServer.on('connection', () => {
  console.log('socked connected');
});

async function handleStartBoss(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log('start boss');
  sendToAllClients('stopMusic');

  res.end();
}

async function handleEndBoss(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log('end boss');
  sendToAllClients('startMusic');

  res.end();
}

function sendToAllClients(message: string) {
  for (const socket of wsServer.clients) {
    socket.send(message);
  }
}
