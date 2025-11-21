export default function IconButton({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-100 text-gray-700">
      <Icon size={18} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
