# Natours

**Natours** is a web application project for booking tour tickets. It was developed using **Node.js** and **Express** to create a robust and flexible backend system for managing tour offers, ticket bookings, and user accounts. The project allows users to log in using **JWT** and includes a feature for resetting passwords via email using **Nodemailer**.

This project is part of **Jonas Schmedtmann's Node.js, Express, MongoDB - The Complete Guide** course on **Udemy**.

## Key Features

- **Tour Management**: The system allows for adding, updating, and deleting tour offers in the database.
- **Secure User Authentication**: User authentication is handled using **JWT**.
- **Password Reset**: Users can request a password reset link via email if they forget their password.
- **Input Validation**: **bcryptjs** is used to securely store passwords, and **validator** ensures the validity of user input.
- **Email Notifications**: **Nodemailer** is used to send email notifications, such as password reset links and booking confirmations.

## Technologies Used

- **Node.js**: The runtime environment used to build the backend application.
- **Express**: A web framework for building flexible and fast APIs.
- **MongoDB**: A NoSQL database for storing user and tour data.
- **JWT**: JSON Web Tokens for user authentication.
- **Nodemailer**: A library for sending emails (such as password reset messages).
- **bcryptjs**: A library to hash and securely store passwords.
- **dotenv**: To load environment variables from a `.env` file.
