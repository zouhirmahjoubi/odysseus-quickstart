
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ShieldAlert, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import LogoComponent from '@/components/LogoComponent.jsx';
import NeoBrutalInput from '@/components/NeoBrutalInput.jsx';
import NeoBrutalButton from '@/components/NeoBrutalButton.jsx';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if timeout query param exists
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('timeout') === '1') {
      setErrorMsg('Session expired due to inactivity. Please log in again.');
      // Remove it from URL so it doesn't persist
      navigate('/odysseus-admin-login', { replace: true });
    }

    // If already authenticated, bounce to dashboard
    if (isAuthenticated) {
      const redirectUrl = searchParams.get('redirect') || '/odysseus-admin';
      navigate(redirectUrl, { replace: true });
    }

    // Check for remembered email
    const savedEmail = localStorage.getItem('admin_remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [isAuthenticated, navigate, location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Clearance required. Please fill in all fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters.');
      setPassword('');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password, rememberMe);
    
    if (result.success) {
      toast.success('Admin session authorized.');
      const searchParams = new URLSearchParams(location.search);
      const redirectUrl = searchParams.get('redirect') || '/odysseus-admin';
      navigate(redirectUrl, { replace: true }); // Use replace to prevent back-button loops
    } else {
      setErrorMsg(result.error || 'Authorization Failed. Invalid command credentials.');
      setPassword(''); // Clear password on failure for security
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col items-center justify-center p-4 w-full">
      <Helmet>
        <title>Command Access | OdysseusAI</title>
      </Helmet>

      <div className="mb-[30px] scale-[0.85] md:scale-100 origin-center transition-transform">
        <LogoComponent />
      </div>

      <NeoBrutalCard className="w-full max-w-[450px] !p-[20px] md:!p-[40px] relative overflow-hidden">
        
        <div className="flex flex-col items-center gap-[15px] mb-[30px] justify-center mt-2 w-full">
          <div className="w-[60px] h-[60px] bg-[hsl(var(--destructive))] border-[4px] border-black rounded-[12px] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ShieldAlert size={32} className="text-white" strokeWidth={3} aria-hidden="true" />
          </div>
          <h1 className="text-[24px] sm:text-[28px] font-black uppercase tracking-tight text-center break-words w-full">Command Center</h1>
          <p className="font-bold text-[hsl(var(--muted-foreground))] text-[14px] md:text-[16px] text-center w-full">Authorized Personnel Only</p>
        </div>

        {errorMsg && (
          <div className="mb-[20px] bg-red-100 border-[3px] border-red-500 text-red-700 p-[15px] font-bold text-[14px] flex flex-col items-center text-center gap-2 shadow-[4px_4px_0px_0px_#ef4444]" role="alert">
            <AlertCircle size={24} strokeWidth={3} aria-hidden="true" className="mb-1" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-[20px] w-full" noValidate>
          <NeoBrutalInput
            label="Admin Identification"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@odysseusai.com"
            required
            aria-invalid={!!errorMsg}
          />

          <div className="flex flex-col gap-2 w-full max-w-full">
            <label className="font-bold text-[14px] md:text-[16px] uppercase tracking-wide">Clearance Code</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full min-h-[44px] p-[12px_15px] pr-[45px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] text-[14px] md:text-[16px] font-bold focus:outline-none focus:bg-[hsl(var(--primary))] focus:text-black transition-colors"
                placeholder="••••••••"
                required
                aria-invalid={!!errorMsg}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-[10px] top-1/2 -translate-y-1/2 text-black hover:text-[hsl(var(--accent))] active:scale-95 transition-all outline-none p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} strokeWidth={3} aria-hidden="true" /> : <Eye size={20} strokeWidth={3} aria-hidden="true" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-[10px] mt-[10px]">
            <input 
              type="checkbox" 
              id="remember" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-[24px] h-[24px] border-[3px] border-black rounded-none appearance-none checked:bg-[hsl(var(--active-green))] cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none relative before:content-[''] before:absolute before:top-[2px] before:left-[6px] before:w-[6px] before:h-[12px] before:border-r-[3px] before:border-b-[3px] before:border-black before:rotate-45 before:opacity-0 checked:before:opacity-100 transition-all" 
            />
            <label htmlFor="remember" className="font-bold text-[14px] cursor-pointer select-none">Remember Terminal</label>
          </div>

          <div className="mt-[15px] w-full">
            <NeoBrutalButton 
              type="submit" 
              disabled={isLoading}
              variant="accent"
              className="w-full text-[16px] md:text-[18px] py-[15px]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-[3px] border-black border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                  Verifying...
                </span>
              ) : (
                'Execute Override'
              )}
            </NeoBrutalButton>
          </div>
        </form>
      </NeoBrutalCard>
    </div>
  );
};

export default AdminLoginPage;
