import React, { useState, useEffect, useContext } from 'react';
import '../styles/Register.css';
import Loader from '../components/Loader';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastOptions } from '../utils/toastConfig';
import { toastOptionsTwo } from '../utils/toastConfig';


const Register = () => {

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
                name: watch("registerName"),
                email: watch("registerEmail"),
                password: watch("registerPassword"),
                gender: watch("registerGender")
            };

            const { data } = await axios.post(`${backendUrl}/api/auth/register`, formData);

            if (data.success) {
                setIsLoggedin(true);
                await getUserData();
                toast.info("A welcome email has been sent to your inbox 📩", toastOptionsTwo);
                navigate('/');
            } else {
                toast.error("Registration failed. Invalid credentials", toastOptions);
            }

        } catch (error) {
            console.error("Registration failed. Invalid credentials :", error);
            toast.error("Registration failed. Invalid credentials", toastOptions);
        }
    };


    if (loading) return <Loader />;


    return (
        <div className='register-main'>

            <div className="form">
                <p className="register-title">Create Account</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            placeholder='Name'
                            id='register-name'
                            {...register("registerName", {
                                required: "Name missing",
                                minLength: { value: 3, message: "Minimum length is 3" }
                            })}
                        />
                        {errors.registerName && <p className='error-msg'>{errors.registerName.message}</p>}
                    </div>

                    <div>
                        <input
                            placeholder='Email'
                            id='register-email'
                            {...register("registerEmail", {
                                required: "Email missing",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format"
                                }
                            })}
                        />
                        {errors.registerEmail && <p className='error-msg'>{errors.registerEmail.message}</p>}
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder='Password (min 8 characters)'
                            id='register-password'
                            {...register("registerPassword", {
                                required: "Password missing",
                                minLength: { value: 8, message: "Minimum length is 8" }
                            })}
                        />
                        {errors.registerPassword && <p className='error-msg'>{errors.registerPassword.message}</p>}
                    </div>

                    <div>
                        <select
                            id='register-gender'
                            defaultValue=""
                            {...register("registerGender", {
                                required: "Please select your gender"
                            })}
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                        {errors.registerGender && <p className='error-msg'>{errors.registerGender.message}</p>}
                    </div>

                    <input
                        type="submit"
                        id='register-btn'
                        disabled={isSubmitting}
                        value={isSubmitting ? "Creating" : "Sign Up"}
                    />
                </form>

                <div className="not-account">
                    Already have an account? <span><Link to="/login">Login</Link></span>
                </div>
            </div>

        </div>
    )
}

export default Register
