import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ShoppingBag, User, ArrowRight } from 'lucide-react';
import Input from '../../components/common/Input';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Button from '../../components/common/Button';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  // Validación de email
  const validateEmail = (email) => {
    if (!email) {
      return 'El email es requerido';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }
    return '';
  };

  // Validación de password
  const validatePassword = (password) => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    return '';
  };

  // Handle change con validación en tiempo real
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real solo si el campo ya fue tocado
    if (touched[name]) {
      let error = '';
      if (name === 'email') {
        error = validateEmail(value);
      } else if (name === 'password') {
        error = validatePassword(value);
      }
      
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  // Handle blur para marcar campo como tocado
  const handleBlur = (e) => {
    const { name } = e.target;
    
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // Validar al salir del campo
    let error = '';
    if (name === 'email') {
      error = validateEmail(values[name]);
    } else if (name === 'password') {
      error = validatePassword(values[name]);
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Validar todo el formulario
  const validateForm = () => {
    const emailError = validateEmail(values.email);
    const passwordError = validatePassword(values.password);

    setErrors({
      email: emailError,
      password: passwordError
    });

    setTouched({
      email: true,
      password: true
    });

    return !emailError && !passwordError;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario completo
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const validateLogin = await login(values.email, values.password);

      if (validateLogin) {
        toast.success('¡Bienvenido!', {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        navigate('/admin')
      } else {
        toast.error('Credenciales inválidas', {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (err) {
      toast.error('Error al iniciar sesión. Intenta nuevamente.', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white/30 mb-4 hover:scale-110 transition-all duration-300 group">
            <ShoppingBag className="w-8 h-8 text-white group-hover:rotate-12 transition-transform" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-800 bg-clip-text text-transparent mb-2">
            Bienvenido
          </h2>
          <p className="text-sm text-emerald-700 font-medium bg-emerald-100/80 px-4 py-2 rounded-xl inline-block backdrop-blur-sm">
            Ingresa a tu cuenta
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-emerald-200/50">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <Input
                label="Correo Electrónico"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.email}
                touched={touched.email}
                placeholder="tu@ejemplo.com"
                required
                icon={Mail}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Input
                label="Contraseña"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.password}
                touched={touched.password}
                placeholder="••••••••"
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 p-1.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-200 group"
              >
                {showPassword ? 
                  <EyeOff className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" /> : 
                  <Eye className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                }
              </button>
            </div>

            {/* Recordar */}
            <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
              <label className="flex items-center cursor-pointer group">
                <div className="w-5 h-5 bg-white border-2 border-emerald-300 rounded-lg flex items-center justify-center group-hover:border-emerald-500 transition-all duration-200 mr-2 shadow-sm">
                  <input
                    type="checkbox"
                    className="w-3 h-3 text-emerald-600 focus:ring-emerald-500 opacity-0 absolute cursor-pointer"
                  />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm scale-0 group-hover:scale-100 transition-transform duration-200" />
                </div>
                <span className="text-sm font-medium text-emerald-800">Recordarme</span>
              </label>
            </div>

            {/* Botón submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="md"
              loading={loading}
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-200/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm rounded-lg shadow-md backdrop-blur-sm">
                ¿Nueva cuenta?
              </span>
            </div>
          </div>

          {/* Link a registro */}
          <div>
            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-emerald-500/50 bg-white/50 hover:bg-emerald-500/10 backdrop-blur-sm rounded-xl text-emerald-700 font-bold text-sm hover:text-emerald-600 hover:border-emerald-400/75 hover:shadow-lg transition-all duration-300 shadow-md hover:scale-[1.02]"
            >
              <User className="w-4 h-4" />
              Crear cuenta gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-emerald-700 font-medium px-4 py-3 bg-emerald-100/60 backdrop-blur-sm rounded-xl border border-emerald-200/50">
          Al iniciar sesión, aceptas nuestros{' '}
          <a href="#" className="text-emerald-900 font-semibold hover:underline transition-all">
            Términos y Condiciones
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;