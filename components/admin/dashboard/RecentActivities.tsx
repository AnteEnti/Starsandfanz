import React from 'react';

const mockActivities = [
  { id: 1, user: 'Admin', action: 'created post', target: "'Chronos Prophecy' Anniversary", time: '2h ago', icon: 'add_circle', color: 'text-green-400' },
  { id: 2, user: 'Admin', action: 'updated post', target: "'Galactic Echoes' Trailer", time: '5h ago', icon: 'edit', color: 'text-yellow-400' },
  { id: 3, user: 'Admin', action: 'deleted post', target: "Old Fan Contest Announcement", time: '1d ago', icon: 'delete', color: 'text-rose-500' },
  { id: 4, user: 'Admin', action: 'created user', target: "LeoFanatic22", time: '2d ago', icon: 'person_add', color: 'text-sky-400' },
  { id: 5, user: 'Admin', action: 'approved comment', target: "On 'Birthday' post", time: '3d ago', icon: 'check_circle', color: 'text-teal-400' },
];


const RecentActivities: React.FC = () => {
  return (
    <div className="bg-slate-700/50 p-5 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activities</h3>
      <ul className="space-y-4">
        {mockActivities.map(activity => (
          <li key={activity.id} className="flex items-start gap-4 text-sm">
            <span className={`material-symbols-outlined mt-0.5 ${activity.color}`}>{activity.icon}</span>
            <div className="flex-1">
              <p className="text-white">
                <span className="font-semibold">{activity.user}</span> {activity.action} <span className="font-semibold text-purple-300">"{activity.target}"</span>
              </p>
              <p className="text-xs text-slate-400">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;