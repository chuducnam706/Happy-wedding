import React, { useMemo } from 'react';

export const FallingPetals: React.FC = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      left: `${(i * 7.5 + Math.random() * 5) % 96}%`,
      animationDuration: `${7 + Math.random() * 8}s`,
      animationDelay: `${Math.random() * 5}s`,
      size: 10 + Math.random() * 12,
      opacity: 0.35 + Math.random() * 0.45,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {petals.map((petal) => (
        <div
          key={petal.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: petal.left,
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            backgroundColor: '#FFCCD5',
            borderRadius: '50% 0 50% 50%',
            opacity: petal.opacity,
            animation: `floatPetal ${petal.animationDuration} linear infinite`,
            animationDelay: petal.animationDelay,
            boxShadow: '0 2px 4px rgba(230, 115, 135, 0.2)',
          }}
        />
      ))}
    </div>
  );
};
