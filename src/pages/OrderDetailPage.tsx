import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  product_name: string | null;
  product_image: string | null;
}

interface Order {
  id: string;
  customer_email: string;
  status: string;
  total_amount: number;
  coupon_code: string | null;
  discount_amount: number;
  created_at: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; step: number }> = {
  pending: { label: 'Pago Pendiente', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', step: 1 },
  paid: { label: 'Recibido', color: 'text-green-500 bg-green-500/10 border-green-500/20', step: 2 },
  preparing: { label: 'En Preparación', color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', step: 3 },
  shipped: { label: 'En Camino', color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20', step: 4 },
  delivered: { label: 'Entregado', color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', step: 5 },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`http://localhost:8003/orders/${id}`);
        setOrder(response.data);
      } catch (err: any) {
        console.error('Error fetching order', err);
        setError('No se pudo cargar el pedido. Puede que no exista.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-primary-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-primary-950 flex flex-col items-center px-4">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl max-w-md text-center">
          <p>{error}</p>
          <Link to="/pedidos" className="text-secondary hover:underline mt-4 inline-block">Volver a mis pedidos</Link>
        </div>
      </div>
    );
  }

  const currentConfig = statusConfig[order.status] || statusConfig['pending'];
  const steps = [
    { label: 'Recibido', key: 'paid' },
    { label: 'Preparando', key: 'preparing' },
    { label: 'En Camino', key: 'shipped' },
    { label: 'Entregado', key: 'delivered' }
  ];
  
  // Paid status is step 2. If status is pending (step 1), we don't light up anything.
  const currentStep = currentConfig.step - 1; // 0-based for the steps array

  return (
    <div className="min-h-screen pt-24 pb-12 bg-primary-950 text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/pedidos" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 font-medium">
          ← Volver a pedidos
        </Link>
        
        <div className="bg-primary-900/40 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-white/10">
            <div>
              <h1 className="text-2xl font-bold mb-1">Pedido #{order.id.split('-')[0]}</h1>
              <p className="text-slate-400">{new Date(order.created_at).toLocaleString('es-AR')}</p>
            </div>
            <div className={`px-4 py-2 rounded-xl border font-semibold ${currentConfig.color}`}>
              {currentConfig.label}
            </div>
          </div>

          {/* Tracking Pipeline */}
          {order.status !== 'pending' && (
            <div className="mb-12">
              <h3 className="text-lg font-bold mb-6">Estado del envío</h3>
              <div className="relative flex justify-between items-center">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 rounded-full" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(0, (currentStep / (steps.length - 1)) * 100)}%` }}
                />
                
                {steps.map((step, idx) => {
                  const isActive = currentStep >= idx + 1; // +1 because step 1 is pending
                  return (
                    <div key={step.key} className="relative flex flex-col items-center gap-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-primary-950 transition-colors duration-500 ${isActive ? 'bg-secondary' : 'bg-slate-700'}`}>
                        {isActive && <span className="text-white text-sm">✓</span>}
                      </div>
                      <span className={`text-xs md:text-sm font-medium absolute top-10 whitespace-nowrap ${isActive ? 'text-white' : 'text-slate-500'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Ticket/Items */}
          <div className="bg-primary-950/50 rounded-2xl p-6 border border-white/5 mb-8 mt-16 md:mt-0">
            <h3 className="text-lg font-bold mb-4">Detalle de productos</h3>
            <div className="space-y-4">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between gap-4 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name || 'Producto'} className="w-16 h-16 object-cover rounded-xl border border-white/10" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-2xl">🛍️</div>
                    )}
                    <div>
                      <p className="font-semibold">{item.product_name || `Producto #${item.product_id}`}</p>
                      <p className="text-sm text-slate-400">{item.quantity} x ${item.unit_price.toFixed(2)}</p>
                    </div>
                  </div>
                  <p className="font-bold">${(item.quantity * item.unit_price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-full max-w-sm bg-primary-950/80 rounded-2xl p-6 border border-white/5">
              <div className="flex justify-between text-slate-400 mb-2">
                <span>Subtotal</span>
                <span>${(order.total_amount + (order.discount_amount || 0)).toFixed(2)}</span>
              </div>
              {order.coupon_code && (
                <div className="flex justify-between text-secondary mb-2">
                  <span>Descuento ({order.coupon_code})</span>
                  <span>-${order.discount_amount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 mb-4">
                <span>Envío</span>
                <span className="text-green-400">Gratis</span>
              </div>
              <div className="flex justify-between text-xl font-bold pt-4 border-t border-white/10">
                <span>Total</span>
                <span className="text-secondary">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
