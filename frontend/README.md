# CryptoProjectX Frontend

The React client for **CryptoProjectX**, a collaborative crypto-investment platform. It delivers the member-facing experience for authentication, dashboards, investment groups, and notifications.

## Built with

- React 18
- React Router 6
- Context API for authentication state
- CSS Modules and shared global styles

## Key user journeys

- Create an account or sign in to a secured application experience.
- Land on a personalized dashboard with portfolio, group, notification, and market-insight areas.
- Discover groups, create a group, open group details, and manage group settings.
- Navigate protected member flows with a reusable route guard.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Authenticated dashboard |
| `/login` and `/signup` | Account access |
| `/groups` | Browse investment groups |
| `/create-group` | Create a group |
| `/my-groups` | View a member's groups |
| `/groups/:groupId` | Group details |
| `/groups/:groupId/settings` | Group settings |
| `/notifications` | Notifications view |

## Local development

From the repository root:

```bash
npm --prefix frontend install
npm --prefix frontend start
```

The client opens at `http://localhost:3000`. Run the backend alongside it from the repository root with `npm start-backend`.

## Frontend structure

```text
src/
├── api/          # API clients for authentication and groups
├── assets/       # Shared styles and visual assets
├── components/   # Reusable UI, group components, and route guard
├── context/      # Authentication context
├── pages/        # Route-level screens
├── App.js        # Route composition
└── index.js      # Application entry point
```

## Production build

```bash
npm --prefix frontend run build
```

This produces an optimized build in `frontend/build`.
