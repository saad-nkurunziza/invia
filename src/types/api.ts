export type ApiResponse<T = unknown> = {
  status: "success" | "error";
  msg: string;
  data?: T;
};

export type BusinessUser = {
  id: string;
  businessId: string;
};

export class ApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiError';
  }
} 