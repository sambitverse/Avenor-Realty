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

test('RBAC: Unauthenticated access to /admin/analytics returns 401 Unauthorized', async () => {
  const res = await fetch(`${baseUrl}/admin/analytics`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.code, 'AUTH_REQUIRED');
});

test('RBAC: Normal User role attempting /admin/analytics returns 403 Forbidden', async () => {
  const userToken = generateAccessToken({
    id: 'usr-user-001',
    email: 'user@avenor.com',
    role: 'User',
    name: 'Standard User'
  });

  const res = await fetch(`${baseUrl}/admin/analytics`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });

  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.code, 'FORBIDDEN');
});

test('RBAC: Admin role accessing /admin/analytics returns 200 OK with analytics data', async () => {
  const adminToken = generateAccessToken({
    id: 'usr-admin-001',
    email: 'admin@avenor.com',
    role: 'Admin',
    name: 'Julian Vane'
  });

  const res = await fetch(`${baseUrl}/admin/analytics`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.overview);
});

test('RBAC: Normal User role attempting GET /users returns 403 Forbidden', async () => {
  const userToken = generateAccessToken({
    id: 'usr-user-001',
    email: 'user@avenor.com',
    role: 'User',
    name: 'Standard User'
  });

  const res = await fetch(`${baseUrl}/users`, {
    headers: { Authorization: `Bearer ${userToken}` }
  });

  assert.equal(res.status, 403);
  const data = await res.json();
  assert.equal(data.code, 'FORBIDDEN');
});

test('RBAC: Admin role accessing GET /users returns 200 OK with paginated list', async () => {
  const adminToken = generateAccessToken({
    id: 'usr-admin-001',
    email: 'admin@avenor.com',
    role: 'Admin',
    name: 'Julian Vane'
  });

  const res = await fetch(`${baseUrl}/users?page=1&limit=5`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.ok(data.pagination);
});
