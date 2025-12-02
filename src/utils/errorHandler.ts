/**
 * Extract error message from API error response
 */
export function extractErrorMessage(error: any, defaultMessage: string): string {
  if (!error.response?.data) {
    return defaultMessage;
  }

  const errorData = error.response.data;

  // Check for direct message property
  if (errorData.message) {
    return errorData.message;
  }

  // Check for validation errors (ASP.NET format)
  if (errorData.errors && typeof errorData.errors === 'object') {
    const firstError = Object.values(errorData.errors)[0];
    if (Array.isArray(firstError) && firstError.length > 0) {
      return firstError[0] as string;
    }
  }

  // Check for title property
  if (errorData.title) {
    return errorData.title;
  }

  // Check if errorData itself is a string
  if (typeof errorData === 'string') {
    return errorData;
  }

  return defaultMessage;
}