'use client'
import React, { useState, useEffect } from 'react';
import {
  Heart,
  Users,
  Calendar,
  Shield,
  Zap,
  Globe,
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
      icon: <Users className="w-7 h-7" />,
      title: 'Multi-Role Management',
      description:
        'Seamlessly manage patients, doctors, and administrators with role-based access control.',
      tone: 'primary',
    },
    {
      icon: <Calendar className="w-7 h-7" />,
      title: 'Smart Scheduling',
      description:
        'Advanced appointment scheduling with automated reminders and conflict resolution.',
      tone: 'amber',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'HIPAA Compliant',
      description:
        'Enterprise-grade security ensuring complete patient data protection and privacy.',
      tone: 'slate',
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: 'Arabic Support',
      description:
        'Full RTL support and localization designed specifically for Arabic-speaking regions.',
      tone: 'primary',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: 'Real-time Updates',
      description:
        'Instant synchronization across all devices with real-time notifications.',
      tone: 'amber',
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: 'Patient Care Focus',
      description:
        'Tools designed to enhance patient experience and improve healthcare outcomes.',
      tone: 'slate',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Ahmed',
      role: 'Chief Medical Officer',
      clinic: 'Cairo Medical Center',
      content:
        'MediCore transformed our clinic operations. The Arabic interface and intuitive design made adoption seamless across our entire team.',
      rating: 5,
    },
    {
      name: 'Ahmad Al-Rashid',
      role: 'Clinic Administrator',
      clinic: 'Riyadh Healthcare',
      content:
        "The multi-role management system is exceptional. We've reduced administrative overhead by 60% since implementing MediCore.",
      rating: 5,
    },
    {
      name: 'Dr. Layla Hassan',
      role: 'Pediatrician',
      clinic: "Dubai Children's Hospital",
      content:
        'Patient scheduling has never been easier. The smart conflict resolution saves us hours every week.',
      rating: 5,
    },
  ];

  const toneClasses: Record<string, string> = {
    primary: 'from-Primary to-Primary/70',
    amber: 'from-amber-500 to-amber-400',
    slate: 'from-slate-800 to-slate-600 dark:from-slate-600 dark:to-slate-400',
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-Primary flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="font-bold text-2xl tracking-tight">
                <span className="text-Primary">Medi</span>Core
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-9">
              {['Features', 'Benefits', 'Testimonials'].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="relative text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-Primary transition-colors group"
                >
                  {label}
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-400 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/98 dark:bg-slate-950/98 backdrop-blur-md border-t border-slate-200 dark:border-slate-800">
            <div className="px-4 py-4 space-y-4">
              {['Features', 'Benefits', 'Testimonials'].map((label) => (
                <a
                  key={label}
                  href={`#${label.toLowerCase()}`}
                  className="block text-slate-700 dark:text-slate-300 hover:text-Primary font-medium"
                >
                  {label}
                </a>
              ))}
              <Link
                href="/signin"
                className="block text-center w-full bg-Primary text-white px-6 py-2.5 rounded-full font-medium"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-28 pb-16">
        {/* Ambient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-10 -left-10 w-[28rem] h-[28rem] bg-Primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[24rem] h-[24rem] bg-amber-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center">
            {/* Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-Primary/30 bg-Primary/5 text-Primary text-xs font-semibold uppercase tracking-wide mb-8">
                <Zap className="w-3.5 h-3.5" />
                Next-Generation Healthcare Management
              </div>

              <h1 className=" text-5xl md:text-6xl lg:text-[4.2rem] font-semibold leading-[1.05] mb-7 text-slate-900 dark:text-white">
                Revolutionize your
                <span className="block italic text-Primary">medical center</span>
              </h1>

              <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-xl leading-relaxed">
                Streamline operations, enhance patient care, and boost efficiency with a
                comprehensive management system built for Arabic-speaking healthcare facilities.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Link
                  href="/signin"
                  className="group bg-Primary hover:bg-Primary/90 text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg shadow-Primary/20 transition-all duration-300 flex items-center"
                >
                  Sign in
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-Primary font-medium transition-colors">
                  <span className="w-11 h-11 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center group-hover:border-Primary transition-colors">
                    <Play className="w-4 h-4 ml-0.5" />
                  </span>
                  Watch overview
                </button>
              </div>
            </div>

            {/* Signature vitals panel */}
            <div className="relative">
              <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200 dark:border-slate-800 p-7 relative overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Today's overview
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-Primary">
                    <span className="w-1.5 h-1.5 rounded-full bg-Primary animate-pulse" />
                    Live
                  </span>
                </div>

                {/* ECG signature line */}
                <svg viewBox="0 0 400 90" className="w-full h-20 mb-6" fill="none">
                  <path
                    d="M0 45 H120 L140 45 L155 15 L172 75 L188 30 L200 45 H400"
                    className="stroke-Primary"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-Primary/8 p-4">
                    <div className="text-2xl  font-semibold text-Primary">128</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Patients today
                    </div>
                  </div>
                  <div className="rounded-2xl bg-amber-400/10 p-4">
                    <div className="text-2xl  font-semibold text-amber-500">94%</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      On-time visits
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 p-4 col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold">Dr. Layla Hassan</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          Next: 2:30 PM · Room 4
                        </div>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-Primary to-amber-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* floating chip */}
              <div className="absolute -bottom-5 -left-5 bg-white dark:bg-slate-900 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2.5 border border-slate-200 dark:border-slate-800">
                <Shield className="w-5 h-5 text-Primary" />
                <span className="text-xs font-semibold">HIPAA compliant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Capabilities
            </span>
            <h2 className=" text-4xl md:text-5xl font-semibold mt-3 mb-6">
              Powerful features for
              <span className="block italic text-Primary">modern healthcare</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need to manage your medical center efficiently, from patient records
              to staff scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-slate-50 dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800 hover:border-Primary/30 hover:shadow-xl hover:shadow-slate-900/5 transition-all duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${toneClasses[feature.tone]} flex items-center justify-center text-white mb-6 group-hover:scale-105 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 bg-slate-900 dark:bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg viewBox="0 0 1200 90" className="w-full h-full" fill="none" preserveAspectRatio="none">
            <path
              d="M0 45 H600 L620 45 L635 15 L652 75 L668 30 L680 45 H1200"
              className="stroke-amber-400"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
                Why MediCore
              </span>
              <h2 className=" text-4xl md:text-5xl font-semibold mt-3 mb-8">
                Built for how clinics
                <span className="block italic">actually run</span>
              </h2>
              <div className="space-y-5">
                {[
                  'Reduce administrative costs by up to 60%',
                  'Improve patient satisfaction scores',
                  'Streamline appointment scheduling',
                  'Ensure HIPAA compliance',
                  'Support multiple languages including Arabic',
                  'Real-time analytics and reporting',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-slate-900" strokeWidth={3} />
                    </div>
                    <span className="text-base text-slate-200">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: 'Patient Management',
                  desc: 'Complete patient profiles with medical history, appointments, and billing.',
                },
                {
                  title: 'Staff Coordination',
                  desc: 'Efficient staff scheduling and role-based access management.',
                },
                {
                  title: 'Analytics Dashboard',
                  desc: 'Real-time insights into clinic performance and patient flow.',
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-amber-400/40 transition-colors"
                >
                  <h4 className="text-lg font-semibold mb-1.5 text-white">{card.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-Primary">
              Trusted region-wide
            </span>
            <h2 className=" text-4xl md:text-5xl font-semibold mt-3 mb-4">
              Healthcare professionals agree
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              See what medical centers across the region are saying about MediCore.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-900 rounded-2xl p-8 shadow-sm border border-slate-200/60 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-900/5 transition-shadow flex flex-col"
              >
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed flex-1">
                  {testimonial.content}
                </p>
                <div className="pt-5 border-t border-slate-200 dark:border-slate-800">
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-Primary text-sm">{testimonial.role}</div>
                  <div className="text-slate-500 dark:text-slate-400 text-sm">
                    {testimonial.clinic}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-amber-400 to-amber-500 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className=" text-4xl md:text-5xl font-semibold text-slate-900 mb-6">
            Ready to transform your medical center?
          </h2>
          <p className="text-lg text-slate-800/70 mb-11 max-w-xl mx-auto">
            Join hundreds of healthcare facilities that have revolutionized their operations with
            MediCore.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {['Doctor', 'Secretary', 'Manager'].map((role) => (
              <button
                key={role}
                className="bg-slate-900 text-white px-8 py-4 rounded-full text-base font-semibold hover:bg-Primary transition-colors duration-300"
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end mb-8">
            <ToggleModeButton />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-lg bg-Primary flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className=" text-xl font-semibold text-white">MediCore</span>
              </div>
              <p className="text-sm leading-relaxed">
                Revolutionizing healthcare management for Arabic-speaking regions with
                cutting-edge technology.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'API'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact', 'Blog'] },
              { title: 'Support', links: ['Help Center', 'Documentation', 'Training', 'Status'] },
            ].map((col) => (
              <div key={col.title}>
                <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wide">
                  {col.title}
                </h3>
                <ul className="space-y-3 text-sm">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-amber-400 transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2025 MediCore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}