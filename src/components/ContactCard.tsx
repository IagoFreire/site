import type { ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';

interface ContactCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  href: string;
}

const ContactCard = ({ icon, title, value, href }: ContactCardProps) => {
  return (
    <a 
      href={href} 
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="contact-card"
    >
      {icon}
      <h3>{title}</h3>
      <p>{value}</p>
      <ExternalLink size={16} />
    </a>
  );
};

export default ContactCard;
