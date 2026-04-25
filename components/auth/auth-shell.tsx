import Link from 'next/link';
import { LogoBadge } from '@/components/ui/logo-badge';

export function AuthShell({
  title,
  subtitle,
  children,
  footerLink,
  footerText
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footerText: string;
  footerLink: { href: string; label: string };
}) {
  return (
    <div className="min-h-screen px-5 py-6 md:px-8 lg:px-10">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1600px] gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden rounded-[34px] border border-white/40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),rgba(240,245,255,0.75)_38%,rgba(220,232,255,0.54)_100%)] p-8 shadow-[0_30px_90px_rgba(15,23,40,0.12)] lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(79,70,229,0.16),transparent_28%),radial-gradient(circle_at_78%_10%,rgba(15,118,110,0.18),transparent_26%),radial-gradient(circle_at_80%_80%,rgba(37,99,235,0.12),transparent_24%)]" />
          <div className="relative z-10 flex items-center justify-between">
            <LogoBadge />
            <button className="rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 backdrop-blur-md transition hover:bg-white">
              About
            </button>
          </div>
          <div className="relative z-10 max-w-[680px] px-2">
            <div className="mb-5 inline-flex rounded-full border border-white/60 bg-white/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-slate-600 backdrop-blur-md">
              Private wealth intelligence
            </div>
            <h1 className="text-6xl font-semibold leading-[1.05] tracking-[-0.04em] text-slate-950">
              Premium financial control with an interface built to feel effortless.
            </h1>
            <p className="mt-6 max-w-[560px] text-lg leading-8 text-slate-600">
              Sign in to a luxury-grade portfolio workspace with clean execution, live market context, and decision-first design.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                ['Multi-portfolio', 'Family, account, and strategy layers'],
                ['Risk-aware', 'Executive metrics and volatility surfaces'],
                ['Secure access', 'Precision login flows and device trust']
              ].map(([label, detail]) => (
                <div key={label} className="rounded-[24px] border border-white/55 bg-white/66 p-5 backdrop-blur-2xl">
                  <div className="text-sm font-semibold text-slate-900">{label}</div>
                  <div className="mt-2 text-sm leading-6 text-slate-600">{detail}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative z-10 flex items-center justify-between text-sm text-slate-500">
            <div className="flex gap-6">
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Status</Link>
            </div>
            <div>© 2026 Aurelius Systems</div>
          </div>
        </section>

        <section className="flex items-center justify-center">
          <div className="w-full max-w-[620px] rounded-[34px] border border-white/50 bg-white/78 p-6 shadow-[0_30px_90px_rgba(15,23,40,0.12)] backdrop-blur-2xl md:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <LogoBadge small />
              <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">About</button>
            </div>
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] text-slate-950">{title}</h2>
              <p className="mt-3 text-base leading-7 text-slate-600">{subtitle}</p>
            </div>
            <div className="mt-8">{children}</div>
            <div className="mt-8 text-sm text-slate-600">
              {footerText}{' '}
              <Link className="font-semibold text-slate-950" href={footerLink.href}>
                {footerLink.label}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-500">
              <Link href="#">Help center</Link>
              <Link href="#">Security</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
