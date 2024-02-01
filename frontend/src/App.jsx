import { BrowserRouter, Routes, Route } from 'react-router-dom' 

import Login from './pages/Login/Login'
import Dashboard from './pages/Dashboard/Dashboard'

import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Dashboard />} />
          {/* <Route path="*" element={}/> */}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
