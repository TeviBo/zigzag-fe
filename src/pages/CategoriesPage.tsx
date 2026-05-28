import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  emoji: string | null;
  subtitle: string | null;
  subcategories: Subcategory[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8001/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setIsLoading(false);
      });
  }, []);

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
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((c) => (
              <Link to={`/categorias/${c.slug}`} key={c.id} className="group rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 p-7 flex flex-col justify-between cursor-pointer shadow-soft backdrop-blur-xl hover:shadow-lg dark:hover:bg-white/10 transition-all hover:-translate-y-2 duration-300">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-3xl shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                    {c.emoji}
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary-100 transition-colors">{c.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.subtitle}</p>
                  {c.subcategories.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {c.subcategories.slice(0, 3).map(sub => (
                        <span key={sub.id} className="text-xs bg-slate-100 dark:bg-white/10 border border-slate-200/50 dark:border-white/5 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
                          {sub.name}
                        </span>
                      ))}
                      {c.subcategories.length > 3 && (
                        <span className="text-xs bg-slate-100 dark:bg-white/10 border border-slate-200/50 dark:border-white/5 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
                          +{c.subcategories.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-7">
                  <div className="flex w-full items-center justify-center rounded-full font-semibold transition-all px-6 py-3 bg-white/50 dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 group-hover:bg-white/80 dark:group-hover:bg-white/20 backdrop-blur-md">
                    Ver productos
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
