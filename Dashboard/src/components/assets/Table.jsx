export default function Table({ columns, data }) {
  return (
    <table className="w-full bg-white rounded-lg shadow-sm">
      <thead>
        <tr className="bg-[#E7F4F8] text-gray-700">
          {columns.map(col => (
            <th
              key={col.key}
              className="p-3 text-left text-sm font-semibold"
            >
              {col.title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50 border-b border-gray-200 last:border-b-0">
            {columns.map(col => (
              <td key={col.key} className="p-3 text-sm text-gray-700">
                {col.render ? col.render(row[col.key], row) : row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
