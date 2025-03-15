
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppStage, MomentoContextType, MomCriticism, SabotageEvent } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { audioManager } from '@/utils/audioManager';
import { useNavigate } from 'react-router-dom';

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
  { text: "My neighbor's kid finishes 10 tasks before breakfast.", severity: 'medium' },
  { text: "That's it? That's the big plan for today?", severity: 'mild' },
  { text: "You call that a task? I call it a joke.", severity: 'harsh' },
  { text: "I didn't raise you to be this unproductive.", severity: 'medium' },
  { text: "When I was your age, I juggled three jobs AND raised you.", severity: 'harsh' },
  { text: "Your cousin would have finished this already.", severity: 'medium' },
  { text: "Are you allergic to actual work?", severity: 'harsh' },
  { text: "This task will join the graveyard of your abandoned projects.", severity: 'medium' },
];

const SABOTAGE_EVENTS: SabotageEvent[] = [
  { id: 'trivia1', type: 'reminder', message: "Hey, did you know that lobsters pee from their faces?", triggered: false },
  { id: 'trivia2', type: 'reminder', message: "Ever wonder how deep the ocean is? Maybe you should Google it now.", triggered: false },
  { id: 'trivia3', type: 'reminder', message: "What happens if you microwave an egg? Maybe try it instead of working.", triggered: false },
  { id: 'jumpScare1', type: 'jumpScare', message: "I KNOW YOU'RE PROCRASTINATING. GET BACK TO WORK.", triggered: false },
  { id: 'fakeProgress1', type: 'fakeProgress', message: "99% Completed... Error: Productivity Not Found. Try Again.", triggered: false },
  { id: 'comparison1', type: 'reminder', message: "Your friend just got promoted while you're sitting here.", triggered: false },
  { id: 'phoneCall1', type: 'reminder', message: "Did you call your grandma yet? She's been waiting.", triggered: false },
  { id: 'jumpScare2', type: 'jumpScare', message: "HEY! EYES ON THE SCREEN! FOCUS!", triggered: false },
  { id: 'fakeProgress2', type: 'fakeProgress', message: "Task almost done... Oops, server crash. Start over!", triggered: false },
  { id: 'passive1', type: 'reminder', message: "Your friends are working right now. What are YOU doing?", triggered: false },
  { id: 'passive2', type: 'reminder', message: "Your childhood self would be disappointed.", triggered: false },
  { id: 'passive3', type: 'reminder', message: "You're getting outworked by a 12-year-old entrepreneur.", triggered: false },
  { id: 'passive4', type: 'reminder', message: "Everyone else is achieving their dreams while you're here.", triggered: false },
  { id: 'passive5', type: 'reminder', message: "That deadline isn't going to meet itself, you know.", triggered: false },
];

const MomentoContext = createContext<MomentoContextType | undefined>(undefined);

export const MomentoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stage, setStage] = useState<AppStage>('welcome');
  const [taskInput, setTaskInput] = useState<string>('');
  const [criticisms] = useState<MomCriticism[]>(CRITICISMS);
  const [selectedCriticism, setSelectedCriticism] = useState<MomCriticism | null>(null);
  const [sabotageEvents, setSabotageEvents] = useState<SabotageEvent[]>(SABOTAGE_EVENTS);
  const [momAngerLevel, setMomAngerLevel] = useState<number>(0); // Start with zero anger
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [isExploding, setIsExploding] = useState<boolean>(false);
  const navigate = useNavigate();

  const triggerCriticism = () => {
    const randomIndex = Math.floor(Math.random() * criticisms.length);
    setSelectedCriticism(criticisms[randomIndex]);
    
    setTimeout(() => {
      setTaskInput('');
    }, 2500);
    
    // Increase mom's anger level with each criticism
    setMomAngerLevel(prev => Math.min(100, prev + 10));
    
    // Play sound if effects are enabled
    audioManager.playSound('sigh');
  };

  const triggerRandomSabotage = () => {
    const availableEvents = sabotageEvents.filter(event => !event.triggered);
    
    if (availableEvents.length === 0) {
      setSabotageEvents(sabotageEvents.map(event => ({ ...event, triggered: false })));
      return;
    }
    
    const randomIndex = Math.floor(Math.random() * availableEvents.length);
    const selectedEvent = availableEvents[randomIndex];
    
    setSabotageEvents(sabotageEvents.map(event => 
      event.id === selectedEvent.id ? { ...event, triggered: true } : event
    ));
    
    toast({
      title: "Mom Says:",
      description: selectedEvent.message,
      duration: 5000,
    });
    
    if (selectedEvent.type === 'jumpScare') {
      document.body.classList.add('animate-shake');
      setTimeout(() => {
        document.body.classList.remove('animate-shake');
      }, 500);
      
      // Play scary sound for jump scares
      audioManager.playSound('angry');
    } else {
      // Play sabotage sound for other events
      audioManager.playSound('sabotage');
    }
    
    // Increase mom's anger level with each sabotage
    setMomAngerLevel(prev => Math.min(100, prev + 5));
  };

  // Check if mom's mood has reached zero
  useEffect(() => {
    if (momAngerLevel >= 100 && !isExploding) {
      setIsExploding(true);
      
      // Play explosion sound
      audioManager.playSound('explosion');
      
      // Dramatic shaking effect
      document.body.classList.add('animate-extreme-shake');
      
      // Navigate to crash page after a delay
      setTimeout(() => {
        document.body.classList.remove('animate-extreme-shake');
        navigate('/mom-crashed');
      }, 2500);
    }
  }, [momAngerLevel, isExploding, navigate]);

  // Exit confirm functions
  const attemptToExit = () => {
    setShowExitConfirm(true);
    audioManager.playSound('error');
  };

  const closeExitConfirm = () => {
    setShowExitConfirm(false);
    audioManager.playSound('click');
  };

  useEffect(() => {
    // Reset mom's anger level on component mount
    setMomAngerLevel(0);
    setIsExploding(false);
    
    if (stage === 'welcome') {
      // Reset mom's anger when returning to welcome screen
      setMomAngerLevel(0);
    }
    
    // Mom gets less angry over time when user is not doing anything
    const calmDownInterval = setInterval(() => {
      if (stage !== 'taskInput') {
        calmMomDown();
      }
    }, 10000);
    
    return () => clearInterval(calmDownInterval);
  }, [stage]);

  const resetApp = () => {
    setStage('welcome');
    setTaskInput('');
    setSelectedCriticism(null);
    setSabotageEvents(SABOTAGE_EVENTS);
    setMomAngerLevel(0);
    setIsExploding(false);
  };

  const calmMomDown = () => {
    // Used when user does something to appease mom
    setMomAngerLevel(prev => Math.max(0, prev - 15));
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
    showExitConfirm,
    setShowExitConfirm,
    attemptToExit,
    closeExitConfirm,
    momAngerLevel,
    setMomAngerLevel,
    calmMomDown,
    resetApp,
    isExploding
  };

  return <MomentoContext.Provider value={value}>{children}</MomentoContext.Provider>;
};

export const useMomento = (): MomentoContextType => {
  const context = useContext(MomentoContext);
  if (context === undefined) {
    throw new Error('useMomento must be used within a MomentoProvider');
  }
  return context;
};
