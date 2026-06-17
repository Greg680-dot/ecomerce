import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Zap, Mail } from 'lucide-react'
import { motion } from 'framer-motion'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { useAuthStore } from '../../store/authStore'

const loginSchema = z.object({
  email: z.string().email('Ungültige E-Mail-Adresse'),
  password: z.string().min(6, 'Mindestens 6 Zeichen'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('')
      await login(data.email, data.password)
      const from = (location.state as { from?: string })?.from || '/konto'
      navigate(from)
    } catch {
      setError('Anmeldung fehlgeschlagen. Bitte überprüfen Sie Ihre Zugangsdaten.')
    }
  }

  return (
    <>
      <SEOHead title="Anmelden" />
      <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Willkommen zurück</h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Melden Sie sich bei Ihrem Konto an</p>
          </div>

          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-danger dark:bg-red-900/20">{error}</div>
              )}
              <Input
                label="E-Mail"
                type="email"
                placeholder="name@beispiel.de"
                error={errors.email?.message}
                {...register('email')}
              />
              <Input
                label="Passwort"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password')}
              />
              <div className="flex justify-end">
                <Link to="/passwort-vergessen" className="text-xs text-primary hover:underline">
                  Passwort vergessen?
                </Link>
              </div>
              <Button type="submit" fullWidth isLoading={isSubmitting}>
                <Mail className="h-4 w-4" /> Anmelden
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
              Noch kein Konto?{' '}
              <Link to="/registrieren" className="font-medium text-primary hover:underline">
                Jetzt registrieren
              </Link>
            </p>
          </Card>
        </motion.div>
      </div>
    </>
  )
}
