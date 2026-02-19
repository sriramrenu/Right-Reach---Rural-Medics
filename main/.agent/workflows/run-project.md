---
description: how to run the project with the node backend
---

This project uses a Node.js/Express backend and a Next.js frontend. Follow these steps to start the application:

1. **Prerequisites**: Ensure you have a PostgreSQL database and update the `DATABASE_URL` in `main/backend/.env`.

2. **Install Dependencies**:
   ```bash
   # From the root directory (main)
   npm install
   ```

3. **Start Both Services**:
   ```bash
   # From the root directory (main)
   npm run dev
   ```

// turbo
4. **Start the backend only** (Optional):
   ```bash
   npm run dev:backend
   ```

// turbo
5. **Start the frontend only** (Optional):
   ```bash
   npm run dev:frontend
   ```
