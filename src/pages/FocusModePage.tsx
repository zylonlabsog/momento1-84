
import React, { useState } from 'react';
import { useMomento } from '@/context/MomentoContext';
import MomAvatar from '@/components/MomAvatar';
import { FastForward, Rewind, ArrowLeft, Focus, Clock, Zap, Timer, Brain, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

const FocusModePage: React.FC = () => {
  const { momAngerLevel } = useMomento();
  const [focusSeconds, setFocusSeconds] = useState(0);
  const [breathePhase, setBreathePhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [distractionCount, setDistractionCount] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [breatheCount, setBreatheCount] = useState(0);
  const [showAd, setShowAd] = useState(false);
  
  // Calculate real-time progress
  const focusProgress = Math.min(100, (focusSeconds / 1500) * 100); // 25 minutes (1500 seconds) is 100%

  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleReset = () => {
    setFocusSeconds(0);
    setIsTimerRunning(false);
    setDistractionCount(0);
    setBreatheCount(0);
  };

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getMomComment = () => {
    if (!isTimerRunning) {
      return "Too scared to start? Typical.";
    } else if (focusSeconds < 60) {
      return "Finally decided to focus? Let's see how long you last...";
    } else if (focusSeconds < 300) {
      return "Five minutes? That's all you can manage?";
    } else if (focusSeconds < 600) {
      return "Your cousin could focus for HOURS when they were half your age.";
    } else {
      return "Not bad... for you, I guess.";
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f0] p-6 cursor-default overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-md border-4 border-black bg-white"
            style={{
              width: `${40 + Math.random() * 60}px`,
              height: `${40 + Math.random() * 60}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 30 - 15}deg)`,
              backgroundColor: ['#FFD600', '#FF61D8', '#00C6FF', '#00FF9E'][i % 4],
              zIndex: 0
            }}
          ></div>
        ))}
      </div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <Link to="/" className="neubrutalism-button bg-momento-yellow mb-10 inline-flex items-center">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Tasks
        </Link>

        <div className="neubrutalism-box bg-momento-red p-6 mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-center uppercase tracking-wide mb-4">
            FOCUS MODE
          </h1>
          <p className="text-center font-bold text-lg">Because Mom wants to sabotage you</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Stats & Timer */}
          <div className="md:col-span-1">
            <div className="neubrutalism-box bg-white p-6 mb-6">
              <h2 className="font-black text-xl uppercase mb-4">Stats</h2>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Focus Time</span>
                    <span>{formatTime(focusSeconds)}</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-green transition-all duration-500"
                      style={{ width: `${focusProgress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Distractions</span>
                    <span>{distractionCount}</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-red transition-all"
                      style={{ width: `${Math.min(100, distractionCount * 10)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Breathing Cycles</span>
                    <span>{breatheCount}</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-blue transition-all"
                      style={{ width: `${Math.min(100, breatheCount * 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="neubrutalism-box bg-momento-yellow p-6">
              <h2 className="font-black text-xl uppercase mb-4">Controls</h2>
              
              <div className="space-y-4">
                <button 
                  onClick={toggleTimer}
                  className="neubrutalism-button w-full bg-white flex items-center justify-center"
                >
                  {isTimerRunning ? (
                    <>
                      <Timer className="mr-2 w-5 h-5" /> 
                      Pause Focus
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 w-5 h-5" /> 
                      Start Focus
                    </>
                  )}
                </button>
                
                <button 
                  onClick={handleReset}
                  className="neubrutalism-button w-full bg-momento-pink text-black flex items-center justify-center"
                >
                  <Clock className="mr-2 w-5 h-5" /> 
                  Reset Timer
                </button>
              </div>
            </div>
          </div>
          
          {/* Middle Column - Focus View */}
          <div className="md:col-span-2">
            <div className="neubrutalism-box bg-white p-6 h-full flex flex-col">
              <h2 className="font-black text-xl uppercase mb-6 text-center">Focus Zone</h2>
              
              {/* Breathing circle animation */}
              <div className="flex justify-center mb-10">
                <div 
                  className="w-56 h-56 rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out border-4 border-black"
                  style={{
                    backgroundColor: breathePhase === 'inhale' 
                      ? '#00C6FF'
                      : breathePhase === 'hold'
                      ? '#00FF9E'
                      : '#FFD600',
                    transform: 'scale(1)',
                    boxShadow: '5px 5px 0px #000'
                  }}
                >
                  <span className="text-black font-black text-2xl uppercase">
                    {breathePhase === 'inhale' ? 'Inhale' : breathePhase === 'hold' ? 'Hold' : 'Exhale'}
                  </span>
                </div>
              </div>
              
              {/* Focus time display */}
              <div className="text-center mb-8">
                <span className="font-black text-6xl neubrutalism-box bg-momento-green py-2 px-6 inline-block">
                  {formatTime(focusSeconds)}
                </span>
              </div>
              
              {/* Mom's focus message */}
              <div className="mt-auto">
                <MomAvatar 
                  speaking={true} 
                  message={getMomComment()}
                  interactive={true}
                />
              </div>
              
              {/* Focus tips */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 border-4 border-black bg-momento-yellow">
                  <Brain className="w-8 h-8 text-black shrink-0" />
                  <p className="font-medium text-sm">Focus on one task at a time</p>
                </div>
                
                <div className="flex items-center gap-3 p-3 border-4 border-black bg-momento-green">
                  <Coffee className="w-8 h-8 text-black shrink-0" />
                  <p className="font-medium text-sm">Take breaks every 25 minutes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusModePage;
