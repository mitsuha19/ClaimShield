export default function Button({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm rounded shadow hover:bg-teal-700 ${className}`}
    >
      {children}
    </button>
  );
}
