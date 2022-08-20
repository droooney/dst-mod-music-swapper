import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import * as ws from 'ws';

const indexFilePath = path.resolve(__dirname, 'index.html');
const musicJsPath = path.resolve(__dirname, 'music.js');

const httpServer = http.createServer(async (req, res) => {
  if (!req.url) {
    return res.end();
  }

  const url = new URL(`http://localhost${req.url}`);

  switch (url.pathname) {
    case '/': {
      return fs.createReadStream(indexFilePath).pipe(res);
    }

    case '/music.js': {
      res.setHeader('Content-Type', 'application/javascript');

      return fs.createReadStream(musicJsPath).pipe(res);
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
  console.log('start boss', getBossName(req));
  sendToAllClients('stopMusic');

  res.end();
}

async function handleEndBoss(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log('end boss', getBossName(req));
  sendToAllClients('startMusic');

  res.end();
}

function sendToAllClients(message: string) {
  for (const socket of wsServer.clients) {
    socket.send(message);
  }
}

function getBossName(req: http.IncomingMessage): string | null {
  if (!req.url) {
    return null;
  }

  return new URL(`http://localhost${req.url}`).searchParams.get('bossName');
}
