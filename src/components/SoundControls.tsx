
import React from 'react';
import { Volume2, Music } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SoundControls: React.FC = () => {
  // Fixed values
  const isMuted = false;
  const isSoundEffectsEnabled = true;
  const isPlaying = false;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 mb-2">
        <button 
          className="neubrutalism-button-sm bg-momento-pink"
          title="Mute All"
        >
          <Volume2 size={16} />
        </button>
        
        <button 
          className="neubrutalism-button-sm bg-momento-blue"
          title="Play Music"
        >
          <Music size={16} />
        </button>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="sound-effects"
          checked={isSoundEffectsEnabled}
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
