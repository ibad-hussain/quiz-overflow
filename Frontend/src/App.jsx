import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Quizzes from './pages/Quizzes';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Quiz from './pages/Quiz';
import Share from './pages/Share';
import TakeQuizPage from "./pages/TakeQuizPage";
import Dashboard from "./pages/Dashboard";
import Stats from "./pages/Stats";
import AdminUsers from "./pages/AdminUsers";
import AdminQuizzes from "./pages/AdminQuizzes";
import AdminQuiz from "./pages/AdminQuiz";
import AdminUser from "./pages/AdminUser";
import CreateQuiz from "./pages/CreateQuiz";
import Queries from './pages/Queries';
import PageNotFound from './pages/PageNotFound';
import { ToastContainer } from 'react-toastify';


const App = () => {
  return (
    <div className='app-main'>
      <ToastContainer />
      <Navbar />
      <main>
        <Routes>
          {/* Static Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/contact' element={<Contact />} />

          {/* User Routes */}
          <Route path='/profile' element={<Profile />} />
          <Route path='/quizzes' element={<Quizzes />} />
          <Route path='/share-profile/:developerId' element={<Share />} />
          <Route path='/progress/:developerId' element={<Progress />} />
          <Route path="/quizzes/:title" element={<Quiz />} />
          <Route path="/quiz/:quizId" element={<TakeQuizPage />} />

          {/* Admin Routes */}
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/admin-stats' element={<Stats />} />
          <Route path='/admin-users' element={<AdminUsers />} />
          <Route path='/admin-quizzes' element={<AdminQuizzes />} />
          <Route path='/admin-queries' element={<Queries />} />
          <Route path='/admin-create-quiz' element={<CreateQuiz />} />
          <Route path="/admin-quiz/:title/:category/level/:level" element={<AdminQuiz />} />
          <Route path="/admin-user/:developerId" element={<AdminUser />} />

          {/* catch-all route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
