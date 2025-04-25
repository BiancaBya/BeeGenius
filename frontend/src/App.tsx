import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import MainPage from "./pages/MainPage";
import UserProfilePage from "./pages/UserProfilePage";
import ForumPage from "./pages/ForumPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/mainpage" element={<MainPage/>} />
            <Route path="/userprofile" element={<UserProfilePage/>} />
            <Route path="/forum" element={<ForumPage/>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
