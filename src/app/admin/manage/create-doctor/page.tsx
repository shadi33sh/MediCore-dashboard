'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../AuthAxios';
import Loading from '../../../../Components/loading';
import LoadingScreen from '../../../../Components/loadingScreen';
import { useAlert } from '../../../../Components/Alert';


const doctors = [
  {
    first_name: "Emily",
    last_name: "Johnson",
    bio: "Cardiology specialist with 10+ years of experience.",
    department: "Cardiology",
    email: "emily.johnson@example.com",
    phone: "+963912345678",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Daniel",
    last_name: "Smith",
    bio: "Experienced neurologist focused on stroke prevention.",
    department: "Neurology",
    email: "daniel.smith@example.com",
    phone: "+963923456789",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Sophia",
    last_name: "Miller",
    bio: "Dedicated pediatrician ensuring children's health.",
    department: "Pediatrics",
    email: "sophia.miller@example.com",
    phone: "+963934567890",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Ahmed",
    last_name: "Hassan",
    bio: "General surgeon with a passion for minimally invasive procedures.",
    department: "Dermatology",
    email: "ahmed.hassan@example.com",
    phone: "+963944321987",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Lina",
    last_name: "Nasser",
    bio: "Dermatologist with expertise in skincare and laser treatments.",
    department: "Dermatology",
    email: "lina.nasser@example.com",
    phone: "+963955987654",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Omar",
    last_name: "Fahad",
    bio: "Orthopedic doctor specializing in sports injuries.",
    department: "Endocrinology",
    email: "omar.fahad@example.com",
    phone: "+963966123456",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Fatima",
    last_name: "Khalil",
    bio: "Gynecologist with deep focus on maternal health.",
    department: "Endocrinology",
    email: "fatima.khalil@example.com",
    phone: "+963977234567",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Zaid",
    last_name: "Mahmoud",
    bio: "ENT specialist treating hearing and sinus disorders.",
    department: "Pulmonology",
    email: "zaid.mahmoud@example.com",
    phone: "+963988345678",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "Noor",
    last_name: "Ali",
    bio: "Psychiatrist focused on youth mental health.",
    department: "Pulmonology",
    email: "noor.ali@example.com",
    phone: "+963999456789",
    password: "00000000",
    password_confirmation: "00000000"
  },
  {
    first_name: "George",
    last_name: "Saad",
    bio: "Internal medicine expert managing chronic diseases.",
    department: "Gastroenterology",
    email: "george.saad@example.com",
    phone: "+963910567890",
    password: "00000000",
    password_confirmation: "00000000"
  }
  ,
    {
      first_name: "Samir",
      last_name: "Zein",
      bio: "Cardiologist passionate about patient education and prevention.",
      department: "Cardiology",
      email: "samir.zein@example.com",
      phone: "+963910112233",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Alaa",
      last_name: "Joudeh",
      bio: "Neurologist specializing in multiple sclerosis treatments.",
      department: "Neurology",
      email: "alaa.joudeh@example.com",
      phone: "+963921223344",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Maya",
      last_name: "Rashid",
      bio: "Pediatrician with experience in rural child care programs.",
      department: "Pediatrics",
      email: "maya.rashid@example.com",
      phone: "+963932334455",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Walid",
      last_name: "Fouad",
      bio: "Dermatologist offering solutions for acne and eczema.",
      department: "Dermatology",
      email: "walid.fouad@example.com",
      phone: "+963943445566",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Jana",
      last_name: "Mansour",
      bio: "Endocrinologist passionate about hormone balance therapy.",
      department: "Endocrinology",
      email: "jana.mansour@example.com",
      phone: "+963954556677",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Rami",
      last_name: "Kanaan",
      bio: "Pulmonologist skilled in advanced respiratory diagnostics.",
      department: "Pulmonology",
      email: "rami.kanaan@example.com",
      phone: "+963965667788",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Dana",
      last_name: "Asaad",
      bio: "Gastroenterologist focused on colonoscopy and digestive health.",
      department: "Gastroenterology",
      email: "dana.asaad@example.com",
      phone: "+963976778899",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Firas",
      last_name: "Al-Hakim",
      bio: "Cardiovascular consultant involved in community clinics.",
      department: "Cardiology",
      email: "firas.hakim@example.com",
      phone: "+963987889900",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Nada",
      last_name: "Sabbagh",
      bio: "Pediatrician supporting developmental milestone tracking.",
      department: "Pediatrics",
      email: "nada.sabbagh@example.com",
      phone: "+963998990011",
      password: "00000000",
      password_confirmation: "00000000"
    },
    {
      first_name: "Youssef",
      last_name: "Adel",
      bio: "Gastroenterologist with focus on liver diseases and diet.",
      department: "Gastroenterology",
      email: "youssef.adel@example.com",
      phone: "+963909001122",
      password: "00000000",
      password_confirmation: "00000000"
    }
]


export default function page() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    department: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  });
  
  const { showAlert } = useAlert();
  const [departments, setDepartments] = useState(); 
  const [loading , setLoading] = useState(false)

  useEffect(() => {
    async function fetchDepartments() {
      try {
        const response = await axiosInstance.get('api/department'); // Adjust endpoint if needed
        setDepartments(response.data.data.departments); // Store department list
      } catch (err) {
        console.error('Error fetching departments:', err);
      }
    }
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  async function registerDoctorsIndividually() {
    for (const doctor of doctors) {
      try {
        const response = await axiosInstance.post('api/admin/doctor', doctor);
        console.log(`Registered: ${doctor.first_name} ${doctor.last_name}`, response.data);
      } catch (error) {
        console.error(`Failed to register ${doctor.first_name} ${doctor.last_name}`, error.response?.data || error.message);
      }
    }
  }
  

  
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();

    try {
      const response = await axiosInstance.post('api/admin/doctor', formData);  
      showAlert('success' , 'Doctor registration successful')
      setLoading(false)

    } catch (err) {
      console.log('Registration error:', err);
      setLoading(false)
      showAlert('error' , err.response.data.msg)

    }
  };



  

  if(!departments) return <LoadingScreen/>

  return (
    <div className="mt-20 flex justify-center  items-center dark:text-white">
      <form
        onSubmit={handleSubmit}
        className="tailwind-form"
      >
        <h1 className="font-bold text-3xl">
          Register as a Doctor <span className="text-Primary">Medi</span>Core
        </h1>
        <img className="w-[120px]" src="/images/Logo.png" alt="Logo" />
        
        <div className='flex gap-6 w-full justify-between'>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            placeholder="First Name"
            // required
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            placeholder="Last Name"
            // required
          />
        </div>

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="dark:bg-black bg-gray-100 p-3 w-full rounded-xl pl-6 border-Primary"
          // required
        >
          <option value="" disabled>Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.name}>
              {dept.name}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Short Bio"
          // required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          // required
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+963XXXXXXXXX"
          // required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password (Min 8 characters)"
          // required
        />
        <input
          type="password"
          name="password_confirmation"
          value={formData.password_confirmation}
          onChange={handleChange}
          placeholder="Confirm Password"
          // required
        />

      <div className='w-full h-16 center'>
          { !loading ?
                  <button  type="submit" className="p-4 bg-Primary rounded-xl w-full flex justify-center">
                  <p className="font-bold text-white">Sign In</p>
                </button>
                :
              <Loading/>
          }
        </div>

        <p className="text-Gray font-semibold">
          Already registered? <Link href="/login" className="text-Primary">Sign in</Link>
        </p>
      </form>
      
    </div>
  );
}
