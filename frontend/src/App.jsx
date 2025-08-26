import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import Layout from './layout/Layout'
import Profile from './pages/Profile'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/about" element={<div>About</div>} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App