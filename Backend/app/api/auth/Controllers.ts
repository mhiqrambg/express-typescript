

import { Request, Response, NextFunction } from "express";
import { handleError } from "../../utils/handleError";
import { AuthService } from "../../services/Auth";
import { AuthError } from "../../errors";

interface AuthController {
  login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
  register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export const Auth:AuthController = {
  login: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const response = await AuthService.login(email, password);

        if (!response) {
            throw new AuthError("Invalid email or password");
        }
      
        res.status(200).json({
        success: "success",
        message: "Login successfully",
        token: response,
      });
    }catch (error: unknown) {
        handleError(error, next)
    }
  },
  register: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { name ,email ,password } = req.body;
        const response = await AuthService.register({email, password, name, role: 'user'});
        if (!response) {
            throw new AuthError("Invalid email or password");
        }
        res.status(201).json({
            success: "success",
            message: "Register successfully",
            data: response,
        });
      
    }catch (error) {
        handleError(error, next)
    }
  }
}