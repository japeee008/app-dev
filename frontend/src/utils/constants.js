export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
export const ENV = process.env.REACT_APP_ENV || 'development';

export const MESSAGE_TYPES = {
  USER: 'user',
  BOT: 'bot',
  SYSTEM: 'system',
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'An error occurred. Please try again later.',
  INVALID_MESSAGE: 'Please enter a valid message.',
  CATEGORY_ERROR: 'Failed to load categories.',
  CHAT_ERROR: 'Failed to send message.',
};
