export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface GetAllUsersResponse {
    success: string;
    message: string;
    data: User[];
  }
  