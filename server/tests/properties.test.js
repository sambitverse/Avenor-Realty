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

test('GET /properties - Returns paginated property listings with metadata', async () => {
  const res = await fetch(`${baseUrl}/properties?page=1&limit=3`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(Array.isArray(data.data));
  assert.equal(data.data.length, 3);
  assert.ok(data.pagination);
  assert.equal(data.pagination.page, 1);
  assert.equal(data.pagination.limit, 3);
});

test('GET /properties - Applies query filters (purpose, minPrice, maxPrice)', async () => {
  const res = await fetch(`${baseUrl}/properties?purpose=Buy&maxPrice=1000000000`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.data.every(p => p.purpose === 'Buy'));
});

test('GET /properties/:id - Returns single property or 404 for non-existent ID', async () => {
  const resValid = await fetch(`${baseUrl}/properties/prop-101`);
  assert.equal(resValid.status, 200);
  const validData = await resValid.json();
  assert.equal(validData.success, true);
  assert.ok(validData.data.title);

  const resNotFound = await fetch(`${baseUrl}/properties/prop-non-existent-999`);
  assert.equal(resNotFound.status, 404);
  const errorData = await resNotFound.json();
  assert.equal(errorData.code, 'PROPERTY_NOT_FOUND');
});

test('POST /properties - Unauthenticated returns 401', async () => {
  const res = await fetch(`${baseUrl}/properties`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: 'The Solstice Villa',
      description: 'Ultra luxury villa in Alibaug.',
      price: 28000000,
      location: 'Alibaug',
      city: 'Alibaug',
      category: 'Luxury Villas'
    })
  });
  assert.equal(res.status, 401);
});

test('POST /properties - Normal User role returns 403 Forbidden', async () => {
  const userToken = generateAccessToken({
    id: 'usr-user-001',
    email: 'user@avenor.com',
    role: 'User'
  });

  const res = await fetch(`${baseUrl}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userToken}`
    },
    body: JSON.stringify({
      title: 'The Solstice Villa',
      description: 'Ultra luxury villa in Alibaug.',
      price: 28000000,
      location: 'Alibaug',
      city: 'Alibaug',
      category: 'Luxury Villas'
    })
  });
  assert.equal(res.status, 403);
});

test('POST /properties - Admin role creates property successfully', async () => {
  const adminToken = generateAccessToken({
    id: 'usr-admin-001',
    email: 'admin@avenor.com',
    role: 'Admin'
  });

  const res = await fetch(`${baseUrl}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'The Riviera Horizon Residence',
      description: 'Bespoke coastal sanctuary with private beach access.',
      price: 34000000,
      location: 'Goa',
      city: 'Goa',
      category: 'Luxury Villas',
      area_sqft: 5200,
      bedrooms: 5,
      bathrooms: 6
    })
  });

  assert.equal(res.status, 201);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.equal(data.data.title, 'The Riviera Horizon Residence');
});

test('POST /properties - Rejects invalid data (price zero / negative)', async () => {
  const adminToken = generateAccessToken({
    id: 'usr-admin-001',
    email: 'admin@avenor.com',
    role: 'Admin'
  });

  const res = await fetch(`${baseUrl}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      title: 'Invalid Prop',
      description: 'Short',
      price: -500,
      location: 'Goa',
      city: 'Goa',
      category: 'Luxury Villas'
    })
  });

  assert.equal(res.status, 400);
  const data = await res.json();
  assert.equal(data.code, 'VALIDATION_ERROR');
});
