
import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { audioManager } from '@/utils/audioManager';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SoundControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSoundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    // Initialize the component with the current state of audio manager
    setIsMuted(audioManager.isMuted());
    setSoundEffectsEnabled(audioManager.areSoundEffectsEnabled());
    setIsPlaying(audioManager.isMusicPlaying());
    
    // Play a sound when the component mounts if sound effects are enabled
    if (audioManager.areSoundEffectsEnabled()) {
      audioManager.playSound('click');
    }
  }, []);
  
  const handleToggleMute = () => {
    const newMutedState = audioManager.toggleMute();
    setIsMuted(newMutedState);
    
    // Play UI feedback sound if unmuting and sound effects are enabled
    if (!newMutedState && audioManager.areSoundEffectsEnabled()) {
      audioManager.playSound('click');
    }
  };
  
  const handleToggleMusic = () => {
    const isNowPlaying = audioManager.toggleBackgroundMusic();
    setIsPlaying(isNowPlaying);
    
    // Play UI feedback sound if sound effects are enabled
    if (!isMuted && audioManager.areSoundEffectsEnabled()) {
      audioManager.playSound('click');
    }
  };
  
  const handleToggleSoundEffects = () => {
    const newSoundEffectsState = audioManager.toggleSoundEffects();
    setSoundEffectsEnabled(newSoundEffectsState);
    
    // No sound feedback here since we're toggling sound effects themselves
  };
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={handleToggleMute}
          className="neubrutalism-button-sm bg-momento-pink"
          title={isMuted ? "Unmute All" : "Mute All"}
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
      
      <div className="flex items-center space-x-2">
        <Switch
          id="sound-effects"
          checked={isSoundEffectsEnabled}
          onCheckedChange={handleToggleSoundEffects}
          className="data-[state=checked]:bg-momento-green"
        />
        <Label htmlFor="sound-effects" className="text-xs font-medium">
          Sound Effects
        </Label>
      </div>
    </div>
  );
};

export default SoundControls;
