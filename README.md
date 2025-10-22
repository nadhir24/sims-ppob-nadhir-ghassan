# SIMS PPOB - React + Redux Toolkit

Pure React application dengan Redux Toolkit untuk SIMS PPOB (Payment Point Online Bank).

## Tech Stack

- **React 18** - UI Library
- **Vite** - Build tool & dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **js-cookie** - Cookie management

## Features

✅ Authentication (Login & Register)
✅ Route Protection dengan AuthGuard
✅ Profile Management (View, Edit, Upload Photo)
✅ Balance Display & Top Up
✅ Services & Banners dari API
✅ Redux Toolkit untuk state management
✅ Full TypeScript support

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di http://localhost:5173

### 3. Build for Production

```bash
npm run build
```

### 4. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── AuthGuard.tsx
│   ├── Header.tsx
│   └── BalanceCard.tsx
├── pages/            # Page components
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── HomePage.tsx
│   ├── TopUpPage.tsx
│   ├── AccountPage.tsx
│   └── TransactionPage.tsx
├── lib/
│   ├── api/          # API utilities
│   │   ├── config.ts
│   │   ├── types.ts
│   │   ├── auth.ts
│   │   └── services.ts
│   ├── features/     # Redux slices
│   │   ├── auth/
│   │   │   └── authSlice.ts
│   │   └── balance/
│   │       └── balanceSlice.ts
│   ├── store.ts      # Redux store
│   └── hooks.ts      # Redux hooks
├── App.tsx           # Main app with routes
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## API Integration

Base URL: `https://take-home-test-api.nutech-integrasi.com`

### Endpoints Terintegrasi:

- ✅ POST `/registration` - Register user
- ✅ POST `/login` - Login user
- ✅ GET `/profile` - Get user profile
- ✅ PUT `/profile/update` - Update profile
- ✅ PUT `/profile/image` - Upload profile image
- ✅ GET `/balance` - Get balance
- ✅ POST `/topup` - Top up balance
- ✅ GET `/banner` - Get banners
- ✅ GET `/services` - Get services
- ⏳ POST `/transaction` - Create transaction (ready)
- ⏳ GET `/transaction/history` - Get history (ready)

## State Management dengan Redux Toolkit

### Auth State
```typescript
{
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

### Balance State
```typescript
{
  balance: number
  banners: Banner[]
  services: Service[]
  isLoading: boolean
  error: string | null
}
```

## Testing

1. **Register**: Buat akun baru di `/register`
2. **Login**: Login dengan credentials yang dibuat
3. **Homepage**: Lihat profile, balance, services, dan banners
4. **Top Up**: Tambah saldo di `/topup`
5. **Profile**: Edit profile dan upload foto di `/account`

## Perbedaan dengan Next.js Version

| Feature | React Version | Next.js Version |
|---------|--------------|-----------------|
| Routing | React Router | Next.js App Router |
| Images | `<img>` tag | `<Image>` component |
| Build Tool | Vite | Next.js |
| SSR | Client-side only | SSR + CSR |
| File Structure | src/ | app/ |

## Scripts

- `npm run dev` - Start dev server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables (Optional)

Create `.env` file:

```env
VITE_API_BASE_URL=https://take-home-test-api.nutech-integrasi.com
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Private
