import { BrowserRouter as Router, Routes, Route } from 'react-router';
import Layout from './layout/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import BuyerHome from './pages/BuyerHome';
import AdminHome from './pages/AdminHome';

function App() {
  return (
    <Router>
      <Routes>
      <Route element={<Layout />}>
        <Route path="/user" element={<BuyerHome />} />
        <Route path="/admin" element={<AdminHome />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/sign-up" element={<SignUp />} />
    </Routes>
    </Router>
  );
}

export default App;
