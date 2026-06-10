
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { FileText, ShoppingBag, Users, Activity, PlusCircle, BarChart, UserPlus, ShoppingCart, Network } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Link } from 'react-router-dom';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';
import NeoBrutalButton from '@/components/NeoBrutalButton.jsx';

const AdminDashboard = () => {
  const { currentAdmin } = useAdminAuth();
  const [stats, setStats] = useState({ users: 0, products: 0, posts: 0, orders: 0 });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const results = await Promise.allSettled([
          pb.collection('users').getList(1, 1, { $autoCancel: false }),
          pb.collection('products').getList(1, 1, { $autoCancel: false }),
          pb.collection('blogs').getList(1, 1, { $autoCancel: false }),
          pb.collection('orders').getList(1, 1, { $autoCancel: false })
        ]);
        
        if (!isMounted) return;

        setStats({
          users: results[0].status === 'fulfilled' ? results[0].value.totalItems : 0,
          products: results[1].status === 'fulfilled' ? results[1].value.totalItems : 0,
          posts: results[2].status === 'fulfilled' ? results[2].value.totalItems : 0,
          orders: results[3].status === 'fulfilled' ? results[3].value.totalItems : 0,
        });
        
        setActivities([
          { id: 1, action: 'User Registration', detail: 'New user signed up to OdysseusAI', time: '10 mins ago' },
          { id: 2, action: 'Product Update', detail: 'Product details updated successfully', time: '2 hours ago' },
          { id: 3, action: 'Blog Published', detail: 'New LLM architecture guide posted', time: '5 hours ago' },
          { id: 4, action: 'System Backup', detail: 'Automated database backup completed', time: '1 day ago' }
        ]);
      } catch (err) {
        console.error("Dashboard fetch error", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchStats();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const statCards = [
    { title: 'Total Users', value: stats.users, icon: Users, color: 'bg-[hsl(var(--primary))]' },
    { title: 'Total Products', value: stats.products, icon: ShoppingBag, color: 'bg-[hsl(var(--orange))]' },
    { title: 'Total Intel Logs', value: stats.posts, icon: FileText, color: 'bg-[hsl(var(--active-green))]' },
    { title: 'Total Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-[hsl(var(--light-blue))]' },
  ];

  return (
    <div className="space-y-[30px] animate-in fade-in duration-500 w-full">
      <Helmet>
        <title>Command Dashboard | Admin Portal</title>
      </Helmet>

      <NeoBrutalCard className="!p-[20px] md:!p-[30px] flex flex-col md:flex-row justify-between items-start md:items-center gap-[15px] w-full bg-[hsl(var(--sidebar))]">
        <div className="w-full">
          <h1 className="text-[24px] md:text-[36px] font-black uppercase tracking-tight mb-[5px] break-words">
            Welcome, {currentAdmin?.name || currentAdmin?.email?.split('@')[0]}
          </h1>
          <p className="text-[hsl(var(--muted-foreground))] font-bold text-[14px] md:text-[18px]">All global systems operational. Ready for commands.</p>
        </div>
      </NeoBrutalCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[15px] md:gap-[24px] w-full">
        {statCards.map((stat, i) => (
          <NeoBrutalCard key={i} className={`!p-[20px] md:!p-[24px] ${stat.color} text-black flex flex-col h-full w-full border-[4px] border-black shadow-[4px_4px_0px_0px_#000000]`}>
            <div className="flex justify-between items-start mb-[15px]">
              <div className="bg-white text-black border-[3px] border-black rounded-[8px] p-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <stat.icon size={24} strokeWidth={3} aria-hidden="true" />
              </div>
            </div>
            <h3 className="font-black uppercase text-[12px] md:text-[14px] mb-[5px] opacity-90 tracking-widest break-words w-full">{stat.title}</h3>
            <p className="text-[36px] md:text-[48px] font-black mt-auto leading-none" aria-live="polite">
              {isLoading ? <span className="text-[20px] md:text-[24px] animate-pulse">Scanning...</span> : stat.value}
            </p>
          </NeoBrutalCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[24px] w-full">
        <NeoBrutalCard className="lg:col-span-2 !p-[20px] md:!p-[30px] w-full overflow-hidden">
          <h2 className="text-[20px] md:text-[24px] font-black uppercase mb-[20px] flex items-center gap-[10px] border-b-[4px] border-black pb-[15px] break-words">
            <Activity size={28} strokeWidth={3} aria-hidden="true" className="flex-shrink-0" /> 
            Global Activity Feed
          </h2>
          <div className="flex flex-col gap-[15px] w-full">
            {activities.map(act => (
              <div key={act.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-[15px] border-[3px] border-black rounded-[8px] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] transition-colors gap-[10px] sm:gap-[15px] w-full overflow-hidden">
                <div className="w-full sm:w-auto overflow-hidden">
                  <h4 className="font-black uppercase text-[14px] text-black break-words w-full">{act.action}</h4>
                  <p className="font-bold text-[hsl(var(--muted-foreground))] text-[12px] md:text-[14px] break-words w-full line-clamp-2">{act.detail}</p>
                </div>
                <span className="font-black text-[10px] md:text-[12px] bg-[hsl(var(--accent))] text-black px-[10px] py-[4px] border-[2px] border-black rounded-full shadow-[2px_2px_0px_0px_#000000] self-start sm:self-auto whitespace-nowrap flex-shrink-0 uppercase tracking-widest">
                  {act.time}
                </span>
              </div>
            ))}
          </div>
        </NeoBrutalCard>

        <div className="flex flex-col gap-[24px] w-full">
          <NeoBrutalCard className="!p-[20px] md:!p-[30px] w-full">
            <h2 className="text-[20px] md:text-[24px] font-black uppercase mb-[20px] border-b-[4px] border-black pb-[15px] break-words">Quick Commands</h2>
            <div className="flex flex-col gap-[15px] w-full">
              <Link to="/admin/neural-grid-dashboard" className="w-full">
                <NeoBrutalButton variant="primary" className="w-full text-[14px] flex items-center justify-center gap-2 py-[12px] bg-[#1a1a1a] text-[#00d7fe] border-[#00d7fe] hover:bg-[#00d7fe] hover:text-[#1a1a1a]">
                  <Network size={18} strokeWidth={3} aria-hidden="true" className="flex-shrink-0" /> Neural Grid
                </NeoBrutalButton>
              </Link>
              <Link to="/admin/blog/new" className="w-full">
                <NeoBrutalButton variant="primary" className="w-full text-[14px] flex items-center justify-center gap-2 py-[12px]">
                  <PlusCircle size={18} strokeWidth={3} aria-hidden="true" className="flex-shrink-0" /> Publish Intel
                </NeoBrutalButton>
              </Link>
              <Link to="/admin/products" className="w-full">
                <NeoBrutalButton variant="accent" className="w-full text-[14px] flex items-center justify-center gap-2 py-[12px]">
                  <ShoppingBag size={18} strokeWidth={3} aria-hidden="true" className="flex-shrink-0" /> Add Blueprint
                </NeoBrutalButton>
              </Link>
              <Link to="/admin/users" className="w-full">
                <NeoBrutalButton variant="secondary" className="w-full text-[14px] flex items-center justify-center gap-2 py-[12px]">
                  <UserPlus size={18} strokeWidth={3} aria-hidden="true" className="flex-shrink-0" /> Provision User
                </NeoBrutalButton>
              </Link>
              <Link to="/admin/analytics" className="w-full">
                <NeoBrutalButton variant="destructive" className="w-full text-[14px] flex items-center justify-center gap-2 py-[12px]">
                  <BarChart size={18} strokeWidth={3} aria-hidden="true" className="flex-shrink-0" /> System Metrics
                </NeoBrutalButton>
              </Link>
            </div>
          </NeoBrutalCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
