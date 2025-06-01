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
import RequireAuth from "./components/RequireAuth";
import AddBookPage from "./pages/AddBookPage";
import ManageBooksPage from "./pages/ManageBooksPage";
import AddPostPage from "./pages/AddPostPage";
import ManageMaterialsPage from "./pages/ManageMaterialsPage";
import AddMaterialPage from "./pages/AddMaterialPage";
import UpdateMaterialPage from "./pages/UpdateMaterialPage";
import ManageBookRequestsPage from "./pages/ManageBookRequestsPage";
import ViewMyRequestsPage from "./pages/ViewMyRequestsPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                <Route path="/mainpage" element={
                    <RequireAuth>
                        <MainPage />
                    </RequireAuth>
                }/>

                <Route path="/userprofile" element={
                    <RequireAuth>
                        <UserProfilePage />
                    </RequireAuth>
                }/>

                <Route path="/materials" element={
                    <RequireAuth>
                        <MaterialsPage />
                    </RequireAuth>
                }/>

                <Route path="/books" element={
                    <RequireAuth>
                        <BooksPage />
                    </RequireAuth>
                }/>

                <Route path="/forum" element={
                    <RequireAuth>
                        <ForumPage />
                    </RequireAuth>
                }/>

                <Route path="/post/:postId" element={
                    <RequireAuth>
                        <ForumPostPage />
                    </RequireAuth>
                }/>

                <Route path="/add-post" element={
                    <RequireAuth>
                        <AddPostPage />
                    </RequireAuth>
                }/>

                <Route path="/books/:id" element={
                    <RequireAuth>
                        <BookDetailsPage />
                    </RequireAuth>
                }/>

                <Route path="/materials/:id" element={
                    <RequireAuth>
                        <MaterialDetailsPage />
                    </RequireAuth>
                }/>

                <Route path="/add-book" element={
                    <RequireAuth>
                        <AddBookPage />
                    </RequireAuth>
                } />

                <Route path="/manage-books" element={
                    <RequireAuth>
                        <ManageBooksPage />
                    </RequireAuth>
                } />

                <Route path="/manage-materials" element={
                    <RequireAuth>
                        <ManageMaterialsPage />
                    </RequireAuth>
                } />

                <Route path="/add-material" element={
                    <RequireAuth>
                        <AddMaterialPage />
                    </RequireAuth>
                }/>

                <Route path="/update-material/:id" element={
                    <RequireAuth>
                        <UpdateMaterialPage />
                    </RequireAuth>
                }/>

                <Route path="/manage-requests" element={
                <RequireAuth>
                    <ManageBookRequestsPage />
                </RequireAuth>
                }/>


                <Route path="/my-requests" element={
                    <RequireAuth>
                        <ViewMyRequestsPage />
                    </RequireAuth>
                } />
            </Routes>

        </BrowserRouter>
    );
}

export default App;
