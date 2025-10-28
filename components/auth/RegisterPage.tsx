import React, { useState, FormEvent } from 'react';
import * as authService from '../../services/auth';
import { StarIcon } from '../icons';

interface RegisterPageProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onClose, onSwitchToLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await authService.registerUser(username, email, password);
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
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
                {success ? (
                    <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-green-400">check_circle</span>
                        <h2 className="text-2xl font-bold text-white mt-4">Registration Successful!</h2>
                        <p className="text-slate-300 mt-2">Your account has been created. You can now log in to join the celebration.</p>
                        <button
                            onClick={onSwitchToLogin}
                            className="w-full mt-6 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-full transition duration-300"
                        >
                            Go to Login
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <StarIcon className="h-12 w-12 text-purple-400 mx-auto" />
                            <h2 className="text-2xl font-bold text-white mt-2">Create an Account</h2>
                            <p className="text-slate-400">Join Fanz Adda and start celebrating!</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="username-reg" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                                <input
                                    type="text"
                                    id="username-reg"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                             <div>
                                <label htmlFor="email-reg" className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    id="email-reg"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-slate-700 text-white rounded-md p-2 border border-slate-600 focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="password-reg" className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                                <input
                                    type="password"
                                    id="password-reg"
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
                                {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Create Account'}
                            </button>
                        </form>
                        
                        <p className="text-xs text-slate-500 text-center mt-4">
                            Already have an account?{' '}
                            <button onClick={onSwitchToLogin} className="font-semibold text-purple-400 hover:underline">
                                Log In
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default RegisterPage;