import { Navigate, Route, Routes } from 'react-router-dom'
import RoleSwitcher from '@/components/RoleSwitcher'
import PhoneShell from '@/components/PhoneShell'
import RiderLayout from '@/rider/RiderLayout'
import HomePage from '@/rider/HomePage'
import OrdersPage from '@/rider/OrdersPage'
import IncomePage from '@/rider/IncomePage'
import RepaymentPage from '@/rider/RepaymentPage'
import MePage from '@/rider/MePage'
import FinanceLayout from '@/finance/FinanceLayout'
import OverviewPage from '@/finance/OverviewPage'
import RiskListPage from '@/finance/RiskListPage'
import RiderDetailPage from '@/finance/RiderDetailPage'
import InterventionsPage from '@/finance/InterventionsPage'
import PlaceholderPage from '@/finance/PlaceholderPage'

export default function App() {
  return (
    <>
      <RoleSwitcher />
      <Routes>
        <Route path="/" element={<Navigate to="/rider/home" replace />} />

        <Route
          path="/rider"
          element={
            <PhoneShell>
              <RiderLayout />
            </PhoneShell>
          }
        >
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomePage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="income" element={<IncomePage />} />
          <Route path="repayment" element={<RepaymentPage />} />
          <Route path="me" element={<MePage />} />
        </Route>

        <Route path="/finance" element={<FinanceLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="risk-list" element={<RiskListPage />} />
          <Route path="rider/:id" element={<RiderDetailPage />} />
          <Route path="interventions" element={<InterventionsPage />} />
          <Route
            path="credit-profile"
            element={<PlaceholderPage title="Credit Profile & Upgrade Loans" />}
          />
          <Route path="settings" element={<PlaceholderPage title="Settings" />} />
        </Route>

        <Route path="*" element={<Navigate to="/rider/home" replace />} />
      </Routes>
    </>
  )
}
