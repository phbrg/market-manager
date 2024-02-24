import { BrowserRouter, Routes, Route } from 'react-router-dom' 
import { Toaster } from 'sonner'

import { Dashboard } from './pages/Dashboard/Dashboard'
import { Product } from './pages/Product/Product'
import { Login } from './pages/Login/Login'
import { NotFound } from './pages/NotFound/NotFound'

import { Nav } from './components/Nav/Nav'

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
