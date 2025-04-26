import React, { useContext, useEffect, useState } from 'react';
import '../styles/Navbar.css';
import { images } from '../utils/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastOptions } from "../utils/toastConfig";


const Navbar = () => {

  const { isLoggedin, setIsLoggedin, backendUrl, getUserData, userData } = useContext(AppContext);
  const navigate = useNavigate();
  const [sidebar, setSidebar] = useState(false);

  useEffect(() => {
    getUserData();  // Auto-fetch user data on load
    setSidebar(false);
  }, []);

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);

      if (data.success) {
        setIsLoggedin(false);
        toast.success("Logged out successfully", toastOptions);
        navigate('/');
      } else {
        toast.error("Logout failed", toastOptions);
      }

    } catch (error) {
      toast.error("Logout failed", toastOptions);
    }
  };

  const handleSidebar = () => {
    setSidebar(true);
  };


  return (
    <div className='navbar-main'>

      <div className="hamburger" onClick={handleSidebar}>
        <img src={images.hamburgerIcon} alt="" />
      </div>

      <div className="logo">
        <a href="/">
          <img src={images.logo} alt="Quiz Overflow Logo" />
          <p>Quiz Overflow</p>
        </a>
      </div>

      <div className="links">
        {isLoggedin && userData?.role === 'admin' && (
          <>
            <NavLink to="/admin-dashboard" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
            <NavLink to="/admin-stats" className={({ isActive }) => isActive ? "active" : ""}>Stats</NavLink>
            <NavLink to="/admin-users" className={({ isActive }) => isActive ? "active" : ""}>Users</NavLink>
            <NavLink to="/admin-quizzes" className={({ isActive }) => isActive ? "active" : ""}>Quizzes</NavLink>
            <NavLink to="/admin-queries" className={({ isActive }) => isActive ? "active" : ""}>Queries</NavLink>
            <NavLink to="/admin-create-quiz" className={({ isActive }) => isActive ? "active" : ""}>Create</NavLink>
            <button onClick={handleLogout}>
              <p>Logout</p>
            </button>
          </>
        )}

        {isLoggedin && userData?.role !== 'admin' && (
          <>
            <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
            <NavLink to="/quizzes" className={({ isActive }) => isActive ? "active" : ""}>Quizzes</NavLink>
            <NavLink to={`/share-profile/${userData?.developerId}`} className={({ isActive }) => isActive ? "active" : ""}>Share</NavLink>
            <NavLink to={`/progress/${userData?.developerId}`} className={({ isActive }) => isActive ? "active" : ""}>Progress</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
            <button onClick={handleLogout}>
              <p>Logout</p>
            </button>
          </>
        )}

        {!isLoggedin && (
          <button onClick={() => navigate('/login')}>
            <p>Login</p>
          </button>
        )}
      </div>


      {sidebar && (
        <div className="sidebar">
          <div className="sidebar-line"></div>
          <div className="close-btn" onClick={() => setSidebar(false)}>×</div>

          {isLoggedin && userData?.role === 'admin' && (
            <>
              <NavLink to="/admin-dashboard" onClick={() => setSidebar(false)}>Dashboard</NavLink>
              <NavLink to="/admin-stats" onClick={() => setSidebar(false)}>Stats</NavLink>
              <NavLink to="/admin-users" onClick={() => setSidebar(false)}>Users</NavLink>
              <NavLink to="/admin-quizzes" onClick={() => setSidebar(false)}>Quizzes</NavLink>
              <NavLink to="/admin-queries" onClick={() => setSidebar(false)}>Queries</NavLink>
              <NavLink to="/admin-create-quiz" onClick={() => setSidebar(false)}>Create</NavLink>
              <button onClick={() => {
                handleLogout();
                setSidebar(false);
              }}>
                <p>Logout</p>
              </button>
            </>
          )}

          {isLoggedin && userData?.role !== 'admin' && (
            <>
              <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setSidebar(false)}>Home</NavLink>
              <NavLink to="/quizzes" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setSidebar(false)}>Quizzes</NavLink>
              <NavLink to={`/share-profile/${userData?.developerId}`} className={({ isActive }) => isActive ? "active" : ""} onClick={() => setSidebar(false)}>Share</NavLink>
              <NavLink to={`/progress/${userData?.developerId}`} className={({ isActive }) => isActive ? "active" : ""} onClick={() => setSidebar(false)}>Progress</NavLink>
              <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setSidebar(false)}>Profile</NavLink>
              <button onClick={() => {
                handleLogout();
                setSidebar(false);
              }}>
                <p>Logout</p>
              </button>
            </>
          )}

          {!isLoggedin && (
            <div className='abcd'><button id='sidebar-login-btn' onClick={() => {
              navigate('/login');
              setSidebar(false);
            }}>
              <p>Login</p>
            </button></div>
          )}
        </div>
      )}

    </div>
  )
}

export default Navbar
