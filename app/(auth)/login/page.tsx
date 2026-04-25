import { AuthShell } from '@/components/auth/auth-shell';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your finance terminal with a premium login experience designed for a modern wealth platform."
      footerText="New to Aurelius?"
      footerLink={{ href: '/signup', label: 'Create an account' }}
    >
      <LoginForm />
    </AuthShell>
  );
}
