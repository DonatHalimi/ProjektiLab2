# ProjektiLab2 - Travel Booking & Management System

A full-stack **Travel Booking & Management System** developed as part of **Lënda Laboratorike 2 (Programim)** at the **UBT Faculty of Computer Science**.

The application provides a platform for users to browse and purchase **flights, hotel rooms, and tours**, manage their purchases, and view their profile information. An administrative dashboard is also included for managing users, roles, flights, hotels, rooms, tours, purchases, FAQs, contacts, and reports.

---

## Table of Contents

* [Overview](#overview)
* [Features](#features)
  * [Customer Features](#customer-features)
  * [Administration](#administration)
  * [Reports](#reports)
* [Technologies Used](#technologies-used)
* [Project Structure](#project-structure)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Database Configuration](#database-configuration)
  * [Running the Application](#running-the-application)
* [Usage](#usage)
* [Authors](#authors)

---

## Overview

**ProjektiLab2 - Travel Booking & Management System** is a full-stack web application designed to provide an online platform for discovering and purchasing travel-related services.
The system allows users to browse available flights, hotels, rooms, and tours, complete purchases through dedicated checkout pages, and manage their bookings through their personal profile.

The application also provides an administrative dashboard where authorized administrators can manage the platform's data and access purchase reports.
The project follows a client-server architecture:

<img width="4257" height="7515" alt="diagram (3)" src="https://github.com/user-attachments/assets/197d77d3-223e-4266-a297-3d5eb3791757" />

---

## Features

### Customer Features

* **User Registration & Login**

  * Create a new account
  * Authenticate existing users
  * Protected routes
  * Role-based authorization

* **Flight Booking**

  * Browse available flights
  * View flight information
  * Purchase flight tickets
  * Complete flight checkout
  * View purchased flights through the user profile

* **Hotel & Room Booking**

  * Browse available hotels
  * View available rooms
  * View room information
  * Purchase rooms
  * Complete room checkout
  * View room purchases through the user profile

* **Tour Booking**

  * Browse available tours
  * View tour information
  * Purchase tours
  * Complete tour checkout
  * View purchased tours through the user profile

* **User Profile**

  * View personal information
  * Manage account information
  * View flight purchases
  * View room purchases
  * View tour purchases

* **Contact & FAQ**

  * Submit contact requests
  * Browse frequently asked questions
  * Access general information about the platform

* **Responsive User Interface**

  * Modern travel-focused interface
  * Responsive navigation
  * Reusable components
  * Protected and public routes
  * Dedicated error pages

---

### Administration

The application includes a dedicated **Admin Dashboard** for managing the travel platform.

Administrators can manage:

* Users
* Roles
* Flights
* Flight Purchases
* Hotels
* Rooms
* Room Purchases
* Tours
* Tour Purchases
* FAQs
* Contacts

The dashboard provides dedicated pages, tables, and add/edit modals for managing the application's data.

---

### Reports

The administrative dashboard includes reporting functionality for purchases.

Administrators can access reports for:

* Flight Purchases
* Room Purchases
* Tour Purchases

These reports provide administrators with an overview of purchase-related information within the system.

---

## Technologies Used

### Frontend

* **React**
* **Vite**
* **JavaScript / JSX**
* **Tailwind CSS**
* **Axios**
* **React Router**
* **ESLint**

### Backend

* **C#**
* **ASP.NET Core**
* **Entity Framework Core**
* **REST API**
* **Controllers**
* **Middleware & Filters**
* **Authentication & Authorization**

### Database & Data Access

* **Entity Framework Core**
* **AppDbContext**
* **EF Core Migrations**
* **MongoDB Service**

### Development Tools

* **.NET SDK**
* **Node.js**
* **npm**
* **Git**
* **GitHub**
* **Visual Studio / Visual Studio Code**

---

## Project Structure

The project is divided into two main applications: `backend` and `frontend`.

```text
donathalimi-projektilab2/
│
├── backend/                              # ASP.NET Core backend
│   ├── Controllers/                     # API controllers
│   ├── Data/                            # Database context
│   ├── Migrations/                      # Entity Framework migrations
│   ├── Models/                          # Application models and DTOs
│   ├── Properties/                      # Application configuration
│   ├── Services/                        # Authentication and other services
│   ├── Program.cs                       # Application entry point
│   ├── appsettings.json                 # Application configuration
│   └── backend.csproj                   # .NET project configuration
│
├── frontend/                            # React frontend
│   ├── src/
│   │   ├── assets/                      # Static application data
│   │   ├── components/                  # Reusable components
│   │   │   ├── Contact/
│   │   │   ├── Dashboard/
│   │   │   ├── Items/
│   │   │   ├── Modal/
│   │   │   └── Slider/
│   │   ├── pages/                       # Application pages
│   │   │   ├── Auth/
│   │   │   ├── Dashboard/
│   │   │   ├── Errors/
│   │   │   ├── Flights/
│   │   │   ├── Profile/
│   │   │   ├── Rooms/
│   │   │   └── Tours/
│   │   ├── services/                    # API service modules
│   │   └── utils/                       # Shared utilities
│   ├── App.jsx                          # Main application component
│   ├── main.jsx                         # Application entry point
│   ├── package.json                     # Frontend dependencies
│   ├── tailwind.config.js               # Tailwind configuration
│   └── vite.config.js                   # Vite configuration
│
└── README.md
```

---

## Getting Started

### Prerequisites

Before running the project, make sure the following are installed:

* **.NET SDK**
* **Node.js**
* **npm**
* **Database server required by the application**
* **Git**

You can verify the .NET and Node.js installations with:

```bash
dotnet --version
node --version
npm --version
```

---

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/donathalimi/projektilab2.git
```

Navigate into the project:

```bash
cd projektilab2
```

---

### 2. Install frontend dependencies

Navigate to the frontend directory:

```bash
cd frontend
```

Install the required packages:

```bash
npm install
```

---

### 3. Restore backend dependencies

Navigate to the backend directory:

```bash
cd ../backend
```

Restore the .NET dependencies:

```bash
dotnet restore
```

---

## Database Configuration

The backend uses **Entity Framework Core** for database access and includes a series of EF Core migrations for creating and updating the application's database schema.

Database configuration is located in:

```text
backend/appsettings.json
```

and, for development-specific settings:

```text
backend/appsettings.Development.json
```

The project contains migrations for entities including:

* Users
* Roles
* Flights
* Flight Purchases
* Hotels
* Rooms
* Room Purchases
* Tours
* Tour Purchases

Before running the application, make sure the configured database service is available and the connection string in the application configuration matches your local environment.

To apply pending Entity Framework Core migrations, run:

```bash
dotnet ef database update
```

> If the Entity Framework Core CLI tool is not installed, it can be installed with `dotnet tool install --global dotnet-ef`.

---

## Running the Application

### Start the Backend

From the `backend` directory:

```bash
dotnet run
```

The ASP.NET Core API will start using the configuration defined in the project.

---

### Start the Frontend

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

The backend API will run on the URL configured by the ASP.NET Core launch settings.

> Make sure the backend and required database services are running before using the frontend.

---

## Usage

Once the application is running, users can:

1. Open the application's homepage.
2. Browse available flights, hotels, rooms, and tours.
3. Register for an account or log in.
4. View detailed travel information.
5. Purchase flights, rooms, or tours.
6. Complete the appropriate checkout process.
7. View their purchases through their profile.
8. Manage their account information.
9. Submit contact requests.
10. Browse frequently asked questions.

Administrators can access the **Admin Dashboard** to manage:

* Users and roles
* Flights and flight purchases
* Hotels and rooms
* Room purchases
* Tours and tour purchases
* FAQs and contacts
* Purchase reports

---

## Authors

This project was developed collaboratively by:

* **[Donat Halimi](https://github.com/DonatHalimi)**
* **[Anjeza Gllareva](https://github.com/anjezagllareva)**
* **[Vullnet Lipovica](https://github.com/VullnetLipovica)**
* **[Ardit Thoxha](https://github.com/arditthoxhaa)**
* **[Erza Boshnjaku](https://github.com/ErzaBoshnjaku)**

### Course

**Lënda Laboratorike 2 (Programim)**
**UBT – Faculty of Computer Science**
