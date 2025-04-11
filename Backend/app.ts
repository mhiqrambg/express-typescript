import express, { Request, Response, NextFunction } from 'express';
import pool, { checkDatabaseConnection } from './app/db';
import { errorHandler } from './app/middleware/errorHandler';

// Routes
import usersRoutes from './app/api/users/Routes';

const app = express();
const port = 3000;

// Middleware
app.use(express.json());

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

app.listen(port, async () => {
  await checkDatabaseConnection();
  console.log(`Server running at http://localhost:${port}`);

});

export default app;