import React, { useState, useEffect, useContext } from 'react';
import '../styles/Login.css';
import Loader from '../components/Loader';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import { toastOptions } from '../utils/toastConfig';


const Login = () => {

  const { backendUrl, isLoggedin, setIsLoggedin, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);  // Simulate loading
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loading && isLoggedin) {
      navigate('/');
    }
  }, [isLoggedin, loading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm();

  const onSubmit = async () => {
    try {
      axios.defaults.withCredentials = true;

      const formData = {
        email: watch("loginEmail"),
        password: watch("loginPassword"),
      };

      const { data } = await axios.post(`${backendUrl}/api/auth/login`, formData);

      if (data.success) {
        setIsLoggedin(true);
        await getUserData();
        navigate('/');
        toast.success("Login successful", toastOptions);
      } else {
        toast.error("Login failed. Invalid credentials", toastOptions);
      }

    } catch (error) {
      console.error("Login failed. Invalid credentials :", error);
      toast.error("Login failed. Invalid credentials", toastOptions);
    }
  };


  if (loading) return <Loader />;


  return (
    <div className='login-main'>

      <div className="form">
        <p className="login-title">Login Account</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              placeholder='Email'
              id='login-email'
              {...register("loginEmail", {
                required: "Email missing",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email pattern"
                }
              })}
            />
            {errors.loginEmail && <p className='error-msg'>{errors.loginEmail.message}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder='Password'
              id='login-password'
              {...register("loginPassword", {
                required: "Password missing"
              })}
            />
            {errors.loginPassword && <p className='error-msg'>{errors.loginPassword.message}</p>}
          </div>

          <input
            type="submit"
            id='login-btn'
            disabled={isSubmitting}
            value={isSubmitting ? "Logging in" : "Login"} />
        </form>

        <div className="not-account">
          <div>Don't have an account? <span><Link to="/register">Sign up</Link></span></div>
        </div>
      </div>

    </div>
  )
}

export default Login
