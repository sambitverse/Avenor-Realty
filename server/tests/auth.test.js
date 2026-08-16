import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'http';
import { app } from '../index.js';
import { generateAccessToken, getJwtSecret } from '../utils/jwt.js';

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

test('JWT Utility Security - Fails safely without JWT_SECRET', () => {
  const originalSecret = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    assert.throws(
      () => getJwtSecret(),
      /JWT_SECRET environment variable is required/,
      'Should throw explicit error when JWT_SECRET is missing'
    );
  } finally {
    process.env.JWT_SECRET = originalSecret;
  }
});

test('POST /auth/register - Successfully creates user and returns JWT token', async () => {
  const testEmail = `test_${Date.now()}@avenor.com`;
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Julian Vance',
      email: testEmail,
      password: 'SecurePassword123!',
      role: 'User'
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token, 'Token should be returned');
  assert.equal(data.user.email, testEmail);
  assert.equal(data.user.password, undefined, 'Password hash must never be returned');
});

test('POST /auth/register - Rejects invalid email and short password (Validation)', async () => {
  const res = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'J',
      email: 'not-an-email',
      password: '123'
    })
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.code, 'VALIDATION_ERROR');
  assert.ok(data.errors.length > 0);
});

test('POST /auth/login - Successfully authenticates user and returns tokens', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'investor@avenor.com',
      password: 'Investor@123'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.token);
  assert.ok(data.refreshToken);
  assert.equal(data.user.email, 'investor@avenor.com');
});

test('POST /auth/login - Rejects invalid password credentials', async () => {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'investor@avenor.com',
      password: 'WrongPassword999!'
    })
  });

  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.code, 'INVALID_CREDENTIALS');
});

test('GET /auth/me - Protected Route returns 401 when token is missing (No Guest Fallback)', async () => {
  const res = await fetch(`${baseUrl}/auth/me`);
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.code, 'AUTH_REQUIRED');
});

test('GET /auth/me - Protected Route returns 401 when token is malformed', async () => {
  const res = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: 'Bearer invalid.malformed.token' }
  });
  assert.equal(res.status, 401);
  const data = await res.json();
  assert.equal(data.success, false);
  assert.equal(data.code, 'INVALID_TOKEN');
});

test('GET /auth/me - Protected Route returns authenticated user with valid token', async () => {
  const token = generateAccessToken({
    id: 'usr-investor-001',
    email: 'investor@avenor.com',
    role: 'User',
    name: 'Alexander Wright'
  });

  const res = await fetch(`${baseUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.user.email, 'investor@avenor.com');
});
