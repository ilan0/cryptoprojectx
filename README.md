## Features 🌟

- **JWT Authentication**: Secure access using JSON Web Tokens.
- **User Management**: Includes signup, login, profile update, and deletion functionalities.
- **Protected Routes**: Ensures only authenticated users can access certain routes.
- **Dynamic Dashboard**: A user-friendly dashboard providing quick access to investment groups, portfolio overviews, and market insights.


## Getting Started 🚀

Follow these instructions to get the project up and running on your local machine for development and testing purposes.


### Prerequisites 📋


- [Node.js](https://nodejs.org/en/download/)
- npm or yarn (npm comes installed with Node.js)
- [MongoDB] Atlas for cloud
- [Postman](https://www.postman.com/downloads/) for testing the API endpoints.

### Set Up 🛠

1. **Clone the repository**

2. **Install dependencies**
    - "npm install"

3. **Create and populate '.env' file**
    - Create a '.env' file in the root directory and add the following to it
        - JWT_SECRET=YourJWTSecretHere
        - MONGODB_URI=YourMongoDBUriHere
        - PORT=3001

### Run the backend and frontend
From the root directory run 'npm start'

## Using the application with Postman

Signing up a new user:

1. Open Postman and create a new POST request to http://localhost:3000/api/auth/signup
2. In the Body section, select raw JSON and enter user details:
    {
  "username": "newUser",
  "email": "newuser@example.com",
  "password": "password123"
    }
3. Send the request. You should receive a user object and a JWT token in response.

Logging in:
1. Create a new POST request in Postman to http://localhost:3000/api/auth/login
2. Enter the email and password of an existing user:
    {
  "email": "newuser@example.com",
  "password": "password123"
    }
3. Upon sending, you'll receive a JWT token.

Accessing Protected Routes
1. Use the JWT token to access a protected route like http://localhost:3000/api/users/me
2. Add an Authorization header: Bearer <Your-JWT-Token>
3. A valid token grants access to the protected content



