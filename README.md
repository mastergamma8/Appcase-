# Telegram CS2 Case Opening Mini App (scaffold)

This archive was generated automatically from the uploaded `caseminiapp.py` content.

Structure:
- `frontend/` - React + TypeScript frontend (Vite)
- `backend/` - Node.js + Express + TypeScript backend with Prisma (SQLite)
- `prisma/` - Prisma schema and seed
- `caseminiapp.py` - original combined file used to build this project

Important:
- Some files were extracted verbatim from the uploaded content.
- Other files are scaffolded placeholders so the project has a runnable structure.
- You must review `.env` files, install dependencies and run `prisma` commands before starting.

Commands:
```bash
# backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

# frontend
cd frontend
npm install
npm run dev
```

If you want, I can now:
- add any missing files,
- fill in stubs (server.ts, routes) from the extracted snippets,
- or customize the project further.

