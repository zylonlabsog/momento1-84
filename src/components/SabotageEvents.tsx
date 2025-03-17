
import React, { useState } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from './MomAvatar';
import { X } from 'lucide-react';

const SabotageEvents: React.FC = () => {
  const { stage } = useMomento();
  const [showDistraction, setShowDistraction] = useState(false);
  const [showGuiltTrip, setShowGuiltTrip] = useState(false);
  const [currentGuiltMessage, setCurrentGuiltMessage] = useState(0);
  
  const guiltMessages = [
    "Your friends are making money while you scroll.",
    "Your childhood self would be disappointed.",
    "Your teachers are gossiping about how lazy you are.",
    "Everyone you know is working harder than you."
  ];

  const handleDistractionClose = () => {
    setShowDistraction(false);
  };

  const handleGuiltTripAction = () => {
    setShowGuiltTrip(false);
  };

  return (
    <>
      {showDistraction && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-popup">
          <div className="neubrutalism-box bg-momento-yellow p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-black uppercase">Take a Break!</h2>
              <button onClick={handleDistractionClose} className="bg-momento-red border-2 border-black p-2">
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <MomAvatar 
                speaking={true} 
                message="Brooo, nahhh. Take a break first! Have you seen this new Netflix show?"
              />
            </div>
            
            <div className="neubrutalism-box bg-white p-4 mb-6">
              <p className="font-bold text-lg">Random Internet Distraction</p>
              <div className="h-48 bg-gray-200 border-2 border-black mt-2 flex items-center justify-center">
                <p className="text-gray-500">A very distracting video would go here...</p>
              </div>
            </div>
            
            <p className="font-medium text-center mb-4">
              Come back when you're ready to actually focus. LOL.
            </p>
            
            <button onClick={handleDistractionClose} className="neubrutalism-button w-full">
              I'll Try to Focus Again
            </button>
          </div>
        </div>
      )}
      
      {showGuiltTrip && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 animate-popup">
          <div className="neubrutalism-box bg-momento-red p-6 max-w-lg w-full">
            <h2 className="text-2xl font-black uppercase text-white mb-6 text-center">GUILT TRIP MODE</h2>
            
            <div className="mb-8">
              <MomAvatar 
                speaking={true} 
                message="BROOO. STUDY, MAN! USELESS PERSON."
              />
            </div>
            
            <div className="bg-black border-4 border-white p-4 mb-6">
              <p className="font-bold text-xl text-white animate-pulse">
                {guiltMessages[currentGuiltMessage]}
              </p>
            </div>
            
            <button 
              onClick={handleGuiltTripAction} 
              className="neubrutalism-button w-full bg-momento-red border-white text-white"
            >
              Fine, I'll Work
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SabotageEvents;
