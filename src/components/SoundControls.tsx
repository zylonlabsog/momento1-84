
import React, { useState } from 'react';
import { Volume2, VolumeX, Music, Music2 } from 'lucide-react';
import { audioManager } from '@/utils/audioManager';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SoundControls: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSoundEffectsEnabled, setSoundEffectsEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleToggleMusic = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleToggleSoundEffects = () => {
    setSoundEffectsEnabled(!isSoundEffectsEnabled);
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
