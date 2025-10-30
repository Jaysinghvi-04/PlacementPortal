import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { login, register } from '../api'; // Corrected import
import { UserRole, UserCredentials, UserRegistration } from '../types'; // Corrected import
import { USER_ROLES } from '../constants'; // Import USER_ROLES

const Login: React.FC = () => {
  const { login: authLogin } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(USER_ROLES.STUDENT); // Corrected to USER_ROLES

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole(USER_ROLES.STUDENT); // Corrected to USER_ROLES
    setError('');
  };

  const handleToggleView = () => {
    setIsLoginView(!isLoginView);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isLoginView) {
        const credentials: UserCredentials = { username: email, password };
        const user = await login(credentials); // Corrected API call
        authLogin(user.data); // Assuming API returns { data: UserProfile }
      } else {
        const userData: UserRegistration = { name, email, password, role }; // Corrected data structure
        const newUser = await register(userData); // Corrected API call
        authLogin(newUser.data); // Assuming API returns { data: UserProfile }
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl dark:bg-slate-800">
          <div className="p-8 space-y-6">
            <div className="text-center">
                <div className="flex justify-center">
                    <div className="rounded-full bg-indigo-100 dark:bg-slate-700 p-3">
                         <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
                  {isLoginView ? 'Welcome Back!' : 'Create an Account'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {isLoginView ? 'Sign in to access your dashboard' : 'Join the portal today'}
                </p>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isLoginView && (
                <>
                  <div className="relative">
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" className="peer w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white placeholder:text-transparent" />
                     <label className="absolute left-4 -top-2.5 text-xs text-slate-500 bg-white dark:bg-slate-800 px-1 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500">Full Name</label>
                  </div>
                  <div className="relative">
                    <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} required className="w-full px-3 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white">
                      {Object.values(USER_ROLES).map((r: string) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1).toLowerCase()}</option>)}
                    </select>
                  </div>
                </>
              )}
              <div className="relative">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required placeholder="Email Address" className="peer w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white placeholder:text-transparent" />
                <label className="absolute left-4 -top-2.5 text-xs text-slate-500 bg-white dark:bg-slate-800 px-1 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500">Email Address</label>
              </div>
              <div className="relative">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isLoginView ? "current-password" : "new-password"} required placeholder="Password" className="peer w-full px-4 py-2 text-slate-900 bg-slate-50 border border-slate-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white placeholder:text-transparent" />
                <label className="absolute left-4 -top-2.5 text-xs text-slate-500 bg-white dark:bg-slate-800 px-1 transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-base peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500">Password</label>
              </div>
              <div>
                <button type="submit" disabled={isLoading} className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 border border-transparent rounded-md shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-indigo-400 disabled:to-purple-400 disabled:cursor-not-allowed">
                  {isLoading ? 'Processing...' : (isLoginView ? 'Sign in' : 'Register')}
                </button>
              </div>
              {error && <p className="text-sm text-center text-rose-500">{error}</p>}
            </form>
            <div className="text-sm text-center text-slate-500 dark:text-slate-400">
              {isLoginView ? "Don't have an account?" : "Already have an account?"}{' '}
              <button onClick={handleToggleView} className="font-medium text-indigo-600 hover:underline dark:text-indigo-500">
                {isLoginView ? 'Sign up' : 'Sign in'}
              </button>
            </div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-4 rounded-b-xl border-t dark:border-slate-700">
                <div className="text-xs text-center text-slate-500 dark:text-slate-400">
                <p className="font-semibold">Demo Credentials</p>
                <p className="mt-2">Password for all accounts: <span className="font-mono bg-slate-200 dark:bg-slate-600 px-1 py-0.5 rounded">password</span></p>
                <div className="mt-2 grid grid-cols-2 gap-x-4 text-left mx-auto max-w-xs">
                    <div className="truncate">
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Admin:</p>
                        <p>ethan@example.com</p>
                    </div>
                    <div className="truncate">
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Recruiter:</p>
                        <p>charlie@example.com</p>
                    </div>
                    <div className="truncate">
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Faculty:</p>
                        <p>diana@example.com</p>
                    </div>
                    <div className="truncate">
                        <p className="font-semibold text-slate-600 dark:text-slate-300">Student:</p>
                        <p>alice@example.com</p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;