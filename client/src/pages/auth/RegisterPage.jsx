import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ShoppingBag, Phone, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useForm } from '../../hooks/useForm';
import { useAuth } from '../../hooks/useAuth';
import { validators } from '../../utils/validators';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validationRules = {
    nombre: validators.compose(
      validators.required('El nombre es requerido'),
      validators.minLength(3, 'El nombre debe tener al menos 3 caracteres')
    ),
    email: validators.compose(
      validators.required('El email es requerido'),
      validators.email('Email inválido')
    ),
    telefono: validators.compose(
      validators.required('El teléfono es requerido'),
      validators.phone('Teléfono inválido')
    ),
    password: validators.compose(
      validators.required('La contraseña es requerida'),
      validators.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
      validators.password('La contraseña debe contener mayúsculas, minúsculas y números')
    ),
    confirmPassword: validators.compose(
      validators.required('Debes confirmar la contraseña'),
      (value, allValues) => {
        if (value !== allValues.password) {
         return 'Las contraseñas no coinciden';
        }
        return '';
      }
    )
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit
  } = useForm(
    {
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      confirmPassword: ''
    },
    validationRules
  );

  const onSubmit = async (formValues) => {
    setLoading(true);
    setError('');

    try {
      const success = await register({
        nombre: formValues.nombre,
        email: formValues.email,
        telefono: formValues.telefono,
        password: formValues.password
      });
      
      if(!success) throw new Error('Registro fallido');
      navigate(success && '/login');
    } catch (err) {
      setError('Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-5">
        {/* Logo y título */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white/30 mb-4 p-3 hover:scale-110 transition-all duration-500 group hover:rotate-6">
            <ShoppingBag className="w-9 h-9 text-white drop-shadow-2xl group-hover:rotate-12 transition-all" />
          </div>
          <h2 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-emerald-900 via-gray-900 to-emerald-800 bg-clip-text text-transparent mb-2 drop-shadow-2xl">
            Crea tu Cuenta
          </h2>
          <p className="text-sm text-emerald-700 font-semibold bg-emerald-100/80 px-4 py-2 rounded-xl inline-block backdrop-blur-xl border border-emerald-200/50">
            Únete a TechStore hoy
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl p-6 lg:p-8 border border-emerald-200/50">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Error general */}
            {error && (
              <div className="flex items-start gap-2 p-3 bg-gradient-to-r from-rose-500/10 to-red-500/10 border-2 border-rose-500/30 rounded-xl backdrop-blur-sm shadow-xl">
                <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-rose-700 leading-relaxed">{error}</span>
              </div>
            )}

            {/* Nombre completo */}
            <Input
              label="Nombre Completo"
              name="nombre"
              value={values.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.nombre}
              touched={touched.nombre}
              placeholder="Tu nombre completo"
              required
              icon={User}
            />

            {/* Email */}
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

            {/* Teléfono */}
            <Input
              label="Teléfono"
              name="telefono"
              type="tel"
              value={values.telefono}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.telefono}
              touched={touched.telefono}
              placeholder="3001234567"
              required
              icon={Phone}
            />

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
                placeholder="••••••••••••"
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 p-1.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-300 group hover:shadow-md"
              >
                {showPassword ? 
                  <EyeOff className="w-4 h-4 text-emerald-600 group-hover:scale-110" /> : 
                  <Eye className="w-4 h-4 text-emerald-600 group-hover:scale-110" />
                }
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <Input
                label="Confirmar Contraseña"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                placeholder="••••••••••••"
                required
                icon={Lock}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-8 p-1.5 hover:bg-emerald-500/20 rounded-lg transition-all duration-300 group hover:shadow-md"
              >
                {showConfirmPassword ? 
                  <EyeOff className="w-4 h-4 text-emerald-600 group-hover:scale-110" /> : 
                  <Eye className="w-4 h-4 text-emerald-600 group-hover:scale-110" />
                }
              </button>
            </div>

            {/* Requisitos de contraseña */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200/50 rounded-xl p-4 backdrop-blur-sm shadow-inner">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-4 h-4 text-emerald-600" />
                <h4 className="text-sm font-black text-emerald-900">Requisitos de seguridad</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${values.password.length >= 8 ? 'bg-emerald-100 border-emerald-300' : 'bg-gray-100 border-gray-300'}`}>
                  <CheckCircle className={`w-4 h-4 ${values.password.length >= 8 ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className="text-xs font-semibold">Mínimo 8 caracteres</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${/[A-Z]/.test(values.password) ? 'bg-emerald-100 border-emerald-300' : 'bg-gray-100 border-gray-300'}`}>
                  <CheckCircle className={`w-4 h-4 ${/[A-Z]/.test(values.password) ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className="text-xs font-semibold">Una mayúscula</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${/[a-z]/.test(values.password) ? 'bg-emerald-100 border-emerald-300' : 'bg-gray-100 border-gray-300'}`}>
                  <CheckCircle className={`w-4 h-4 ${/[a-z]/.test(values.password) ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className="text-xs font-semibold">Una minúscula</span>
                </div>
                <div className={`flex items-center gap-2 p-2 rounded-lg transition-all ${/\d/.test(values.password) ? 'bg-emerald-100 border-emerald-300' : 'bg-gray-100 border-gray-300'}`}>
                  <CheckCircle className={`w-4 h-4 ${/\d/.test(values.password) ? 'text-emerald-600' : 'text-gray-400'}`} />
                  <span className="text-xs font-semibold">Un número</span>
                </div>
              </div>
            </div>

            {/* Botón submit */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
            >
              Crear Mi Cuenta
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-emerald-200/50"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm rounded-xl shadow-2xl backdrop-blur-xl border-2 border-white/30">
                ¿Ya tienes cuenta?
              </span>
            </div>
          </div>

          {/* Link a login */}
          <div>
            <Link
              to="/login"
              className="w-full flex items-center justify-center gap-2 py-3 px-5 border-2 border-emerald-500/50 bg-white/60 hover:bg-emerald-500/10 backdrop-blur-xl rounded-xl text-emerald-700 font-black text-base hover:text-emerald-600 hover:border-emerald-400/75 hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 shadow-xl hover:scale-[1.02]"
            >
              <User className="w-5 h-5" />
              Iniciar Sesión
              <ArrowRight className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;