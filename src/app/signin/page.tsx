'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import axiosInstance from '../AuthAxios';
import Loading from '../../Components/loading';
import { useAlert } from '../../Components/Alert';
import DarkModeToggle from '../../Components/toggleDarkMode';
import ToggleModeButton from '../../Components/ToggleModeButton';
import { useRouter } from 'next/navigation';


export default function LoginPage() {
  const [formData, setFormData] = useState({ email : '', password: '' });
  const [error, setError] = useState('');
  const [loading , setLoading] = useState(false)
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const { showAlert } = useAlert();
   
  const navigator = useRouter()
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    setError(''); 
    try {

      const response = await axiosInstance.post('api/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      
      const user = await axiosInstance.post('api/auth/me')
      localStorage.setItem('user', user.data);
      
      navigator.push(user.data.role)

      setLoading(false)
      showAlert('success','logged is successfuly')
      
    } catch (err) {
      showAlert('error','Invalid username or password')
      setLoading(false)
    }
  };  

  return (
    <div className="w-screen h-screen bg-gradient-to-br dark:text-White from-white  to-Primary dark:from-gray-950 dark:to-gray-900 flex justify-center items-center dark:text-white">
          <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-Primary rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-200 dark:bg-blue-800/20  rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 dark:bg-teal-800/60 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-4000"></div>
        </div>
      <form
        onSubmit={handleSubmit}
        className="p-16 rounded-xl text-center md:bg-gray-200/30 md:dark:bg-gray-700/40 w-[580px] flex flex-col items-center gap-8 z-10"
        >
        {/* <ToggleModeButton/> */}
        <h1 className="font-bold text-3xl">
          Sign in as Doctor <span className="text-Primary">Medi</span>Core
        </h1>
        <img className="w-[120px]" src="/images/Logo.png" alt="Logo" />


        <input
          type="text"
          name="email"
          value={formData.username}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 max-md:bg-gray-200 max-md:dark:bg-gray-700/40 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 max-md:bg-gray-200 max-md:dark:bg-gray-700/40 p-4 w-full rounded-xl pl-6 border-Primary"
          placeholder="Password"
          required
        />
        <div className='w-full h-16 center'>
          { !loading ?
                  <button type="submit" className="p-4 bg-Primary rounded-xl w-full flex justify-center">
                  <p className="font-bold text-white">Sign In</p>
                </button>
                :
              <Loading/>
          }
        </div>
        <p className="text-Gray font-semibold">
          Forgot password? <Link href="/forgot-password" className="text-Primary">Click here</Link>
        </p>
      </form>
    </div>
  );
}
