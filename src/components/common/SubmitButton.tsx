import React from 'react';
import { Loader2 } from 'lucide-react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  isLoading,
  loadingText = 'Loading...',
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={
        className || // Use provided className or default
        "w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      }
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default SubmitButton;
