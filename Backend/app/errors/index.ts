export class ValidationError extends Error {
    statusCode: number;
    
    constructor(message: string) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400; // Bad Request
    }
  }

export class InternalServerError extends Error {
    statusCode: number;
    
    constructor(message: string) {
      super(message);
      this.name = 'Internal Server Error';
      this.statusCode = 500; // Internal Server Error
    }
}

export class Model extends Error {
    statusCode: number;
    
    constructor(message: string) {
      super(message);
      this.name = 'Model';
      this.statusCode = 400; 
    }
}
