# Chatbot Frontend

A modern, responsive React-based chatbot interface built with reusable components and Tailwind CSS.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Reusable Components**: Modular component architecture for easy maintenance and scalability
- **Real-time Chat**: Messages appear instantly with animations
- **Sidebar Navigation**: Access chat history and categories
- **Typing Indicator**: Visual feedback when bot is responding
- **Modern UI**: Clean, intuitive interface with Tailwind CSS

## Project Structure

```
src/
├── components/
│   ├── ChatContainer.jsx      # Main chat container
│   ├── ChatHeader.jsx         # Header with menu button
│   ├── MessageList.jsx        # Message list container
│   ├── Message.jsx            # Individual message component
│   ├── MessageInput.jsx       # Input field and send button
│   ├── TypingIndicator.jsx    # Animated typing indicator
│   └── Sidebar.jsx            # Navigation sidebar
├── services/
│   └── chatService.js         # API service for chat operations
├── App.jsx                    # Main app component
└── index.css                  # Global styles with Tailwind
```

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your backend API URL:
```
REACT_APP_API_URL=http://localhost:8080
```

## Running the Application

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000`

## Building for Production

```bash
npm run build
```

## Components Overview

### ChatContainer
- Main component managing chat state and logic
- Handles message sending and receiving
- Manages sidebar visibility

### ChatHeader
- Displays chatbot title and menu button
- Responsive header with branding

### MessageList
- Displays all messages in the conversation
- Auto-scrolls to newest message
- Shows typing indicator during bot response

### Message
- Individual message bubble component
- Shows avatar, timestamp, and message text
- Different styling for user vs bot messages

### MessageInput
- Input field for typing messages
- Send button with validation
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### TypingIndicator
- Animated dots showing bot is thinking
- Placed above message input

### Sidebar
- Navigation menu with chat history
- Category selection
- Settings button
- Responsive mobile drawer

## API Integration

The frontend is configured to communicate with the Spring Boot backend at `/api` endpoints:

- `POST /api/chat` - Send a message
- `GET /api/chat/history` - Get chat history
- `GET /categories` - Get available categories

Update `src/services/chatService.js` to match your backend endpoints.

## Customization

### Colors
Edit the Tailwind config in `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
    },
  },
}
```

### Styling
All components use Tailwind CSS classes for styling, making it easy to customize appearance globally or per-component.

## Dependencies

- **React 18**: UI library
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Axios**: HTTP client for API calls

## Future Enhancements

- Image/file upload support
- Voice input/output
- Chat history persistence
- User authentication
- Emoji picker
- Message search
- Export chat history
