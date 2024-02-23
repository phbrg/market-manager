import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import { Toaster } from 'sonner'

import { Home } from './pages/Home/Home'
import { Login } from './pages/Login/Login'
import { NotFound } from './pages/NotFound/NotFound'

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
