import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from './app/middleware/errorHandler';
import cors from 'cors';
import {db} from './app/db/config'

// Routes
import usersRoutes from './app/api/users/Routes';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const v1 = '/api/v1';
app.use(v1, usersRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
 errorHandler(err, req, res, next);
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: "fail",
    message: 'Route not found'
  });
});

// Only start the server if this file is run directly (not imported in tests)
if (require.main === module) {
  app.listen(port, async () => {
    await db.connect();
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;