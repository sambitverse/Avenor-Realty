import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { app } from '../index.js';
import { generateAccessToken } from '../utils/jwt.js';

let server;
let baseUrl;

test.before(async () => {
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}/api/v1`;
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /favorites - Unauthenticated access returns 401 Unauthorized', async () => {
  const res = await fetch(`${baseUrl}/favorites`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.code, 'AUTH_REQUIRED');
});

test('POST /favorites - Authenticated user can save property to portfolio', async () => {
  const userToken = generateAccessToken({
    id: 'usr-investor-001',
    email: 'investor@avenor.com',
    role: 'User'
  });

  const res = await fetch(`${baseUrl}/favorites`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`
    },
    body: JSON.stringify({
      propertyId: 'prop-103'
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.propertyId, 'prop-103');
});

test('GET /favorites - Authenticated user retrieves their own favorites list', async () => {
  const userToken = generateAccessToken({
    id: 'usr-investor-001',
    email: 'investor@avenor.com',
    role: 'User'
  });

  const res = await fetch(`${baseUrl}/favorites?page=1&limit=5`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.pagination);
});

test('DELETE /favorites/:propertyId - Authenticated user removes property from favorites', async () => {
  const userToken = generateAccessToken({
    id: 'usr-investor-001',
    email: 'investor@avenor.com',
    role: 'User'
  });

  const res = await fetch(`${baseUrl}/favorites/prop-103`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${userToken}` }
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.propertyId, 'prop-103');
});
