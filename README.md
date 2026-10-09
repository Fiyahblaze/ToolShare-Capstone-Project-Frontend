# ToolShare Frontend

ToolShare is my full-stack MERN capstone project. It connects people who need tools with owners who have tools available to share or rent. I rebuilt my original project with a focus on working CRUD features, authentication, and a simple user experience.

## Features

- Register, log in, and log out.
- Browse tools and view listing details.
- Create, edit, and delete your own tool listings.
- Submit and view rental requests.
- Edit, cancel, and delete your pending rental requests.
- Approve or decline incoming requests.
- Confirm tool returns.
- Manage listings and requests from a personal dashboard.
- Responsive layouts with loading, error, and empty states.

Listings with rental history cannot be deleted. Owners can mark them unavailable instead. Online payments are a future feature.

## Technologies

React, TypeScript, Vite, React Router, CSS, and Lucide icons.

The frontend connects to an Express API backed by MongoDB. Authentication uses JWT tokens, and React Context manages the current user.

## Local Setup

Use Node.js 24.

```bash
git clone https://github.com/Fiyahblaze/ToolShare-Capstone-Project-Frontend.git
cd ToolShare-Capstone-Project-Frontend
npm ci
cp .env.example .env
```

Set the API URL in `.env`:

```env
VITE_API_URL=http://localhost:3001/api
```

Run the backend locally in a separate terminal using its README instructions. Set the backend's `FRONTEND_URL` to `http://localhost:5173`.

Start the frontend:

```bash
npm run dev
```

Open http://localhost:5173.

## Checks

```bash
npm run lint
npm run build
```

## Project Links

- [Live ToolShare App](https://toolshare-capstone-project-frontend.onrender.com)
- [Frontend Repository](https://github.com/Fiyahblaze/ToolShare-Capstone-Project-Frontend)
- [Backend Repository](https://github.com/Fiyahblaze/ToolShare-Capstone-Project-Backend)
- [Backend Health Check](https://toolshare-capstone-project-backend.onrender.com/health)

## API Documentation

The backend README describes all authentication, tool, and rental request endpoints, including which routes require authentication.

[View API Documentation](https://github.com/Fiyahblaze/ToolShare-Capstone-Project-Backend#api-routes)

## What I Learned

This project helped me understand how the frontend and backend work together. I worked through authentication, protected routes, ownership checks, and keeping the dashboard updated after changes. Building reusable components made it easier to work on each feature, and committing after each section helped me keep my progress organized.