
import React from 'react';
import { Focus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const FocusMode: React.FC = () => {
  const handleClick = () => {
    toast({
      title: "Warning",
      description: "Mom's Focus Mode will actively try to distract you and make you feel guilty. Your mood will drop even faster when idle!",
      duration: 3000,
    });
  };

  return (
    <Link 
      to="/focus"
      className="neubrutalism-button bg-momento-red my-4 flex items-center"
      onClick={handleClick}
    >
      <Focus className="mr-2 w-5 h-5" />
      Enter Focus Mode
    </Link>
  );
};

export default FocusMode;
