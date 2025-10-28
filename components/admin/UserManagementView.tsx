import React, { useState, useEffect, useCallback } from 'react';
import { AdminUser } from '../../types';
import { getUsers, updateUserRole, deleteUser, createUser } from '../../services/wordpress';
import { useAuth } from '../../hooks/useAuth';
import EditUserModal from './EditUserModal';
import ConfirmationModal from './ConfirmationModal';
import CreateUserModal from './CreateUserModal';

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
  const { user: currentUser } = useAuth();
  const token = localStorage.getItem('fanz_adda_jwt');

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError("Authentication token not found.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const fetchedUsers = await getUsers(token);
      setUsers(fetchedUsers);
    } catch (e: any) {
      setError(e.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleCreateUser = async (userData: { username: string; email: string; password: string, role: string }) => {
    if (!token) return;
     try {
      await createUser(token, { ...userData, roles: [userData.role] });
      setIsCreateModalOpen(false);
      await fetchUsers();
    } catch (e: any) {
      // Let the modal handle and display the error
      throw e;
    }
  };

  const handleSaveRole = async (userId: number, role: string) => {
    if (!token) return;
    try {
      await updateUserRole(token, userId, role);
      setUserToEdit(null);
      await fetchUsers(); // Refresh the list
    } catch (e: any) {
      alert(`Error updating role: ${e.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!token || !userToDelete || !currentUser) return;
    try {
      await deleteUser(token, userToDelete.id, currentUser.id);
      setUserToDelete(null);
      await fetchUsers(); // Refresh the list
    } catch (e: any) {
      alert(`Error deleting user: ${e.message}`);
    }
  };
  
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">User Management</h2>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>Create New User</span>
          </button>
        </div>
        
        {isLoading && <div className="text-center p-10">Loading users...</div>}
        {error && <div className="text-center p-10 text-rose-400">{error}</div>}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-slate-300">
              <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">User</th>
                  <th scope="col" className="px-6 py-3">Role</th>
                  <th scope="col" className="px-6 py-3">Joined Date</th>
                  <th scope="col" className="px-6 py-3">Activity Level</th>
                  <th scope="col" className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const isCurrentUser = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                      <td className="px-6 py-4 font-medium text-white">
                        <div className="flex items-center gap-3">
                          <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                          <div>
                            <span>{user.name}</span>
                            <div className="text-xs text-slate-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className="bg-slate-600 text-slate-200 text-xs font-semibold px-2.5 py-1 rounded-full">{user.roles.join(', ')}</span>
                      </td>
                      <td className="px-6 py-4">{formatDate(user.registeredDate)}</td>
                      <td className="px-6 py-4"><ActivityBar value={Math.floor(Math.random() * 80) + 10} /></td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button 
                          onClick={() => setUserToEdit(user)} 
                          className="font-medium text-purple-400 hover:underline disabled:text-slate-500 disabled:cursor-not-allowed"
                          disabled={isCurrentUser}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => setUserToDelete(user)} 
                          className="font-medium text-rose-500 hover:underline disabled:text-slate-500 disabled:cursor-not-allowed"
                          disabled={isCurrentUser}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isCreateModalOpen && (
        <CreateUserModal
          onCreate={handleCreateUser}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}

      {userToEdit && (
        <EditUserModal 
          user={userToEdit}
          onSave={handleSaveRole}
          onClose={() => setUserToEdit(null)}
        />
      )}

      {userToDelete && (
        <ConfirmationModal
          isOpen={!!userToDelete}
          title="Delete User"
          confirmText="Delete"
          confirmColor="bg-red-600 hover:bg-red-700"
          onConfirm={handleConfirmDelete}
          onClose={() => setUserToDelete(null)}
        >
          Are you sure you want to delete the user <strong className="text-white">{userToDelete.name}</strong>? All their posts and content will be reassigned to you. This action cannot be undone.
        </ConfirmationModal>
      )}
    </>
  );
};

export default UserManagementView;