
// Sound effects for Mom's reactions
const sounds = {
  angry: new Audio('/sounds/angry.mp3'),
  sigh: new Audio('/sounds/sigh.mp3'),
  happy: new Audio('/sounds/happy.mp3'),
  laugh: new Audio('/sounds/laugh.mp3')
};

// Preload sounds
Object.values(sounds).forEach(sound => {
  sound.load();
  sound.volume = 0.5; // Set default volume
});

export const playSound = (type: 'angry' | 'sigh' | 'happy' | 'laugh') => {
  try {
    // Stop any currently playing sounds
    Object.values(sounds).forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
    
    // Play the requested sound
    sounds[type].play().catch(err => {
      console.log('Sound play error (likely user has not interacted yet):', err);
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

// Set a global flag to track if we've played sounds recently
let lastSoundPlayed = 0;
const SOUND_COOLDOWN = 3000; // 3 seconds between sounds to avoid spam

export const playSoundWithCooldown = (type: 'angry' | 'sigh' | 'happy' | 'laugh') => {
  const now = Date.now();
  if (now - lastSoundPlayed > SOUND_COOLDOWN) {
    playSound(type);
    lastSoundPlayed = now;
  }
};
