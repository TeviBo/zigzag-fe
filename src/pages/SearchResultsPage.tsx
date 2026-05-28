import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '../design-system/Button';
import { useCart } from '../context/CartContext';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description: string;
  category: string;
}

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { items, addToCart, updateQuantity, removeFromCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8001/products/search?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search failed:', err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 transition-colors duration-300">
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,59,145,0.05),_transparent_50%)] dark:bg-[radial-gradient(circle_at_top,_rgba(13,59,145,0.15),_transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/categorias" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors mb-8 font-medium">
            ← Volver a categorías
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
            Resultados para <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">"{query}"</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
            {loading ? 'Buscando...' : `${products.length} resultado${products.length !== 1 ? 's' : ''} encontrado${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">🔍</span>
            <h2 className="text-2xl font-bold mb-3">No encontramos resultados</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Intentá con otro término de búsqueda o explorá nuestras categorías.</p>
            <Link to="/categorias">
              <Button variant="primary" className="shadow-lg shadow-primary/20">Explorar categorías</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <article key={product.id} className="group rounded-[2rem] border border-slate-200/50 dark:border-white/10 bg-white/60 dark:bg-white/5 p-6 flex flex-col justify-between shadow-soft backdrop-blur-xl hover:shadow-lg dark:hover:bg-white/10 transition-all hover:-translate-y-2 duration-300">
                <div>
                  <div className="w-full aspect-square rounded-2xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-7xl shadow-sm mb-6 transition-transform duration-300 group-hover:scale-105">
                    {product.image_url}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-primary dark:group-hover:text-primary-100 transition-colors">{product.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{product.description}</p>
                  <div className="mt-4">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="mt-6">
                  {items.find(i => i.id === product.id) ? (
                    <div className="flex items-center justify-between bg-slate-100 dark:bg-white/10 rounded-full p-1 shadow-inner transition-colors">
                      <button
                        onClick={() => updateQuantity(product.id, items.find(i => i.id === product.id)!.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm hover:bg-slate-50 dark:hover:bg-white/20 transition-colors font-bold text-lg"
                      >-</button>
                      <span className="font-bold text-slate-900 dark:text-white">{items.find(i => i.id === product.id)!.quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, items.find(i => i.id === product.id)!.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-sm hover:bg-primary-600 transition-colors font-bold text-lg"
                      >+</button>
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
