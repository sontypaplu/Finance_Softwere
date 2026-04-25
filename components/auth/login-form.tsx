'use client';

import { useState } from 'react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || '')
    };

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.message || 'Unable to sign in.');
      return;
    }

    router.push('/terminal');
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5">
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Email address</span>
          <input
            required
            name="email"
            type="email"
            placeholder="you@example.com"
            defaultValue="demo@aurelius.finance"
            className="h-14 rounded-2xl border border-slate-200 bg-white/80 px-4 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <div className="relative">
            <input
              required
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              defaultValue="Demo@1234"
              className="h-14 w-full rounded-2xl border border-slate-200 bg-white/80 px-4 pr-14 text-slate-900 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-200/70"
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
      </div>
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-3 text-slate-600">
          <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          Keep this device trusted
        </label>
        <a className="font-medium text-slate-900" href="#">Forgot password?</a>
      </div>
      {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</div> : null}
      <button
        type="submit"
        disabled={loading}
        className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_35%,#4f46e5_100%)] px-5 text-base font-semibold text-white shadow-[0_24px_50px_rgba(79,70,229,0.28)] transition hover:translate-y-[-1px] disabled:opacity-70"
      >
        {loading ? <LoaderCircle size={18} className="animate-spin" /> : null}
        Sign in
      </button>
    </form>
  );
}
