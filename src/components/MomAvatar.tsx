
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
  const [blinkEyes, setBlinkEyes] = useState<boolean>(false);
  const [emote, setEmote] = useState<string>('');
  
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
    
    // Random eye blinking
    const blinkInterval = setInterval(() => {
      setBlinkEyes(true);
      setTimeout(() => setBlinkEyes(false), 200);
    }, Math.random() * 3000 + 2000);
    
    // Random emotional state
    const emotionInterval = setInterval(() => {
      const emotions = ['', 'annoyed', 'judgmental', 'disappointed'];
      setEmote(emotions[Math.floor(Math.random() * emotions.length)]);
    }, 5000);
    
    return () => {
      clearInterval(blinkInterval);
      clearInterval(emotionInterval);
    };
  }, [stage, speaking]);

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="mom-bubble mb-4 max-w-xs animate-popup">
          <p className="font-bold text-black">{message}</p>
        </div>
      )}
      
      <div 
        className={`${sizeClasses[size]} ${animation} rounded-full bg-momento-pink border-4 border-black flex items-center justify-center overflow-hidden relative`}
      >
        {/* Aura effect for mom's judgement */}
        {emote === 'judgmental' && (
          <div className="absolute inset-0 bg-momento-red opacity-20 animate-pulse rounded-full" />
        )}
        
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Basic mom avatar face */}
          <div className="w-3/4 h-3/4 relative">
            {/* Eyes */}
            <div className={`absolute top-1/4 left-1/4 w-1/4 h-${blinkEyes ? '0.5' : '1/4'} bg-black rounded-full transition-all duration-100`}></div>
            <div className={`absolute top-1/4 right-1/4 w-1/4 h-${blinkEyes ? '0.5' : '1/4'} bg-black rounded-full transition-all duration-100`}></div>
            
            {/* Eyebrows - different based on mood */}
            {emote === 'annoyed' && (
              <>
                <div className="absolute top-[15%] left-[20%] w-1/4 h-1 bg-black rotate-[-20deg]"></div>
                <div className="absolute top-[15%] right-[20%] w-1/4 h-1 bg-black rotate-[20deg]"></div>
              </>
            )}
            {emote === 'disappointed' && (
              <>
                <div className="absolute top-[15%] left-[20%] w-1/4 h-1 bg-black rotate-[10deg]"></div>
                <div className="absolute top-[15%] right-[20%] w-1/4 h-1 bg-black rotate-[-10deg]"></div>
              </>
            )}
            
            {/* Mouth - different based on stage */}
            {stage === 'guiltTrip' ? (
              // Angry mouth for guilt trip
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black transform rotate-12 before:content-[''] before:absolute before:w-full before:h-full before:bg-black before:transform before:rotate-[-24deg] before:origin-center"></div>
            ) : speaking ? (
              // Open mouth when speaking
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-1/4 bg-black rounded-full"></div>
            ) : emote === 'annoyed' ? (
              // Annoyed mouth
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black transform rotate-[-12deg]"></div>
            ) : emote === 'disappointed' ? (
              // Disappointed mouth
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black transform rotate-[-20deg]"></div>
            ) : (
              // Default smirk
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black transform -rotate-6"></div>
            )}
          </div>
        </div>
        
        {/* Cool interactive element - mom's hair */}
        <div className="absolute top-[-5px] left-0 right-0 flex justify-center">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-6 bg-black rounded-t-full mx-[1px] animate-float"
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MomAvatar;
