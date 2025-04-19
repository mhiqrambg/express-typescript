import { NextFunction } from "express";

export const handleError = (error: unknown, next: NextFunction): void => {
    const err = error as Error;
    process.env.NODE_ENV === "development" && console.error(err.message);
   
    next(err);
};