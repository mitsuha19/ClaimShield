import { NavLink } from "react-router-dom";

export default function Topbar({ items = [] }) {
  return (
    <div className="h-16 bg-white shadow px-6 flex items-center">
      <div className="flex items-center gap-2 text-sm">

        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            {/* Jika bukan aktif → bisa diklik */}
            {!item.active ? (
              <NavLink
                to={item.path}
                className="text-gray-600 hover:text-teal-600"
              >
                {item.label}
              </NavLink>
            ) : (
              <span className="text-teal-600 font-semibold">{item.label}</span>
            )}

            {/* Separator "/" kecuali di item terakhir */}
            {idx < items.length - 1 && <span>/</span>}
          </div>
        ))}

      </div>
    </div>
  );
}
