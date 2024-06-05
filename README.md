# RTDE Backend

## Overview

The backend of RTDE (Real-Time Document Editor) handles all server-side operations, including real-time collaboration, document management, user authentication, and data storage.

## Features

- **Real-Time Collaboration:** Manage multiple users editing documents simultaneously.
- **RESTful API:** Provides endpoints for document CRUD operations and user management.
- **WebSocket Support:** Enables real-time updates and notifications.
- **Authentication:** Secure user authentication and authorization.
- **Data Persistence:** Stores documents and user data using a database.

## Technologies Used

- **Node.js:** Server-side JavaScript runtime.
- **Express.js:** Web framework for building RESTful APIs.
- **Passport.js:** For google Authentication and session creations
- **MongoDB:** NoSQL database for data storage.
- **Y.js** collaborative environments

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)

### Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/yourusername/RTDE-backend.git
   cd RTDE-backend
   ```
2. **Install Dependencies:**
   ```bash
   pnpm install
   ```
3. **Set Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/rtde
   ```

### Running the Server

```bash
pnpm start
```
