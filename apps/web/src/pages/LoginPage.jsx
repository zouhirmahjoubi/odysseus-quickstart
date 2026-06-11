
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ShieldAlert, Github, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import NeoBrutalButton from '@/components/NeoBrutalButton.jsx';
import NeoBrutalInput from '@/components/NeoBrutalInput.jsx';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  
  const { login, loginWithOAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      toast.success('Authentication successful. Welcome, Operator.');
      // Navigate to the location they were trying to access, or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || 'Authentication failed.');
    }
    
    setIsSubmitting(false);
  };

  const handleOAuth = async (provider) => {
    setOauthLoading(provider);
    try {
      await loginWithOAuth(provider);
    } catch (error) {
      toast.error(`Failed to initialize ${provider} login: ${error.message}`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[hsl(var(--background))] flex items-center justify-center p-[15px] md:p-[30px] w-full overflow-hidden">
      <Helmet>
        <title>Login - OdysseusAI</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px]"
      >
        <NeoBrutalCard className="!p-[20px] md:!p-[40px] w-full">
          <div className="flex flex-col items-center mb-[20px] md:mb-[30px] w-full">
            <div className="w-[60px] h-[60px] bg-[hsl(var(--active-green))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] flex items-center justify-center mb-[15px]">
              <ShieldAlert size={32} className="text-black" />
            </div>
            <h1 className="text-[24px] md:text-[28px] font-black text-center space-grotesk w-full break-words uppercase tracking-tight">System Access</h1>
            <p className="font-bold text-[hsl(var(--muted-foreground))] mt-2 text-[14px] md:text-[16px] text-center w-full">OdysseusAI Platform</p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            <button 
              onClick={() => handleOAuth('google')}
              disabled={oauthLoading !== null}
              className="neo-button bg-white text-black w-full flex items-center justify-center gap-2 border-[3px] border-black font-bold p-3 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] active:translate-y-0 active:shadow-none"
            >
              {oauthLoading === 'google' ? 'Connecting...' : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            <button 
              onClick={() => handleOAuth('github')}
              disabled={oauthLoading !== null}
              className="neo-button bg-[#24292e] text-white w-full flex items-center justify-center gap-2 border-[3px] border-black font-bold p-3 transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000] active:translate-y-0 active:shadow-none"
            >
              {oauthLoading === 'github' ? 'Connecting...' : <><Github size={20} /> Continue with GitHub</>}
            </button>
          </div>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t-[3px] border-black"></div>
            <span className="flex-shrink-0 mx-4 font-black text-sm uppercase tracking-widest text-[hsl(var(--muted-foreground))]">Or Manual Entry</span>
            <div className="flex-grow border-t-[3px] border-black"></div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[15px] md:gap-[20px] w-full">
            <NeoBrutalInput 
              label="Operator Email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@odysseusai.ai"
            />
            
            <NeoBrutalInput 
              label="Access Passcode"
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="mt-[10px] w-full">
              <NeoBrutalButton 
                type="submit" 
                variant="primary" 
                className="w-full py-[15px] text-[16px] tracking-wide"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Authenticating...' : 'Initialize Session'}
              </NeoBrutalButton>
            </div>
          </form>
          
          <div className="mt-[20px] md:mt-[30px] text-center w-full">
            <button onClick={() => navigate('/')} className="font-bold text-[14px] text-[hsl(var(--muted-foreground))] hover:text-black underline p-2 min-h-[44px] transition-colors">
              Return to Main Site
            </button>
          </div>
        </NeoBrutalCard>
      </motion.div>
    </div>
  );
}

export default LoginPage;
