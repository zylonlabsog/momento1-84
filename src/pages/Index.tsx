import React, { useState, useEffect } from 'react';
import { MomentoProvider, useMomento } from '@/context/MomentoContext';
import MomAvatar from '@/components/MomAvatar';
import TaskInput from '@/components/TaskInput';
import FakeChoice from '@/components/FakeChoice';
import SabotageEvents from '@/components/SabotageEvents';
import InstallAppBanner from '@/components/InstallAppBanner';
import MomMoodMeter from '@/components/MomMoodMeter';
import FocusMode from '@/components/FocusMode';
import SoundControls from '@/components/SoundControls';
import { Brain, Coffee, Calendar, Sparkles, Skull, ListTodo, Phone } from 'lucide-react';
import { audioManager } from '@/utils/audioManager';
import { Link } from 'react-router-dom';

const MomentoApp: React.FC = () => {
  const { stage, setStage } = useMomento();
  const [welcomeMessage, setWelcomeMessage] = useState("Oh, look who finally decided to be productive. Took you long enough.");
  const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0 });
  const [buttonMoved, setButtonMoved] = useState(false);
  const [showTips, setShowTips] = useState(false);
  
  const handleStartButtonHover = () => {
    if (!buttonMoved) {
      const newX = Math.floor(Math.random() * 100) - 50;
      const newY = Math.floor(Math.random() * 30) - 15;
      setButtonPosition({ x: newX, y: newY });
      setButtonMoved(true);
      
      audioManager.playSound('error');
      
      setTimeout(() => {
        setButtonMoved(false);
      }, 700);
    }
  };
  
  const handleStartClick = () => {
    audioManager.playSound('click');
    setStage('taskInput');
  };
  
  useEffect(() => {
    document.body.classList.add('animate-jitter');
    setTimeout(() => {
      document.body.classList.remove('animate-jitter');
    }, 1000);
    
    setTimeout(() => {
      audioManager.playBackgroundMusic();
    }, 1000);
  }, []);
  
  useEffect(() => {
    document.title = "Momento - The To-Do App That Judges You Like Your Mom";
  }, []);
  
  return (
    <div className="min-h-screen p-6 cursor-default relative overflow-hidden">
      <div className="floating-shape w-16 h-16 bg-momento-yellow top-[10%] left-[5%]"></div>
      <div className="floating-shape w-10 h-10 bg-momento-pink top-[30%] right-[8%]"></div>
      <div className="floating-shape w-14 h-14 bg-momento-blue bottom-[15%] left-[10%]"></div>
      <div className="floating-shape w-12 h-12 bg-momento-green bottom-[25%] right-[12%]"></div>
      <div className="floating-shape w-8 h-8 bg-momento-red top-[60%] left-[15%]"></div>
      <div className="floating-shape w-20 h-20 bg-momento-purple opacity-20 bottom-[10%] right-[5%]"></div>
      
      <InstallAppBanner />
      
      <header className="max-w-4xl mx-auto pt-6 pb-10 relative z-10">
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
          
          <div className="mt-2 flex items-center justify-center gap-2">
            <p className="text-center font-bold text-sm md:text-base bg-momento-black bg-opacity-10 px-3 py-1 rounded-full">
              Made by Jagrit Sachdev <Skull className="w-4 h-4 inline-block animate-pulse text-momento-red" /> The Best Productivity App You'll Ever Find
            </p>
          </div>
          
          <div className="mt-4">
            <MomMoodMeter />
          </div>
          
          <div className="mt-4 flex justify-center">
            <SoundControls />
          </div>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto relative z-10">
        {stage === 'welcome' && (
          <div className="flex flex-col items-center justify-center py-10">
            <MomAvatar size="lg" speaking={true} message={welcomeMessage} interactive={true} />
            
            <div className="mt-16 relative flex flex-col gap-4 items-center">
              <button
                className="neubrutalism-button text-xl bg-momento-yellow flex items-center"
                style={{
                  transform: `translate(${buttonPosition.x}px, ${buttonPosition.y}px)`,
                  transition: 'transform 0.2s ease-out'
                }}
                onMouseEnter={handleStartButtonHover}
                onClick={handleStartClick}
              >
                <ListTodo className="mr-2 w-6 h-6" />
                Add a Task
              </button>
              
              <button 
                onClick={() => {
                  audioManager.playSound('click');
                  const uselessTaskButton = document.querySelector('[data-useless-task-button]');
                  if (uselessTaskButton) {
                    (uselessTaskButton as HTMLButtonElement).click();
                  }
                }}
                className="neubrutalism-button bg-momento-purple text-white flex items-center"
              >
                <Coffee className="mr-2 w-5 h-5" />
                Recommend a Task
              </button>
              
              <Link 
                to="/call-mom"
                className="neubrutalism-button bg-momento-red text-white flex items-center"
                onClick={() => audioManager.playSound('click')}
              >
                <Phone className="mr-2 w-5 h-5" />
                Call Mom
              </Link>
            </div>
            
            <div className="mt-8">
              <FocusMode />
            </div>
            
            <div className="w-full max-w-md mt-16">
              <button 
                onClick={() => {
                  setShowTips(!showTips);
                  audioManager.playSound('click');
                }}
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
            <div className="flex justify-center mt-6">
              <FocusMode />
            </div>
          </>
        )}
        
        {stage === 'fakeChoice' && <FakeChoice />}
        
        <SabotageEvents />
      </main>
      
      <footer className="mt-10 max-w-4xl mx-auto text-center relative z-10">
        <p className="font-medium text-gray-700">
          Mom is watching your (lack of) productivity.
        </p>
        
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
