import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from './Input';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Link } from './Link';
import { useAuth } from '../../hooks/useAuth';
import { ForgotPasswordModal } from '../Modal/ForgotPasswordModal';
import styles from './LoginForm.module.css';

const loginSchema = z.object({
  email: z.string().min(1, 'El email es requerido').email('Ingresa un email válido'),
  password: z.string().min(1, 'La contraseña es requerida').min(8, 'Mínimo 8 caracteres'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      setIsSubmitted(true);
    } catch {
      // Error handled by useAuth
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h2 className={styles.successTitle}>¡Bienvenido!</h2>
        <p className={styles.successText}>Has iniciado sesión exitosamente.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.logo}>ARTEM</h1>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Input
            id="email"
            label="Email"
            type="email"
            placeholder="tu@email.com"
            error={errors.email?.message}
            {...register('email')}
            autocomplete="email"
            required
          />

          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
            autocomplete="current-password"
            required
          />

          <div className={styles.options}>
            <Checkbox
              id="rememberMe"
              label="Remember me"
              checked={false}
              onChange={() => {}}
            />
            <Link
              to="#"
              variant="primary"
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot?
            </Link>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <Button type="submit" loading={loading}>
            Sign In
          </Button>
        </form>

        <p className={styles.register}>
          Don't have an account?{' '}
          <Link to="/register" variant="secondary">
            Create one
          </Link>
        </p>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </>
  );
};
