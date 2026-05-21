import { Link } from 'react-router-dom';
import Button from '../design-system/Button';
import { useCart } from '../context/CartContext';

export default function Hero() {
  const { addToCart } = useCart();
  return (
    <section className="relative overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white sm:pb-16 transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(13,59,145,0.1),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(229,57,53,0.1),_transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(13,59,145,0.2),_transparent_25%),radial-gradient(circle_at_bottom_right,_rgba(229,57,53,0.15),_transparent_30%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="max-w-2xl space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Destacado • Entrega express</span>
          </span>
          <h1 className="text-5xl font-black leading-tight tracking-tighter sm:text-6xl lg:text-7xl">
            La compra de alimentos frescos <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">nunca había sido tan impactante.</span>
          </h1>
          <p className="max-w-xl text-lg text-slate-600 dark:text-slate-300 sm:text-xl">
            Descubre un mercado moderno con recetas, tracking de pedidos y entregas ultra rápidas para que tu cocina siempre esté lista.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <Button variant="primary" className="px-8 py-4 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">Ver ofertas</Button>
            <Link
              to="/categorias"
              className="inline-flex items-center justify-center rounded-2xl font-semibold transition-all px-8 py-4 text-base bg-white/50 text-slate-900 border border-slate-200 hover:bg-white/80 active:bg-slate-100 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 dark:active:bg-white/5 backdrop-blur-md"
            >
              Explorar categorías
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-5 text-sm shadow-soft backdrop-blur-xl transition-transform hover:-translate-y-1 hover:shadow-lg">
              <p className="font-semibold text-slate-900 dark:text-white">🚚 Envío al instante</p>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Lo mejor del mercado directo a tu casa.</p>
            </div>
            <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-5 text-sm shadow-soft backdrop-blur-xl transition-transform hover:-translate-y-1 hover:shadow-lg">
              <p className="font-semibold text-slate-900 dark:text-white">🌿 Local y sostenible</p>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Productos responsables y de gran calidad.</p>
            </div>
            <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-5 text-sm shadow-soft backdrop-blur-xl transition-transform hover:-translate-y-1 hover:shadow-lg">
              <p className="font-semibold text-slate-900 dark:text-white">🔒 Pago seguro</p>
              <p className="mt-2 text-slate-600 dark:text-slate-400">Tu información protegida siempre.</p>
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-white/5 p-6 shadow-xl backdrop-blur-2xl sm:p-8 transition-colors duration-300">
          <div className="absolute -right-12 top-8 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative space-y-6">
            <div className="rounded-[1.75rem] bg-white/80 dark:bg-white/10 p-6 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10 backdrop-blur-xl transition-colors duration-300">
              <p className="text-sm uppercase tracking-[0.24em] text-primary dark:text-primary-100 font-medium">Selección de la semana</p>
              <h2 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Canasta saludable</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Frutas, verduras y esenciales frescos para tu mesa.</p>
              <div className="mt-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Desde</p>
                  <p className="text-2xl font-extrabold text-slate-900 dark:text-white">$24.99</p>
                </div>
                <Button 
                  onClick={() => addToCart({ id: 'canasta-1', name: 'Canasta saludable', price: 24.99, emoji: '🧺' })}
                  variant="primary" 
                  className="px-5 py-3 text-sm shadow-md"
                >
                  Añadir 🧺
                </Button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-4 shadow-lg backdrop-blur-md transition-colors duration-300">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Más vendido</p>
                <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Aguacates orgánicos</p>
              </div>
              <div className="rounded-3xl bg-white/60 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 p-4 shadow-lg backdrop-blur-md transition-colors duration-300">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Top receta</p>
                <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">Pollo al limón</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
