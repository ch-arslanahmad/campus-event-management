import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Events from './pages/Events.jsx'
import Admin from './pages/Admin.jsx'
import Dashboard from './pages/Dashboard.jsx'
import EventDetails from './pages/EventDetails.jsx'
import MyEvents from './pages/MyEvents.jsx'

export default function App() {
  const { pathname } = useLocation()
  return (
    <>
      <Navbar />
      <main key={pathname} className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/event" element={<EventDetails />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
