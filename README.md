# CryptoProjectX

> A full-stack web application for organizing crypto investment groups, tracking portfolio activity, and giving members a secure, personalized dashboard.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Authentication](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

## Why this project

CryptoProjectX is a portfolio project that demonstrates how to design and connect a modern React client with an Express/MongoDB API. It focuses on the product flows behind collaborative investment communities: secure member access, protected application routes, group management, and an at-a-glance dashboard.

## Highlights

- **Secure authentication:** signup and login flows backed by JSON Web Tokens, password hashing, and protected routes.
- **Personalized dashboard:** combines portfolio summaries, investment groups, notifications, and market insights in one workspace.
- **Investment-group workflows:** create groups, browse available groups, view group details, manage membership-oriented settings, and see a member's groups.
- **Full-stack architecture:** React + React Router on the client; Express, MongoDB/Mongoose, and REST endpoints on the server.
- **Thoughtful client state:** an authentication context keeps the signed-in experience consistent across the application.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, React Router, CSS Modules |
| Backend | Node.js, Express |
| Data | MongoDB, Mongoose |
| Security | JWT, Passport JWT, bcryptjs, express-validator |
| Developer experience | Nodemon, Concurrently, dotenv |

## Architecture

```text
React client (frontend)  →  Express REST API (backend)  →  MongoDB
       │                          │
       └── AuthContext            └── /api/auth, /api/users, /api/groups
```

## Getting started

### Prerequisites

- Node.js 18+ and npm
- A MongoDB Atlas cluster or local MongoDB instance

### Installation

```bash
git clone https://github.com/ilan0/cryptoprojectx.git
cd cryptoprojectx
npm install
npm --prefix backend install
npm --prefix frontend install
```

Create a `.env` file in the repository root:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=use_a_long_random_secret
PORT=3001
```

Start the frontend and backend together:

```bash
npm start
```

The React development server runs at `http://localhost:3000`; the API runs on the port specified by `PORT` (for example, `3001`).

## API areas

| Base route | Responsibility |
| --- | --- |
| `/api/auth` | Account creation and sign-in |
| `/api/users` | User profile operations |
| `/api/groups` | Investment-group creation, discovery, and management |

## Project structure

```text
cryptoprojectx/
├── frontend/       # React application and authenticated user experience
│   └── src/
│       ├── api/        # Auth and group API clients
│       ├── components/ # Reusable UI and route guards
│       ├── context/    # Authentication state
│       └── pages/      # Dashboard, groups, auth, and supporting views
├── backend/        # Express server, API routes, controllers, and models
└── DEVELOPMENT.md  # Development notes
```

## What I built and learned

This project was an opportunity to practice end-to-end product thinking: designing secure access control, structuring REST APIs, modeling application data with MongoDB, and translating those capabilities into a navigable React experience.

## Portfolio note

CryptoProjectX is a portfolio project created to demonstrate full-stack JavaScript engineering. Feedback, suggestions, and conversation are welcome.
