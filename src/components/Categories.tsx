import { Link } from 'react-router-dom';
import Button from '../design-system/Button';

const categories = [
  { title: 'Frutas & Verduras', subtitle: 'Frescos de temporada', emoji: '🍎' },
  { title: 'Lácteos & Huevos', subtitle: 'Calidad garantizada', emoji: '🥛' },
  { title: 'Despensa', subtitle: 'Todo lo esencial', emoji: '🛖' },
  { title: 'Carnes & Pescados', subtitle: 'Selección premium', emoji: '🍗' },
  { title: 'Panadería', subtitle: 'Recién horneado', emoji: '🥐' },
  { title: 'Salud & Belleza', subtitle: 'Cuidado personal', emoji: '💅' }
];

export default function Categories() {
  return (
    <section id="categorias" className="relative py-20 lg:py-24 bg-white dark:bg-slate-900 text-slate-900 dark:text-white overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(13,59,145,0.05),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(229,57,53,0.05),_transparent_35%)] dark:bg-[radial-gradient(circle_at_top_right,_rgba(13,59,145,0.15),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(229,57,53,0.1),_transparent_35%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">Explora por categoría</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mt-3">Encuentra exactamente lo que necesitas en nuestras categorías cuidadosamente organizadas.</p>
          </div>
          <Link to="/categorias" className="inline-flex items-center justify-center rounded-2xl font-semibold transition-all px-6 py-3 bg-white/50 text-slate-900 border border-slate-200 hover:bg-white/80 active:bg-slate-100 dark:bg-white/5 dark:text-white dark:border-white/10 dark:hover:bg-white/10 dark:active:bg-white/5 backdrop-blur-md shadow-sm">
            Ver todas
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <article key={c.title} className="group rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 p-7 flex flex-col justify-between cursor-pointer shadow-soft backdrop-blur-xl hover:shadow-lg dark:hover:bg-white/10 transition-all hover:-translate-y-2 duration-300">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  {c.emoji}
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary-100 transition-colors">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.subtitle}</p>
              </div>
              <div className="mt-7">
                <Button variant="secondary" className="w-full justify-center !bg-white/50 dark:!bg-white/5 !text-slate-900 dark:!text-white !border-slate-200 dark:!border-white/10 hover:!bg-white/80 dark:hover:!bg-white/20 backdrop-blur-md transition-colors">Ver categoría</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
