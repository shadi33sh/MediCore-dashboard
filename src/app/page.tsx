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
import { useTranslation } from 'react-i18next';

export default function MediCoreLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-7 h-7" />,
      title: t('Landing.featuresList.multiRole.title', 'Multi-Role Management'),
      description: t('Landing.featuresList.multiRole.desc', 'Seamlessly manage patients, doctors, and administrators with role-based access control.'),
      tone: 'primary',
    },
    {
      icon: <Calendar className="w-7 h-7" />,
      title: t('Landing.featuresList.scheduling.title', 'Smart Scheduling'),
      description: t('Landing.featuresList.scheduling.desc', 'Advanced appointment scheduling with automated reminders and conflict resolution.'),
      tone: 'amber',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: t('Landing.featuresList.hipaa.title', 'HIPAA Compliant'),
      description: t('Landing.featuresList.hipaa.desc', 'Enterprise-grade security ensuring complete patient data protection and privacy.'),
      tone: 'slate',
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: t('Landing.featuresList.arabic.title', 'Arabic Support'),
      description: t('Landing.featuresList.arabic.desc', 'Full RTL support and localization designed specifically for Arabic-speaking regions.'),
      tone: 'primary',
    },
    {
      icon: <Zap className="w-7 h-7" />,
      title: t('Landing.featuresList.realTime.title', 'Real-time Updates'),
      description: t('Landing.featuresList.realTime.desc', 'Instant synchronization across all devices with real-time notifications.'),
      tone: 'amber',
    },
    {
      icon: <Heart className="w-7 h-7" />,
      title: t('Landing.featuresList.patientCare.title', 'Patient Care Focus'),
      description: t('Landing.featuresList.patientCare.desc', 'Tools designed to enhance patient experience and improve healthcare outcomes.'),
      tone: 'slate',
    },
  ];

  const testimonials = [
    {
      name: t('Landing.testimonialsList.sarah.name', 'Dr. Sarah Ahmed'),
      role: t('Landing.testimonialsList.sarah.role', 'Chief Medical Officer'),
      clinic: t('Landing.testimonialsList.sarah.clinic', 'Cairo Medical Center'),
      content: t('Landing.testimonialsList.sarah.content', 'MediCore transformed our clinic operations. The Arabic interface and intuitive design made adoption seamless across our entire team.'),
      rating: 5,
    },
    {
      name: t('Landing.testimonialsList.ahmad.name', 'Ahmad Al-Rashid'),
      role: t('Landing.testimonialsList.ahmad.role', 'Clinic Administrator'),
      clinic: t('Landing.testimonialsList.ahmad.clinic', 'Riyadh Healthcare'),
      content: t('Landing.testimonialsList.ahmad.content', "The multi-role management system is exceptional. We've reduced administrative overhead by 60% since implementing MediCore."),
      rating: 5,
    },
    {
      name: t('Landing.testimonialsList.layla.name', 'Dr. Layla Hassan'),
      role: t('Landing.testimonialsList.layla.role', 'Pediatrician'),
      clinic: t('Landing.testimonialsList.layla.clinic', "Dubai Children's Hospital"),
      content: t('Landing.testimonialsList.layla.content', 'Patient scheduling has never been easier. The smart conflict resolution saves us hours every week.'),
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
              {[
                { label: t('Landing.nav.features', 'Features'), id: 'features' },
                { label: t('Landing.nav.benefits', 'Benefits'), id: 'benefits' },
                { label: t('Landing.nav.testimonials', 'Testimonials'), id: 'testimonials' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="relative text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-Primary transition-colors group"
                >
                  {item.label}
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
              {[
                { label: t('Landing.nav.features', 'Features'), id: 'features' },
                { label: t('Landing.nav.benefits', 'Benefits'), id: 'benefits' },
                { label: t('Landing.nav.testimonials', 'Testimonials'), id: 'testimonials' }
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block text-slate-700 dark:text-slate-300 hover:text-Primary font-medium"
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/signin"
                className="block text-center w-full bg-Primary text-white px-6 py-2.5 rounded-full font-medium"
              >
                {t('Landing.nav.signIn', 'Sign in')}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden h-[97vh] flex flex-col  ">
        {/* Ambient background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[40rem] bg-Primary/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-Primary/30 bg-Primary/5 text-Primary text-xs font-semibold uppercase tracking-wide mb-8">
            <Zap className="w-3.5 h-3.5" />
            {t('Landing.hero.tagline', 'Next-Generation Healthcare Management')}
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold mb-8 text-slate-900 dark:text-white lin">
            {t('Landing.hero.title1', 'Revolutionize your')}{' '}
            <span className="text-Primary ">{t('Landing.hero.title2', 'medical center')}</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('Landing.hero.subtitle', 'Streamline operations, enhance patient care, and boost efficiency with a comprehensive management system built for Arabic-speaking healthcare facilities.')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Link
              href="/signin"
              className="group bg-Primary hover:bg-Primary/90 text-white px-8 py-4 rounded-full text-base font-semibold shadow-lg shadow-Primary/20 transition-all duration-300 flex items-center"
            >
              {t('Landing.hero.signIn', 'Sign in')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-Primary font-medium transition-all px-8 py-4 rounded-full border border-slate-200 dark:border-slate-800 hover:border-Primary/30 hover:bg-slate-50 dark:hover:bg-slate-900">
              <Play className="w-4 h-4 text-Primary" />
              {t('Landing.hero.watchOverview', 'Watch overview')}
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              {t('Landing.features.subtitle', 'Capabilities')}
            </span>
            <h2 className=" text-4xl md:text-5xl font-semibold mt-3 mb-6">
              {t('Landing.features.title1', 'Powerful features for')}
              <span className="block  text-Primary">{t('Landing.features.title2', 'modern healthcare')}</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t('Landing.features.desc', 'Everything you need to manage your medical center efficiently, from patient records to staff scheduling.')}
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
                {t('Landing.benefits.subtitle', 'Why MediCore')}
              </span>
              <h2 className=" text-4xl md:text-5xl font-semibold mt-3 mb-8">
                {t('Landing.benefits.title1', 'Built for how clinics')}
                <span className="block ">{t('Landing.benefits.title2', 'actually run')}</span>
              </h2>
              <div className="space-y-5">
                {[
                  t('Landing.benefits.point1', 'Reduce administrative costs by up to 60%'),
                  t('Landing.benefits.point2', 'Improve patient satisfaction scores'),
                  t('Landing.benefits.point3', 'Streamline appointment scheduling'),
                  t('Landing.benefits.point4', 'Ensure HIPAA compliance'),
                  t('Landing.benefits.point5', 'Support multiple languages including Arabic'),
                  t('Landing.benefits.point6', 'Real-time analytics and reporting'),
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
                  title: t('Landing.benefits.card1.title', 'Patient Management'),
                  desc: t('Landing.benefits.card1.desc', 'Complete patient profiles with medical history, appointments, and billing.'),
                },
                {
                  title: t('Landing.benefits.card2.title', 'Staff Coordination'),
                  desc: t('Landing.benefits.card2.desc', 'Efficient staff scheduling and role-based access management.'),
                },
                {
                  title: t('Landing.benefits.card3.title', 'Analytics Dashboard'),
                  desc: t('Landing.benefits.card3.desc', 'Real-time insights into clinic performance and patient flow.'),
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
              {t('Landing.testimonials.subtitle', 'Trusted region-wide')}
            </span>
            <h2 className=" text-4xl md:text-5xl font-semibold mt-3 mb-4">
              {t('Landing.testimonials.title', 'Healthcare professionals agree')}
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              {t('Landing.testimonials.desc', 'See what medical centers across the region are saying about MediCore.')}
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
            {t('Landing.cta.title', 'Ready to transform your medical center?')}
          </h2>
          <p className="text-lg text-slate-800/70 mb-11 max-w-xl mx-auto">
            {t('Landing.cta.desc', 'Join hundreds of healthcare facilities that have revolutionized their operations with MediCore.')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {[
              t('Landing.cta.roles.doctor', 'Doctor'),
              t('Landing.cta.roles.secretary', 'Secretary'),
              t('Landing.cta.roles.manager', 'Manager')
            ].map((role) => (
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
                {t('Landing.footer.desc', 'Revolutionizing healthcare management for Arabic-speaking regions with cutting-edge technology.')}
              </p>
            </div>

            {[
              { title: t('Landing.footer.col1.title', 'Product'), links: [t('Landing.footer.col1.l1', 'Features'), t('Landing.footer.col1.l2', 'Pricing'), t('Landing.footer.col1.l3', 'Security'), t('Landing.footer.col1.l4', 'API')] },
              { title: t('Landing.footer.col2.title', 'Company'), links: [t('Landing.footer.col2.l1', 'About'), t('Landing.footer.col2.l2', 'Careers'), t('Landing.footer.col2.l3', 'Contact'), t('Landing.footer.col2.l4', 'Blog')] },
              { title: t('Landing.footer.col3.title', 'Support'), links: [t('Landing.footer.col3.l1', 'Help Center'), t('Landing.footer.col3.l2', 'Documentation'), t('Landing.footer.col3.l3', 'Training'), t('Landing.footer.col3.l4', 'Status')] },
            ].map((col, index) => (
              <div key={index}>
                <h3 className="text-sm font-semibold text-white mb-6 uppercase tracking-wide">
                  {col.title}
                </h3>
                <ul className="space-y-3 text-sm">
                  {col.links.map((link, idx) => (
                    <li key={idx}>
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
            <p>{t('Landing.footer.copyright', '© 2025 MediCore. All rights reserved.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}