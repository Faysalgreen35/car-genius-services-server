 # Car Genius

Car Genius is a web application that helps users book servicing for their cars conveniently.
 

**Live Site URL:** [Car Genius services Client](https://car-genius-18058.web.app)
 
-**Live Site URL:** [Car Genius services Server](https://car-genius-server-omega.vercel.app)
 

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Routes](#routes)
- [Contributing](#contributing)
- [License](#license)

## Introduction

Car Genius is built using React.js and utilizes React Router for navigation. It provides users with the ability to sign up, log in, book servicing for their cars, and view their bookings. Private routes are implemented to restrict access to certain pages only to authenticated users.

## Features

- User authentication: Sign up and log in securely.
- Book Servicing: Users can book servicing for their cars by selecting from available services.
- View Bookings: Users can view their past and upcoming bookings.
- Private Routes: Certain pages are accessible only to authenticated users.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:


2. Install dependencies:


3. Start the development server: npm run dev


4. Open your browser and navigate to https://car-genius-18058.web.app to view the application.

## Usage

Once the application is running, users can navigate through the following pages:

- **Home**: Landing page displaying information about the application.
- **About**: Page providing information about Car Genius.
- **Login**: Page for users to log in to their accounts.
- **Sign Up**: Page for new users to create an account.
- **Book Service**: Page for users to book servicing for their cars.
- **Bookings**: Page for users to view their past and upcoming bookings.

## Routes

The application uses React Router for navigation. Here are the main routes:

- **/**: Home page.
- **/about**: About page.
- **/login**: Login page.
- **/signup**: Sign up page.
- **/book/:id**: Book Service page with service details.
- **/bookings**: Bookings page for users to view their bookings.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
