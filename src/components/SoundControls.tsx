
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { audioManager } from '@/utils/audioManager';

const SoundControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Initialize the component with the current state of audio manager
    setIsMuted(false); // Default to unmuted
    setIsPlaying(audioManager.isMusicPlaying());
    
    // Play a sound when the component mounts
    audioManager.playSound('click');
  }, []);
  
  const handleToggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
    
    // Play UI feedback sound if unmuting
    if (!newMutedState) {
      audioManager.playSound('click');
    }
  };
  
  const handleToggleMusic = () => {
    const isNowPlaying = audioManager.toggleBackgroundMusic();
    setIsPlaying(isNowPlaying);
    
    // Play UI feedback sound
    if (!isMuted) {
      audioManager.playSound('click');
    }
  };
  
  return (
    <div className="flex items-center gap-2">
      <button 
        onClick={handleToggleMute}
        className="neubrutalism-button-sm bg-momento-pink"
        title={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
      </button>
      
      <button 
        onClick={handleToggleMusic}
        className="neubrutalism-button-sm bg-momento-blue"
        title={isPlaying ? "Pause Music" : "Play Music"}
      >
        {isPlaying ? <Music2 size={16} /> : <Music size={16} />}
      </button>
    </div>
  );
};

export default SoundControls;
