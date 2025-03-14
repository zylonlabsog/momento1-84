
import React, { useState, useEffect } from 'react';
import { MomentoProvider, useMomento } from '@/context/MomentoContext';
import MomAvatar from '@/components/MomAvatar';
import TaskInput from '@/components/TaskInput';
import FakeChoice from '@/components/FakeChoice';
import SabotageEvents from '@/components/SabotageEvents';

const MomentoApp: React.FC = () => {
  const { stage, setStage } = useMomento();
  const [welcomeMessage, setWelcomeMessage] = useState("Oh, look who finally decided to be productive. Took you long enough.");
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [buttonMoved, setButtonMoved] = useState(false);
  
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
  
  return (
    <div className="min-h-screen bg-[#f0f0f0] p-6 cursor-default">
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
          <p className="text-center font-bold text-lg mt-2">The To-Do App That Judges You</p>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto">
        {stage === 'welcome' && (
          <div className="flex flex-col items-center justify-center py-10">
            <MomAvatar size="lg" speaking={true} message={welcomeMessage} />
            
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
          </div>
        )}
        
        {stage === 'taskInput' && <TaskInput />}
        {stage === 'fakeChoice' && <FakeChoice />}
        
        {/* Sabotage events are always present but conditionally displayed */}
        <SabotageEvents />
      </main>
      
      <footer className="mt-10 max-w-4xl mx-auto text-center">
        <p className="font-medium text-gray-700">
          Mom is watching your (lack of) productivity.
        </p>
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
