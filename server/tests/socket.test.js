import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { io as ClientIO } from 'socket.io-client';
import { app, server, io } from '../index.js';
import { generateAccessToken } from '../utils/jwt.js';

let testServer;
let serverPort;

test.before(async () => {
  testServer = http.createServer(app);
  io.attach(testServer);
  await new Promise((resolve) => testServer.listen(0, resolve));
  serverPort = testServer.address().port;
});

test.after(async () => {
  await new Promise((resolve) => testServer.close(resolve));
});

test('Socket.IO Security: Rejects unauthenticated connection (missing token)', async () => {
  await new Promise((resolve) => {
    const socket = ClientIO(`http://127.0.0.1:${serverPort}`, {
      transports: ['websocket'],
      autoConnect: true,
      reconnection: false
    });

    socket.on('connect_error', (err) => {
      assert.match(err.message, /Authentication error/);
      socket.disconnect();
      resolve();
    });

    socket.on('connect', () => {
      socket.disconnect();
      assert.fail('Socket should not connect without token');
    });
  });
});

test('Socket.IO Security: Rejects connection with invalid or malformed token', async () => {
  await new Promise((resolve) => {
    const socket = ClientIO(`http://127.0.0.1:${serverPort}`, {
      transports: ['websocket'],
      auth: { token: 'invalid.token.here' },
      autoConnect: true,
      reconnection: false
    });

    socket.on('connect_error', (err) => {
      assert.match(err.message, /Authentication error/);
      socket.disconnect();
      resolve();
    });

    socket.on('connect', () => {
      socket.disconnect();
      assert.fail('Socket should not connect with invalid token');
    });
  });
});

test('Socket.IO Security: Accepts connection with valid JWT and allows authorized room join', async () => {
  const token = generateAccessToken({
    id: 'usr-investor-001',
    email: 'investor@avenor.com',
    role: 'User',
    name: 'Alexander Wright'
  });

  await new Promise((resolve, reject) => {
    const socket = ClientIO(`http://127.0.0.1:${serverPort}`, {
      transports: ['websocket'],
      auth: { token },
      autoConnect: true,
      reconnection: false
    });

    socket.on('connect_error', (err) => {
      socket.disconnect();
      reject(err);
    });

    socket.on('connect', () => {
      assert.ok(socket.id);

      // Join authorized room (matches conversation or user channel)
      socket.emit('join_room', { roomId: 'conv-001' }, (response) => {
        assert.equal(response.success, true);
        assert.equal(response.roomId, 'conv-001');

        // Send verified message
        socket.emit('send_message', {
          roomId: 'conv-001',
          conversationId: 'conv-001',
          content: 'Testing real-time luxury inquiry'
        }, (sendResponse) => {
          assert.equal(sendResponse.success, true);
          assert.equal(sendResponse.message.senderId, 'usr-investor-001');
          socket.disconnect();
          resolve();
        });
      });
    });
  });
});
