# Baatchit

Baatchit is a modern real-time chat application designed to facilitate seamless communication between users. With Baatchit, users can engage in conversations, share files, see when others are typing, and more, all in real-time.

## Features

- **OAuth Integration**: Sign in easily using social login options like GitHub and Google.
- **Real-time Messaging**: Instantly send and receive messages with other users.
- **Group Chats**: Create and participate in group chats with multiple users.
- **Friends Feature**: Connect with other users and engage in private chats or group conversations after adding them as friends.
- **User Presence**: See who's online and available for chat in real-time.
- **Typing Indicators**: See when other users are typing to enhance communication flow.
- **Message Seen Status**: Know when your messages have been seen by other users.
- **File Sharing**: Share files and documents securely within chats.
- **GIF Sending**: Express yourself with animated GIFs using the integrated Tenor GIF library.

## Technologies Used

### Frontend Technologies Used:
- **React**: A JavaScript library for building user interfaces.
- **React Router**: Declarative routing for React applications.
- **Redux Toolkit**: An opinionated, batteries-included toolset for efficient Redux development.
- **Socket.IO Client**: Real-time bidirectional event-based communication library for web applications.
- **React Hook Form**: Performant, flexible and extensible forms with easy-to-use validation.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Framer Motion**: A production-ready motion library for React.
- **Lottie React**: Render After Effects animations on React-based web apps.
- **Gif Picker React**: Provides a simple and easy-to-use UI for selecting GIFs.
- **React Hot Toast**: Toast notifications for React applications.

### Backend Technologies Used:
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: Fast, unopinionated, minimalist web framework for Node.js.
- **Socket.IO**: Real-time bidirectional event-based communication library for Node.js.
- **MongoDB (with Mongoose)**: A NoSQL database for storing application data.
- **Bcryptjs**: Library for hashing passwords.
- **Cloudinary**: Cloud-based image and video management service.
- **Cors**: Middleware for handling Cross-Origin Resource Sharing (CORS).
- **Dotenv**: Module to load environment variables from a `.env` file.
- **Helmet**: Middleware to secure Express apps by setting various HTTP headers.
- **Jsonwebtoken**: Library to create and verify JSON Web Tokens (JWTs).
- **Morgan**: HTTP request logger middleware for Node.js.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.
- **Nodemailer**: Module for sending emails from Node.js applications.
- **Passport**: Authentication middleware for Node.js.
- **Passport-Github2**: Passport strategy for authenticating with GitHub using OAuth 2.0.
- **Passport-Google-Oauth20**: Passport strategy for authenticating with Google using OAuth 2.0.
- **UUID**: Library for generating universally unique identifiers (UUIDs).

Feel free to adjust or expand this list based on your specific project requirements or preferences!

## Getting Started

To get started with Baatchit, follow these steps:

1. Clone the repository: `git clone https://github.com/RishiBakshii/Baatchit`
2. Navigate to the project directory: `cd Baatchit`
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Visit `http://localhost:5173` in your browser to access the application.

### Setting Up Environment Variables

#### Backend

Before running the backend server, you need to set up the following environment variables. Create a `.env` file in the root directory of the `backend` folder and add the following variables:

```plaintext
NODE_ENV=DEVELOPMENT
PORT=8000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_TOKEN_EXPIRATION_DAYS=1
EMAIL=your_email_address
PASSWORD=your_email_password
OTP_EXPIRATION_MINUTES=5
PASSWORD_RESET_TOKEN_EXPIRATION_MINUTES=5
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

Make sure to replace placeholder values with your actual credentials and secrets.

#### Frontend

For the frontend application, you need to set up the following environment variable. Create a `.env` file in the root directory of the `frontend` folder and add the following variable:

```plaintext
VITE_ENV=DEVELOPMENT
VITE_TENOR_API_KEY=your_tenor_api_key
```

Replace the `VITE_TENOR_API_KEY` value with your Tenor API key.

By setting up these environment variables, you ensure that your backend and frontend applications have access to the required configurations for seamless operation.

## Contributing

Contributions are welcome! If you'd like to contribute to Baatchit, please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.

## Contact

For any inquiries or feedback, please contact me at [rishibakshiofficial@gmail.com](mailto:rishibakshiofficial@gmail.com).