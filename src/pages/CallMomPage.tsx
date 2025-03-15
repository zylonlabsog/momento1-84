
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Phone } from 'lucide-react';

const CallMomPage: React.FC = () => {
  useEffect(() => {
    // Set the title when component mounts
    document.title = "Calling Mom - Momento";
    
    return () => {
      // Reset title when component unmounts
      document.title = "Momento - The To-Do App That Judges You Like Your Mom";
    };
  }, []);

  return (
    <div className="min-h-screen p-6 bg-momento-yellow bg-opacity-10">
      <div className="max-w-4xl mx-auto">
        <Link 
          to="/"
          className="neubrutalism-button bg-white mb-6 inline-flex items-center"
        >
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Home
        </Link>
        
        <div className="neubrutalism-box bg-white p-8">
          <h1 className="text-4xl font-black mb-6 text-center uppercase">
            Call Mom
          </h1>
          
          <p className="text-lg mb-8 text-center">
            Ready to get judged in real-time? Talk to Mom directly!
          </p>
          
          <div className="p-4 bg-momento-pink bg-opacity-10 rounded-lg mb-8">
            <p className="font-medium text-center text-gray-700">
              Mom is ready to hear all about your excuses and procrastination habits.
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="neubrutalism-box bg-momento-purple p-6 transform rotate-1">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Phone className="w-10 h-10 text-white animate-pulse" />
              </div>
              <p className="text-white font-bold text-center">
                Click below to start a call with Mom
              </p>
            </div>
          </div>
          
          <div className="call-mom-container min-h-[400px] border-4 border-black relative overflow-hidden">
            <iframe 
              src="https://elevenlabs.io/speech-synthesis" 
              className="w-full h-[400px] border-0"
              title="Call with Mom"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallMomPage;
