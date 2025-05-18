import React from 'react';

const Sidebar = () => {
  return (
    <div className="text-gray-700">
      <h2 className="text-xl font-semibold mb-4">Conversations</h2>
      <ul className="space-y-2">
        <li className="p-2 bg-gray-100 rounded">Chat 1</li>
        <li className="p-2 bg-gray-100 rounded">Chat 2</li>
      </ul>
    </div>
  );
};

export default Sidebar;
