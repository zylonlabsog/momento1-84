
// Audio manager for background music and sound effects
class AudioManager {
  private static instance: AudioManager;
  private bgMusic: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private musicPlaying: boolean = false;
  
  // Sound effects collection
  private sounds: Record<string, HTMLAudioElement> = {};
  
  private constructor() {
    // Initialize with empty instances
    this.loadSounds();
  }
  
  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }
  
  private loadSounds(): void {
    // Background music
    this.bgMusic = new Audio('/sounds/background_music.mp3');
    this.bgMusic.loop = true;
    this.bgMusic.volume = this.volume * 0.4; // Background music at lower volume
    
    // Sound effects - only initialize Audio objects (don't load yet)
    this.sounds = {
      angry: new Audio('/sounds/angry.mp3'),
      sigh: new Audio('/sounds/sigh.mp3'),
      happy: new Audio('/sounds/happy.mp3'),
      laugh: new Audio('/sounds/laugh.mp3'),
      click: new Audio('/sounds/click.mp3'),
      error: new Audio('/sounds/error.mp3'),
      success: new Audio('/sounds/success.mp3'),
      typing: new Audio('/sounds/typing.mp3'),
      sabotage: new Audio('/sounds/sabotage.mp3')
    };
    
    // Set volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }
  
  public playBackgroundMusic(): void {
    if (this.bgMusic && !this.isMuted && !this.musicPlaying) {
      this.bgMusic.play().catch(err => {
        console.log('Music play failed (user interaction needed):', err);
      });
      this.musicPlaying = true;
    }
  }
  
  public pauseBackgroundMusic(): void {
    if (this.bgMusic && this.musicPlaying) {
      this.bgMusic.pause();
      this.musicPlaying = false;
    }
  }
  
  public toggleBackgroundMusic(): boolean {
    if (this.musicPlaying) {
      this.pauseBackgroundMusic();
    } else {
      this.playBackgroundMusic();
    }
    return this.musicPlaying;
  }
  
  public playSound(type: keyof typeof this.sounds): void {
    try {
      if (this.isMuted) return;
      
      const sound = this.sounds[type];
      if (sound) {
        // Reset the sound to beginning if it's already playing
        sound.currentTime = 0;
        sound.play().catch(err => {
          console.log(`Sound '${type}' play error:`, err);
        });
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
  
  public playSoundWithCooldown(type: keyof typeof this.sounds, cooldown: number = 3000): void {
    const now = Date.now();
    const lastPlayed = (this.sounds[type] as any).lastPlayed || 0;
    
    if (now - lastPlayed > cooldown) {
      this.playSound(type);
      (this.sounds[type] as any).lastPlayed = now;
    }
  }
  
  public mute(): void {
    this.isMuted = true;
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.musicPlaying = false;
    }
  }
  
  public unmute(): void {
    this.isMuted = false;
  }
  
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.pauseBackgroundMusic();
    }
    return this.isMuted;
  }
  
  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    if (this.bgMusic) {
      this.bgMusic.volume = this.volume * 0.4; // Background music lower
    }
    
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }
  
  public getVolume(): number {
    return this.volume;
  }
  
  public isMusicPlaying(): boolean {
    return this.musicPlaying;
  }
}

// Export a singleton instance
export const audioManager = AudioManager.getInstance();

// Re-export original soundEffects functions with the new implementation
export const playSound = (type: 'angry' | 'sigh' | 'happy' | 'laugh') => {
  audioManager.playSound(type);
};

export const playSoundWithCooldown = (type: 'angry' | 'sigh' | 'happy' | 'laugh') => {
  audioManager.playSoundWithCooldown(type);
};
