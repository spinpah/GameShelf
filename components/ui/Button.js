export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 focus:ring-indigo-500 dark:border-indigo-400 dark:text-indigo-400 dark:hover:bg-indigo-950',
    ghost: 'text-gray-700 hover:bg-gray-50 focus:ring-0 focus:outline-none focus:ring-offset-0 dark:text-gray-300 dark:hover:bg-gray-50 rounded-none'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? disabledClasses : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}