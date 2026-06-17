import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SEOHead } from '../../components/ui/SEOHead'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardHeader, CardTitle } from '../../components/ui/Card'
import { useAuthStore } from '../../store/authStore'

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user)

  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
  })

  const onSubmit = async () => {
    // API call would go here
  }

  return (
    <>
      <SEOHead title="Profil" />
      <Card>
        <CardHeader>
          <CardTitle>Persönliche Daten</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Vorname" {...register('firstName')} />
            <Input label="Nachname" {...register('lastName')} />
          </div>
          <Input label="E-Mail" type="email" {...register('email')} />
          <Input label="Telefon" type="tel" {...register('phone')} />
          <Button type="submit" isLoading={isSubmitting} disabled={!isDirty}>
            Änderungen speichern
          </Button>
        </form>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Passwort ändern</CardTitle>
        </CardHeader>
        <form className="space-y-4">
          <Input label="Aktuelles Passwort" type="password" />
          <Input label="Neues Passwort" type="password" />
          <Input label="Passwort bestätigen" type="password" />
          <Button variant="outline">Passwort aktualisieren</Button>
        </form>
      </Card>
    </>
  )
}
