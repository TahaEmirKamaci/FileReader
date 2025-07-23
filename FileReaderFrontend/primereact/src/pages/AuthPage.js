import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { TabView, TabPanel } from 'primereact/tabview';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { ProgressBar } from 'primereact/progressbar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Login state
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginMessage, setLoginMessage] = useState(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Register state
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '' });
  const [registerMessage, setRegisterMessage] = useState(null);
  const [registerLoading, setRegisterLoading] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;

    if (strength <= 25) return { strength, label: 'Zayıf', color: 'danger' };
    if (strength <= 50) return { strength, label: 'Orta', color: 'warning' };
    if (strength <= 75) return { strength, label: 'İyi', color: 'info' };
    return { strength, label: 'Güçlü', color: 'success' };
  };

  const passwordStrength = getPasswordStrength(registerData.password);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginMessage(null);

    try {
      const result = await authService.login(loginData);
      login(result.token, result.username);
      setLoginMessage({ severity: 'success', text: '✅ Giriş başarılı! Yönlendiriliyor...' });
      setTimeout(() => navigate('/upload'), 1000);
    } catch (error) {
      setLoginMessage({ 
        severity: 'error', 
        text: `❌ ${error.response?.data || 'Giriş başarısız!'}`
      });
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    setRegisterMessage(null);

    try {
      await authService.register(registerData);
      setRegisterMessage({ 
        severity: 'success', 
        text: '🎉 Kayıt başarılı! Artık giriş yapabilirsiniz.' 
      });
      setRegisterData({ username: '', email: '', password: '' });
    } catch (error) {
      setRegisterMessage({ 
        severity: 'error', 
        text: `❌ ${error.response?.data || 'Kayıt başarısız!'}`
      });
    } finally {
      setRegisterLoading(false);
    }
  };

  const isLoginFormValid = loginData.username && loginData.password;
  const isRegisterFormValid = registerData.username && registerData.email && 
                             registerData.password && passwordStrength.strength >= 50;

  return (
    <>
      {/* Global CSS for animated background */}
      <style jsx>{`
        .auth-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: linear-gradient(-45deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe, #00f2fe);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          z-index: -2;
        }
        
        .auth-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          animation: float 20s ease-in-out infinite;
        }
        
        .auth-background::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite alternate;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0% { opacity: 0.5; }
          100% { opacity: 0.8; }
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.1);
        }
        
        .floating-elements {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          pointer-events: none;
          z-index: -1;
        }
        
        .floating-element {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: floatUpDown 6s ease-in-out infinite;
        }
        
        .floating-element:nth-child(1) {
          width: 60px;
          height: 60px;
          top: 20%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-element:nth-child(2) {
          width: 80px;
          height: 80px;
          top: 60%;
          right: 10%;
          animation-delay: 2s;
        }
        
        .floating-element:nth-child(3) {
          width: 40px;
          height: 40px;
          top: 40%;
          left: 80%;
          animation-delay: 4s;
        }
        
        .floating-element:nth-child(4) {
          width: 100px;
          height: 100px;
          top: 80%;
          left: 20%;
          animation-delay: 1s;
        }
        
        .floating-element:nth-child(5) {
          width: 50px;
          height: 50px;
          top: 10%;
          right: 30%;
          animation-delay: 3s;
        }
        
        @keyframes floatUpDown {
          0%, 100% {
            transform: translateY(0px) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translateY(-30px) scale(1.1);
            opacity: 0.9;
          }
        }
        
        .auth-container {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* Animated Background */}
      <div className="auth-background"></div>
      
      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Main Content */}
      <div className="auth-container flex justify-content-center align-items-center min-h-screen p-3">
        <Card className="w-full max-w-28rem shadow-8 border-round-xl glass-effect">
          {/* Header */}
          <div className="text-center mb-4">
            <div className="mb-3">
              <i className="pi pi-shield text-6xl text-primary"></i>
            </div>
            <h1 className="text-3xl font-bold text-900 m-0">
              Hoş Geldiniz
            </h1>
            <p className="text-600 mt-2 mb-0">
              Hesabınıza giriş yapın veya yeni hesap oluşturun
            </p>
          </div>

          <TabView className="custom-tabview">
            <TabPanel 
              header={
                <div className="flex align-items-center">
                  <i className="pi pi-sign-in mr-2"></i>
                  <span>Giriş Yap</span>
                </div>
              }
            >
              <form onSubmit={handleLogin} className="p-fluid">
                <div className="field">
                  <label htmlFor="loginUsername" className="font-semibold text-900 mb-2 block">
                    <i className="pi pi-user mr-2"></i>Kullanıcı Adı
                  </label>
                  <InputText
                    id="loginUsername"
                    value={loginData.username}
                    onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                    placeholder="Kullanıcı adınızı girin"
                    className="p-inputtext-lg"
                    required
                  />
                </div>
                
                <div className="field">
                  <label htmlFor="loginPassword" className="font-semibold text-900 mb-2 block">
                    <i className="pi pi-lock mr-2"></i>Şifre
                  </label>
                  <Password
                    id="loginPassword"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    placeholder="Şifrenizi girin"
                    feedback={false}
                    toggleMask
                    className="p-password-lg"
                    required
                  />
                </div>

                {loginLoading && (
                  <div className="mb-3">
                    <ProgressBar mode="indeterminate" style={{height: '4px'}} />
                    <p className="text-center text-600 mt-2 mb-0">
                      <i className="pi pi-spin pi-spinner mr-2"></i>
                      Giriş yapılıyor...
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  label={loginLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                  icon={loginLoading ? "pi pi-spin pi-spinner" : "pi pi-sign-in"}
                  className="w-full p-button-lg font-semibold"
                  loading={loginLoading}
                  disabled={!isLoginFormValid}
                />

                {loginMessage && (
                  <Message 
                    severity={loginMessage.severity} 
                    text={loginMessage.text}
                    className="mt-3"
                  />
                )}
              </form>
            </TabPanel>

            <TabPanel 
              header={
                <div className="flex align-items-center">
                  <i className="pi pi-user-plus mr-2"></i>
                  <span>Kayıt Ol</span>
                </div>
              }
            >
              <form onSubmit={handleRegister} className="p-fluid">
                <div className="field">
                  <label htmlFor="registerUsername" className="font-semibold text-900 mb-2 block">
                    <i className="pi pi-user mr-2"></i>Kullanıcı Adı
                  </label>
                  <InputText
                    id="registerUsername"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                    placeholder="Kullanıcı adı seçin"
                    className="p-inputtext-lg"
                    required
                  />
                </div>

                <div className="field">
                  <label htmlFor="registerEmail" className="font-semibold text-900 mb-2 block">
                    <i className="pi pi-envelope mr-2"></i>Email
                  </label>
                  <InputText
                    id="registerEmail"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="p-inputtext-lg"
                    required
                  />
                </div>
                
                <div className="field">
                  <label htmlFor="registerPassword" className="font-semibold text-900 mb-2 block">
                    <i className="pi pi-lock mr-2"></i>Şifre
                  </label>
                  <Password
                    id="registerPassword"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    placeholder="Güçlü bir şifre oluşturun"
                    toggleMask
                    className="p-password-lg"
                    promptLabel="Şifre girin"
                    weakLabel="Zayıf"
                    mediumLabel="Orta"
                    strongLabel="Güçlü"
                    required
                  />
                  
                  {/* Custom Password Strength Indicator */}
                  {registerData.password && (
                    <div className="mt-2">
                      <div className="flex align-items-center justify-content-between mb-1">
                        <span className="text-sm text-600">Şifre Gücü:</span>
                        <Badge 
                          value={passwordStrength.label} 
                          severity={passwordStrength.color}
                          size="small"
                        />
                      </div>
                      <ProgressBar 
                        value={passwordStrength.strength} 
                        style={{height: '4px'}}
                        color={
                          passwordStrength.color === 'danger' ? '#ef4444' :
                          passwordStrength.color === 'warning' ? '#f59e0b' :
                          passwordStrength.color === 'info' ? '#3b82f6' : '#10b981'
                        }
                      />
                      <div className="text-xs text-600 mt-1">
                        {passwordStrength.strength < 50 && "En az 8 karakter, büyük harf, sayı ve özel karakter kullanın"}
                      </div>
                    </div>
                  )}
                </div>

                <Divider className="my-3" />

                <div className="surface-100 border-round p-2 mb-3">
                  <div className="text-xs text-600 text-center">
                    <i className="pi pi-info-circle mr-1"></i>
                    Kayıt olarak <strong>Kullanım Şartları</strong> ve <strong>Gizlilik Politikası</strong>nı kabul etmiş olursunuz.
                  </div>
                </div>

                {registerLoading && (
                  <div className="mb-3">
                    <ProgressBar mode="indeterminate" style={{height: '4px'}} />
                    <p className="text-center text-600 mt-2 mb-0">
                      <i className="pi pi-spin pi-spinner mr-2"></i>
                      Hesap oluşturuluyor...
                    </p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  label={registerLoading ? "Kayıt Oluşturuluyor..." : "Hesap Oluştur"}
                  icon={registerLoading ? "pi pi-spin pi-spinner" : "pi pi-user-plus"}
                  className="w-full p-button-lg font-semibold"
                  loading={registerLoading}
                  disabled={!isRegisterFormValid}
                />

                {registerMessage && (
                  <Message 
                    severity={registerMessage.severity} 
                    text={registerMessage.text}
                    className="mt-3"
                  />
                )}
              </form>
            </TabPanel>
          </TabView>

          {/* Footer */}
          <Divider className="my-4" />
          <div className="text-center">
            <p className="text-600 text-sm m-0">
              <i className="pi pi-shield mr-1"></i>
              Güvenli bağlantı ile korunmaktasınız
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};

export default AuthPage;