import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Ponds from './pages/Ponds'
import Alerts from './pages/Alerts'
import Reports from './pages/Reports'
import Tips from './pages/Tips'
import PondDetails from './pages/PondDetails';
import { Button } from './components/ui/button'

const App = () => {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="bg-gray-50 pl-46 p-4">
        <Routes>
          <Route path="/" element={
            <>
              <p className='text-7xl'>hello</p>
              <Button>hello</Button>
            </>
          } />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ponds" element={<Ponds />} />
          <Route path="/ponds/:pondId" element={<PondDetails />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/rapports" element={<Reports />} />
          <Route path="/tips" element={<Tips />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
