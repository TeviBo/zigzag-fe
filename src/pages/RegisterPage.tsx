import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import Button from '../design-system/Button';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // Redirect if already logged in and has address
  useEffect(() => {
    if (user && user.address) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.first_name || !formData.last_name || !formData.email) {
        return setError('Por favor, completa todos los campos personales.');
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.password || formData.password.length < 6) {
        return setError('La contraseña debe tener al menos 6 caracteres.');
      }
      if (formData.password !== formData.confirmPassword) {
        return setError('Las contraseñas no coinciden.');
      }
      setStep(3);
    }
  };

  const prevStep = () => setStep(step - 1);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== 3) return nextStep();

    if (!formData.address || !formData.phone) {
      return setError('Por favor, completa tu dirección y teléfono.');
    }

    setIsLoading(true);
    setError('');

    try {
      await axios.post('http://localhost:8004/auth/register', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        phone: formData.phone
      });
      
      const loginData = new URLSearchParams();
      loginData.append('username', formData.email);
      loginData.append('password', formData.password);

      const response = await axios.post('http://localhost:8004/auth/login', loginData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      
      login(response.data.access_token);
      navigate('/');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Ocurrió un error al registrar el usuario.');
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
      // Let AuthContext logic or Profile guard handle redirection if address is missing
    } catch (err) {
      console.error('Google register error:', err);
      setError('Error al registrar con Google.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-primary-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-primary-900/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl flex flex-col items-center">
        <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-secondary' : 'bg-slate-600'}`} />
          <div className={`w-8 h-1 rounded-full ${step >= 2 ? 'bg-secondary' : 'bg-slate-600'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-secondary' : 'bg-slate-600'}`} />
          <div className={`w-8 h-1 rounded-full ${step >= 3 ? 'bg-secondary' : 'bg-slate-600'}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-secondary' : 'bg-slate-600'}`} />
        </div>

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 text-sm px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="w-full space-y-4">
          {step === 1 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nombre</label>
                <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition" placeholder="Juan" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Apellido</label>
                <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition" placeholder="Pérez" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition" placeholder="tu@email.com" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
                <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition" placeholder="••••••••" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Confirmar Contraseña</label>
                <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition" placeholder="••••••••" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Dirección de Envío</label>
                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition" placeholder="Av. Principal 123, CABA" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Teléfono</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className="w-full bg-secondary/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-secondary/30 transition" placeholder="11 1234-5678" />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <Button type="button" onClick={prevStep} className="flex-1 bg-white/5 hover:bg-white/10 text-white border border-white/10">
                Volver
              </Button>
            )}
            <Button type="submit" disabled={isLoading} className="flex-[2] bg-secondary hover:bg-secondary/90 text-white flex items-center justify-center gap-3">
              {step < 3 ? 'Continuar' : (isLoading ? 'Registrando...' : 'Finalizar Registro')}
            </Button>
          </div>
        </form>

        {step === 1 && (
          <>
            <div className="w-full flex items-center gap-4 my-6">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-slate-500 text-sm">O regístrate con</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>
            <div className="w-full flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('No se pudo iniciar sesión con Google.')}
                theme="filled_black"
                shape="pill"
                text="signup_with"
              />
            </div>
          </>
        )}

        <p className="mt-8 text-sm text-slate-400">
          ¿Ya tienes cuenta? <Link to="/login" className="text-secondary hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
