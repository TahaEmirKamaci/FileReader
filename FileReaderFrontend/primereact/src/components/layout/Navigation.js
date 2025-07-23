import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Navigation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const items = [
    {
      label: 'Dosya Yükle',
      icon: 'pi pi-upload',
      command: () => navigate('/upload')
    },
    {
      label: 'Kişiler',
      icon: 'pi pi-users',
      command: () => navigate('/persons')
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const end = (
    <div className="flex align-items-center gap-2">
      <Button
        icon={theme === 'dark' ? 'pi pi-sun' : 'pi pi-moon'}
        className="p-button-rounded p-button-text"
        onClick={toggleTheme}
        tooltip={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}
      />
      <span className="text-sm">Giriş yapan: {user}</span>
      <Button 
        label="Çıkış" 
        icon="pi pi-sign-out" 
        onClick={handleLogout}
        className="p-button-outlined p-button-sm"
      />
    </div>
  );

  return (
    <Menubar model={items} end={end} />
  );
};

export default Navigation;