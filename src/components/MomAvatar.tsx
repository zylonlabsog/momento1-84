
import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';

interface MomAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  speaking?: boolean;
  message?: string;
}

const MomAvatar: React.FC<MomAvatarProps> = ({ 
  size = 'md',
  speaking = false,
  message
}) => {
  const { stage } = useMomento();
  const [animation, setAnimation] = useState<string>('animate-popup');
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  useEffect(() => {
    // Change animation based on stage
    if (stage === 'welcome') {
      setAnimation('animate-popup');
    } else if (stage === 'guiltTrip') {
      setAnimation('animate-shake-infinite');
    } else if (speaking) {
      setAnimation('animate-jitter-slow');
    } else {
      setAnimation('animate-float');
    }
  }, [stage, speaking]);

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="mom-bubble mb-4 max-w-xs animate-popup">
          <p className="font-bold text-black">{message}</p>
        </div>
      )}
      
      <div 
        className={`${sizeClasses[size]} ${animation} rounded-full bg-momento-pink border-4 border-black flex items-center justify-center overflow-hidden`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Basic mom avatar face */}
          <div className="w-3/4 h-3/4 relative">
            {/* Eyes */}
            <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-black rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-black rounded-full"></div>
            
            {/* Mouth - different based on stage */}
            {stage === 'guiltTrip' ? (
              // Angry mouth for guilt trip
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black transform rotate-12 before:content-[''] before:absolute before:w-full before:h-full before:bg-black before:transform before:rotate-[-24deg] before:origin-center"></div>
            ) : speaking ? (
              // Open mouth when speaking
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/4 bg-black rounded-full"></div>
            ) : (
              // Default smirk
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black transform -rotate-6"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MomAvatar;
