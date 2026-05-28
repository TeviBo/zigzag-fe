import { useCart } from '../context/CartContext';
import Button from '../design-system/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, cartTotal, clearCart, coupon, setCoupon, discountAmount, finalTotal } = useCart();
  const navigate = useNavigate();
  const [couponError, setCouponError] = useState<string | null>(null);

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
          <div className="p-6 border-t border-white/10 bg-primary-950/80 backdrop-blur-xl space-y-4">
            
            {!coupon ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setCouponError(null);
                  const form = e.target as HTMLFormElement;
                  const input = form.elements.namedItem('code') as HTMLInputElement;
                  const code = input.value.trim();
                  if (code) {
                    fetch('http://localhost:8002/coupons/validate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ code })
                    })
                    .then(res => {
                      if (!res.ok) throw new Error('Cupón inválido');
                      return res.json();
                    })
                    .then(data => {
                      setCoupon(data);
                      input.value = '';
                    })
                    .catch(err => {
                      setCouponError('Cupón inválido o expirado.');
                    });
                  }
                }}
                className="flex flex-col gap-2"
              >
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    name="code"
                    placeholder="Código de descuento" 
                    className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary transition-colors uppercase"
                  />
                  <Button type="submit" variant="primary" className="!py-2 !px-4">Aplicar</Button>
                </div>
                {couponError && (
                  <p className="text-red-400 text-sm pl-2 animate-pulse">{couponError}</p>
                )}
              </form>
            ) : (
              <div className="flex items-center justify-between bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-2">
                <div className="flex items-center gap-2 text-secondary">
                  <span>🎟️</span>
                  <span className="font-bold">{coupon.code}</span>
                </div>
                <button 
                  onClick={() => setCoupon(null)} 
                  className="text-white/50 hover:text-white transition-colors text-sm"
                >
                  Quitar
                </button>
              </div>
            )}

            <div className="space-y-2 border-b border-white/10 pb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              {coupon && (
                <div className="flex justify-between text-sm text-secondary">
                  <span>Descuento</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between text-lg">
              <span className="text-white/70">Total</span>
              <span className="font-bold text-xl">${finalTotal.toFixed(2)}</span>
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
