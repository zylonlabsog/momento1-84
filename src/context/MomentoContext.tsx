import React, { createContext, useContext, useState } from 'react';
import { AppStage, MomentoContextType, MomCriticism, SabotageEvent } from '@/types';

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
  const [momAngerLevel, setMomAngerLevel] = useState<number>(50); // Fixed at 50%
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [isExploding, setIsExploding] = useState<boolean>(false);

  // Non-functional placeholders for functions
  const triggerCriticism = () => {
    // Non-functional
  };

  const triggerRandomSabotage = () => {
    // Non-functional
  };

  const attemptToExit = () => {
    // Non-functional
  };

  const closeExitConfirm = () => {
    // Non-functional
  };

  const resetApp = () => {
    // Non-functional
  };

  const calmMomDown = () => {
    // Non-functional
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
