
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppStage, MomentoContextType, MomCriticism, SabotageEvent } from '@/types';
import { toast } from '@/components/ui/use-toast';

const CRITICISMS: MomCriticism[] = [
  { text: "Ugh, this is so basic. You're better than this.", severity: 'mild' },
  { text: "Too easy. Try something harder.", severity: 'medium' },
  { text: "LMAO, you think you'll actually do this?", severity: 'harsh' },
  { text: "Wow, another task you'll abandon. Classic you.", severity: 'medium' },
  { text: "I can already tell you're going to procrastinate on this one too.", severity: 'harsh' },
  { text: "Let me guess, you'll 'do it tomorrow' right?", severity: 'mild' },
  { text: "Your ambition is adorable but unrealistic.", severity: 'medium' },
  { text: "Oh honey, we both know this isn't happening.", severity: 'harsh' },
  { text: "This is why you never finish anything.", severity: 'harsh' },
];

const SABOTAGE_EVENTS: SabotageEvent[] = [
  {
    id: 'trivia1',
    type: 'reminder',
    message: "Hey, did you know that lobsters pee from their faces?",
    triggered: false
  },
  {
    id: 'trivia2',
    type: 'reminder',
    message: "Ever wonder how deep the ocean is? Maybe you should Google it now.",
    triggered: false
  },
  {
    id: 'trivia3',
    type: 'reminder',
    message: "What happens if you microwave an egg? Maybe try it instead of working.",
    triggered: false
  },
  {
    id: 'jumpScare1',
    type: 'jumpScare',
    message: "I KNOW YOU'RE PROCRASTINATING. GET BACK TO WORK.",
    triggered: false
  },
  {
    id: 'fakeProgress1',
    type: 'fakeProgress',
    message: "99% Completed... Error: Productivity Not Found. Try Again.",
    triggered: false
  },
];

// Create the context with a default undefined value
const MomentoContext = createContext<MomentoContextType | undefined>(undefined);

export const MomentoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStage] = useState<AppStage>('welcome');
  const [taskInput, setTaskInput] = useState<string>('');
  const [criticisms] = useState<MomCriticism[]>(CRITICISMS);
  const [selectedCriticism, setSelectedCriticism] = useState<MomCriticism | null>(null);
  const [sabotageEvents, setSabotageEvents] = useState<SabotageEvent[]>(SABOTAGE_EVENTS);

  // Function to trigger a random criticism
  const triggerCriticism = () => {
    const randomIndex = Math.floor(Math.random() * criticisms.length);
    setSelectedCriticism(criticisms[randomIndex]);
    
    // Reset after showing criticism
    setTimeout(() => {
      setTaskInput('');
    }, 2500);
  };

  // Function to trigger a random sabotage event
  const triggerRandomSabotage = () => {
    const availableEvents = sabotageEvents.filter(event => !event.triggered);
    
    if (availableEvents.length === 0) {
      // Reset all events if all have been triggered
      setSabotageEvents(sabotageEvents.map(event => ({ ...event, triggered: false })));
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    const selectedEvent = availableEvents[randomIndex];
    
    // Mark this event as triggered
    setSabotageEvents(sabotageEvents.map(event => 
      event.id === selectedEvent.id ? { ...event, triggered: true } : event
    ));
    
    // Display the sabotage event
    toast({
      title: "Mom Says:",
      description: selectedEvent.message,
      duration: 5000,
    });
    
    // If it's a jumpScare, also play a sound
    if (selectedEvent.type === 'jumpScare') {
      // We'd add sound here if implementing sound
      document.body.classList.add('animate-shake');
      setTimeout(() => {
        document.body.classList.remove('animate-shake');
      }, 500);
    }
  };

  // Set up random sabotage events
  useEffect(() => {
    const sabotageInterval = setInterval(() => {
      if (stage !== 'welcome') {
        triggerRandomSabotage();
      }
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(sabotageInterval);
  }, [stage]);

  // Reset function
  const resetApp = () => {
    setStage('welcome');
    setTaskInput('');
    setSelectedCriticism(null);
    setSabotageEvents(SABOTAGE_EVENTS);
  };

  const value = {
    stage,
    setStage,
    taskInput,
    setTaskInput,
    criticisms,
    selectedCriticism,
    triggerCriticism,
    sabotageEvents,
    triggerRandomSabotage,
    resetApp
  };

  return <MomentoContext.Provider value={value}>{children}</MomentoContext.Provider>;
};

// Custom hook to use the Momento context
export const useMomento = (): MomentoContextType => {
  const context = useContext(MomentoContext);
  if (context === undefined) {
    throw new Error('useMomento must be used within a MomentoProvider');
  }
  return context;
};
