import React, { useState } from 'react';
import { AdminUser } from '../../types';

interface EditUserModalProps {
  user: AdminUser;
  onSave: (userId: number, newRole: string) => void;
  onClose: () => void;
}

const ROLES = ['subscriber', 'editor', 'administrator'];

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onSave, onClose }) => {
  const [selectedRole, setSelectedRole] = useState(user.roles[0] || 'subscriber');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(user.id, selectedRole);
    setIsSaving(false);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-modal-bg-enter"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4 animate-modal-content-enter"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-white mb-2">Edit User Role</h2>
        <p className="text-sm text-slate-400 mb-4">Change the role for <strong className="text-white">{user.name}</strong>.</p>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">User Role</label>
                <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
                >
                    {ROLES.map(role => (
                        <option key={role} value={role} className="capitalize">{role}</option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-md transition duration-200"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition duration-200 disabled:bg-slate-500"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;