# BE-Chat

A real-time chat application built with Node.js, Express, and Socket.IO.

## Project Overview

BE-Chat is a modern chat application that provides real-time messaging capabilities using WebSocket technology. The application is built with a modular architecture and follows RESTful API principles.

## Tech Stack

- **Backend Framework**: Express.js
- **Real-time Communication**: Socket.IO
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT
- **Security**: bcryptjs
- **Development Tools**: nodemon, dotenv

## Project Structure

```
be-chat/
├── app.js                # Main application file
├── controllers/         # Request handlers
├── middleware/         # Custom middleware functions
├── models/            # Mongoose data models
├── routes/            # API route definitions
├── seed/             # Database seeding scripts
├── sockets/          # Socket.IO configuration
├── utils/            # Utility functions and helpers
└── .env              # Environment variables
```

## Features

- Real-time messaging using WebSocket
- User authentication and authorization
- Google API integration
- Chat room functionality
- Message management
- RESTful API endpoints
- CORS support for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with the required environment variables
4. Start the development server:
   ```bash
   npm run dev
   ```

### Environment Variables

Create a `.env` file with the following variables:

```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
```

## API Endpoints

The application provides three main API routes:

- `/api/google` - Google API related endpoints
- `/api/chat` - Chat room operations
- `/api/message` - Message management

## Development

The project uses nodemon for development, allowing automatic server restarts on file changes.

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with nodemon
- `npm run clearDB` - Clear the database (using seed script)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC License

## Author

Andrew Yupin
