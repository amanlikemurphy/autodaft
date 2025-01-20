import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { userPreferenceRoutes } from './routes/userPreference.routes';
import { listingsRouter } from "./routes/listings";
import { startAutomationService } from './services/automation.service';

dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite's default port
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400 // 24 hours
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/preferences', userPreferenceRoutes);
app.use('/api', listingsRouter);

// Start automation service
startAutomationService().catch(console.error);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

