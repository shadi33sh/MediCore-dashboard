'use client'
import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Users, 
  Calendar, 
  Shield, 
  Zap, 
  Globe, 
  ChevronRight, 
  Play,
  Check,
  Star,
  ArrowRight,
  Menu,
  X,
} from 'lucide-react';
import Link from 'next/link';
import ToggleModeButton from '../Components/ToggleModeButton';

export default function MediCoreLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Role Management",
      description: "Seamlessly manage patients, doctors, and administrators with role-based access control."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Smart Scheduling",
      description: "Advanced appointment scheduling with automated reminders and conflict resolution."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security ensuring complete patient data protection and privacy."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Arabic Support",
      description: "Full RTL support and localization designed specifically for Arabic-speaking regions."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Updates",
      description: "Instant synchronization across all devices with real-time notifications."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Patient Care Focus",
      description: "Tools designed to enhance patient experience and improve healthcare outcomes."
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Ahmed",
      role: "Chief Medical Officer",
      clinic: "Cairo Medical Center",
      content: "MediCore transformed our clinic operations. The Arabic interface and intuitive design made adoption seamless across our entire team.",
      rating: 5
    },
    {
      name: "Ahmad Al-Rashid",
      role: "Clinic Administrator",
      clinic: "Riyadh Healthcare",
      content: "The multi-role management system is exceptional. We've reduced administrative overhead by 60% since implementing MediCore.",
      rating: 5
    },
    {
      name: "Dr. Layla Hassan",
      role: "Pediatrician",
      clinic: "Dubai Children's Hospital",
      content: "Patient scheduling has never been easier. The smart conflict resolution saves us hours every week.",
      rating: 5
    }
  ];

  return (
    <div style={{scrollBehavior : 'smooth'}} className="min-h-screen bg-gradient-to-br dark:text-White from-white  to-Primary dark:from-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-white/95 dark:bg-gray-900 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="rounded-xl flex items-center justify-center">
               <img src="images/Logo.png" style={{width  : 50 ,height : 50 }} alt="" />
              </div>
                 <h1 className="font-bold text-3xl">
                  <span className="text-Primary">Medi</span>Core 
                </h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="dark:text-gray-500 hover:text-Primary transition-colors">Features</a>
              <a href="#benefits" className="dark:text-gray-500 hover:text-Primary transition-colors">Benefits</a>
              <a href="#testimonials" className="dark:text-gray-500 hover:text-Primary transition-colors">Testimonials</a>
              {/* <button className="bg-gradient-to-r from-Primary to-blue-400 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                Get Started
              </button> */}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-gray-900 backdrop-blur-md border-t">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block dark:text-gray-500  text-gray-700 hover:text-Primary">Features</a>
              <a href="#benefits" className="block dark:text-gray-500  text-gray-700 hover:text-Primary">Benefits</a>
              <a href="#testimonials" className="block dark:text-gray-500  text-gray-700 hover:text-Primary">Testimonials</a>
              <button className="w-full bg-gradient-to-r from-Primary to-blue-400 text-white px-6 py-2 rounded-full">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-Primary rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-200 dark:bg-blue-800/20  rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-purple-200 dark:bg-teal-800/60 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 border-Primary border-2 rounded-full text-Primary text-sm font-medium mb-8 animate-fade-in">
              <Zap className="w-4 h-4 mr-2" />
              Next-Generation Healthcare Management
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-gray-300 mb-8 leading-tight">
              Revolutionize Your
              <span className="block bg-Primary  bg-clip-text text-transparent">
                Medical Center
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-500 mb-12 max-w-4xl mx-auto leading-relaxed">
              Streamline operations, enhance patient care, and boost efficiency with our comprehensive 
              web-based management system designed for Arabic-speaking healthcare facilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Link href='/signin' className="group bg-gradient-to-r from-Primary/60 to-Primary text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center">
                Sign in
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-Primary mb-2">Doctor</div>
              </div>
              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-Primary mb-2">Secretary</div>
              </div>
              <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-3xl font-bold text-Primary mb-2">Manager</div>
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block text-Primary">Modern Healthcare</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-3xl mx-auto">
              Everything you need to manage your medical center efficiently, 
              from patient records to staff scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-white dark:from-gray-900 to-Primary/30 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 "
              >
                <div className="w-16 h-16 bg-gradient-to-r from-Primary to-blue-500 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-gradient-to-br from-Primary  text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Why Choose MediCore?
              </h2>
              <div className="space-y-6">
                {[
                  "Reduce administrative costs by up to 60%",
                  "Improve patient satisfaction scores",
                  "Streamline appointment scheduling",
                  "Ensure HIPAA compliance",
                  "Support multiple languages including Arabic",
                  "Real-time analytics and reporting"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <Check className="w-4 h-4 text-green-800" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="space-y-6">
                  <div className="bg-white/20 rounded-2xl p-6">
                    <h4 className="text-xl font-semibold mb-2">Patient Management</h4>
                    <p >Complete patient profiles with medical history, appointments, and billing.</p>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-6">
                    <h4 className="text-xl font-semibold mb-2">Staff Coordination</h4>
                    <p >Efficient staff scheduling and role-based access management.</p>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-6">
                    <h4 className="text-xl font-semibold mb-2">Analytics Dashboard</h4>
                    <p >Real-time insights into clinic performance and patient flow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold  mb-6">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-500">
              See what medical centers across the region are saying about MediCore
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-500 mb-6 italic dark:text-white">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold dark:text-gray-400  text-gray-900 ">{testimonial.name}</div>
                  <div className="text-Primary">{testimonial.role}</div>
                  <div className="text-gray-500 text-sm">{testimonial.clinic}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-Primary ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Medical Center?
          </h2>
          <p className="text-xl text-white mb-12">
            Join hundreds of healthcare facilities that have revolutionized their operations with MediCore.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-white text-Primary px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Doctor
            </button>

            <button className="bg-white text-Primary px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Secretary
            </button>

            <button className="bg-white text-Primary px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              Manager
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
      <ToggleModeButton/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-Primary to-blue-400 rounded-xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">MediCore</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing healthcare management for Arabic-speaking regions with cutting-edge technology.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Training</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MediCore. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}