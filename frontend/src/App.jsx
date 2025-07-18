import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
