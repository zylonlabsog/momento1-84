
import React, { useState, useEffect } from 'react';
import { MomentoProvider, useMomento } from '@/context/MomentoContext';
import MomAvatar from '@/components/MomAvatar';
import TaskInput from '@/components/TaskInput';
import FakeChoice from '@/components/FakeChoice';
import SabotageEvents from '@/components/SabotageEvents';
import ConfirmExit from '@/components/ConfirmExit';
import InstallAppBanner from '@/components/InstallAppBanner';
import MomMoodMeter from '@/components/MomMoodMeter';
import FocusMode from '@/components/FocusMode';
import { Brain, Coffee, Calendar, Sparkles } from 'lucide-react';

const MomentoApp: React.FC = () => {
  const { stage, setStage, attemptToExit } = useMomento();
  const [welcomeMessage, setWelcomeMessage] = useState("Oh, look who finally decided to be productive. Took you long enough.");
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [buttonMoved, setButtonMoved] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  // Move start button away from cursor when hovered
  const handleStartButtonHover = () => {
    if (!buttonMoved) {
      const newX = Math.floor(Math.random() * 100) - 50;
      const newY = Math.floor(Math.random() * 30) - 15;
      setButtonPosition({ x: newX, y: newY });
      setButtonMoved(true);
      
      // Reset after short delay so user can try again
      setTimeout(() => {
        setButtonMoved(false);
      }, 700);
    }
  };
  
  const handleStartClick = () => {
    setStage('taskInput');
  };
  
  // Add a glitchy screen shake on load
  useEffect(() => {
    document.body.classList.add('animate-jitter');
    setTimeout(() => {
      document.body.classList.remove('animate-jitter');
    }, 1000);
  }, []);

  // Add event listeners for beforeunload and keydown (Escape)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      attemptToExit();
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        attemptToExit();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [attemptToExit]);
  
  // Update the title to include "The To-Do App That Judges You Like Your Mom"
  useEffect(() => {
    document.title = "Momento - The To-Do App That Judges You Like Your Mom";
  }, []);
  
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-6 cursor-default">
      <InstallAppBanner />
      
      <header className="max-w-4xl mx-auto pt-6 pb-10">
        <div className="neubrutalism-box bg-momento-blue p-4 mb-6">
          <h1 className="text-4xl md:text-6xl font-black text-center uppercase tracking-wide">
            <span className="inline-block animate-float">M</span>
            <span className="inline-block animate-float" style={{ animationDelay: '0.1s' }}>o</span>
            <span className="inline-block animate-float" style={{ animationDelay: '0.2s' }}>m</span>
            <span className="inline-block animate-float" style={{ animationDelay: '0.3s' }}>e</span>
            <span className="inline-block animate-float" style={{ animationDelay: '0.4s' }}>n</span>
            <span className="inline-block animate-float" style={{ animationDelay: '0.5s' }}>t</span>
            <span className="inline-block animate-float" style={{ animationDelay: '0.6s' }}>o</span>
          </h1>
          <p className="text-center font-bold text-lg mt-2">The To-Do App That Judges You Like Your Mom</p>
          
          {/* Mom Mood Meter */}
          <div className="mt-4">
            <MomMoodMeter />
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {stage === 'welcome' && (
          <div className="flex flex-col items-center justify-center py-10">
            <MomAvatar size="lg" speaking={true} message={welcomeMessage} interactive={true} />
            
            <div className="mt-16 relative">
              <button
                className="neubrutalism-button text-xl bg-momento-yellow"
                style={{
                  transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
                  transition: 'transform 0.2s ease-out'
                }}
                onMouseEnter={handleStartButtonHover}
                onClick={handleStartClick}
              >
                Start Being Productive
              </button>
            </div>
            
            {/* Focus Mode Button - Available in welcome screen */}
            <div className="mt-8">
              <FocusMode />
            </div>
            
            {/* Fun Neubrutalism UI Elements */}
            <div className="w-full max-w-md mt-16">
              <button 
                onClick={() => setShowTips(!showTips)}
                className="neubrutalism-button w-full bg-momento-purple mb-4"
              >
                {showTips ? "Hide Mom's Tips" : "Show Mom's Tips"}
              </button>
              
              {showTips && (
                <div className="neubrutalism-box bg-white p-6 animate-popup">
                  <h3 className="font-black text-xl mb-4 uppercase">Mom's Productivity Tips</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border-2 border-black bg-momento-yellow">
                      <Brain className="w-8 h-8 text-black shrink-0" />
                      <p className="font-medium">Your cousin finished their PhD at age 12. What's your excuse?</p>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border-2 border-black bg-momento-green">
                      <Coffee className="w-8 h-8 text-black shrink-0" />
                      <p className="font-medium">Coffee breaks are for the weak. I raised 4 kids without sleep.</p>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border-2 border-black bg-momento-pink">
                      <Calendar className="w-8 h-8 text-black shrink-0" />
                      <p className="font-medium">You've been procrastinating since 2015. That's a record!</p>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border-2 border-black bg-momento-blue">
                      <Sparkles className="w-8 h-8 text-black shrink-0" />
                      <p className="font-medium">Have you considered a career in professional disappointment?</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {stage === 'taskInput' && (
          <>
            <TaskInput />
            {/* Focus Mode Button - Also available in task input screen */}
            <div className="flex justify-center mt-6">
              <FocusMode />
            </div>
          </>
        )}
        
        {stage === 'fakeChoice' && <FakeChoice />}
        
        {/* Sabotage events are always present but conditionally displayed */}
        <SabotageEvents />
        
        {/* Exit confirmation dialog */}
        <ConfirmExit />
      </main>
      
      <footer className="mt-10 max-w-4xl mx-auto text-center">
        <p className="font-medium text-gray-700">
          Mom is watching your (lack of) productivity.
        </p>
        <button 
          onClick={attemptToExit}
          className="mt-4 text-gray-500 underline hover:text-gray-700"
        >
          I Give Up
        </button>
        
        {/* Cool Neubrutalism decorative elements */}
        <div className="flex justify-center gap-3 mt-6">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i}
              className="w-8 h-8 border-2 border-black"
              style={{ 
                backgroundColor: ['#FFD600', '#FF61D8', '#00C6FF', '#00FF9E', '#FF4D4D'][i],
                transform: `rotate(${Math.random() * 10 - 5}deg)`
              }}
            ></div>
          ))}
        </div>
      </footer>
    </div>
  );
};

const Index: React.FC = () => (
  <MomentoProvider>
    <MomentoApp />
  </MomentoProvider>
);

export default Index;
