
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import NeoBrutalButton from '@/components/NeoBrutalButton.jsx';
import NeoBrutalInput from '@/components/NeoBrutalInput.jsx';
import NeoBrutalTextarea from '@/components/NeoBrutalTextarea.jsx';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';
import { 
  Search, Menu, X, Home, BookOpen, HelpCircle, Package, Settings, 
  LogOut, Terminal, Cpu, Target, Database, User, ShieldAlert,
  ChevronDown, LayoutDashboard
} from 'lucide-react';

// --- STATIC DATA ---
const WORKSPACE_CARDS = [
  { id: 1, title: 'Universal AI Chat', desc: 'Interact with local LLMs seamlessly.', icon: Terminal },
  { id: 2, title: 'Hardware Cookbook', desc: 'Optimize models for your specific GPU.', icon: Cpu },
  { id: 3, title: 'Deep Research Engine', desc: 'Autonomous web scraping and summarization.', icon: Target },
  { id: 4, title: 'Blind Comparison', desc: 'A/B test different models locally.', icon: Database },
];

const FAQS = [
  { q: 'Is OdysseusAI free?', a: 'Yes. The core orchestration layer is MIT licensed.' },
  { q: 'Does this tool monitor my logs?', a: 'No. Everything runs locally on your machine.' },
  { q: 'Can I connect cloud APIs?', a: 'Yes, via OpenRouter or custom proxy configs.' },
];

// --- MAIN COMPONENT ---
function DashboardPage() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [blogs, setBlogs] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Admin Form State
  const [adminForm, setAdminForm] = useState({
    title: '',
    category: 'Tutorials',
    content: '',
    featured_image: ''
  });

  useEffect(() => {
    // The ProtectedRoute handles redirects, but double check here
    if (!isAuthenticated) return;
    
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [blogsRes, productsRes] = await Promise.all([
          pb.collection('blogs').getList(1, 50, { sort: '-created', $autoCancel: false }),
          pb.collection('products').getList(1, 50, { sort: '-created', $autoCancel: false })
        ]);
        if (isMounted) {
          setBlogs(blogsRes.items);
          setProducts(productsRes.items);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load workspace data.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    toast.success('Session terminated.');
    navigate('/');
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminForm.title || !adminForm.content) {
      toast.error('Title and Content are required.');
      return;
    }

    try {
      await pb.collection('blogs').create({
        ...adminForm,
        author: currentUser?.name || 'Admin',
        published: true
      }, { $autoCancel: false });
      
      toast.success('Article published successfully!');
      setAdminForm({ title: '', category: 'Tutorials', content: '', featured_image: '' });
      // Refresh Data
      const blogsRes = await pb.collection('blogs').getList(1, 50, { sort: '-created', $autoCancel: false });
      setBlogs(blogsRes.items);
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish article.');
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm('Delete this intel log?')) return;
    try {
      await pb.collection('blogs').delete(id, { $autoCancel: false });
      toast.success('Log deleted.');
      const blogsRes = await pb.collection('blogs').getList(1, 50, { sort: '-created', $autoCancel: false });
      setBlogs(blogsRes.items);
    } catch (error) {
      toast.error('Failed to delete log.');
    }
  };

  // Filtering logic
  const filterContent = (items, fields) => {
    if (!searchQuery) return items;
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      fields.some(field => item[field]?.toLowerCase().includes(query))
    );
  };

  const filteredBlogs = filterContent(blogs, ['title', 'content', 'category']);
  const filteredProducts = filterContent(products, ['name', 'description']);
  const filteredFaqs = filterContent(FAQS, ['q', 'a']);
  const filteredWorkspace = filterContent(WORKSPACE_CARDS, ['title', 'desc']);
  
  const avatarUrl = currentUser?.image || (currentUser?.avatar ? pb.files.getUrl(currentUser, currentUser.avatar) : null);

  // --- SUB-COMPONENTS ---
  const SidebarLink = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => { setActiveTab(id); setIsMobileMenuOpen(false); }}
      className={`w-full flex items-center gap-3 p-[15px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] font-bold text-[14px] md:text-[16px] transition-all duration-200 min-h-[44px] ${
        activeTab === id ? 'bg-[hsl(var(--primary))] translate-x-1 translate-y-1 shadow-none' : 'bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] hover:bg-[hsl(var(--muted))] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000000]'
      }`}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="truncate">{label}</span>
    </button>
  );

  const AccordionItem = ({ q, a }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <NeoBrutalCard className="mb-[15px] !p-0 overflow-hidden w-full">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-[15px] md:p-[20px] text-left focus:outline-none hover:bg-[hsl(var(--muted))] transition-colors min-h-[44px]"
        >
          <span className="font-bold text-[14px] md:text-[16px] pr-[10px]">{q}</span>
          <motion.animate animate={{ rotate: isOpen ? 180 : 0 }} className="flex-shrink-0">
            <ChevronDown size={20} />
          </motion.animate>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="overflow-hidden bg-[hsl(var(--primary))] border-t-[3px] border-black"
            >
              <div className="p-[15px] md:p-[20px] font-medium text-[14px] text-black">
                {a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </NeoBrutalCard>
    );
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] flex flex-col md:flex-row space-grotesk overflow-hidden w-full relative z-10">
      <Helmet>
        <title>Dashboard | OdysseusAI</title>
      </Helmet>

      {/* MOBILE HEADER */}
      <div className="md:hidden bg-[hsl(var(--sidebar))] border-b-[3px] border-black p-[10px] px-[15px] flex items-center justify-between sticky top-0 z-40 w-full min-h-[50px]">
        <h1 className="font-black text-[18px] text-black m-0 truncate">Dashboard</h1>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-[8px] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-[3px] border-black active:scale-95 flex items-center justify-center min-h-[44px] min-w-[44px]">
          <Menu size={24} />
        </button>
      </div>

      {/* SIDEBAR */}
      <AnimatePresence>
        {(isMobileMenuOpen || window.innerWidth >= 768) && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
            className={`fixed md:sticky top-0 left-0 h-[100vh] w-[80vw] sm:w-[300px] lg:w-[280px] bg-[hsl(var(--sidebar))] border-r-[3px] border-black p-[15px] md:p-[24px] flex flex-col z-[70] md:z-50 overflow-y-auto ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}`}
          >
            <div className="flex items-center justify-between mb-[20px] md:mb-[30px] w-full">
              <div className="bg-[hsl(var(--card))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] p-[10px] text-center w-full flex flex-col items-center">
                <LayoutDashboard size={24} className="text-black mb-1" />
                <h1 className="font-black text-[16px] md:text-[18px] text-[hsl(var(--card-foreground))] truncate uppercase">Command Center</h1>
              </div>
              {isMobileMenuOpen && (
                <button onClick={() => setIsMobileMenuOpen(false)} className="ml-[10px] p-[8px] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-[3px] border-black active:scale-95 md:hidden min-h-[44px] min-w-[44px] flex-shrink-0 flex items-center justify-center">
                  <X size={24} />
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-[10px] flex-grow w-full max-w-full">
              <SidebarLink id="home" icon={Home} label="Home Workspace" />
              <SidebarLink id="profile" icon={User} label="My Profile" />
              <SidebarLink id="tutorials" icon={BookOpen} label="Deep Tutorials" />
              <SidebarLink id="faq" icon={HelpCircle} label="FAQ Engine" />
              <SidebarLink id="blueprints" icon={Package} label="Premium Blueprints" />
              
              {/* Optional Admin tab if the user role requires it, here just showing based on Auth as before */}
              <SidebarLink id="admin" icon={Settings} label="Content Control" />
            </nav>

            <div className="mt-[20px] pt-[20px] border-t-[3px] border-black flex flex-col gap-3 w-full">
              <NeoBrutalButton onClick={() => navigate('/')} variant="primary" className="w-full text-[12px] md:text-[14px]">
                <LayoutDashboard size={16} className="mr-2" /> Back to Main Site
              </NeoBrutalButton>
              <NeoBrutalButton onClick={handleLogout} variant="destructive" className="w-full text-[12px] md:text-[14px]">
                <LogOut size={16} className="mr-2" /> Terminate Session
              </NeoBrutalButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 w-[100vw] h-[100vh] bg-black/50 z-[60] md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 p-[15px] md:p-[30px] overflow-x-hidden w-full h-[calc(100vh-50px)] md:h-[100vh] overflow-y-auto">
        
        {/* HEADER */}
        <header className="mb-[20px] md:mb-[30px] w-full">
          <h2 className="text-[24px] md:text-[36px] lg:text-[40px] font-black mb-[15px] md:mb-[20px] text-center md:text-left text-[hsl(var(--foreground))] uppercase">
            Welcome, {currentUser?.name || currentUser?.email?.split('@')[0] || 'Commander'}! 🚀
          </h2>
          <div className="relative w-full max-w-3xl">
            <div className="absolute inset-y-0 left-0 pl-[15px] flex items-center pointer-events-none">
              <Search size={20} className="text-[hsl(var(--muted-foreground))]" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search workspace..."
              className="w-full pl-[45px] pr-[15px] min-h-[44px] py-[10px] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] font-bold text-[14px] md:text-[16px] focus:outline-none focus:bg-[hsl(var(--primary))] focus:text-black transition-colors"
            />
          </div>
        </header>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {/* HOME WORKSPACE */}
            {activeTab === 'home' && (
              <div className="w-full">
                <h2 className="text-[20px] md:text-[28px] font-black mb-[15px] md:mb-[24px] border-b-[3px] border-black pb-2 inline-block text-[hsl(var(--foreground))]">Core Modules</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[15px] md:gap-[24px] w-full">
                  {filteredWorkspace.map(card => (
                    <NeoBrutalCard 
                      key={card.id}
                      className="flex flex-col h-full w-full"
                    >
                      <div className="w-[44px] h-[44px] md:w-[48px] md:h-[48px] bg-[hsl(var(--sidebar))] border-[3px] border-black flex items-center justify-center mb-[15px]">
                        <card.icon size={20} className="text-black" />
                      </div>
                      <h3 className="font-black text-[16px] md:text-[18px] mb-[10px] w-full break-words">{card.title}</h3>
                      <p className="font-medium mb-[15px] flex-grow text-[12px] md:text-[14px] text-[hsl(var(--muted-foreground))] w-full break-words">{card.desc}</p>
                      <div className="mt-auto w-full">
                        <NeoBrutalButton variant="primary" className="w-full text-[12px] md:text-[14px]" onClick={() => navigate('/workspace-simulator')}>Launch</NeoBrutalButton>
                      </div>
                    </NeoBrutalCard>
                  ))}
                </div>
              </div>
            )}

            {/* MY PROFILE */}
            {activeTab === 'profile' && (
              <div className="max-w-3xl w-full">
                <h2 className="text-[20px] md:text-[28px] font-black mb-[15px] md:mb-[24px] border-b-[3px] border-black pb-2 inline-block text-[hsl(var(--foreground))]">Identity Card</h2>
                
                <NeoBrutalCard className="flex flex-col md:flex-row gap-[24px] md:items-center">
                  <div className="flex-shrink-0">
                    <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] border-[4px] border-black bg-[hsl(var(--muted))] flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={currentUser?.name} className="w-full h-full object-cover" />
                      ) : (
                        <User size={48} className="text-[hsl(var(--muted-foreground))]" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-grow flex flex-col gap-[10px]">
                    <div className="flex items-center gap-[10px] flex-wrap">
                      <h3 className="font-black text-[24px] md:text-[28px] leading-tight break-all uppercase">{currentUser?.name || 'Authorized User'}</h3>
                      {currentUser?.verified && (
                        <span className="bg-[hsl(var(--active-green))] text-black border-[2px] border-black px-[8px] py-[2px] font-bold text-[12px] uppercase tracking-wide">
                          Verified
                        </span>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[15px] mt-[10px]">
                      <div>
                        <p className="text-[12px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Comm Channel</p>
                        <p className="font-bold text-[16px] break-all">{currentUser?.email}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Clearance Level</p>
                        <p className="font-bold text-[16px]">{currentUser?.role || 'Standard'}</p>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-1">Joined Fleet</p>
                        <p className="font-bold text-[16px]">{currentUser?.createdAt || currentUser?.created ? new Date(currentUser.createdAt || currentUser.created).toLocaleDateString() : 'Unknown'}</p>
                      </div>
                    </div>
                  </div>
                </NeoBrutalCard>
                
                <div className="mt-[24px] flex flex-wrap gap-[15px]">
                  <NeoBrutalButton variant="primary">Edit Profile</NeoBrutalButton>
                  <NeoBrutalButton variant="destructive" onClick={handleLogout}>Terminate Session</NeoBrutalButton>
                </div>
              </div>
            )}

            {/* DEEP TUTORIALS */}
            {activeTab === 'tutorials' && (
              <div className="w-full">
                <h2 className="text-[20px] md:text-[28px] font-black mb-[15px] md:mb-[24px] border-b-[3px] border-black pb-2 inline-block text-[hsl(var(--foreground))]">Intel Logs</h2>
                {isLoading ? (
                  <div className="font-black text-[16px] md:text-[20px] animate-pulse">Loading intel...</div>
                ) : filteredBlogs.length === 0 ? (
                  <NeoBrutalCard className="p-[20px] font-bold text-[16px]">No logs found.</NeoBrutalCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] md:gap-[24px] w-full">
                    {filteredBlogs.map(blog => (
                      <NeoBrutalCard 
                        key={blog.id}
                        className="flex flex-col h-full !p-0 w-full"
                      >
                        <div className="p-[15px] md:p-[20px] flex-grow w-full">
                          <span className="inline-block px-[10px] py-[4px] bg-[hsl(var(--sidebar))] text-black border-[2px] border-black font-bold text-[10px] md:text-[12px] mb-[10px] truncate max-w-full">
                            {blog.category || 'Tutorials'}
                          </span>
                          <div className="h-[3px] w-full bg-black mb-[15px]" />
                          <h3 className="font-black text-[18px] md:text-[20px] mb-[10px] line-clamp-2 w-full break-words">{blog.title}</h3>
                          <p className="font-medium text-[12px] md:text-[14px] text-[hsl(var(--muted-foreground))] line-clamp-3 mb-[15px] w-full break-words">{blog.content}</p>
                        </div>
                        <div className="p-[15px] md:p-[20px] pt-0 mt-auto w-full">
                          <NeoBrutalButton variant="secondary" className="w-full text-[12px] md:text-[14px]" onClick={() => navigate(`/blog/${blog.slug}`)}>Read Log</NeoBrutalButton>
                        </div>
                      </NeoBrutalCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* FAQ ENGINE */}
            {activeTab === 'faq' && (
              <div className="max-w-3xl w-full">
                <h2 className="text-[20px] md:text-[28px] font-black mb-[15px] md:mb-[24px] border-b-[3px] border-black pb-2 inline-block text-[hsl(var(--foreground))]">Knowledge Base</h2>
                <div className="w-full">
                  {filteredFaqs.length === 0 ? (
                    <NeoBrutalCard className="p-[20px] font-bold text-[16px]">No answers found.</NeoBrutalCard>
                  ) : (
                    filteredFaqs.map((faq, idx) => (
                      <AccordionItem key={idx} q={faq.q} a={faq.a} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* PREMIUM BLUEPRINTS */}
            {activeTab === 'blueprints' && (
              <div className="w-full">
                <h2 className="text-[20px] md:text-[28px] font-black mb-[15px] md:mb-[24px] border-b-[3px] border-black pb-2 inline-block text-[hsl(var(--foreground))]">Asset Store</h2>
                {isLoading ? (
                  <div className="font-black text-[16px] md:text-[20px] animate-pulse">Loading assets...</div>
                ) : filteredProducts.length === 0 ? (
                  <NeoBrutalCard className="p-[20px] font-bold text-[16px]">No blueprints found.</NeoBrutalCard>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] md:gap-[24px] w-full">
                    {filteredProducts.map(product => (
                      <NeoBrutalCard 
                        key={product.id}
                        className="flex flex-col h-full !p-0 w-full"
                      >
                        <div className="h-[120px] md:h-[150px] bg-[hsl(var(--primary))] text-black border-b-[3px] border-black flex items-center justify-center p-[15px] w-full">
                          <Package size={48} className="opacity-50" />
                        </div>
                        <div className="p-[15px] md:p-[20px] flex-grow flex flex-col w-full">
                          <h3 className="font-black text-[18px] md:text-[20px] mb-[5px] w-full break-words line-clamp-2">{product.name}</h3>
                          <p className="font-black text-[20px] md:text-[24px] text-[hsl(var(--accent))] mb-[10px]">${product.price}</p>
                          <p className="font-medium text-[12px] md:text-[14px] text-[hsl(var(--muted-foreground))] mb-[15px] flex-grow w-full break-words line-clamp-3">{product.description}</p>
                          <div className="mt-auto w-full">
                            <NeoBrutalButton variant="primary" className="w-full text-[12px] md:text-[14px]">Get Blueprint</NeoBrutalButton>
                          </div>
                        </div>
                      </NeoBrutalCard>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ADMIN CONTROL PANEL */}
            {activeTab === 'admin' && (
              <div className="max-w-4xl w-full">
                <div className="mb-[24px] bg-[hsl(var(--destructive))] text-white border-[3px] border-black p-[15px] flex items-center gap-[15px] shadow-[4px_4px_0px_0px_#000000]">
                  <ShieldAlert size={28} className="flex-shrink-0" />
                  <div>
                    <h3 className="font-black text-[18px] uppercase">Content Authoring Mode</h3>
                    <p className="font-bold text-[14px]">Actions taken here affect global systems.</p>
                  </div>
                </div>

                <h2 className="text-[20px] md:text-[28px] font-black mb-[15px] md:mb-[24px] border-b-[3px] border-black pb-2 inline-block text-[hsl(var(--foreground))]">Publish Intel</h2>
                
                <NeoBrutalCard className="mb-[30px] md:mb-[40px] w-full">
                  <form onSubmit={handleAdminSubmit} className="flex flex-col gap-[15px] md:gap-[20px] w-full">
                    <NeoBrutalInput 
                      label="Article Title *"
                      required
                      value={adminForm.title}
                      onChange={e => setAdminForm({...adminForm, title: e.target.value})}
                    />
                    
                    <div className="flex flex-col gap-2 w-full max-w-full">
                      <label className="font-bold text-[14px] md:text-[16px]">Category Tags</label>
                      <select 
                        value={adminForm.category}
                        onChange={e => setAdminForm({...adminForm, category: e.target.value})}
                        className="w-full min-h-[44px] p-[12px_15px] border-[3px] border-black shadow-[4px_4px_0px_0px_#000000] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] text-[14px] md:text-[16px] font-bold focus:outline-none focus:bg-[hsl(var(--primary))] focus:text-black appearance-none rounded-none cursor-pointer"
                      >
                        <option>Tutorials</option>
                        <option>System Updates</option>
                        <option>AI Engine Setup</option>
                        <option>Security</option>
                        <option>Performance</option>
                        <option>Case Studies</option>
                      </select>
                    </div>

                    <NeoBrutalTextarea 
                      label="Article Content *"
                      required
                      rows={6}
                      value={adminForm.content}
                      onChange={e => setAdminForm({...adminForm, content: e.target.value})}
                    />

                    <NeoBrutalInput 
                      label="Featured Image URL"
                      type="url"
                      value={adminForm.featured_image}
                      onChange={e => setAdminForm({...adminForm, featured_image: e.target.value})}
                      placeholder="https://..."
                    />

                    <div className="mt-[10px] w-full">
                      <NeoBrutalButton type="submit" variant="accent" className="w-full text-[16px]">
                        🚀 Publish Article
                      </NeoBrutalButton>
                    </div>
                  </form>
                </NeoBrutalCard>

                <h2 className="text-[20px] md:text-[28px] font-black mb-[15px] md:mb-[24px] border-b-[3px] border-black pb-2 inline-block text-[hsl(var(--foreground))]">Manage Intel</h2>
                <div className="flex flex-col gap-[15px] w-full">
                  {blogs.map(blog => (
                    <NeoBrutalCard key={blog.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-[15px] w-full">
                      <div className="w-full sm:w-[60%]">
                        <h4 className="font-black text-[16px] md:text-[18px] truncate">{blog.title}</h4>
                        <p className="font-bold text-[12px] md:text-[14px] text-[hsl(var(--muted-foreground))] truncate mt-[5px]">
                          {blog.category} • {new Date(blog.created).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-row gap-[10px] w-full sm:w-auto">
                        <NeoBrutalButton variant="secondary" className="flex-1 sm:flex-none text-[12px] md:text-[14px] px-3 py-2 min-h-[40px]">Edit</NeoBrutalButton>
                        <NeoBrutalButton onClick={() => handleDeleteBlog(blog.id)} variant="destructive" className="flex-1 sm:flex-none text-[12px] md:text-[14px] px-3 py-2 min-h-[40px]">Delete</NeoBrutalButton>
                      </div>
                    </NeoBrutalCard>
                  ))}
                  {blogs.length === 0 && <p className="font-bold text-[hsl(var(--muted-foreground))] text-[14px]">No logs published.</p>}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default DashboardPage;
