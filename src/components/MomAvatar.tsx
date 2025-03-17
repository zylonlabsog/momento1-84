
import React from 'react';

interface MomAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  speaking?: boolean;
  message?: string;
  interactive?: boolean;
}

const MomAvatar: React.FC<MomAvatarProps> = ({ 
  size = 'md',
  speaking = false,
  message,
  interactive = false
}) => {
  // Fixed values
  const animation = 'animate-popup';
  const blinkEyes = false;
  const emote = '';
  const faceColor = 'bg-momento-pink';
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="mom-bubble mb-4 max-w-xs animate-popup">
          <p className="font-bold text-black">{message}</p>
        </div>
      )}
      
      <div 
        className={`${sizeClasses[size]} ${animation} rounded-full ${faceColor} border-4 border-black flex items-center justify-center overflow-hidden relative`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Basic mom avatar face - frozen expression */}
          <div className="w-3/4 h-3/4 relative">
            {/* Eyes */}
            <div className="absolute top-1/4 left-1/4 w-1/4 h-1/4 bg-black rounded-full"></div>
            <div className="absolute top-1/4 right-1/4 w-1/4 h-1/4 bg-black rounded-full"></div>
            
            {/* Basic eyebrows */}
            <div className="absolute top-[18%] left-[20%] w-1/4 h-1 bg-black"></div>
            <div className="absolute top-[18%] right-[20%] w-1/4 h-1 bg-black"></div>
            
            {/* Default mouth */}
            <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black"></div>
          </div>
        </div>
        
        {/* Mom's hair */}
        <div className="absolute top-[-5px] left-0 right-0 flex justify-center">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-6 bg-black rounded-t-full mx-[1px]"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MomAvatar;
