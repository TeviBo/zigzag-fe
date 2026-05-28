import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../design-system/Button';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
  subcategory_id: number | null;
}

interface Subcategory {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

interface CategoryDetail {
  id: number;
  name: string;
  slug: string;
  emoji: string | null;
  subtitle: string | null;
  subcategories: Subcategory[];
}

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [category, setCategory] = useState<CategoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubcategory, setActiveSubcategory] = useState<number | null>(null);

  const categorySlug = id || 'frutas-verduras';

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8001/categories/${categorySlug}`)
      .then(res => {
        if (!res.ok) throw new Error('Category not found');
        return res.json();
      })
      .then((data: CategoryDetail) => {
        setCategory(data);
        setActiveSubcategory(null);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch category:', err);
        setLoading(false);
      });
  }, [categorySlug]);

  // Get filtered products based on active subcategory
  const allProducts = category?.subcategories.flatMap(s => s.products) || [];
  const displayProducts = activeSubcategory
    ? category?.subcategories.find(s => s.id === activeSubcategory)?.products || []
    : allProducts;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4">
        <span className="text-6xl mb-6">🔍</span>
        <h1 className="text-3xl font-black mb-4">Categoría no encontrada</h1>
        <Link to="/categorias" className="text-secondary hover:underline font-medium">← Volver a categorías</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,59,145,0.05),_transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(229,57,53,0.05),_transparent_40%)] dark:bg-[radial-gradient(circle_at_top,_rgba(13,59,145,0.15),_transparent_50%),radial-gradient(circle_at_bottom_left,_rgba(229,57,53,0.1),_transparent_40%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/categorias" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors mb-8 font-medium">
            ← Volver a categorías
          </Link>
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-3xl bg-white/80 dark:bg-white/10 border border-slate-200 dark:border-white/10 flex items-center justify-center text-5xl shadow-lg backdrop-blur-md transition-colors duration-300">
              {category.emoji}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {category.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
                {category.subtitle} • {allProducts.length} producto{allProducts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategory Filter Tabs */}
      {category.subcategories.length > 1 && (
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveSubcategory(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeSubcategory === null
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10'
              }`}
            >
              Todos ({allProducts.length})
            </button>
            {category.subcategories.map(sub => (
              <button
                key={sub.id}
                onClick={() => setActiveSubcategory(sub.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeSubcategory === sub.id
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                    : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/10'
                }`}
              >
                {sub.name} ({sub.products.length})
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        {displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">📦</span>
            <p className="text-xl font-bold text-slate-500 dark:text-slate-400">
              Aún no hay productos en esta subcategoría.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayProducts.map((product) => (
              <article key={product.id} className="group rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 flex flex-col justify-between shadow-soft backdrop-blur-xl hover:shadow-lg dark:hover:bg-white/10 transition-all hover:-translate-y-2 duration-300">
                <div>
                  <div className="w-full aspect-square rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-7xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-105">
                    {product.image_url}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary-100 transition-colors">{product.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{product.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6">
                  {items.find(i => i.id === product.id) ? (
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-white/10 rounded-full p-1 shadow-inner transition-colors">
                      <button 
                        onClick={() => updateQuantity(product.id, items.find(i => i.id === product.id)!.quantity - 1)} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/20 transition-colors font-bold text-lg"
                        aria-label="Disminuir cantidad"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={items.find(i => i.id === product.id)!.quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val) && val >= 0) {
                            if (val === 0) removeFromCart(product.id);
                            else updateQuantity(product.id, val);
                          }
                        }}
                        className="w-16 text-center bg-transparent border-none focus:outline-none font-bold text-slate-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        min="0"
                        aria-label="Cantidad"
                      />
                      <button 
                        onClick={() => updateQuantity(product.id, items.find(i => i.id === product.id)!.quantity + 1)} 
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-600 transition-colors font-bold text-lg"
                        aria-label="Aumentar cantidad"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, emoji: product.image_url })}
                      variant="primary" 
                      className="w-full justify-center shadow-md shadow-primary/10 hover:shadow-primary/30"
                    >
                      Añadir 🛒
                    </Button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
