
import React from 'react';
import { Focus } from 'lucide-react';
import { Link } from 'react-router-dom';

const FocusMode: React.FC = () => {
  return (
    <Link 
      to="/focus"
      className="neubrutalism-button bg-momento-green my-4 flex items-center"
    >
      <Focus className="mr-2 w-5 h-5" />
      Enter Focus Mode
    </Link>
  );
};

export default FocusMode;
