
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Focus, Brain, Coffee } from 'lucide-react';
import MomAvatar from '@/components/MomAvatar';

const FocusModePage: React.FC = () => {
  // Fixed values that never change
  const focusSeconds = 0;
  const breathePhase = 'inhale';
  const distractionCount = 0;
  const isTimerRunning = false;
  const breatheCount = 0;
  const focusProgress = 0;
  
  // Static format time function
  const formatTime = () => {
    return "00:00";
  };

  // Static mom comment
  const getMomComment = () => {
    return "Too scared to start? Typical.";
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
                    <span>00:00</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-green"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Distractions</span>
                    <span>0</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-red"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm font-bold mb-1">
                    <span>Breathing Cycles</span>
                    <span>0</span>
                  </div>
                  <div className="h-4 bg-gray-200 border-2 border-black">
                    <div 
                      className="h-full bg-momento-blue"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="neubrutalism-box bg-momento-yellow p-6">
              <h2 className="font-black text-xl uppercase mb-4">Controls</h2>
              
              <div className="space-y-4">
                <button 
                  className="neubrutalism-button w-full bg-white flex items-center justify-center"
                >
                  <Focus className="mr-2 w-5 h-5" /> 
                  Start Focus
                </button>
                
                <button 
                  className="neubrutalism-button w-full bg-momento-pink text-black flex items-center justify-center"
                >
                  Reset Timer
                </button>
              </div>
            </div>
          </div>
          
          {/* Middle Column - Focus View */}
          <div className="md:col-span-2">
            <div className="neubrutalism-box bg-white p-6 h-full flex flex-col">
              <h2 className="font-black text-xl uppercase mb-6 text-center">Focus Zone</h2>
              
              {/* Breathing circle animation - now static */}
              <div className="flex justify-center mb-10">
                <div 
                  className="w-56 h-56 rounded-full flex items-center justify-center border-4 border-black"
                  style={{
                    backgroundColor: '#00C6FF',
                    boxShadow: '5px 5px 0px #000'
                  }}
                >
                  <span className="text-black font-black text-2xl uppercase">
                    Inhale
                  </span>
                </div>
              </div>
              
              {/* Focus time display - static */}
              <div className="text-center mb-8">
                <span className="font-black text-6xl neubrutalism-box bg-momento-green py-2 px-6 inline-block">
                  00:00
                </span>
              </div>
              
              {/* Mom's focus message - static */}
              <div className="mt-auto">
                <MomAvatar 
                  speaking={false} 
                  message={"Too scared to start? Typical."}
                  interactive={false}
                />
              </div>
              
              {/* Focus tips - static */}
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
