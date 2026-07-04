// Shared form shell used by all manage forms
'use client'
import React from 'react'
import { motion } from 'framer-motion'

interface FormShellProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  accentColor: string        // Tailwind gradient string e.g. "from-cyan-500 to-teal-600"
  children: React.ReactNode
}

export default function FormShell({ title, subtitle, icon, accentColor, children }: FormShellProps) {
  return (
    <div className="flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full"
      >
        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          {/* Gradient header */}
          <div className={`bg-gradient-to-br ${accentColor} px-8 py-7 relative overflow-hidden`}>
            {/* dot pattern */}
            <div
              className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                {icon}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">{title}</h1>
                <p className="text-white/70 text-sm mt-0.5">{subtitle}</p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="px-8 py-7 space-y-5">
            {children}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

// ─── Reusable field components ─────────────────────────────────────────────────

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: React.ReactNode
}

export function Field({ label, icon, className, ...props }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`w-full ${icon ? 'pl-9' : 'pl-4'} pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary
            transition-all duration-200 ${className ?? ''}`}
        />
      </div>
    </div>
  )
}

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  icon?: React.ReactNode
}

export function TextareaField({ label, icon, className, ...props }: TextareaFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-3.5 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <textarea
          {...props}
          rows={3}
          className={`w-full ${icon ? 'pl-9' : 'pl-4'} pr-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white
            placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary
            transition-all duration-200 resize-none ${className ?? ''}`}
        />
      </div>
    </div>
  )
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon?: React.ReactNode
  children: React.ReactNode
}

export function SelectField({ label, icon, children, className, ...props }: SelectFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </span>
        )}
        <select
          {...props}
          className={`w-full appearance-none ${icon ? 'pl-9' : 'pl-4'} pr-9 py-3 rounded-2xl border border-gray-200 dark:border-gray-700
            bg-gray-50 dark:bg-gray-800 text-sm text-gray-800 dark:text-white
            focus:outline-none focus:ring-2 focus:ring-Primary/50 focus:border-Primary
            transition-all duration-200 ${className ?? ''}`}
        >
          {children}
        </select>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
        </span>
      </div>
    </div>
  )
}

interface RowProps { children: React.ReactNode }
export function FieldRow({ children }: RowProps) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>
}

interface SubmitBtnProps {
  label: string
  loading?: boolean
  accentColor?: string
  loadingComponent?: React.ReactNode
}
export function SubmitBtn({ label, loading, accentColor = 'from-Primary to-teal-500', loadingComponent }: SubmitBtnProps) {
  return (
    <div className="pt-2">
      {loading ? (
        <div className="flex justify-center py-2">{loadingComponent}</div>
      ) : (
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`w-full py-3.5 mt-3 rounded-2xl bg-gradient-to-r from-Primary/90 to-Primary text-white font-bold text-sm shadow-lg shadow-Primary/20 transition-shadow hover:shadow-xl`}
        >
          {label}
        </motion.button>
      )}
    </div>
  )
}
