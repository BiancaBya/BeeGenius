import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignUpPage';
import MainPage from "./pages/MainPage";
import UserProfilePage from "./pages/UserProfilePage";
import MaterialsPage from "./pages/MaterialsPage";
import BooksPage from "./pages/BooksPage";
import ForumPage from "./pages/ForumPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import ForumPostPage from "./pages/ForumPostPage";
import MaterialDetailsPage from "./pages/MaterialDetailsPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage/>} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/mainpage" element={<MainPage/>} />
            <Route path="/userprofile" element={<UserProfilePage/>} />
            <Route path="/materials" element={<MaterialsPage/>} />
            <Route path="/books" element={<BooksPage/>} />
            <Route path="/forum" element={<ForumPage/>} />
            <Route path="/post/:postId" element={<ForumPostPage />} />
            <Route path="/books/:id" element={<BookDetailsPage/>} />
            <Route path="materials/:id" element={<MaterialDetailsPage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
