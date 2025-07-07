import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const LoginPage: React.FC = () => {
  const [showRegister, setShowRegister] = useState(false);

  const handleLoginSuccess = () => {
    console.log('Login exitoso');
    // Aquí podrías redirigir al dashboard
    window.location.href = '/dashboard';
  };

  const handleRegisterSuccess = () => {
    console.log('Registro exitoso');
    setShowRegister(false);
    // Mostrar mensaje de éxito y volver al login
  };

  if (showRegister) {
    return (
      <RegisterForm
        onSuccess={handleRegisterSuccess}
        onLoginClick={() => setShowRegister(false)}
      />
    );
  }

  return (
    <LoginForm
      onSuccess={handleLoginSuccess}
      onRegisterClick={() => setShowRegister(true)}
    />
  );
};

export default LoginPage; 