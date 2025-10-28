import React, { useState, FormEvent } from 'react';

interface CreateUserModalProps {
  onCreate: (userData: { username: string; email: string; password: string, role: string }) => Promise<void>;
  onClose: () => void;
}

const ROLES = ['subscriber', 'editor', 'administrator'];

const CreateUserModal: React.FC<CreateUserModalProps> = ({ onCreate, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('subscriber');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      await onCreate({ username, email, password, role });
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsSaving(false);
    }
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
        <h2 className="text-xl font-bold text-white mb-4">Create New User</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="new-username" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                <input type="text" id="new-username" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
                <label htmlFor="new-email" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" id="new-email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input type="password" id="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
                <label htmlFor="new-role" className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                <select id="new-role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500">
                    {ROLES.map(r => <option key={r} value={r} className="capitalize">{r}</option>)}
                </select>
            </div>
            {error && <p className="text-sm text-rose-400 bg-rose-500/10 p-2 rounded-md">{error}</p>}
        </form>

        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white font-semibold rounded-md transition duration-200" disabled={isSaving}>
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition duration-200 disabled:bg-slate-500" disabled={isSaving}>
            {isSaving ? 'Creating...' : 'Create User'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
