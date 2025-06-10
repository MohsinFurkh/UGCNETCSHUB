# UGC NET CS HUB

A comprehensive platform for UGC NET Computer Science aspirants to prepare for their exams with practice questions, study materials, and progress tracking.

## Features

- User authentication (Register, Login, Logout)
- Password reset functionality
- Subject and topic-wise question bank
- Practice tests with performance tracking
- Progress monitoring
- Responsive design for all devices

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (for the backend)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   JWT_COOKIE_EXPIRE=30
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variable:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## Project Structure

```
UGCNETCSHUB/
├── backend/               # Backend server code
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── server.js         # Express server setup
│
├── frontend/            # Frontend React application
│   ├── public/           # Static files
│   └── src/              # React source code
│       ├── components/   # Reusable components
│       ├── features/     # Redux slices and actions
│       ├── pages/        # Page components
│       └── App.js        # Main App component
│
├── .gitignore          # Git ignore file
└── README.md            # Project documentation
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

### Frontend
- React.js
- Redux Toolkit for state management
- Redux Persist for persisting state
- Material-UI for UI components
- React Router for navigation
- Axios for API requests

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
