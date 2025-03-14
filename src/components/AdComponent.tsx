
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface AdComponentProps {
  onClose: () => void;
  adIndex?: number;
}

const AdComponent: React.FC<AdComponentProps> = ({ onClose, adIndex: forcedAdIndex }) => {
  const [adIndex] = useState(() => forcedAdIndex !== undefined ? forcedAdIndex : Math.floor(Math.random() * 5));
  const [closingIn, setClosingIn] = useState<number | null>(null);
  
  const adTemplates = [
    {
      title: "LIMITED TIME OFFER!",
      description: "Buy now and get 50% off on premium productivity tools!",
      color: "bg-momento-yellow"
    },
    {
      title: "HOT SINGLES IN YOUR AREA",
      description: "Want to meet people who are also procrastinating?",
      color: "bg-momento-pink"
    },
    {
      title: "QUIZ: What type of procrastinator are you?",
      description: "Take our 30-minute survey to find out now!",
      color: "bg-momento-blue"
    },
    {
      title: "DOCTORS HATE THIS ONE TRICK",
      description: "Click here to learn how to focus without actually trying!",
      color: "bg-momento-green"
    },
    {
      title: "YOUR COMPUTER MAY BE AT RISK",
      description: "Download our totally legitimate scanner now!",
      color: "bg-momento-red"
    }
  ];

  const currentAd = adTemplates[adIndex];

  // Occasionally show a fake "close in X seconds" countdown
  useEffect(() => {
    if (Math.random() > 0.7) {
      setClosingIn(5);
      
      const interval = setInterval(() => {
        setClosingIn(prev => {
          if (prev === null) return null;
          if (prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, []);

  const handleCloseAd = () => {
    toast({
      title: "Mom Says:",
      description: "You didn't even click the ad! You're not studying anyway, now listen to my story!",
      duration: 3000,
    });
    
    onClose();
  };

  const handleAdClick = () => {
    toast({
      title: "Mom Says:",
      description: "I knew you couldn't resist! Back to work now.",
      duration: 3000,
    });
    
    onClose();
  };

  const moveCloseButton = (e: React.MouseEvent) => {
    // 25% chance the close button moves away when hovered
    if (Math.random() < 0.25) {
      const button = e.currentTarget as HTMLButtonElement;
      const container = button.parentElement?.parentElement;
      
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        // Random position within the container that's not overlapping the current position
        let newLeft = Math.random() * (containerRect.width - buttonRect.width);
        let newTop = Math.random() * (containerRect.height - buttonRect.height);
        
        // Ensure button stays within the container
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - buttonRect.width));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - buttonRect.height));
        
        button.style.position = 'absolute';
        button.style.left = `${newLeft}px`;
        button.style.top = `${newTop}px`;
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-popup">
      <div className={`neubrutalism-box ${currentAd.color} p-6 max-w-md w-full relative`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black uppercase">{currentAd.title}</h3>
          <button 
            onClick={handleCloseAd} 
            onMouseEnter={moveCloseButton}
            className="bg-white border-4 border-black p-2 z-10"
          >
            <X size={20} />
          </button>
        </div>
        
        {closingIn !== null && (
          <div className="absolute top-2 left-2 text-xs font-bold bg-white px-2 py-1 border-2 border-black">
            Close in {closingIn}s
          </div>
        )}
        
        <div className="neubrutalism-box bg-white p-4 mb-6">
          <div className="h-40 flex items-center justify-center border-2 border-black">
            <p className="font-bold text-lg text-center px-4">
              {currentAd.description}
            </p>
          </div>
        </div>
        
        <button 
          onClick={handleAdClick} 
          className="neubrutalism-button w-full bg-white"
        >
          Click Here Now!
        </button>
      </div>
    </div>
  );
};

export default AdComponent;
