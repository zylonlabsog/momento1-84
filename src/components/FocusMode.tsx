
import React from 'react';
import { Focus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

const FocusMode: React.FC = () => {
  const handleClick = () => {
    toast({
      title: "Warning",
      description: "Mom's Focus Mode will actively try to distract you with ads and nagging. Are you sure you're ready for this torture?",
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
      Enter EXTREMELY EVIL Focus Mode
    </Link>
  );
};

export default FocusMode;
