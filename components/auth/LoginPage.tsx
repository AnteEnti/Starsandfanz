import React, { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { StarIcon } from '../icons';

interface LoginPageProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onClose, onSwitchToRegister }) => {
    const { login, error, clearError } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        clearError();
        try {
            await login(username, password);
            onClose(); // Close modal on successful login
        } catch (err) {
            // Error is handled in context, just stop loading
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div 
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-bg-enter"
          onClick={onClose}
        >
            <div 
                className="bg-slate-800 rounded-lg shadow-xl p-8 w-full max-w-sm mx-4 animate-modal-content-enter"
                onClick={e => e.stopPropagation()}
            >
                <div className="text-center mb-6">
                    <StarIcon className="h-12 w-12 text-purple-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-white mt-2">Welcome Back</h2>
                    <p className="text-slate-400">Log in to celebrate with us.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    
                    {error && <p className="text-sm text-rose-400 bg-rose-500/10 p-2 rounded-md">{error}</p>}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold rounded-full transition duration-300 flex items-center justify-center"
                    >
                        {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Log In'}
                    </button>
                </form>

                 <p className="text-xs text-slate-500 text-center mt-4">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToRegister} className="font-semibold text-purple-400 hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;