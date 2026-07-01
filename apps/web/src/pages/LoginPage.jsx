import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Eye, EyeOff, User as UserIcon, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Card, CardHeader, CardBody, Button, Input, Tabs, Tab } from '@heroui/react';
import { FadeIn } from '@/components/ScrollAnimations.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize selectedKey based on current pathname
  const [selectedKey, setSelectedKey] = useState(
    location.pathname === "/signup" ? "signup" : "login"
  );
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const { login, signup, loginWithOAuth } = useAuth();

  // Sync tab with pathname on history changes (e.g. browser back/forward)
  React.useEffect(() => {
    const key = location.pathname === "/signup" ? "signup" : "login";
    if (selectedKey !== key) {
      setSelectedKey(key);
    }
  }, [location.pathname, selectedKey]);

  const handleTabChange = (key) => {
    setSelectedKey(key);
    navigate(key === "signup" ? "/signup" : "/login", { replace: true });
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let result;
    if (selectedKey === "signup") {
      result = await signup(email, password, name || email.split('@')[0]);
    } else {
      result = await login(email, password);
    }
    
    if (result.success) {
      toast.success(selectedKey === "signup" ? 'Registration successful. Welcome, Operator.' : 'Authentication successful. Welcome, Operator.');
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
    <div className="min-h-[calc(100vh-80px)] bg-transparent flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 w-full overflow-hidden font-rounded">
      <Helmet>
        <title>{selectedKey === 'signup' ? 'Sign Up - OdysseusAI' : 'Login - OdysseusAI'}</title>
      </Helmet>

      <FadeIn direction="up" distance={30} delay={0.1} className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[460px] z-10">
        <Card className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden text-white shadow-2xl p-5 sm:p-7 md:p-8 w-full">
          <CardHeader className="flex flex-col items-center pb-6 select-none">
            {/* Status strip matching calculator style */}
            <div className="inline-flex items-center gap-2 bg-[#E73A5A]/10 px-4 py-1.5 rounded-full border border-[#E73A5A]/20 text-xs font-bold mb-4">
              <span className="bg-[#E73A5A] px-2 py-0.5 rounded-full text-[9px] text-white font-black">SECURE</span>
              <span className="text-gray-300 text-[10px] sm:text-xs">OdysseusAI Orchestrator Portal</span>
            </div>

            {/* Tilted badge heading matching calculator style */}
            <motion.h1 
              key={`title-${selectedKey}`}
              initial={{ opacity: 0, scale: 0.95, y: -5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2 leading-tight text-center"
            >
              System{' '}
              <span className="text-[#E73A5A] bg-[#E73A5A]/10 px-4 py-1 border border-[#E73A5A]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(231, 58, 90, 0.2)]">
                {selectedKey === 'signup' ? 'Registration' : 'Access'}
              </span>
            </motion.h1>
          </CardHeader>

          <CardBody className="flex flex-col gap-6 p-0">
            {/* Tabs for switching between Sign In and Sign Up */}
            <Tabs 
              fullWidth 
              size="md" 
              aria-label="Auth options" 
              selectedKey={selectedKey}
              onSelectionChange={handleTabChange}
              className="p-1 bg-white/5 border border-white/10 rounded-full"
              classNames={{
                tabList: "bg-transparent gap-1 p-0",
                cursor: "w-full bg-[#E73A5A] rounded-full shadow-[0_0_10px_rgba(231,58,90,0.5)]",
                tab: "h-9 text-xs font-bold uppercase tracking-wider text-gray-400 data-[selected=true]:text-white",
              }}
            >
              <Tab key="login" title="Access System" />
              <Tab key="signup" title="Register Operator" />
            </Tabs>

            {/* OAuth Login buttons */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Button 
                variant="bordered"
                onClick={() => handleOAuth('google')}
                isLoading={oauthLoading === 'google'}
                className="border-white/10 hover:border-[#E73A5A] hover:bg-[#E73A5A]/10 text-white rounded-2xl h-12 flex items-center justify-center gap-2"
                title="Sign in with Google"
              >
                {oauthLoading !== 'google' && (
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                )}
                <span className="text-xs font-bold uppercase tracking-wider">Google</span>
              </Button>
              <Button 
                variant="bordered"
                onClick={() => handleOAuth('github')}
                isLoading={oauthLoading === 'github'}
                className="border-white/10 hover:border-[#E73A5A] hover:bg-[#E73A5A]/10 text-white rounded-2xl h-12 flex items-center justify-center gap-2"
                title="Sign in with GitHub"
              >
                {oauthLoading !== 'github' && <Github size={18} className="flex-shrink-0" />}
                <span className="text-xs font-bold uppercase tracking-wider">GitHub</span>
              </Button>
              <Button 
                variant="bordered"
                onClick={() => handleOAuth('apple')}
                isLoading={oauthLoading === 'apple'}
                className="border-white/10 hover:border-[#E73A5A] hover:bg-[#E73A5A]/10 text-white rounded-2xl h-12 flex items-center justify-center gap-2"
                title="Sign in with Apple"
              >
                {oauthLoading !== 'apple' && (
                  <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.97 1.1.09 2.23-.57 2.98-1.41z" />
                  </svg>
                )}
                <span className="text-xs font-bold uppercase tracking-wider">Apple</span>
              </Button>
              <Button 
                variant="bordered"
                onClick={() => handleOAuth('microsoft')}
                isLoading={oauthLoading === 'microsoft'}
                className="border-white/10 hover:border-[#E73A5A] hover:bg-[#E73A5A]/10 text-white rounded-2xl h-12 flex items-center justify-center gap-2"
                title="Sign in with Microsoft"
              >
                {oauthLoading !== 'microsoft' && (
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 23 23">
                    <rect x="0" y="0" width="10.5" height="10.5" fill="#f25022"/>
                    <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7fba00"/>
                    <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00a4ef"/>
                    <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#ffb900"/>
                  </svg>
                )}
                <span className="text-xs font-bold uppercase tracking-wider">Microsoft</span>
              </Button>
            </div>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-xs uppercase tracking-wider text-gray-500 font-bold">Or Manual Entry</span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <AnimatePresence mode="popLayout">
                {selectedKey === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input 
                      label="Operator Name"
                      type="text" 
                      required
                      value={name}
                      onValueChange={setName}
                      placeholder="John Doe"
                      variant="bordered"
                      classNames={{
                        label: "text-gray-400 text-xs font-bold uppercase",
                        input: "text-white",
                        inputWrapper: "border-white/10 h-12 bg-white/5 hover:bg-white/10 focus-within:border-[#E73A5A]",
                      }}
                      startContent={<UserIcon className="text-gray-400 mr-2" size={18} />}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <Input 
                label="Operator Email"
                type="email" 
                required
                value={email}
                onValueChange={setEmail}
                placeholder="operator@odysseusai.ai"
                variant="bordered"
                classNames={{
                  label: "text-gray-400 text-xs font-bold uppercase",
                  input: "text-white",
                  inputWrapper: "border-white/10 h-12 bg-white/5 hover:bg-white/10 focus-within:border-[#E73A5A]",
                }}
                startContent={<Mail className="text-gray-400 mr-2" size={18} />}
              />
              
              <Input 
                label="Access Passcode"
                type={isVisible ? "text" : "password"} 
                required
                value={password}
                onValueChange={setPassword}
                placeholder="••••••••"
                variant="bordered"
                classNames={{
                  label: "text-gray-400 text-xs font-bold uppercase",
                  input: "text-white",
                  inputWrapper: "border-white/10 h-12 bg-white/5 hover:bg-white/10 focus-within:border-[#E73A5A]",
                }}
                endContent={
                  <button className="focus:outline-none p-1 rounded-full hover:bg-white/10 transition-colors" type="button" onClick={toggleVisibility}>
                    {isVisible ? (
                      <EyeOff className="text-gray-400 pointer-events-none" size={18} />
                    ) : (
                      <Eye className="text-gray-400 pointer-events-none" size={18} />
                    )}
                  </button>
                }
              />

              <Button 
                type="submit" 
                color="danger"
                isLoading={isSubmitting}
                className="w-full h-12 bg-[#E73A5A] text-white font-bold uppercase tracking-wider text-sm rounded-2xl shadow-[0_0_15px_rgba(231,58,90,0.4)] hover:shadow-[0_0_25px_rgba(231,58,90,0.6)] hover:brightness-112 transition-all mt-4"
              >
                {selectedKey === "signup" ? 'Create Operator Account' : 'Initialize Session'}
              </Button>
            </form>

            <div className="flex justify-center mt-2 border-t border-white/5 pt-4">
              <Button
                variant="light"
                onClick={() => navigate('/')}
                className="text-gray-400 hover:text-white font-semibold text-xs tracking-wide hover:bg-white/5"
              >
                Return to Main Site
              </Button>
            </div>
          </CardBody>
        </Card>
      </FadeIn>
    </div>
  );
}

export default LoginPage;
