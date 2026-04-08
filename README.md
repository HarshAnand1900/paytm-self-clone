# Paytm Self Clone

A paytem app built for learning and practice.
This project includes user authentication , wallet balance management, P2P Money Transfer, and Transaction History and Filtering.

## Features
- User SignUp/SignIn
- Logout with cookie-base auth
- Wallet balance display
- Add Money/Top Up Balance
- Send money to other Users
- Transaction History
- Filter transactions on the basis of all/sent/recieved
- Basic validation for invalid transfers and other cases

## Tech Stack
- Next.js
- React
- TypeScript
- PostgresSQl
- Tailwind CSS
- Turborepo

## Project Structure
- `apps/user-app` - main user-facing app
- `package/db` - Prisma schema and generated client
-  `packages/typescript-config` - shared TypeScript config
- `packages/eslint-config` - shared lint config

## Running Locally
1. Install dependencies
```bash
npm install

2. Add environment vairbales
DATABASE_URL=yours_databse_url

3. Run Prisma/databse setup

4. npm run dev 
open http://localhost:3000

Environment Varibles

DATABSE_URL = PostgresSQL databse string

```

# Current Status

- auth flow
- databse operations
- server actions 
- validation 
transaction handling
frontend structure 


# Future Improvements
- Better UI Polish
- Middleware-based route
- Bank-Webhook
- Merchant-app