import { ApiResponse } from "@/types/api";

export function createSuccessResponse<T>(
  msg: string,
  data?: T
): ApiResponse<T> {
  return {
    status: "success",
    msg,
    data,
  };
}

export function createErrorResponse(msg: string): ApiResponse {
  return {
    status: "error",
    msg,
  };
}
