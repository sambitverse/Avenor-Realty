# Avenor Realty — Production REST API Specification

Base URL: `/api/v1`

---

## Standard Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Paginated Collection Response
```json
{
  "success": true,
  "count": 12,
  "data": [ ... ],
  "pagination": {
    "total": 48,
    "page": 1,
    "limit": 12,
    "totalPages": 4,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Descriptive human-readable error",
  "code": "ERROR_CODE_ENUM",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email address"
    }
  ]
}
```

---

## Standard Error Codes

| Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `AUTH_REQUIRED` | 401 | Missing Bearer authorization token |
| `INVALID_TOKEN` | 401 | Invalid or unparseable JWT token |
| `TOKEN_EXPIRED` | 401 | Expired JWT token |
| `INVALID_CREDENTIALS` | 401 | Email or password mismatch |
| `FORBIDDEN` | 403 | Authenticated user lacks required role |
| `NOT_FOUND` | 404 | Requested entity does not exist |
| `VALIDATION_ERROR` | 400 | Request body/query failed Zod schema |
| `RATE_LIMIT_EXCEEDED`| 429 | IP reached maximum request allowance |
| `EMAIL_IN_USE` | 409 | Account with email already exists |

---

## 1. Authentication Endpoints (`/api/v1/auth`)

### `POST /api/v1/auth/register`
- **Auth**: Public (Rate Limited: 15 req/15 min)
- **Request Body**:
  ```json
  {
    "name": "Alexander Wright",
    "email": "investor@avenor.com",
    "password": "SecurePassword123!",
    "role": "User",
    "phone": "+91 98765 43210"
  }
  ```
- **Response**: `201 Created` with JWT access token & user object.

### `POST /api/v1/auth/login`
- **Auth**: Public (Rate Limited: 15 req/15 min)
- **Request Body**:
  ```json
  {
    "email": "investor@avenor.com",
    "password": "SecurePassword123!"
  }
  ```
- **Response**: `200 OK` with JWT access token, refresh token & user profile.

### `POST /api/v1/auth/refresh`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "refreshToken": "<jwt-refresh-token>"
  }
  ```
- **Response**: `200 OK` with new access token.

### `GET /api/v1/auth/me`
- **Auth**: Authenticated (`Authorization: Bearer <token>`)
- **Response**: `200 OK` with authenticated user profile.

---

## 2. Properties Endpoints (`/api/v1/properties`)

### `GET /api/v1/properties`
- **Auth**: Public
- **Query Parameters**:
  - `page`: integer (default: 1)
  - `limit`: integer (default: 12, max: 100)
  - `search`: string (search title, location, description)
  - `purpose`: `Buy` | `Rent` | `Lease`
  - `category`: `Luxury Villas` | `Penthouses` | `Sky Apartments` | `Farm Houses` | `Commercial`
  - `city`: string
  - `minPrice`: number
  - `maxPrice`: number
  - `bedrooms`: integer
  - `bathrooms`: integer
  - `tag`: string
- **Response**: `200 OK` with paginated property listings.

### `GET /api/v1/properties/:id`
- **Auth**: Public
- **Response**: `200 OK` with detailed property record.

### `POST /api/v1/properties`
- **Auth**: Authorized (`Admin`, `Agent`, `Property Owner`)
- **Request Body**:
  ```json
  {
    "title": "The Azure Coast Pavilion",
    "description": "Panoramic oceanfront architectural villa.",
    "purpose": "Buy",
    "category": "Luxury Villas",
    "price": 28500000,
    "location": "Alibaug",
    "city": "Alibaug",
    "area_sqft": 4800,
    "bedrooms": 5,
    "bathrooms": 5
  }
  ```
- **Response**: `201 Created`

### `PUT /api/v1/properties/:id`
- **Auth**: Authorized (`Admin`, `Property Owner` of listing)
- **Response**: `200 OK`

### `DELETE /api/v1/properties/:id`
- **Auth**: Authorized (`Admin`, `Property Owner` of listing)
- **Response**: `200 OK`

---

## 3. Favorites Endpoints (`/api/v1/favorites`)

### `GET /api/v1/favorites`
- **Auth**: Authenticated (Returns caller's saved portfolio only)
- **Response**: `200 OK` with paginated favorite properties.

### `POST /api/v1/favorites`
- **Auth**: Authenticated
- **Request Body**:
  ```json
  {
    "propertyId": "prop-101"
  }
  ```
- **Response**: `201 Created`

### `DELETE /api/v1/favorites/:propertyId`
- **Auth**: Authenticated
- **Response**: `200 OK`

---

## 4. User Profile & Admin Management (`/api/v1/users`)

### `GET /api/v1/users/profile`
- **Auth**: Authenticated (Caller profile)

### `PUT /api/v1/users/profile`
- **Auth**: Authenticated (Update own profile)

### `GET /api/v1/users`
- **Auth**: Authorized (`Admin` only)
- **Response**: `200 OK` with paginated user directory.

### `PATCH /api/v1/users/:id/role`
- **Auth**: Authorized (`Admin` only)
- **Request Body**:
  ```json
  {
    "role": "Agent"
  }
  ```

---

## 5. Appointments & Private Inspections (`/api/v1/appointments`)

### `POST /api/v1/appointments`
- **Auth**: Public (Rate Limited: 20 req/15 min)
- **Request Body**:
  ```json
  {
    "propertyId": "prop-101",
    "clientName": "Alexander Wright",
    "clientEmail": "investor@avenor.com",
    "clientPhone": "+91 98765 43210",
    "date": "2026-08-25",
    "timeSlot": "11:00 AM"
  }
  ```

### `GET /api/v1/appointments/my`
- **Auth**: Authenticated (Caller's booked inspections)

### `GET /api/v1/appointments`
- **Auth**: Authorized (`Admin` only)

### `PATCH /api/v1/appointments/:id/status`
- **Auth**: Authorized (`Admin` only)

---

## 6. Real-Time Socket.IO Protocol

### Handshake Authentication
Connect via `auth` token:
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: '<user_jwt_access_token>'
  }
});
```

### Events

#### Join Room
```javascript
socket.emit('join_room', { roomId: 'conv-001' }, (response) => {
  if (response.success) {
    console.log('Joined room:', response.roomId);
  } else {
    console.error('Access denied:', response.error);
  }
});
```

#### Send Message
```javascript
socket.emit('send_message', {
  roomId: 'conv-001',
  conversationId: 'conv-001',
  content: 'Hello, looking forward to the viewing.'
}, (response) => {
  console.log('Message sent:', response);
});
```

#### Receive Message
```javascript
socket.on('receive_message', (message) => {
  console.log('New message received:', message);
});
```
