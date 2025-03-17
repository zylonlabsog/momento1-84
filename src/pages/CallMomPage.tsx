
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowDown } from 'lucide-react';

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
          
          <p className="text-lg mb-4 text-center">
            Ready to get judged in real-time? Talk to Mom directly!
          </p>
          
          <p className="font-medium text-center text-gray-700 mb-8">
            Mom is ready to hear all about your excuses and procrastination habits.
          </p>
          
          <div className="flex justify-center mb-4">
            <ArrowDown className="w-12 h-12 text-momento-purple animate-bounce" />
          </div>
          
          <div className="call-mom-container min-h-[400px] border-4 border-black relative overflow-hidden flex justify-center items-center p-4">
            <p className="text-xl font-bold text-center">Mom is currently unavailable for calls.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallMomPage;
