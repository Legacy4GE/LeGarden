import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CalendarPage from './pages/CalendarPage'
import PlantsPage from './pages/PlantsPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/plants" element={<PlantsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
