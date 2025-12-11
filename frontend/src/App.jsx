import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Layout from './layout/Layout'
import Profile from './pages/Profile'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import PublicHome from './pages/PublicHome'
import BuyerHome from './pages/BuyerHome'
import SellerHome from './pages/SellerHome'

const App = () => {
  return (
    <Router>
      <Routes>

        <Route element={<Layout profile={false} />}>
          <Route path="/" element={<PublicHome />} />
        </Route>
        <Route element={<Layout profile={true} />}>
          <Route path="/about" element={<div>About</div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/buyer" element={<BuyerHome />} />
          <Route path="/seller" element={<SellerHome />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App