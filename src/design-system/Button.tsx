import React, { useRef } from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline';
};

export default function Button({ variant = 'primary', className = '', onClick, ...rest }: Props) {
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const base = 'relative overflow-hidden px-4 py-2 rounded-full font-medium transition-transform transition-colors focus:outline-none';

  const variants: Record<string, string> = {
    primary:
      'bg-primary text-white hover:bg-primary-600 active:bg-primary-700 focus:ring-4 focus:ring-primary-200',
    secondary:
      'bg-white/90 text-slate-950 border border-slate-200 hover:bg-slate-100 active:bg-slate-200 focus:ring-4 focus:ring-slate-200 dark:bg-white/10 dark:text-white dark:border-white/20 dark:hover:bg-white/15 dark:active:bg-white/20 dark:focus:ring-white/25',
    outline: 'bg-white border border-slate-300 text-black hover:bg-slate-50'
  };

  const rippleColor = variant === 'primary' ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.12)';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = btnRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      const span = document.createElement('span');
      span.className = 'ripple';
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${x}px`;
      span.style.top = `${y}px`;
      span.style.background = rippleColor;
      el.appendChild(span);
      setTimeout(() => span.remove(), 650);
    }

    if (onClick) onClick(e);
  };

  const classes = `${base} ${variants[variant]} ${className} transform hover:-translate-y-1 active:translate-y-0`;
  return (
    <button ref={btnRef} className={classes} onClick={handleClick} {...rest} />
  );
}
