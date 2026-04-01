# InnerLog 🧠

InnerLog is an ethical mental health companion focused on mood tracking, self-reflection, and emotional awareness.

⚠️ This application does **NOT** provide medical diagnosis or treatment.

## Features
- Secure authentication
- Mood journaling
- Progress visualization
- Resource recommendations
- Privacy-first design

## Tech Stack
- Django + Django REST Framework
- SQLite
- Chart.js
- React

## Environment Setup
1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Open `.env` and fill in required values before starting the app.

> `.env.example` is only a template for reference and is **not** read directly by the application. The application reads runtime values from `.env`.

### Required variables
- `EMAIL_APP_USER`
- `EMAIL_APP_PASSWORD`
- `FRONTEND_URL`

### Optional Contact Us variables
- `CONTACT_LINKEDIN`
- `CONTACT_WHATSAPP`

These contact variables are optional and only needed if you want to enable Contact Us links in the UI. If they are not provided, Contact Us options are hidden/disabled gracefully.

## Email verification setup
- The backend sends verification emails through Gmail SMTP.
- Ensure required email variables are set in `.env` before starting Django.

## Ethics
InnerLog is designed to support self-awareness, not replace professional mental health care.
