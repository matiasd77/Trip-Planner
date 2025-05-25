# Trip Planner Frontend

A modern React-based frontend application for the Interactive Trip Planner, built with Vite, React, and Tailwind CSS.

## Features

- User Authentication (Login/Register)
- Trip Planning and Management
- Weather Integration
- Interactive Dashboard
- Responsive Design
- Protected Routes
- Error Handling

## Tech Stack

- React 18 with Vite
- React Router v6
- Tailwind CSS
- React Query
- Axios
- HeadlessUI & Heroicons
- JWT Authentication

## Prerequisites

- Node.js 16.0 or later
- npm 7.0 or later
- Backend service running (Spring Boot application)

## Setup

1. Clone the repository
2. Install dependencies:
```bash
cd frontend
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:8080/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:5173

## Project Structure

```
src/
├── components/           # Reusable components
│   ├── auth/            # Authentication related components
│   ├── error/           # Error handling components
│   └── layout/          # Layout components
├── pages/               # Page components
│   ├── auth/            # Authentication pages
│   └── ...             # Other page components
├── services/            # API and service layer
├── assets/             # Static assets
└── main.jsx           # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Development

### Authentication

The application uses JWT tokens for authentication. Login and registration are handled through the `/auth` endpoints.

### Protected Routes

Routes under `/dashboard` and `/trips` require authentication. Unauthorized access will redirect to the login page.

### API Integration

API calls are handled through the `api.js` service using Axios. The service includes:

- Request/response interceptors
- JWT token management
- Error handling
- Automatic token refresh (coming soon)

### Styling

The application uses Tailwind CSS for styling with custom configuration for:

- Colors
- Fonts (Poppins and Roboto)
- Components
- Responsive design

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License
