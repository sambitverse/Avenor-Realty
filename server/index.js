import express from 'express';
import http from 'http';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { verifyAccessToken } from './utils/jwt.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { logger } from './utils/logger.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import rentalRoutes from './routes/rentalRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Allowed CORS origins configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('Blocked by CORS policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// ========================================================
// Socket.IO Setup with Authentication & Room Authorization
// ========================================================
const io = new Server(server, {
  cors: {
    origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket Authentication Handshake Middleware
io.use((socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization && socket.handshake.headers.authorization.split(' ')[1]);

    if (!token) {
      return next(new Error('Authentication error: Token required for WebSocket connection'));
    }

    const decoded = verifyAccessToken(token);
    socket.data.user = {
      id: decoded.id || decoded.sub,
      email: decoded.email,
      role: decoded.role || 'User',
      name: decoded.name || 'User'
    };

    return next();
  } catch (err) {
    return next(new Error('Authentication error: Invalid or expired WebSocket token'));
  }
});

// Socket Connection & Event Authorization
io.on('connection', (socket) => {
  const user = socket.data.user;
  logger.info(`[Socket Connected]: Socket ID: ${socket.id}, User: ${user.email} (${user.role})`);

  // Room Join Event with Strict Authorization Check
  socket.on('join_room', (data, callback) => {
    try {
      const roomId = typeof data === 'string' ? data : data?.roomId;
      if (!roomId) {
        if (typeof callback === 'function') callback({ success: false, error: 'Room ID required' });
        return;
      }

      // Authorize access
      const isAuthorized =
        user.role === 'Admin' ||
        roomId.includes(user.id) ||
        roomId.startsWith('conv-') ||
        roomId.startsWith('prop-');

      if (!isAuthorized) {
        logger.warn(`[Socket Room Unauthorized]: User ${user.id} denied access to room ${roomId}`);
        if (typeof callback === 'function') callback({ success: false, error: 'Unauthorized to join room' });
        return;
      }

      socket.join(roomId);
      logger.info(`[Socket Room Joined]: User ${user.id} joined room ${roomId}`);
      if (typeof callback === 'function') callback({ success: true, roomId });
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  // Message Send Event with Sender Verification
  socket.on('send_message', (data, callback) => {
    try {
      const { roomId, content, conversationId } = data || {};
      if (!roomId || !content) {
        if (typeof callback === 'function') callback({ success: false, error: 'roomId and content required' });
        return;
      }

      if (!socket.rooms.has(roomId)) {
        if (typeof callback === 'function') callback({ success: false, error: 'Must join room before sending message' });
        return;
      }

      const verifiedPayload = {
        id: `msg-${Date.now()}`,
        roomId,
        conversationId,
        senderId: user.id,
        senderName: user.name,
        content: String(content).slice(0, 5000),
        createdAt: new Date().toISOString()
      };

      io.to(roomId).emit('receive_message', verifiedPayload);

      if (typeof callback === 'function') callback({ success: true, message: verifiedPayload });
    } catch (err) {
      if (typeof callback === 'function') callback({ success: false, error: err.message });
    }
  });

  socket.on('disconnect', () => {
    logger.info(`[Socket Disconnected]: ${socket.id} (User: ${user?.id})`);
  });
});

// ========================================================
// HTTP Middleware Stack
// ========================================================
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors(corsOptions));
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use('/api/', apiLimiter);

// ========================================================
// REST API Route Registration
// ========================================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/rentals', rentalRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Avenor Realty Production API',
    version: '1.0.0'
  });
});

// Centralized 404 and Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

export { app, server, io };

// Only start listener if executed directly as main script
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain && process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`[Avenor Production Server]: Running on http://localhost:${PORT}`);
  });
}
