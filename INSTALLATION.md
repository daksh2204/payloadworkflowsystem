# Installation Guide

## Requirements

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone repository:
```bash
git clone https://github.com/daksh2204/payloadworkflowsystem.git
cd payloadworkflowsystem
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB URI and secret key.

4. Seed demo data:
```bash
npm run seed
```

5. Start development server:
```bash
npm run dev
```

6. Access admin panel:
```
http://localhost:3000/admin
```

## Demo Credentials

```
Admin:    admin@demo.com / admin123
Reviewer: reviewer@demo.com / reviewer123
Editor:   editor@demo.com / editor123
```

## Build for Production

```bash
npm run build
npm start
```

