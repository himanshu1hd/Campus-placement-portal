# Nexus Campus Placement Portal

A comprehensive full-stack campus placement management system.

## Setup & Running

This project is a full-stack application using **Express** and **Vite**.

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
npm install
```

### Running in Development
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

### Running in Production (Build)
To build the application for production:
```bash
npm run build
```
Then start the server:
```bash
npm start
```

## Features
- **Authentic Login**: Secure email/password authentication (Sample: `love@example.com` / `password123`).
- **Complete Backend**: Custom Express server with JSON-based file persistence.
- **Role-based Access**: Custom dashboards for Students, TPOs, HRs, and Coordinators.
- **Real-time Data**: State managed via a centralized API.

## Default Credentials
All test accounts use the password: `password123`

- **Student**: `love@example.com`
- **TPO**: `william@example.com`
- **HR**: `sher@google.com`
- **Coordinator**: `harry@example.com`
