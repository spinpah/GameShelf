export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}