import { Routes, Route } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import Navbar from "./components/Navbar"
import MyBooksPage from "./pages/MyBooksPage"
import MyBookDetailPage from "./pages/MyBookDetailPage"
import BookDetailPage from "./pages/BookDetailPage"
import SearchPage from "./pages/SearchPage"
import HomePage from "./pages/HomePage" 
import Practice from "./pages/Practice"

import './App.css'


function App() {

  return (
    <>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<HomePage />} />
        <Route path="/practice" element={<Practice/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/mybooks" element={<MyBooksPage />} />
        <Route path="/mybooks/:book_id" element={< MyBookDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/books/:book_id" element={< BookDetailPage />} />

      </Routes>
    </>
  )
}

export default App
