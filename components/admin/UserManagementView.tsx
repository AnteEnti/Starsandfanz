import React from 'react';

const mockUsers = [
  { id: 'user-1', name: 'AliceFan92', avatar: 'https://i.pravatar.cc/150?u=AliceFan92', joined: '2024-05-10', activity: 92 },
  { id: 'user-2', name: 'BobStarlight', avatar: 'https://i.pravatar.cc/150?u=BobStarlight', joined: '2024-04-22', activity: 78 },
  { id: 'user-3', name: 'CharlieChronos', avatar: 'https://i.pravatar.cc/150?u=CharlieChronos', joined: '2024-03-15', activity: 45 },
  { id: 'user-4', name: 'DianaEchoes', avatar: 'https://i.pravatar.cc/150?u=DianaEchoes', joined: '2024-05-01', activity: 88 },
  { id: 'user-5', name: 'EveLeoFan', avatar: 'https://i.pravatar.cc/150?u=EveLeoFan', joined: '2023-12-30', activity: 65 },
];

const ActivityBar: React.FC<{ value: number }> = ({ value }) => (
    <div className="w-full bg-slate-600 rounded-full h-2.5">
        <div 
            className="bg-gradient-to-r from-teal-400 to-purple-500 h-2.5 rounded-full" 
            style={{width: `${value}%`}}
            title={`${value}% Activity`}
        ></div>
    </div>
);

const UserManagementView: React.FC = () => {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold text-white">User Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">User</th>
              <th scope="col" className="px-6 py-3">Joined Date</th>
              <th scope="col" className="px-6 py-3">Activity Level</th>
              <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map(user => (
              <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                <td className="px-6 py-4 font-medium text-white">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                    <span>{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{user.joined}</td>
                <td className="px-6 py-4"><ActivityBar value={user.activity} /></td>
                <td className="px-6 py-4 text-right">
                  <button className="font-medium text-purple-400 hover:underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementView;