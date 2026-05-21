import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../design-system/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const menuItems = [
  { label: 'Categorías', href: '/categorias' },
  { label: 'Pedidos', href: '/pedidos' },
  { label: 'Tracking', href: '#seguimiento' },
  { label: 'Ayuda', href: '#ayuda' }
];

export default function Header() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const { cartCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDark(stored === 'dark');
      document.documentElement.classList.toggle('dark', stored === 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(prefersDark);
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">ZZ</div>
          <div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ZigZag</h1>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tienda de alimentos</p>
          </div>
        </Link>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 text-slate-900 dark:text-white shadow-sm transition hover:bg-slate-100 dark:hover:bg-white/10 backdrop-blur-md"
            aria-label="Abrir menú"
          >
            ☰
          </button>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300 lg:flex">
          {menuItems.map((item) => (
            <Link key={item.label} to={item.href} className="transition hover:text-primary dark:hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <input className="search-input w-64 !bg-white/50 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:!border-primary/50 backdrop-blur-md shadow-inner transition-colors" placeholder="Buscar productos, recetas..." />
          <button onClick={() => setIsCartOpen(true)} className="relative flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 px-4 py-2 text-sm font-medium shadow-sm transition hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white backdrop-blur-md">
            <span>🛒</span>
            <span>Carrito</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white shadow-md">
                {cartCount}
              </span>
            )}
          </button>
          <button onClick={toggleTheme} className="rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 p-2 text-sm shadow-sm transition hover:bg-slate-100 dark:hover:bg-white/10 text-slate-900 dark:text-white backdrop-blur-md">
            {isDark ? '🌙' : '🌞'}
          </button>
          {user ? (
            <Link to="/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-white/50 dark:border-white/20 flex items-center justify-center text-white font-bold hover:scale-105 transition shadow-lg">
              {user.name.charAt(0).toUpperCase()}
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="primary" className="shadow-lg shadow-primary/20 hover:shadow-primary/30">Ingresar</Button>
            </Link>
          )}
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-950/95 px-4 py-4 shadow-lg backdrop-blur-xl transition-colors duration-300">
          <div className="space-y-4">
            {menuItems.map((item) => (
              <Link key={item.label} to={item.href} onClick={() => setMobileMenuOpen(false)} className="block rounded-2xl px-4 py-3 text-base font-semibold text-slate-700 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-white/10 hover:text-primary dark:hover:text-white">
                {item.label}
              </Link>
            ))}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-white/5">
              <input className="search-input w-full !bg-slate-100 dark:!bg-white/5 !border-slate-200 dark:!border-white/10 !text-slate-900 dark:!text-white placeholder:text-slate-400 focus:!border-primary/50" placeholder="Buscar productos, recetas..." />
              <div className="flex gap-3">
                <button onClick={() => { setIsCartOpen(true); setMobileMenuOpen(false); }} className="relative flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 flex flex-col items-center justify-center transition-colors">
                  <div className="flex gap-2">
                    <span>🛒</span>
                    <span>Carrito</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white shadow-md">
                      {cartCount}
                    </span>
                  )}
                </button>
                <button onClick={toggleTheme} className="flex-1 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  {isDark ? 'Modo claro' : 'Modo oscuro'}
                </button>
              </div>
              <div className="pt-2">
                {user ? (
                  <Link to="/profile" className="w-full rounded-2xl bg-gradient-to-r from-primary to-secondary px-4 py-3 text-sm text-white hover:opacity-90 flex justify-center items-center font-bold shadow-lg" onClick={() => setMobileMenuOpen(false)}>
                    {user.name}
                  </Link>
                ) : (
                  <Link to="/login" className="block w-full" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="primary" className="w-full shadow-lg shadow-primary/20">Ingresar</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
