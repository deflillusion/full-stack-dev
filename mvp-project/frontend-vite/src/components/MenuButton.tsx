import React from 'react';
import { Card, Typography } from '@mui/material';

interface MenuButtonProps {
  icon: JSX.Element;
  title: string;
  onClick: () => void;
}

const MenuButton: React.FC<MenuButtonProps> = ({ icon, title, onClick }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        p: 2,
        textAlign: 'center',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': { bgcolor: 'rgba(0,122,255,0.05)' }
      }}
    >
      {icon}
      <Typography sx={{ mt: 1 }}>{title}</Typography>
    </Card>
  );
};

export default MenuButton;
