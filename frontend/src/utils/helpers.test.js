import { formatDate, validateMessage, truncateText, createMessage } from '../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('should format time correctly', () => {
      const date = new Date('2025-01-15T14:30:00');
      expect(formatDate(date)).toBe('14:30');
    });
  });

  describe('validateMessage', () => {
    it('should return true for valid message', () => {
      expect(validateMessage('Hello world')).toBe(true);
    });

    it('should return false for empty message', () => {
      expect(validateMessage('')).toBe(false);
      expect(validateMessage('   ')).toBe(false);
    });

    it('should return false for non-string input', () => {
      expect(validateMessage(null)).toBe(false);
      expect(validateMessage(undefined)).toBe(false);
      expect(validateMessage(123)).toBe(false);
    });
  });

  describe('truncateText', () => {
    it('should truncate text exceeding max length', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
    });

    it('should not truncate text within max length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });
  });

  describe('createMessage', () => {
    it('should create a message object with correct properties', () => {
      const message = createMessage('Hello', 'user', 1);
      expect(message.text).toBe('Hello');
      expect(message.sender).toBe('user');
      expect(message.id).toBe(1);
      expect(message.timestamp).toBeInstanceOf(Date);
    });
  });
});
