import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CalculatorPage from './pages/CalculatorPage'
import ResultsPage from './pages/ResultsPage'

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/calculator" element={<CalculatorPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </div>
  )
}

export default App
