import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Button from '../design-system/Button';

initMercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY || 'TEST-829d5bda-4c07-4282-b7b2-a40ba23b128c', { locale: 'es-AR' });

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, cartTotal, finalTotal, coupon, discountAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMpSuccess, setIsMpSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mp_credit');
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const MIN_ORDER_AMOUNT = parseInt(import.meta.env.VITE_MIN_ORDER_AMOUNT || '5000', 10);

  // Calculate final total including payment method discount
  const isDiscountedPayment = paymentMethod === 'mp_debit' || paymentMethod === 'cash';
  const paymentMethodDiscount = isDiscountedPayment ? finalTotal * 0.15 : 0;
  const checkoutTotal = finalTotal - paymentMethodDiscount;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (checkoutTotal < MIN_ORDER_AMOUNT) {
      alert(`El monto mínimo de compra es de $${MIN_ORDER_AMOUNT}. Te faltan $${MIN_ORDER_AMOUNT - checkoutTotal}.`);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        customer_email: user?.email,
        items: items.map(item => ({ product_id: item.id, quantity: item.quantity })),
        coupon_code: coupon ? coupon.code : null,
        payment_method: paymentMethod
      };

      if (paymentMethod === 'mp_credit' || paymentMethod === 'mp_debit') {
        const response = await axios.post('http://localhost:8003/checkout/create_preference', payload);
        const { id } = response.data;
        setPreferenceId(id);
      } else {
        await axios.post('http://localhost:8003/checkout/create_order', payload);
        clearCart();
        setIsSuccess(true);
      }
    } catch (error) {
      console.error("Error processing checkout:", error);
      alert("Hubo un error al procesar el pedido. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <div className="w-24 h-24 rounded-full bg-primary/10 border border-primary flex items-center justify-center text-5xl mb-8 animate-bounce">
          🎉
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-center tracking-tighter mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">¡Pedido Confirmado!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 text-center max-w-lg mb-8">
          Tu pedido ha sido procesado exitosamente mediante Cuenta Corriente y ya lo estamos preparando. Te enviaremos un correo con los detalles del envío.
        </p>
        <Button onClick={() => navigate('/pedidos')} className="!bg-primary !text-white px-8 py-4 text-lg font-bold shadow-lg shadow-primary/30">
          Ver mis pedidos
        </Button>
      </div>
    );
  }

  if (items.length === 0 && !isMpSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <h1 className="text-3xl font-black mb-4">Tu carrito está vacío</h1>
        <Button onClick={() => navigate('/categorias')} className="!bg-primary !text-white px-6 py-3 shadow-md shadow-primary/20">
          Explorar productos
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 pt-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/categorias" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors mb-8 font-medium">
          ← Seguir comprando
        </Link>
        <h1 className="text-4xl font-black tracking-tighter mb-10 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7 space-y-8">
            <form id="checkout-form" onSubmit={handleConfirm} className="space-y-6">
              <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Información de envío</h2>
                  <Link to="/profile" className="text-sm text-secondary hover:underline font-medium">Editar en mi perfil</Link>
                </div>
                <div className="bg-white/80 dark:bg-white/5 p-4 rounded-xl border border-slate-200 dark:border-white/10 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👤</span>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Destinatario</p>
                      <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">✉️</span>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📍</span>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Dirección de entrega</p>
                      <p className="font-medium">{user?.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📞</span>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Teléfono</p>
                      <p className="font-medium">{user?.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-sm">
                <h2 className="text-xl font-bold mb-4">Método de pago</h2>
                <div className="space-y-4">
                  <label htmlFor="payment-mp-credit" className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'mp_credit' ? 'border-[#009EE3] bg-[#009EE3]/5 dark:bg-[#009EE3]/20' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <input id="payment-mp-credit" type="radio" name="payment" checked={paymentMethod === 'mp_credit'} onChange={() => setPaymentMethod('mp_credit')} className="accent-[#009EE3] w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#009EE3]">Mercado Pago (Tarjeta de Crédito)</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Paga seguro con tu tarjeta de crédito</span>
                    </div>
                  </label>
                  <label htmlFor="payment-mp-debit" className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'mp_debit' ? 'border-[#009EE3] bg-[#009EE3]/5 dark:bg-[#009EE3]/20' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <input id="payment-mp-debit" type="radio" name="payment" checked={paymentMethod === 'mp_debit'} onChange={() => setPaymentMethod('mp_debit')} className="accent-[#009EE3] w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-[#009EE3]">Mercado Pago (Débito o Dinero en cuenta)</span>
                      <span className="text-xs text-green-600 font-medium">¡15% de descuento adicional!</span>
                    </div>
                  </label>
                  <label htmlFor="payment-cash" className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-primary bg-primary/5 dark:bg-primary/20' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <input id="payment-cash" type="radio" name="payment" checked={paymentMethod === 'cash'} onChange={() => setPaymentMethod('cash')} className="accent-primary w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white">Efectivo contra entrega</span>
                      <span className="text-xs text-green-600 font-medium">¡15% de descuento adicional!</span>
                    </div>
                  </label>
                  <label htmlFor="payment-account" className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'account' ? 'border-primary bg-primary/5 dark:bg-primary/20' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}>
                    <input id="payment-account" type="radio" name="payment" checked={paymentMethod === 'account'} onChange={() => setPaymentMethod('account')} className="accent-primary w-5 h-5" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900 dark:text-white">Cuenta Corriente</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Paga a futuro con tu cuenta del negocio</span>
                    </div>
                  </label>
                </div>

                {(paymentMethod === 'mp_credit' || paymentMethod === 'mp_debit') && (
                  <div className="mt-6 p-6 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center text-slate-900 dark:text-white shadow-inner">
                    <p className="font-bold mb-4 text-center">Continuá con el pago seguro</p>
                    {preferenceId ? (
                      <div className="w-full max-w-sm">
                        <Wallet initialization={{ preferenceId }} />
                        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                          <span className="text-blue-500 text-lg mt-0.5">ℹ️</span>
                          <p className="text-xs text-blue-700 dark:text-blue-300">Al hacer click serás redirigido a la plataforma segura de Mercado Pago para completar tu pago. Una vez finalizado, volverás automáticamente a ZigZag.</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">Completa el formulario y presiona el botón para iniciar Mercado Pago.</p>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-6">Resumen del pedido</h2>
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-white/10 flex items-center justify-center text-xl shadow-sm">
                        {item.emoji}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Cant: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 dark:border-white/10 pt-4 space-y-3">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                {coupon && (
                  <div className="flex justify-between text-secondary">
                    <span>Descuento ({coupon.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Envío</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">¡Gratis!</span>
                </div>
                {isDiscountedPayment && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Descuento 15% (Medio de pago)</span>
                    <span>-${paymentMethodDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold pt-2 border-t border-slate-200 dark:border-white/10 text-slate-900 dark:text-white">
                  <span>Total</span>
                  <span>${checkoutTotal.toFixed(2)}</span>
                </div>
              </div>
              {checkoutTotal < MIN_ORDER_AMOUNT && (
                <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl mt-4 font-medium text-center">
                  El mínimo de compra es ${MIN_ORDER_AMOUNT}. Te faltan ${(MIN_ORDER_AMOUNT - checkoutTotal).toFixed(2)}.
                </div>
              )}

              <Button
                form="checkout-form"
                type="submit"
                disabled={isLoading || checkoutTotal < MIN_ORDER_AMOUNT || ((paymentMethod === 'mp_credit' || paymentMethod === 'mp_debit') && preferenceId !== null)}
                className={`w-full mt-4 py-4 text-lg font-bold transition-all shadow-lg ${(paymentMethod === 'mp_credit' || paymentMethod === 'mp_debit') ? '!bg-[#009EE3] !text-white !border-[#009EE3] hover:!bg-[#0089C7] shadow-[#009EE3]/30' : '!bg-primary !text-white !border-primary hover:!bg-primary-600 shadow-primary/20'} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading ? 'Procesando...' : (paymentMethod === 'mp_credit' || paymentMethod === 'mp_debit') ? 'Generar enlace de pago' : 'Confirmar pedido'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
