import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Zap, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { useAuthStore } from '../../store/authStore'

const registerSchema = z.object({
  firstName: z.string().min(2, 'Mindestens 2 Zeichen'),
  lastName: z.string().min(2, 'Mindestens 2 Zeichen'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Mindestens 8 Zeichen'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwörter stimmen nicht überein',
  path: ['confirmPassword'],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((s) => s.register)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const getErrorMessage = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      return (
        error.response?.data?.message || error.response?.data?.error || error.message ||
        'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
      )
    }

    if (error instanceof Error) {
      return error.message
    }

    return 'Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.'
  }

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('')
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone?.trim() || undefined,
      })
      navigate('/konto')
    } catch (error) {
      setError(getErrorMessage(error))
    }
  }

  return (
    <>
      <SEOHead title="Registrieren" />
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Konto erstellen</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Registrieren Sie sich kostenlos</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-danger dark:bg-red-900/20">{error}</div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Vorname" error={errors.firstName?.message} {...register('firstName')} />
                <Input label="Nachname" error={errors.lastName?.message} {...register('lastName')} />
              </div>
              <Input label="E-Mail" type="email" error={errors.email?.message} {...register('email')} />
              <Input label="Telefon (optional)" type="tel" {...register('phone')} />
              <Input label="Passwort" type="password" error={errors.password?.message} {...register('password')} />
              <Input label="Passwort bestätigen" type="password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
              <Button type="submit" fullWidth isLoading={isSubmitting}>
                <UserPlus className="h-4 w-4" /> Registrieren
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              Bereits registriert?{' '}
              <Link to="/anmelden" className="font-medium text-primary hover:underline">Anmelden</Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
