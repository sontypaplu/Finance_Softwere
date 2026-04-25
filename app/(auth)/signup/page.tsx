import { AuthShell } from '@/components/auth/auth-shell';
import { SignupForm } from '@/components/auth/signup-form';

export default function SignupPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="Start with a premium onboarding flow that captures details, stages verification, and returns users back to sign in."
      footerText="Already have an account?"
      footerLink={{ href: '/login', label: 'Go to sign in' }}
    >
      <SignupForm />
    </AuthShell>
  );
}
