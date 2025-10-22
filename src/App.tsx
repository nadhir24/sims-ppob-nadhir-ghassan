import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthGuard } from './components/AuthGuard'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { HomePage } from './pages/HomePage'
import { TopUpPage } from './pages/TopUpPage'
import { AccountPage } from './pages/AccountPage'
import { TransactionPage } from './pages/TransactionPage'
import { PaymentPage } from './pages/PaymentPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route element={<AuthGuard />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/topup" element={<TopUpPage />} />
        <Route path="/transaction" element={<TransactionPage />} />
        <Route path="/payment/:serviceCode" element={<PaymentPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
