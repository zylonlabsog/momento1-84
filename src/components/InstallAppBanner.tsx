
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const InstallAppBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show the install banner
      setShowBanner(true);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const handleInstallClick = () => {
    // Hide the banner
    setShowBanner(false);
    
    // Show the install prompt
    if (deferredPrompt) {
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        
        // Clear the saved prompt since it can't be used again
        setDeferredPrompt(null);
      });
    }
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="neubrutalism-box p-4 bg-momento-yellow max-w-md mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-black text-lg">Install Momento App</h3>
          <button
            onClick={() => setShowBanner(false)}
            className="bg-momento-red p-2 border-2 border-black rounded-full"
          >
            <X size={16} />
          </button>
        </div>
        
        <p className="mb-4">Install Momento as an app for a more immersive guilt-trip experience!</p>
        
        <button
          onClick={handleInstallClick}
          className="neubrutalism-button bg-momento-green w-full"
        >
          Install Now
        </button>
      </div>
    </div>
  );
};

export default InstallAppBanner;
