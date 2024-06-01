import React from 'react';

interface CardProps {
  color: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ color, title, description }) => {
  return (
    <div className={`p-4 ${color} rounded-lg text-white`}>
      <div>{title}</div>
      <div>{description}</div>
      <div className="mt-2"><a href="#" className="text-blue-200">Visualizar tudo</a></div>
    </div>
  );
};

export default Card;
