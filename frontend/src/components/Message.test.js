import React from 'react';
import { render, screen } from '@testing-library/react';
import Message from '../components/Message';

describe('Message Component', () => {
  const mockMessage = {
    id: 1,
    text: 'Hello, World!',
    sender: 'user',
    timestamp: new Date(),
  };

  it('should render message text', () => {
    render(<Message message={mockMessage} />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('should render user avatar for user messages', () => {
    render(<Message message={mockMessage} />);
    const avatar = screen.getByRole('img', { hidden: true });
    expect(avatar).toBeInTheDocument();
  });

  it('should apply correct styling for user messages', () => {
    const { container } = render(<Message message={mockMessage} />);
    const messageBubble = container.querySelector('.bg-red-700');
    expect(messageBubble).toBeInTheDocument();
  });

  it('should apply correct styling for bot messages', () => {
    const botMessage = { ...mockMessage, sender: 'bot' };
    const { container } = render(<Message message={botMessage} />);
    const messageBubble = container.querySelector('.bg-white');
    expect(messageBubble).toBeInTheDocument();
  });
});
