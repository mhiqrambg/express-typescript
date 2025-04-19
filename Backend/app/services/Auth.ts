import { AuthError } from "../errors";
import { User } from "../api/users/Models";
import { comparePassword, hashPassword } from "../utils/Bcrypt";
import jwt from "jsonwebtoken";

interface AuthService {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const AuthService = {
  login: async (email: string, password: string) => {
    const response = await User.findOne({ email });

    if (!response || !(await comparePassword(password, response.password))) {
      throw new AuthError("Invalid email or password");
    }

    const payLoad = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role,
    };

    const token = jwt.sign(payLoad, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    return token;
  },
  register: async (userData: AuthService) => {
    if (!userData.name || !userData.email || !userData.password) {
      throw new AuthError("All fields are required");
    }

    const emailExist = await User.findOne({ email: userData.email });

    if (emailExist) {
      throw new AuthError("Email already exists");
    }

    const hashPassworded = await hashPassword(userData.password);

    const response = await User.create({
      ...userData,
      password: hashPassworded,
    });

    return response;
  },
};
