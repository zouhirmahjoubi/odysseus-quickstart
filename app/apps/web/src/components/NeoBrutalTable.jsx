
import React from 'react';

function NeoBrutalTable({ columns, data, renderRowActions }) {
  return (
    <div className="w-full overflow-x-auto bg-white neo-border neo-shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#BAE6FD] border-b-[3px] border-black">
            {columns.map((col, index) => (
              <th 
                key={index} 
                className="p-4 font-extrabold text-black border-r-[3px] border-black last:border-r-0"
              >
                {col.header}
              </th>
            ))}
            {renderRowActions && (
              <th className="p-4 font-extrabold text-black">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex} 
              className="border-b-[3px] border-black last:border-b-0 hover:bg-[#FFFDE6] transition-colors"
            >
              {columns.map((col, colIndex) => (
                <td 
                  key={colIndex} 
                  className="p-4 font-medium text-black border-r-[3px] border-black last:border-r-0"
                >
                  {row[col.accessor]}
                </td>
              ))}
              {renderRowActions && (
                <td className="p-4">
                  {renderRowActions(row)}
                </td>
              )}
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td 
                colSpan={columns.length + (renderRowActions ? 1 : 0)} 
                className="p-8 text-center font-bold text-black/60"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NeoBrutalTable;
