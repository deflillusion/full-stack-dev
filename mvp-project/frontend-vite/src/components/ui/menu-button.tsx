import React from 'react';
import { Card } from './card';
import { cn } from '../../lib/utils';

interface MenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  title: string;
}

const MenuButton = React.forwardRef<HTMLButtonElement, MenuButtonProps>(
  ({ icon, title, className, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        as="button"
        className={cn(
          "p-4 text-center cursor-pointer h-full flex flex-col items-center justify-center transition-colors hover:bg-primary/5",
          className
        )}
        {...props}
      >
        {icon}
        <span className="mt-2">{title}</span>
      </Card>
    );
  }
);

MenuButton.displayName = "MenuButton";

export { MenuButton };
