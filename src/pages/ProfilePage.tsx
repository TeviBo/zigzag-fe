import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../design-system/Button';

export default function ProfilePage() {
  const { user, logout, login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    address: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if we were redirected here because of missing address
  const requireAddress = location.state?.requireAddress;

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate('/login');
      } else {
        setFormData({
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          address: user.address || '',
          phone: user.phone || ''
        });
        if (requireAddress) {
          setIsEditing(true);
        }
      }
    }
  }, [user, isLoading, navigate, requireAddress]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-primary-950 flex flex-col items-center px-4">
        <div className="w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.address || !formData.phone) {
      return setError('La dirección y el teléfono son obligatorios para realizar compras.');
    }

    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('user_token');
      const response = await axios.put('http://localhost:8004/auth/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state by forcing a re-fetch of the token or just re-logging in
      // Actually, AuthContext should ideally expose an update user function.
      // But we can just refresh the page or rely on the /auth/me endpoint if we add it to AuthContext.
      // For now, let's just show success. 
      setSuccess('Perfil actualizado correctamente.');
      setIsEditing(false);
      
      if (requireAddress && location.state?.from) {
        navigate(location.state.from);
        // Force reload to get updated context
        window.location.reload();
      } else {
        window.location.reload(); // Reload to update auth context
      }

    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Ocurrió un error al actualizar el perfil.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-primary-950 flex flex-col items-center px-4">
      <div className="w-full max-w-2xl bg-primary-900/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center">
        
        {requireAddress && (
          <div className="w-full bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-sm px-4 py-3 rounded-xl mb-6 text-center font-medium">
            ⚠️ Por favor completa tu dirección y teléfono para continuar con tu compra.
          </div>
        )}

        <div className="w-24 h-24 rounded-full bg-secondary text-white text-3xl font-bold flex items-center justify-center mb-6 shadow-lg border-4 border-secondary/30">
          {(user.first_name || user.name || '?').charAt(0).toUpperCase()}
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-2">{user.first_name} {user.last_name}</h1>
        <p className="text-slate-400 mb-8">{user.email}</p>

        {error && <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">{error}</div>}
        {success && <div className="w-full bg-green-500/10 border border-green-500/50 text-green-500 text-sm px-4 py-3 rounded-xl mb-6">{success}</div>}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="w-full space-y-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Apellido</label>
                <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Dirección de Envío</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30" />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              {!requireAddress && (
                <Button type="button" onClick={() => setIsEditing(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                  Cancelar
                </Button>
              )}
              <Button type="submit" disabled={isSaving} className="flex-[2] bg-secondary hover:bg-secondary/90 text-white">
                {isSaving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div onClick={() => navigate('/pedidos')} className="bg-primary-950/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-secondary/10 transition cursor-pointer">
              <span className="text-2xl mb-2">📦</span>
              <h3 className="text-white font-medium">Mis Pedidos</h3>
              <p className="text-sm text-slate-400 mt-1">Revisa el historial de tus compras</p>
            </div>
            <div onClick={() => setIsEditing(true)} className="bg-primary-950/50 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center hover:bg-secondary/10 transition cursor-pointer">
              <span className="text-2xl mb-2">⚙️</span>
              <h3 className="text-white font-medium">Configuración</h3>
              <p className="text-sm text-slate-400 mt-1">Modificar dirección y datos</p>
            </div>
          </div>
        )}

        <Button 
          onClick={handleLogout} 
          className="w-full max-w-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 py-3 rounded-xl transition"
        >
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
