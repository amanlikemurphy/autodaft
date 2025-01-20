import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
} 