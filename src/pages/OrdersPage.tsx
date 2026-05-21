import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../design-system/Button';
import axios from 'axios';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: string;
  customer_email: string;
  status: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  paid: { label: 'Pagado', color: 'text-green-400 bg-green-400/10 border-green-400/30', icon: '✓' },
  pending: { label: 'Pendiente', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30', icon: '⏳' },
  failed: { label: 'Fallido', color: 'text-red-400 bg-red-400/10 border-red-400/30', icon: '✕' },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8003/orders?email=${encodeURIComponent(user.email)}`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <span className="text-6xl mb-6">🔒</span>
        <h1 className="text-3xl font-black mb-4">Iniciá sesión para ver tus pedidos</h1>
        <Button onClick={() => navigate('/login')} className="!bg-primary !text-white px-6 py-3 shadow-md shadow-primary/20">
          Ir a login
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-500 dark:text-slate-400 font-medium">Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-20 pt-10 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors mb-8 font-medium">
          ← Volver al inicio
        </Link>
        <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Mis Pedidos
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10">{orders.length} pedido{orders.length !== 1 ? 's' : ''} realizados</p>

        {orders.length === 0 ? (
          <div className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-12 backdrop-blur-md text-center">
            <span className="text-6xl block mb-6">🛒</span>
            <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">Aún no tenés pedidos</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Explorá nuestros productos y hacé tu primera compra.</p>
            <Button onClick={() => navigate('/categorias')} className="!bg-primary !text-white px-6 py-3 shadow-md shadow-primary/20">
              Explorar productos
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const config = statusConfig[order.status] || statusConfig.pending;
              const dateString = order.created_at.endsWith('Z') ? order.created_at : `${order.created_at}Z`;
              const date = new Date(dateString);
              const formattedDate = date.toLocaleDateString('es-AR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={order.id}
                  className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-sm hover:shadow-md transition-all flex flex-col"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                          Pedido #{order.id.slice(0, 8)}
                        </h3>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                          <span>{config.icon}</span>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{formattedDate}</p>
                    </div>
                    <p className="text-2xl font-black text-slate-900 dark:text-white">
                      ${order.total_amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="border-t border-slate-200 dark:border-white/10 pt-4 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm"
                        >
                          <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[120px]">
                            {item.product_name || `Producto #${item.product_id}`}
                          </span>
                          <span className="text-slate-400 dark:text-slate-500">×</span>
                          <span className="font-semibold text-slate-900 dark:text-white">{item.quantity}</span>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="flex items-center justify-center bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-slate-500">
                          +{order.items.length - 3} más
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-2 flex justify-end">
                    <Button onClick={() => navigate(`/pedidos/${order.id}`)} className="bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-900 dark:text-white px-4 py-2 text-sm">
                      Ver detalle del pedido →
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
