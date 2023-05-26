"use client";

import React, {useRef, useState} from 'react';
import {useRouter} from "next/navigation";
import {useFormik} from "formik";
import emailjs from '@emailjs/browser';
import {contactUsSchema} from "@/app/components/schema";

const ContactForm = () => {
    const initialValues = {
        name: "",
        email: "",
        message: "",
    }
    const {values, errors, handleBlur, touched, handleChange, handleSubmit} = useFormik({
        initialValues: initialValues,
        validationSchema: contactUsSchema,
        onSubmit: (values, action) => {
            setLoading(true);
            emailjs.sendForm('service_x5kkkwn', 'template_y4tprfd', form.current, '97zstD9nZbHoIhjlC')
                .then((result: any) => {
                    setLoading(false);
                    useRouter.call('/thank-you')
                }, (error: any) => {
                    console.error(error.text);
                });
        }
    })
    const form: any = useRef();
    const navigate = useRouter();
    const [loading, setLoading] = useState(false);
    const inputClass = 'w-full bg-opacity-50 rounded border border-gray-300 focus:border-teal-500' +
        ' focus:bg-white focus:ring-2 focus:ring-teal-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out'
    return (
        <form ref={form} className="grid grid-cols-12 gap-2 sm:gap-5" onSubmit={handleSubmit}>
            <div className="col-span-12 sm:col-span-6">
                <label htmlFor="name" className="leading-7 text-sm text-white">Name</label>
                <input type="text" className={inputClass} name="name" placeholder="Enter your name"
                       value={values.name} onChange={handleChange} onBlur={handleBlur}/>
                {errors.name && touched.name &&
                    <p className="text-xs text-red-400 mt-1 capitalize">{errors.name}</p>}
            </div>
            <div className="col-span-12 sm:col-span-6">
                <label htmlFor="email" className="leading-7 text-sm text-white">Email</label>
                <input type="text" className={inputClass} name="email" placeholder="Enter your email"
                       value={values.email} onChange={handleChange} onBlur={handleBlur}/>
                {errors.email && touched.email &&
                    <p className="text-xs text-red-400 mt-1 capitalize">{errors.email}</p>}
            </div>
            <div className="col-span-12">
                <label htmlFor="message" className="leading-7 text-sm text-white">Message</label>
                <textarea className={inputClass} name="message" placeholder="Enter your message here"
                          value={values.message} onChange={handleChange} onBlur={handleBlur}/>
                {errors.message && touched.message &&
                    <p className="text-xs text-red-400 mt-1 capitalize">{errors.message}</p>}
            </div>
            <div className="col-span-12 place-self-start">
                <button
                    type="submit"
                    disabled={loading}
                    className={`uppercase text-sm font-bold tracking-wide bg-yellow-600 w-52 flex justify-center items-center
                                     hover:bg-yellow-700 text-gray-100 p-3 rounded-lg w-full focus:outline-none focus:shadow-outline ${loading && 'cursor-not-allowed'}`}>
                    {loading ? <div
                        className="w-6 h-6 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></div> : 'Send Message'}
                </button>
            </div>
        </form>
    );
};

export default ContactForm;