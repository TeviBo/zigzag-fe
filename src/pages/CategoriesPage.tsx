import { Link } from 'react-router-dom';

const allCategories = [
  { id: 'frutas-verduras', title: 'Frutas & Verduras', subtitle: 'Frescos de temporada', emoji: '🍎' },
  { id: 'lacteos-huevos', title: 'Lácteos & Huevos', subtitle: 'Calidad garantizada', emoji: '🥛' },
  { id: 'despensa', title: 'Despensa', subtitle: 'Todo lo esencial', emoji: '🛖' },
  { id: 'carnes-pescados', title: 'Carnes & Pescados', subtitle: 'Selección premium', emoji: '🍗' },
  { id: 'panaderia', title: 'Panadería', subtitle: 'Recién horneado', emoji: '🥐' },
  { id: 'salud-belleza', title: 'Salud & Belleza', subtitle: 'Cuidado personal', emoji: '💅' },
  { id: 'bebidas', title: 'Bebidas', subtitle: 'Refrescos y jugos', emoji: '🥤' },
  { id: 'congelados', title: 'Congelados', subtitle: 'Listos para preparar', emoji: '🧊' },
  { id: 'snacks', title: 'Snacks', subtitle: 'Para picar', emoji: '🥨' },
  { id: 'bebe', title: 'Bebé', subtitle: 'Cuidado infantil', emoji: '🍼' },
  { id: 'mascotas', title: 'Mascotas', subtitle: 'Alimentos y accesorios', emoji: '🐶' },
  { id: 'limpieza', title: 'Limpieza', subtitle: 'Hogar reluciente', emoji: '🧼' },
];

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,59,145,0.05),_transparent_50%),radial-gradient(circle_at_bottom_right,_rgba(229,57,53,0.05),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top,_rgba(13,59,145,0.15),_transparent_50%),radial-gradient(circle_at_bottom_right,_rgba(229,57,53,0.1),_transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] backdrop-blur-md">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Catálogo completo</span>
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
            Todas las <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">categorías</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Explora nuestra gran variedad de productos frescos, seleccionados con el más alto estándar de calidad para ti y tu familia.
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {allCategories.map((c) => (
            <Link to={`/categorias/${c.id}`} key={c.id} className="group rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 p-7 flex flex-col justify-between cursor-pointer shadow-soft backdrop-blur-xl hover:shadow-lg dark:hover:bg-white/10 transition-all hover:-translate-y-2 duration-300">
              <div>
                <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  {c.emoji}
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary-100 transition-colors">{c.title}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.subtitle}</p>
              </div>
              <div className="mt-7">
                <div className="flex w-full items-center justify-center rounded-full font-semibold transition-all px-6 py-3 bg-white/50 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 group-hover:bg-white/80 dark:group-hover:bg-white/20 backdrop-blur-md">
                  Ver productos
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
