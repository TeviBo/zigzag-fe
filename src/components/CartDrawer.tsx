import { useCart } from '../context/CartContext';
import Button from '../design-system/Button';
import { useNavigate } from 'react-router-dom';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-primary-950 border-l border-white/10 shadow-2xl flex flex-col text-white">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-baseline gap-4">
            <h2 className="text-xl font-bold">Tu Carrito</h2>
            {items.length > 0 && (
              <button onClick={clearCart} className="text-sm text-secondary hover:text-white transition">
                Vaciar
              </button>
            )}
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/50 space-y-4">
              <span className="text-6xl">🛒</span>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 items-center">
                <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center text-3xl shadow-inner">
                  {item.emoji || '📦'}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white/90">{item.name}</h3>
                  <p className="text-white/60 font-medium">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">-</button>
                  <span className="w-4 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-primary-950/80 backdrop-blur-xl">
            <div className="flex justify-between mb-4 text-lg">
              <span className="text-white/70">Subtotal</span>
              <span className="font-bold text-xl">${cartTotal.toFixed(2)}</span>
            </div>
            <Button onClick={handleCheckout} variant="secondary" className="w-full py-4 text-lg font-bold !bg-secondary !text-white !border-secondary hover:!bg-secondary/90 transition-all shadow-lg shadow-secondary/20">
              Proceder al pago
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
