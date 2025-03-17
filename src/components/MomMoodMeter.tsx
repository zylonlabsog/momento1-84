import React from 'react';
import { useMomento } from '@/context/MomentoContext';
import { Heart } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import MomAvatar from '@/components/MomAvatar';

const USELESS_TASKS = [
  "Alphabetize your spice rack",
  "Count how many red cars pass by your window",
  "Organize your sock drawer by color",
  "Research the history of paperclips",
  "Make a list of all the places you've never been to",
  "Rename all your digital files with emoji prefixes",
  "Create a playlist for plants",
  "Organize your books by color instead of author",
  "Write a poem about your vacuum cleaner",
  "Learn to say 'procrastination' in 5 different languages",
  "Design a new logo for your personal brand",
  "Make paper airplanes from old receipts",
  "Practice your signature with your non-dominant hand",
  "Create a tier list of breakfast cereals",
  "Reorganize your apps by icon color"
];

const MOM_NAGS = [
  "Really? THAT'S what you're choosing to do with your time?",
  "Your cousin would have finished three REAL tasks by now.",
  "I didn't raise you to waste time like this!",
  "This is why you never accomplish anything meaningful.",
  "And you wonder why you're always behind on everything?",
  "When I was your age, I would never waste time like this.",
  "Do you think successful people alphabetize their spices?",
  "I'm not mad, I'm just disappointed in your choices.",
  "This is exactly why your room was always a mess growing up.",
  "You get this from your father's side of the family.",
  "I should have known this is how you'd spend your day."
];

const MomMoodMeter: React.FC = () => {
  const { momAngerLevel } = useMomento();
  const [uselessTaskDialogOpen, setUselessTaskDialogOpen] = React.useState(false);
  const [currentUselessTask, setCurrentUselessTask] = React.useState("");
  const [momNaggingResponse, setMomNaggingResponse] = React.useState("");
  const [showMomAvatar, setShowMomAvatar] = React.useState(false);
  
  const getMoodColor = () => {
    if (momAngerLevel < 30) return 'bg-momento-red';
    if (momAngerLevel < 60) return 'bg-momento-yellow';
    return 'bg-momento-green';
  };
  
  const getMoodLabel = () => {
    if (momAngerLevel < 20) return 'Furious';
    if (momAngerLevel < 35) return 'Disappointed';
    if (momAngerLevel < 50) return 'Judging You';
    if (momAngerLevel < 70) return 'Tolerating You';
    if (momAngerLevel < 85) return 'Almost Proud';
    return 'Momentarily Proud';
  };
  
  const handleUselessTaskClick = () => {
    setCurrentUselessTask(USELESS_TASKS[0]);
    setUselessTaskDialogOpen(true);
  };
  
  const handleTaskCompletedClick = () => {
    setMomNaggingResponse(MOM_NAGS[0]);
    setShowMomAvatar(true);
    
    setTimeout(() => {
      setUselessTaskDialogOpen(false);
    }, 4000);
  };
  
  return (
    <div className="mt-4">
      <div className="flex justify-between items-center text-sm font-bold mb-2">
        <span className="flex items-center">
          Mom's Mood: <Heart className="w-5 h-5 text-momento-green ml-1" />
        </span>
        <span className={`px-2 py-1 ${getMoodColor()} border-2 border-black flex items-center`}>
          {getMoodLabel()}
        </span>
      </div>
      
      <Progress 
        value={momAngerLevel} 
        className="h-4 border-2 border-black" 
        indicatorClassName={`${getMoodColor()} transition-all duration-300`}
      />
      
      {uselessTaskDialogOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="border-2 border-black max-w-md bg-white p-6">
            <h3 className="text-center text-lg font-bold">Try This Instead!</h3>
            
            <div className="py-4">
              <p className="text-lg font-bold text-center mb-4">{currentUselessTask}</p>
              
              {showMomAvatar ? (
                <div className="flex flex-col items-center">
                  <MomAvatar speaking={true} size="md" />
                  <div className="mt-3 p-3 bg-momento-red/20 rounded-lg border-2 border-black">
                    <p className="font-bold text-black">{momNaggingResponse}</p>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center mt-2">
                  <button 
                    onClick={handleTaskCompletedClick}
                    className="border-2 border-black bg-momento-pink hover:bg-momento-pink/80 text-black font-bold p-2"
                  >
                    I Did This Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MomMoodMeter;
