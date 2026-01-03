# Sports / Casino Mini Platform

A simple, user-friendly platform to view sports matches and casino games, filter them, and mark favorites.

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS, Axios, React Router
- **Backend**: Node.js, Express, PostgreSQL, Sequelize ORM
- **Auth**: JWT (JSON Web Tokens), Bcrypt.js (Password Hashing)

## Method Used
- **Option 1: Seeded Mock Data**. This approach was chosen to ensure maximum stability and a "ready-to-use" experience without relying on unstable external APIs.

## Docker Setup (Recommended for professional review)

This project is fully dockerized. You can spin up the entire stack with a single command:

1. **Prerequisites**: Ensure Docker and Docker Compose are installed.
2. **Launch**:
   ```bash
   docker-compose up --build
   ```
3. **Access**:
   - Frontend: `http://localhost:80`
   - Backend API: `http://localhost:5000/api`

---

## Preparation (Local Setup without Docker)
1. **PostgreSQL**: Ensure you have PostgreSQL installed and running.
2. **Database**: Create a database named `casino_db`.
   ```bash
   createdb -U postgres casino_db
   ```
3. **Configuration**: Check the `.env` file in the `server` folder. Update `DB_USER` and `DB_PASSWORD` if your PostgreSQL credentials differ from the defaults (`postgres`/`postgres`).

## Setup Instructions

### Backend
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Seed the database (Important for initial data):
   ```bash
   node seed.js
   ```
4. Start the server:
   ```bash
   npm start
   ```
   *Note: Add `"start": "node index.js"` to `package.json` if not already present, or use `node index.js`.*

### Frontend
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Login to account
- `GET /api/games` - Get all games (use `?type=sport` or `?type=casino` to filter)
- `GET /api/games/favorites` - Get favorited games
- `POST /api/games/favorites/:gameId` - Toggle favorite status
