# EcoMarket — Frontend

Next.js storefront and admin panel for the EcoMarket platform.

## Prerequisites

| Tool    | Version | Notes                    |
|---------|---------|--------------------------|
| Node.js | 20+     | LTS recommended          |
| npm     | 10+     | Bundled with Node        |

The backend must be running at `http://localhost:8084` before starting the frontend.

## Environment Variables

Create a `.env.local` file in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8084/api/v1
JWT_SECRET=your_jwt_secret_here
```

> `JWT_SECRET` must match the value used by the backend to sign admin tokens. Never commit this file.

## Install & Run

```bash
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

## Routes

| Path             | Description                     |
|------------------|---------------------------------|
| `/`              | Product catalog (storefront)    |
| `/productos/:id` | Product detail page             |
| `/carrito`       | Shopping cart                   |
| `/admin/login`   | Admin login                     |
| `/admin`         | Admin dashboard (requires auth) |

## Build for Production

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- Radix UI primitives
- Sonner (toast notifications)
- Jose (JWT verification in middleware)
