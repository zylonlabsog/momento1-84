
import React, { useState, useEffect } from 'react';
import { useMomento } from '@/context/MomentoContext';
import confetti from 'canvas-confetti';
import { audioManager } from '@/utils/audioManager';

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
  const { stage, triggerRandomSabotage, momAngerLevel } = useMomento();
  const [animation, setAnimation] = useState<string>('animate-popup');
  const [blinkEyes, setBlinkEyes] = useState<boolean>(false);
  const [emote, setEmote] = useState<string>('');
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [faceColor, setFaceColor] = useState<string>('bg-momento-pink');
  const [lastEmoteChange, setLastEmoteChange] = useState<number>(Date.now());
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  
  // React to mom's anger level with animations and sounds
  useEffect(() => {
    // Change animation based on anger level and stage
    if (stage === 'welcome') {
      setAnimation('animate-popup');
    } else if (stage === 'guiltTrip') {
      setAnimation('animate-shake-infinite');
      audioManager.playSoundWithCooldown('angry');
    } else if (momAngerLevel > 80) {
      setAnimation('animate-shake-infinite');
      setFaceColor('bg-momento-red bg-opacity-30');
      if (Date.now() - lastEmoteChange > 5000) {
        audioManager.playSoundWithCooldown('angry');
        setLastEmoteChange(Date.now());
      }
    } else if (momAngerLevel > 60) {
      setAnimation('animate-jitter-slow');
      setFaceColor('bg-momento-pink bg-opacity-90');
      if (Date.now() - lastEmoteChange > 10000) {
        audioManager.playSoundWithCooldown('sigh');
        setLastEmoteChange(Date.now());
      }
    } else if (momAngerLevel < 20 && speaking) {
      setAnimation('animate-float');
      setFaceColor('bg-momento-pink');
      if (Date.now() - lastEmoteChange > 15000) {
        audioManager.playSoundWithCooldown('happy');
        setLastEmoteChange(Date.now());
      }
    } else {
      setAnimation('animate-float');
      setFaceColor('bg-momento-pink');
    }
    
    // Random eye blinking
    const blinkInterval = setInterval(() => {
      setBlinkEyes(true);
      setTimeout(() => setBlinkEyes(false), 200);
    }, Math.random() * 3000 + 2000);
    
    // Random emotional state based on anger level
    const emotionInterval = setInterval(() => {
      let emotions;
      
      if (momAngerLevel > 70) {
        emotions = ['annoyed', 'judgmental', 'disappointed', 'furious'];
        audioManager.playSoundWithCooldown('angry');
      } else if (momAngerLevel > 40) {
        emotions = ['annoyed', 'judgmental', 'disappointed'];
        if (Math.random() > 0.7) audioManager.playSoundWithCooldown('sigh');
      } else {
        emotions = ['', 'annoyed', '', 'judgmental', '', 'proud'];
        if (Math.random() > 0.9) audioManager.playSoundWithCooldown('happy');
      }
      
      const newEmote = emotions[Math.floor(Math.random() * emotions.length)];
      if (newEmote !== emote) {
        setEmote(newEmote);
        setLastEmoteChange(Date.now());
      }
    }, 5000);
    
    return () => {
      clearInterval(blinkInterval);
      clearInterval(emotionInterval);
    };
  }, [stage, speaking, momAngerLevel, emote]);

  const handlePoke = () => {
    if (!interactive) return;
    
    setPokeCount(prev => prev + 1);
    setEmote('annoyed');
    
    if (pokeCount >= 2) {
      // Trigger mom's anger with confetti explosion (but in angry colors)
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF4D4D', '#FFD600', '#FF61D8']
      });
      
      audioManager.playSound('angry');
      triggerRandomSabotage();
      setPokeCount(0);
    } else {
      audioManager.playSound('sigh');
    }
  };

  return (
    <div className="flex flex-col items-center">
      {message && (
        <div className="mom-bubble mb-4 max-w-xs animate-popup">
          <p className="font-bold text-black">{message}</p>
        </div>
      )}
      
      <div 
        className={`${sizeClasses[size]} ${animation} rounded-full ${faceColor} border-4 border-black flex items-center justify-center overflow-hidden relative ${interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}
        onClick={handlePoke}
      >
        {/* Aura effect for mom's judgement */}
        {emote === 'judgmental' && (
          <div className="absolute inset-0 bg-momento-red opacity-20 animate-pulse rounded-full" />
        )}
        
        {emote === 'furious' && (
          <div className="absolute inset-0 bg-momento-red opacity-40 animate-ping rounded-full" />
        )}
        
        {emote === 'proud' && (
          <div className="absolute inset-0 bg-momento-green opacity-20 animate-pulse rounded-full" />
        )}
        
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Basic mom avatar face */}
          <div className="w-3/4 h-3/4 relative">
            {/* Eyes */}
            <div className={`absolute top-1/4 left-1/4 w-1/4 h-${blinkEyes ? '0.5' : '1/4'} bg-black rounded-full transition-all duration-100`}></div>
            <div className={`absolute top-1/4 right-1/4 w-1/4 h-${blinkEyes ? '0.5' : '1/4'} bg-black rounded-full transition-all duration-100`}></div>
            
            {/* Eyebrows - different based on mood */}
            {(emote === 'annoyed' || emote === 'furious') && (
              <>
                <div className={`absolute top-[15%] left-[20%] w-1/4 h-1 bg-black rotate-[-${emote === 'furious' ? '30' : '20'}deg]`}></div>
                <div className={`absolute top-[15%] right-[20%] w-1/4 h-1 bg-black rotate-[${emote === 'furious' ? '30' : '20'}deg]`}></div>
              </>
            )}
            {emote === 'disappointed' && (
              <>
                <div className="absolute top-[15%] left-[20%] w-1/4 h-1 bg-black rotate-[10deg]"></div>
                <div className="absolute top-[15%] right-[20%] w-1/4 h-1 bg-black rotate-[-10deg]"></div>
              </>
            )}
            {emote === 'proud' && (
              <>
                <div className="absolute top-[18%] left-[20%] w-1/4 h-1 bg-black rotate-[-5deg]"></div>
                <div className="absolute top-[18%] right-[20%] w-1/4 h-1 bg-black rotate-[5deg]"></div>
              </>
            )}
            
            {/* Mouth - different based on stage and emotion */}
            {stage === 'guiltTrip' || emote === 'furious' ? (
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
            ) : emote === 'proud' ? (
              // Proud smile
              <div className="absolute bottom-1/4 left-1/4 w-1/2 h-[3px] bg-black transform rotate-6 before:content-[''] before:absolute before:w-full before:h-[5px] before:bg-black before:transform before:rotate-[180deg] before:rounded-t-full before:top-[-5px]"></div>
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
        
        {interactive && (
          <div className="absolute -bottom-2 w-full text-center">
            <span className="text-[8px] text-momento-red font-bold">{pokeCount > 0 ? "Stop poking me!" : "Poke me"}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MomAvatar;
