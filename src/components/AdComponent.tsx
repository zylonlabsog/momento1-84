
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import MomAvatar from '@/components/MomAvatar';

interface AdComponentProps {
  onClose: () => void;
  onAdClick: () => void;
  adIndex?: number;
  isUnskippable?: boolean;
  showCloseTimer?: number;
}

const AdComponent: React.FC<AdComponentProps> = ({ 
  onClose, 
  onAdClick, 
  adIndex: forcedAdIndex,
  isUnskippable = false,
  showCloseTimer = 0
}) => {
  const [adIndex] = useState(() => forcedAdIndex !== undefined ? forcedAdIndex : Math.floor(Math.random() * 5));
  const [closingIn, setClosingIn] = useState<number | null>(showCloseTimer > 0 ? showCloseTimer : null);
  const [showingMom, setShowingMom] = useState(false);
  
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

  const momNaggings = [
    "When I was your age, I studied 12 hours a day without breaks...",
    "Your cousin just got accepted to Harvard while studying in worse conditions...",
    "I saw on Facebook that your friend got promoted. What are YOU doing?",
    "Remember when you said you'd be a doctor by now? That was 5 years ago...",
    "I told all my friends you're extremely productive. Don't make me a liar...",
    "Are you even trying? This is why you'll never succeed in life!",
    "Your brother finished his PhD at your age. What's your excuse?",
    "I'm not angry, I'm just disappointed in your lack of focus.",
    "Back in my day, we didn't have fancy focus apps. We just focused!",
    "Your sister is managing three kids and a full-time job. You can't even manage this?",
    "I didn't raise you to be a quitter. But here we are...",
    "This is why your father and I are disappointed in you.",
    "You are not studying anyway, now listen to my story...",
  ];

  const currentAd = adTemplates[adIndex];
  const [currentNagging] = useState(momNaggings[Math.floor(Math.random() * momNaggings.length)]);

  useEffect(() => {
    if (closingIn !== null) {
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
  }, [closingIn]);

  const handleCloseAd = () => {
    if (isUnskippable) {
      toast({
        title: "Mom Says:",
        description: "Nice try! This ad is UNSKIPPABLE. You have to engage with it!",
        duration: 3000,
      });
      return;
    }
    
    toast({
      title: "Mom Says:",
      description: "You didn't even click the ad! You're not studying anyway, now listen to my story!",
      duration: 3000,
    });
    
    onClose();
  };

  const handleAdClick = () => {
    setShowingMom(true);
  };

  const handleCloseMom = () => {
    toast({
      title: "Mom Says:",
      description: "Fine! Go back to pretending to focus!",
      duration: 3000,
    });
    onAdClick();
  };

  const moveCloseButton = (e: React.MouseEvent) => {
    if (Math.random() < 0.8) { // Increased chance of button moving
      const button = e.currentTarget as HTMLButtonElement;
      const container = button.parentElement?.parentElement;
      
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        let newLeft = Math.random() * (containerRect.width - buttonRect.width);
        let newTop = Math.random() * (containerRect.height - buttonRect.height);
        
        newLeft = Math.max(0, Math.min(newLeft, containerRect.width - buttonRect.width));
        newTop = Math.max(0, Math.min(newTop, containerRect.height - buttonRect.height));
        
        button.style.position = 'absolute';
        button.style.left = `${newLeft}px`;
        button.style.top = `${newTop}px`;
      }
    }
  };

  if (showingMom) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 animate-popup">
        <div className="neubrutalism-box bg-momento-red p-6 max-w-md w-full relative">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-black uppercase text-white">Mom's Nagging Time</h3>
            <button 
              onClick={handleCloseMom} 
              className="bg-white border-4 border-black p-2"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="mb-6">
            <MomAvatar 
              speaking={true} 
              message={currentNagging}
              size="lg"
            />
          </div>
          
          <button onClick={handleCloseMom} className="neubrutalism-button w-full bg-white">
            Sorry, I'll Get Back to Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80 animate-popup">
      <div className={`neubrutalism-box ${currentAd.color} p-6 max-w-md w-full relative animate-pulse`}>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-black uppercase">{currentAd.title}</h3>
          {!isUnskippable && (
            <button 
              onClick={handleCloseAd} 
              onMouseEnter={moveCloseButton}
              className="bg-white border-4 border-black p-2 z-10"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {closingIn !== null && (
          <div className="absolute top-2 left-2 text-xs font-bold bg-white px-2 py-1 border-2 border-black">
            {isUnskippable ? "Unskippable" : `Close in ${closingIn}s`}
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
          className="neubrutalism-button w-full bg-white animate-bounce"
        >
          Click Here Now!
        </button>
      </div>
    </div>
  );
};

export default AdComponent;
