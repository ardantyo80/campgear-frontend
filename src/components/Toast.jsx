import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  const icon = type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ';

  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-in">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[250px]`}>
        <span className="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
          {icon}
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;