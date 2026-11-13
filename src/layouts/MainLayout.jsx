import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import SkipLink from '../components/SkipLink'

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
