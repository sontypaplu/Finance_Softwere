'use client';

import { useState } from 'react';
import { Eye, EyeOff, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'verify'>('details');
  const [error, setError] = useState('');
  const [formSnapshot, setFormSnapshot] = useState({ email: '', name: '' });

  async function handleDetailsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const confirmPassword = String(formData.get('confirmPassword') || '');

    if (password !== confirmPassword) {
      setLoading(false);
      setError('Passwords do not match.');
      return;
    }

    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      password,
      country: String(formData.get('country') || '')
    };

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message || 'Unable to create account.');
      return;
    }

    setFormSnapshot({ email: payload.email, name: payload.name });
    setStep('verify');
  }

  function handleVerify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push('/login');
  }

  if (step === 'verify') {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,rgba(240,253,250,0.94),rgba(255,255,255,0.9))] p-6">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            <ShieldCheck size={26} />
          </div>
          <h3 className="text-2xl font-semibold tracking-[-0.03em] text-slate-950">Verify your details</h3>
          <p className="mt-3 text-base leading-7 text-slate-600">
            We have staged the account for <span className="font-semibold text-slate-900">{formSnapshot.name}</span>. Enter the review code shown in the email verification step to continue.
          </p>
          <div className="mt-5 rounded-2xl border border-white/70 bg-white/80 p-4 text-sm text-slate-600">
            Review route created. Real email delivery and persistent auth logging will connect to your backend later.
          </div>
        </div>
        <form className="space-y-5" onSubmit={handleVerify}>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-slate-700">Verification code</span>
            <input
              required
              placeholder="Enter 6-digit code"
              className="h-14 rounded-2xl border border-slate-200 bg-white/80 px-4 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
            />
          </label>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Verification target: {formSnapshot.email}
          </div>
          <button className="h-14 w-full rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_35%,#0f766e_100%)] text-base font-semibold text-white shadow-[0_24px_50px_rgba(15,118,110,0.25)]">
            Continue to sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={handleDetailsSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Full name</span>
          <input required name="name" placeholder="Your full name" className="h-14 rounded-2xl border border-slate-200 bg-white/80 px-4 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70" />
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Email address</span>
          <input required name="email" type="email" placeholder="name@company.com" className="h-14 rounded-2xl border border-slate-200 bg-white/80 px-4 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70" />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="relative">
            <input required name="password" type={showPassword ? 'text' : 'password'} className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 pr-14 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Confirm password</span>
          <div className="relative">
            <input required name="confirmPassword" type={showConfirm ? 'text' : 'password'} className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 pr-14 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70" />
            <button type="button" onClick={() => setShowConfirm((value) => !value)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
        <label className="grid gap-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Country / region</span>
          <select name="country" className="h-14 rounded-2xl border border-slate-200 bg-white/80 px-4 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70">
            <option>India</option>
            <option>United States</option>
            <option>United Kingdom</option>
            <option>Singapore</option>
          </select>
        </label>
      </div>
      <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600">
        <input required type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-300" />
        I confirm the account details are accurate and I agree to the platform terms.
      </label>
      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}
      <button disabled={loading} className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#111827_0%,#334155_35%,#0f766e_100%)] text-base font-semibold text-white shadow-[0_24px_50px_rgba(15,118,110,0.24)] disabled:opacity-70">
        {loading ? <LoaderCircle size={18} className="animate-spin" /> : null}
        Create account
      </button>
    </form>
  );
}
