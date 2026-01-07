// src/components/ResponsiveTable.jsx
export default function ResponsiveTable({ data }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        {/* Desktop view */}
        <thead className="hidden md:table-header-group">
          <tr>
            <th>Name</th>
            <th>Clicks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.id}>
              {/* Desktop */}
              <td className="hidden md:table-cell">{item.name}</td>
              <td className="hidden md:table-cell">{item.clicks}</td>
              <td className="hidden md:table-cell">Actions</td>
              
              {/* Mobile */}
              <td className="md:hidden">
                <div className="space-y-2">
                  <div className="font-bold">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.clicks} clicks</div>
                  <div>Actions</div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}