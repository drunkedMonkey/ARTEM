import React from 'react';
import styles from './Link.module.css';

export interface LinkProps {
  to: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

export const Link: React.FC<LinkProps> = ({
  to,
  children,
  variant = 'primary',
  onClick,
}) => {
  return (
    <a
      href={to}
      className={`${styles.link} ${styles[variant]}`}
      onClick={(e) => {
        if (onClick) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {children}
    </a>
  );
};
