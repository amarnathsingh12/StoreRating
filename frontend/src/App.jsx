import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AdminDashboard from '../component/AdminDashboard'
import StoreOwnerDashboard from '../component/StoreOwner'
import ChangePassword from '../component/PasswordChange'
import StoreCard from '../component/StoreCard'
import StoreList from '../component/StoreList'
import Home from '../component/Home'
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/adminpage" element={<AdminDashboard/> } />
      <Route path="/storeOwner" element={<StoreOwnerDashboard/> } />
      <Route path="/passwordChange" element={<ChangePassword/> } />
      <Route path="/storeCard" element={<StoreCard/> } />
      <Route path="/storeList" element={<StoreList/> } />
    </Routes>
  )
}

export default App
