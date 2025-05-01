
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url'; // 🔥 Needed for __dirname in ESM

import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
connectDB();

// 🔥 Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // body-parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 🔥 CORS - (Allow frontend to connect)
app.use(cors({
  origin: '*', // you can tighten later to specific domains if needed
  credentials: true,
}));

// Routes
app.use('/api/users', userRoutes);

// Serving frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => res.send('Server is ready'));
}

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
app.listen(port, () => console.log(`Server started on port ${port}`));