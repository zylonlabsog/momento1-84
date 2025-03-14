
export type AppStage = 
  | 'welcome' 
  | 'taskInput' 
  | 'fakeChoice' 
  | 'distraction' 
  | 'guiltTrip';

export interface SabotageEvent {
  id: string;
  type: 'reminder' | 'jumpScare' | 'fakeProgress' | 'movingButton';
  message: string;
  triggered: boolean;
}

export type MomCriticism = {
  text: string;
  severity: 'mild' | 'medium' | 'harsh';
};

export interface MomentoContextType {
  stage: AppStage;
  setStage: (stage: AppStage) => void;
  taskInput: string;
  setTaskInput: (input: string) => void;
  criticisms: MomCriticism[];
  selectedCriticism: MomCriticism | null;
  triggerCriticism: () => void;
  sabotageEvents: SabotageEvent[];
  triggerRandomSabotage: () => void;
  showExitConfirm: boolean;
  setShowExitConfirm: (show: boolean) => void;
  attemptToExit: () => void;
  closeExitConfirm: () => void;
  resetApp: () => void;
}
