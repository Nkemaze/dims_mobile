import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof AxiosError) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.';

    return {
      message,
      statusCode: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred.' };
};
