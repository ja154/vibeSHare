
import React, { useState } from 'react';
import { User } from '../types';

type View = 'login' | 'signup' | 'forgot_request' | 'forgot_reset' | 'forgot_sent';

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
  onSignUp: (username: string, email: string, password: string) => void;
  onResetPassword: (usernameOrEmail: string, newPassword: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin, onSignUp, onResetPassword }) => {
  const [view, setView] = useState<View>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userToResetIdentifier, setUserToResetIdentifier] = useState('');

  const clearState = (newView?: View) => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setEmail('');
    // Keep success message only when transitioning to login
    if (newView !== 'login') {
      setSuccess('');
    }
    if (newView) {
      setView(newView);
    }
  };

  const handleLoginAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const identifier = username.toLowerCase().trim();
    const foundUser = users.find(user => 
        user.name.toLowerCase() === identifier || 
        user.email.toLowerCase() === identifier
    );
    if (foundUser) {
      if (foundUser.password === password) {
        onLogin(foundUser);
      } else {
        setError('Incorrect password. Please try again.');
      }
    } else {
      setError('User not found. Please check your username or email.');
    }
  };
  
  const handleSignUpAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    const existingUserByName = users.find(user => user.name.toLowerCase() === username.toLowerCase().trim());
    if (existingUserByName) {
      setError('Username is already taken.');
      return;
    }
    const existingUserByEmail = users.find(user => user.email.toLowerCase() === email.toLowerCase().trim());
    if (existingUserByEmail) {
        setError('An account with this email already exists.');
        return;
    }
    onSignUp(username.trim(), email.trim(), password);
  };

  const handleForgotRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = username.trim();
    const foundUser = users.find(user => 
        user.name.toLowerCase() === identifier.toLowerCase() || 
        user.email.toLowerCase() === identifier.toLowerCase()
    );
    setUserToResetIdentifier(foundUser ? identifier : '');
    // Always go to the 'sent' screen to avoid user enumeration
    clearState('forgot_sent');
  };

  const handleProceedToReset = () => {
    if (userToResetIdentifier) {
        clearState('forgot_reset');
    } else {
        // If no valid user was entered, just go back to login.
        clearState('login');
    }
  };

  const handlePasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const success = onResetPassword(userToResetIdentifier, password);
    if(success) {
      clearState('login');
      setSuccess('Password reset successfully! You can now log in.');
    } else {
      setError('Something went wrong. Please try again.');
    }
  };

  const renderTitle = () => {
    switch (view) {
      case 'signup':
        return { title: 'Create Account', subtitle: 'Join the community and share your vibes.' };
      case 'forgot_request':
        return { title: 'Reset Password', subtitle: 'Enter your username or email to reset your password.' };
      case 'forgot_sent':
        return { title: 'Check Your Inbox', subtitle: 'We\'ve simulated sending a password reset link.' };
      case 'forgot_reset':
        return { title: 'Set New Password', subtitle: `Enter a new password.` };
      case 'login':
      default:
        return { title: 'Welcome Back!', subtitle: 'Log in to continue sharing your vibes.' };
    }
  };
  const { title, subtitle } = renderTitle();

  return (
    <div className="fixed inset-0 bg-primary-bg flex flex-col items-center justify-center z-50 p-4 transition-all duration-300">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white tracking-tighter mb-2 cursor-pointer" onClick={() => clearState('login')}>
          Vibe<span className="text-neon-green">share</span>
        </h1>
        <p className="text-lg text-gray-400">{subtitle}</p>
      </div>
      
      <div className="max-w-sm w-full">
        {/* LOGIN FORM */}
        {view === 'login' && (
          <form onSubmit={handleLoginAttempt} className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-lg">
            {success && <p className="text-sm text-green-400 mb-4">{success}</p>}
            <div className="space-y-6">
              <div>
                <label htmlFor="username-login" className="block text-sm font-medium text-gray-300 mb-2">Username or Email</label>
                <input type="text" id="username-login" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. Alex Dev or alex@example.com" required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
              <div>
                <div className="flex justify-between items-baseline">
                  <label htmlFor="password-login" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <button type="button" onClick={() => clearState('forgot_request')} className="text-xs text-neon-green/80 hover:text-neon-green font-semibold">Forgot Password?</button>
                </div>
                <input type="password" id="password-login" value={password} onChange={e => setPassword(e.target.value)} placeholder="e.g. password1" required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
              {error && <p className="text-sm text-red-400 -mt-2">{error}</p>}
              <button type="submit" className="w-full bg-neon-green text-black font-bold px-6 py-3 rounded-lg transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green">Login</button>
            </div>
            <p className="text-sm text-center text-gray-500 mt-6">
              Don't have an account? <button type="button" onClick={() => clearState('signup')} className="font-semibold text-neon-green/80 hover:text-neon-green">Sign Up</button>
            </p>
          </form>
        )}

        {/* SIGN UP FORM */}
        {view === 'signup' && (
           <form onSubmit={handleSignUpAttempt} className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <label htmlFor="username-signup" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input type="text" id="username-signup" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
               <div>
                <label htmlFor="email-signup" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" id="email-signup" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
              <div>
                <label htmlFor="password-signup" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input type="password" id="password-signup" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
               <div>
                <label htmlFor="confirm-password-signup" className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                <input type="password" id="confirm-password-signup" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
              {error && <p className="text-sm text-red-400 -mt-2">{error}</p>}
              <button type="submit" className="w-full bg-neon-green text-black font-bold px-6 py-3 rounded-lg transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green">Create Account</button>
            </div>
             <p className="text-sm text-center text-gray-500 mt-6">
              Already have an account? <button type="button" onClick={() => clearState('login')} className="font-semibold text-neon-green/80 hover:text-neon-green">Log In</button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD REQUEST */}
        {view === 'forgot_request' && (
           <form onSubmit={handleForgotRequest} className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <label htmlFor="username-forgot" className="block text-sm font-medium text-gray-300 mb-2">Username or Email</label>
                <input type="text" id="username-forgot" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
              <button type="submit" className="w-full bg-neon-green text-black font-bold px-6 py-3 rounded-lg transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green">Send Reset Link</button>
            </div>
             <p className="text-sm text-center text-gray-500 mt-6">
              Remembered your password? <button type="button" onClick={() => clearState('login')} className="font-semibold text-neon-green/80 hover:text-neon-green">Back to Login</button>
            </p>
          </form>
        )}
        
        {/* FORGOT PASSWORD SENT CONFIRMATION */}
        {view === 'forgot_sent' && (
           <div className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-lg text-center">
            <p className="text-gray-300 mb-6">If an account with the provided username or email exists, a password reset link has been simulated. Please proceed to the next step.</p>
            <button type="button" onClick={handleProceedToReset} className="w-full bg-neon-green text-black font-bold px-6 py-3 rounded-lg transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green">Set New Password</button>
             <p className="text-sm text-center text-gray-500 mt-6">
              <button type="button" onClick={() => clearState('login')} className="font-semibold text-neon-green/80 hover:text-neon-green">Back to Login</button>
            </p>
          </div>
        )}

        {/* FORGOT PASSWORD RESET */}
        {view === 'forgot_reset' && (
           <form onSubmit={handlePasswordReset} className="bg-card-bg border border-border-color rounded-2xl p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <label htmlFor="password-reset" className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <input type="password" id="password-reset" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
               <div>
                <label htmlFor="confirm-password-reset" className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <input type="password" id="confirm-password-reset" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-primary-bg border border-border-color rounded-lg p-3 text-white focus:ring-2 focus:ring-neon-green focus:outline-none transition" />
              </div>
              {error && <p className="text-sm text-red-400 -mt-2">{error}</p>}
              <button type="submit" className="w-full bg-neon-green text-black font-bold px-6 py-3 rounded-lg transition-all hover:bg-white hover:shadow-neon focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card-bg focus:ring-neon-green">Set New Password</button>
            </div>
          </form>
        )}
      </div>

       <footer className="absolute bottom-8 text-gray-600 text-sm">
        This is a simulated login experience. No data is stored or sent.
      </footer>
    </div>
  );
};

export default LoginScreen;