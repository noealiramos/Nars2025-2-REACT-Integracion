import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import UserDetail from './UserDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/:id" element={<UserDetail />} />
      </Routes>
    </BrowserRouter>
  )
}
