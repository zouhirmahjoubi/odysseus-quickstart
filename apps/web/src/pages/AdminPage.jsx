
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Package, 
  FileEdit, 
  DollarSign, 
  Download, 
  TrendingUp, 
  UploadCloud, 
  CheckCircle 
} from 'lucide-react';
import Sidebar from '@/components/Sidebar.jsx';
import NeoBrutalCard from '@/components/NeoBrutalCard.jsx';
import NeoBrutalButton from '@/components/NeoBrutalButton.jsx';
import NeoBrutalInput from '@/components/NeoBrutalInput.jsx';
import NeoBrutalTextarea from '@/components/NeoBrutalTextarea.jsx';
import NeoBrutalTable from '@/components/NeoBrutalTable.jsx';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Blog CMS State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Digital Product Manager State
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [checkoutLink, setCheckoutLink] = useState('');

  const blogCategories = [
    'Tutorials', 'System Updates', 'AI Engine Setup', 
    'Security', 'Performance', 'Case Studies'
  ];

  const inventoryData = [
    { id: 1, name: 'AI Model Pack', price: '$49.00', downloads: '128', status: 'Active' },
    { id: 2, name: 'Security Guide', price: '$19.00', downloads: '342', status: 'Active' },
    { id: 3, name: 'Integration Toolkit', price: '$99.00', downloads: '45', status: 'Active' }
  ];

  const handleBlogSubmit = (e) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;
    setPublishSuccess(true);
    setBlogTitle('');
    setBlogCategory('');
    setBlogContent('');
    setTimeout(() => setPublishSuccess(false), 3000);
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    // Placeholder for product submission logic
    setProductName('');
    setProductPrice('');
    setCheckoutLink('');
  };

  return (
    <>
      <Helmet>
        <title>Admin Panel - OdysseusAI</title>
        <meta name="description" content="Admin Control Panel for OdysseusAI Operator Dashboard" />
      </Helmet>

      <div className="min-h-screen bg-[#FFFDE6] flex flex-col md:flex-row">
        <Sidebar activeTab="admin" />
        
        <main className="flex-1 p-6 md:p-10 pt-20 md:pt-10 max-w-7xl mx-auto w-full">
          {/* Main Dashboard Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-black tracking-tight mb-6">
              Control Panel // Admin Session Active 🛠️
            </h1>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-4 border-b-4 border-black pb-4">
              {[
                { id: 'overview', label: 'Store Overview', icon: BarChart },
                { id: 'blog', label: 'Blog CMS Engine', icon: FileEdit },
                { id: 'products', label: 'Digital Product Manager', icon: Package }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    px-5 py-3 font-bold text-lg neo-border transition-all
                    flex items-center gap-2
                    ${activeTab === tab.id 
                      ? 'bg-[#BBF7D0] neo-shadow translate-y-[-2px]' 
                      : 'bg-white hover:bg-[#BAE6FD]'
                    }
                  `}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              
              {/* === STORE OVERVIEW MODULE === */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <NeoBrutalCard bgColor="#FFEDD5">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-black">Total Sales Counter</h3>
                      <div className="p-2 bg-white neo-border rounded-full">
                        <DollarSign size={24} className="text-black" />
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p className="text-3xl font-extrabold text-black mb-1">$12,450.00</p>
                      <p className="text-black/80 font-bold">this month</p>
                    </div>
                  </NeoBrutalCard>

                  <NeoBrutalCard bgColor="#FFFFFF">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-black">Active Digital Products</h3>
                      <div className="p-2 bg-[#BBF7D0] neo-border rounded-full">
                        <Package size={24} className="text-black" />
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p className="text-3xl font-extrabold text-black mb-1">8 products</p>
                      <p className="text-black/80 font-bold">342 downloads total</p>
                    </div>
                  </NeoBrutalCard>

                  <NeoBrutalCard bgColor="#FFFFFF" className="lg:col-span-1 md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-black">Blog Traffic Insights</h3>
                      <div className="p-2 bg-[#BAE6FD] neo-border rounded-full">
                        <TrendingUp size={24} className="text-black" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto">
                      {[
                        { title: 'OLLAMA Setup Guide', views: '4.2k' },
                        { title: 'Prompt Engineering 101', views: '3.8k' },
                        { title: 'AI Security Best Practices', views: '2.1k' }
                      ].map((post, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-[#FFFDE6] neo-border p-3">
                          <span className="font-bold text-black truncate max-w-[180px]">{post.title}</span>
                          <span className="font-bold text-black bg-[#BBF7D0] px-2 py-1 neo-border text-sm">
                            {post.views}
                          </span>
                        </div>
                      ))}
                    </div>
                  </NeoBrutalCard>
                </div>
              )}


              {/* === BLOG CMS ENGINE MODULE === */}
              {activeTab === 'blog' && (
                <div className="max-w-4xl">
                  <h2 className="text-2xl font-extrabold mb-6">Blog CMS Engine</h2>
                  
                  {publishSuccess && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-[#BBF7D0] neo-border neo-shadow flex items-center gap-3 font-bold"
                    >
                      <CheckCircle size={24} />
                      Article published successfully to odysseusai.ai!
                    </motion.div>
                  )}

                  <form onSubmit={handleBlogSubmit} className="space-y-6 bg-white neo-border neo-shadow p-6 md:p-8">
                    <NeoBrutalInput 
                      label="Article Title" 
                      id="blogTitle"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      placeholder="Enter a catchy title..."
                      required
                    />

                    <div>
                      <label className="font-bold text-black block mb-3">Category Tags</label>
                      <div className="flex flex-wrap gap-3">
                        {blogCategories.map(cat => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setBlogCategory(cat)}
                            className={`
                              px-4 py-2 font-bold text-sm neo-border transition-all
                              ${blogCategory === cat 
                                ? 'bg-[#FFEDD5] neo-shadow translate-y-[-2px]' 
                                : 'bg-gray-100 hover:bg-[#FFFDE6]'
                              }
                            `}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    <NeoBrutalTextarea 
                      label="Article Content" 
                      id="blogContent"
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      placeholder="Write your brilliant intel here... (Markdown supported)"
                      rows={10}
                      required
                    />

                    <div className="pt-4 border-t-4 border-black">
                      <NeoBrutalButton 
                        type="submit" 
                        variant="mint-green" 
                        className="w-full md:w-auto text-lg flex items-center justify-center gap-2"
                      >
                        🚀 Publish to odysseusai.ai
                      </NeoBrutalButton>
                    </div>
                  </form>
                </div>
              )}


              {/* === DIGITAL PRODUCT MANAGER MODULE === */}
              {activeTab === 'products' && (
                <div className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-extrabold mb-6">Digital Product Manager</h2>
                    <form onSubmit={handleProductSubmit} className="bg-white neo-border neo-shadow p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      
                      <div className="space-y-6 md:col-span-1">
                        <NeoBrutalInput 
                          label="Product Name" 
                          id="productName"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          placeholder="e.g., Ultimate Prompt Library"
                          required
                        />

                        <div className="relative">
                          <NeoBrutalInput 
                            label="Price ($ USD)" 
                            id="productPrice"
                            type="number"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                            placeholder="0.00"
                            className="pl-8"
                            required
                          />
                          <span className="absolute left-3 top-[38px] font-bold text-black text-lg">$</span>
                        </div>

                        <NeoBrutalInput 
                          label="Stripe/PayPal Checkout Link" 
                          id="checkoutLink"
                          type="url"
                          value={checkoutLink}
                          onChange={(e) => setCheckoutLink(e.target.value)}
                          placeholder="https://buy.stripe.com/..."
                          required
                        />
                      </div>

                      <div className="space-y-6 md:col-span-1">
                        <div>
                          <label className="font-bold text-black block mb-2">Upload Digital Asset</label>
                          <div className="border-[3px] border-dashed border-black bg-[#FFFDE6] p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FFEDD5] transition-colors">
                            <UploadCloud size={48} className="text-black mb-4" />
                            <p className="font-bold text-lg mb-1">Drag & drop your file here</p>
                            <p className="font-medium text-black/60">(ZIP, PDF, EXE)</p>
                          </div>
                        </div>

                        <NeoBrutalButton 
                          type="submit" 
                          variant="mint-green" 
                          className="w-full text-lg"
                        >
                          + Add Product
                        </NeoBrutalButton>
                      </div>
                    </form>
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold mb-4">Current Inventory</h3>
                    <NeoBrutalTable 
                      columns={[
                        { header: 'Product Name', accessor: 'name' },
                        { header: 'Price', accessor: 'price' },
                        { header: 'Downloads', accessor: 'downloads' },
                        { header: 'Status', accessor: 'status' }
                      ]}
                      data={inventoryData}
                      renderRowActions={(row) => (
                        <div className="flex flex-wrap gap-2">
                          <NeoBrutalButton variant="mint-green" className="!px-3 !py-1 text-sm">
                            Edit
                          </NeoBrutalButton>
                          <NeoBrutalButton variant="orange" className="!px-3 !py-1 text-sm">
                            Archive
                          </NeoBrutalButton>
                        </div>
                      )}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </main>
      </div>
    </>
  );
}

export default AdminPage;
