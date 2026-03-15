import { LoginRequest, LoginResponse, ForgotPasswordRequest, ForgotPasswordResponse } from '../types/auth';

const DEMO_USER = {
  id: '1',
  email: 'demo@artem.ai',
  name: 'Demo User',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
};

const DEMO_PASSWORD = 'demo123456';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  await delay(1500);

  if (data.email === DEMO_USER.email && data.password === DEMO_PASSWORD) {
    return {
      success: true,
      user: DEMO_USER,
      token: 'demo-token-' + Date.now(),
      expiresIn: 86400
    };
  }

  await delay(1000);
  throw new Error('Email o contraseña incorrectos');
};

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
  await delay(1000);
  return {
    success: true,
    message: 'Email de recuperación enviado'
  };
};
