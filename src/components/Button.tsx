import type { ReactNode } from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  icon?: ReactNode;
}

const Button = ({ variant = 'primary', children, onClick, href, icon }: ButtonProps) => {
  const className = `btn btn-${variant}`;

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button className={className} onClick={onClick}>
      {icon}
      {children}
    </button>
  );
};

export default Button;
