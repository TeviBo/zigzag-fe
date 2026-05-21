import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../design-system/Button';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post('http://localhost:8004/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      login(response.data.access_token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Credenciales inválidas. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await axios.post('http://localhost:8004/auth/google', {
        token: credentialResponse.credential
      });
      login(response.data.access_token);
      navigate('/');
    } catch (err) {
      console.error('Google login error:', err);
      setError('Error al autenticar con Google.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-primary-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary-900/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a ZigZag</h1>
        <p className="text-slate-400 mb-8 text-sm text-center">
          Inicia sesión para poder realizar compras y guardar tus preferencias.
        </p>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-secondary hover:bg-secondary/90 text-white flex items-center justify-center gap-3 py-3 mt-4"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="w-full flex items-center gap-4 my-6">
          <div className="h-px bg-white/10 flex-1" />
          <span className="text-slate-500 text-sm">O continúa con</span>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.log('Login Failed');
              setError('No se pudo iniciar sesión con Google.');
            }}
            theme="filled_black"
            shape="pill"
          />
        </div>

        <p className="mt-8 text-sm text-slate-400">
          ¿No tienes cuenta? <Link to="/register" className="text-secondary hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  );
}
