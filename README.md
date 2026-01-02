# IMACS Auth

A standalone authentication UI for the IMACS Data Intelligence Platform, built with Vite + React.

## Requirements

- Node.js >= 18

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The app will open at [http://localhost:5173](http://localhost:5173)

## Build

```bash
npm run build
```

Build output will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Architecture

### Pages

- `/login` - Sign in page
- `/register` - Create account page
- `/verify` - Account verification / pending approval page

### Authentication Flow

1. User registers → account created with `approved: false`
2. User redirected to `/verify` (pending approval state)
3. User can request access via modal
4. Once approved (manually set in localStorage for now), user can sign in
5. Successful sign in stores token and redirects to `/verify?status=success`

### Local Storage Mock Backend

This project uses localStorage to simulate a backend for development purposes.

**Storage Keys:**

- `imacs_users` - Array of user objects
- `imacs_access_requests` - Array of access request objects
- `imacs_token` - Current session token

**To swap to a real API later:**

Replace the functions in `src/services/authService.js` with actual API calls. The function signatures are designed to be API-ready:

```js
// Example: Replace localStorage calls with fetch
export async function login(email, password) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}
```

### Approving Users (Development)

To manually approve a user for testing:

1. Open browser DevTools → Application → Local Storage
2. Find `imacs_users` key
3. Edit the JSON to set `approved: true` for the desired user
4. Refresh and sign in

## Tech Stack

- **Vite** - Build tool and dev server
- **React 18** - UI library
- **React Router DOM v6** - Client-side routing
- **Plain CSS** - Styling with IMACS Design System
- **IBM Plex Sans** - Typography via IMACS brand guidelines

## Project Structure

```
imacs-auth/
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── routes.jsx
    ├── pages/
    │   ├── Login.jsx
    │   ├── Register.jsx
    │   └── Verify.jsx
    ├── components/
    │   ├── AuthLayout.jsx
    │   ├── ImacsLogo.jsx
    │   ├── TextField.jsx
    │   ├── Button.jsx
    │   ├── Alert.jsx
    │   ├── Modal.jsx
    │   └── RequestAccessModal.jsx
    ├── services/
    │   └── authService.js
    └── styles/
        ├── brandColors.js    # IMACS brand color tokens
        ├── cdahTokens.js     # Design system tokens
        ├── global.css        # Global styles & animations
        ├── theme.css         # CSS custom properties
        ├── auth.css          # Auth-specific styles
        └── index.js          # Style exports
```
