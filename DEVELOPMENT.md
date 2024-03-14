# Project Summary

This document outlines the key steps taken and features implemented.

## Project Setup and Initial Configuration

### Project Initialization

- Initialized a new Node.js project, setting up the npm environment and installing essential packages, including `express` for our web server framework.

### Environment Configuration

- Introduced the use of environment variables through the `dotenv` package for securely managing sensitive information, such as database connection strings and JWT secrets.

## Database Setup and Model Definitions

### MongoDB Integration

- Connection setup included the use of MongoDB Atlas for cloud database services.

### Schema Definitions

- Defined Mongoose schemas and models for core entities like `User`, and discussed planning for additional entities such as `Group` and `Investment`.

## Authentication System

### JWT-Based Authentication

- Implemented JWT-based authentication, covering functionalities for user signup and login. This involved generating JWT tokens upon successful authentication and securely hashing user passwords before storage.

### Authentication Middleware

- Developed middleware to protect routes by verifying JWT tokens included in request headers, ensuring certain actions and routes are accessible only by authenticated users.

## Routing and Controllers

### API Routes and Controllers

- Established structured routing and controller logic, segregating responsibilities for improved clarity and maintainability. This included creating routes for user-related actions (e.g., signup, login, profile viewing and editing) and securing appropriate endpoints with authentication middleware.

### Error Handling

- Implemented basic error handling middleware to catch and respond to errors throughout the application.

## Testing

### Manual Testing with Postman

- Conducted manual testing of implemented features, especially the authentication flow, using Postman. This included testing the processes for signup and login, as well as verifying the protection of routes with JWT.

