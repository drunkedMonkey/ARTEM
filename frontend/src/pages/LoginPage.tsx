import React from 'react';
import { LoginForm } from '../components/Login';
import '../styles/global.css';

const LoginPage: React.FC = () => {
  return (
    <div className="page">
      <div className="background">
        <div className="grid-pattern" />
      </div>
      <main className="main">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
