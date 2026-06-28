import { Alert } from 'react-native';


export class ApiError extends Error {
  code?: number;
  localizedMessage?: string;
  status?: number;
  data?: any;

  constructor({
    message,
    code,
    localizedMessage,
    status,
    data,
  }: {
    message: string;
    code?: number;
    localizedMessage?: string;
    status?: number;
    data?: any;
  }) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.localizedMessage = localizedMessage;
    this.status = status;
    this.data = data;
  }
}



export function getErrorMessage(
  error: unknown,
  fallback: string = 'Something went wrong'
): string {

  if (error instanceof ApiError) {
    return (
      error.localizedMessage ||
      error.message ||
      fallback
    );
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export function showApiErrorAlert(
  error: unknown,
  fallback: string = 'Something went wrong'
): void {
  const message = getErrorMessage(error, fallback);

  if (message) {
    Alert.alert('', message);
  }
}