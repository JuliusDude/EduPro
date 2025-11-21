import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, User, Shield, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<'student' | 'lecturer' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'indigo', demo: { email: 'student@edu.com', password: 'password' } },
    { id: 'lecturer', label: 'Lecturer', icon: User, color: 'emerald', demo: { email: 'lecturer@edu.com', password: 'password' } },
    { id: 'admin', label: 'Admin', icon: Shield, color: 'rose', demo: { email: 'admin@edu.com', password: 'password' } }
  ];

  const currentRole = roles.find(r => r.id === selectedRole)!;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, selectedRole);

      if (success) {
        // Navigate based on role
        switch (selectedRole) {
          case 'student':
            navigate('/student/dashboard');
            break;
          case 'lecturer':
            navigate('/lecturer');
            break;
          case 'admin':
            navigate('/admin');
            break;
        }
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(currentRole.demo.email);
    setPassword(currentRole.demo.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-lg">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">EduPro</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Classroom Automation Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Sign In</h2>

          {/* Role Selection */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {roles.map(role => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id as any)}
                  className={`p-4 rounded-xl border-2 transition-all ${isSelected
                    ? `border-${role.color}-600 bg-${role.color}-50 dark:bg-${role.color}-900/20`
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${isSelected ? `text-${role.color}-600 dark:text-${role.color}-400` : 'text-slate-400'
                    }`} />
                  <p className={`text-xs font-medium ${isSelected ? `text-${role.color}-600 dark:text-${role.color}-400` : 'text-slate-600 dark:text-slate-400'
                    }`}>
                    {role.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all"
                placeholder="your.email@edu.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Demo Credentials</p>
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-500 font-mono">
              {currentRole.demo.email}<br />
              {currentRole.demo.password}
            </p>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Forgot password? <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">Reset here</a>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-6">
          © 2024 EduPro. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
