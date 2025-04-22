import React, { useState, useEffect, useContext } from 'react'
import '../styles/Contact.css'
import Loader from '../components/Loader';
import { useForm } from "react-hook-form";
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { toast } from 'react-toastify';
import { toastOptions } from "../utils/toastConfig";


const Contact = () => {

    const { backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 300);  // Simulate loading
        return () => clearTimeout(timer);
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm();

    async function onSubmit(data) {
        try {
            axios.defaults.withCredentials = true;
            const { data: response } = await axios.post(`${backendUrl}/api/admin/submit-contact`, data);

            if (response.success) {
                toast.success("Contact form submitted successfully", toastOptions);
                reset();
            } else {
                toast.error("Error submitting contact form", toastOptions);
            }

        } catch (error) {
            console.error("Error submitting contact form :", error);
            toast.error("Error submitting contact form", toastOptions);
        }
    };


    if (loading) return <Loader />;


    return (
        <div className='contact-main'>

            <div className="form">
                <p className="contact-title">Contact us</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <input
                            placeholder='Enter Name'
                            id='contact-name'
                            {...register("contactName",
                                {
                                    required: { value: true, message: "Name missing" },
                                    minLength: { value: 3, message: "Min len atleast 3" }
                                })} />
                        {errors.contactName && <p className='error-msg'>{errors.contactName.message}</p>}
                    </div>

                    <div>
                        <input
                            placeholder='Enter Email'
                            id='contact-email'
                            {...register("contactEmail",
                                {
                                    required: { value: true, message: "Email missing" },
                                    pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: "Invalid email pattern" }
                                })} />
                        {errors.contactEmail && <p className='error-msg'>{errors.contactEmail.message}</p>}
                    </div>

                    <div>
                        <textarea
                            placeholder='Enter Query'
                            id='contact-query'
                            {...register("contactQuery",
                                {
                                    required: { value: true, message: "Query missing" }
                                })}
                        />
                        {errors.contactQuery && <p className='error-msg'>{errors.contactQuery.message}</p>}
                    </div>

                    <input
                        type="submit"
                        id='contact-btn'
                        disabled={isSubmitting}
                        value={isSubmitting ? "Submitting" : "Submit"} />
                </form>
            </div>

        </div>
    )
}

export default Contact
