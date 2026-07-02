import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Pagination, Skeleton, Input } from '@heroui/react';
import pb from '@/lib/pocketbaseClient.js';
import BlogCard from '@/components/BlogCard.jsx';
import { fallbackBlogs } from '@/data/fallbackBlogs.js';

// ── Animation Variants ──────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

const heroVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const POSTS_PER_PAGE = 9;

// ── Component ────────────────────────────────────────────────────────
const BlogListPage = () => {
  const [searchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPublishedPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let dbItems = [];
      try {
        const result = await pb.collection('blog_posts').getList(1, 50, { 
          filter: 'status="published"',
          sort: '-publication_date,-created',
          expand: 'category,tags',
          $autoCancel: false 
        });
        dbItems = result.items || [];
      } catch (dbErr) {
        console.warn("Pocketbase fetch failed, utilizing fallback static articles:", dbErr);
      }

      // Merge unique items by slug, prioritizing database records
      const combined = [...dbItems];
      fallbackBlogs.forEach(staticPost => {
        if (!combined.some(item => item.slug === staticPost.slug)) {
          combined.push(staticPost);
        }
      });

      setPosts(combined);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      // Fallback directly to static blogs if everything fails
      setPosts(fallbackBlogs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublishedPosts();
  }, []);

  const filteredPosts = posts.filter(p => 
    (p.title && p.title.toLowerCase().includes(search.toLowerCase())) || 
    (p.excerpt && p.excerpt.toLowerCase().includes(search.toLowerCase())) ||
    (p.expand?.category && p.expand.category.name.toLowerCase().includes(search.toLowerCase())) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // Derived pagination
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE)), [filteredPosts.length]);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  // Unique categories for chip filters
  const categories = useMemo(() => {
    const cats = new Set();
    posts.forEach(p => {
      const cat = p.expand?.category?.name || p.category;
      if (cat) cats.add(cat);
    });
    return [...cats];
  }, [posts]);

  const [activeCategory, setActiveCategory] = useState(null);

  const categoryFilteredPosts = useMemo(() => {
    if (!activeCategory) return paginatedPosts;
    return paginatedPosts.filter(p => {
      const cat = p.expand?.category?.name || p.category;
      return cat === activeCategory;
    });
  }, [paginatedPosts, activeCategory]);

  return (
    <div className="max-w-7xl mx-auto pb-24 pt-6 md:pt-12 px-4 sm:px-6 space-y-12">
      <Helmet>
        <title>Engineering Blog | OdysseusAI</title>
      </Helmet>

      {/* ── Hero ── */}
      <div className="text-center mb-14 select-none">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 bg-[#E73A5A]/10 px-4 py-1.5 rounded-full border border-[#E73A5A]/20 text-sm font-bold mb-6">
            <span className="bg-[#E73A5A] px-2 py-0.5 rounded-full text-xs text-white font-black">BLOG</span>
            <span className="text-gray-300 font-semibold">Knowledge Base • Guides & Tutorials</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Engineering{' '}
            <span className="text-[#E73A5A] bg-[#E73A5A]/10 px-4 py-1 border border-[#E73A5A]/20 rounded-3xl inline-block transform -rotate-1 shadow-[0_0_15px_rgba(231, 58, 90,0.2)]">
              Transmissions
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed mb-8">
            Deep dives into enterprise LLM architectures, local deployment strategies, and autonomous agent frameworks.
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex flex-wrap justify-center gap-4 mt-2 select-none">
            {[
              { icon: '📝', val: `${posts.length || fallbackBlogs.length}`, label: 'Transmissions' },
              { icon: '📂', val: `${categories.length || 3}`, label: 'Categories' },
              { icon: '⚡', val: 'Active', label: 'Updates' },
              { icon: '🛡️', val: 'Local', label: 'Knowledge' },
            ].map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl px-5 py-3 flex items-center gap-3 backdrop-blur-md">
                <span className="text-xl">{s.icon}</span>
                <div className="text-left">
                  <div className="text-lg font-black text-white leading-none">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Search Bar ──────────────────────────────────────────────── */}
      <motion.div
        className="relative max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
      >
        <Input
          placeholder="Search transmissions..."
          value={search}
          onValueChange={setSearch}
          startContent={<Search className="text-white/40 w-5 h-5" strokeWidth={3} />}
          classNames={{
            base: 'w-full',
            mainWrapper: 'w-full',
            inputWrapper: [
              'bg-white/5 border border-white/10 rounded-2xl',
              'shadow-[0_4px_12px_rgba(0,0,0,0.2)]',
              'hover:border-white/20',
              'data-[focused=true]:border-[#E73A5A] data-[focused=true]:ring-2 data-[focused=true]:ring-[#E73A5A]/25',
              'transition-all duration-300',
              'py-3 md:py-4 px-4 h-auto min-h-[52px]',
            ].join(' '),
            input: 'font-bold text-lg text-white placeholder:text-white/40',
          }}
          size="lg"
          variant="bordered"
        />
      </motion.div>

      {/* ── Category Chips ──────────────────────────────────────────── */}
      {!loading && !error && categories.length > 0 && (
        <motion.div
          className="flex flex-wrap gap-3 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Chip
            classNames={{
              base: `cursor-pointer border border-white/10 rounded-lg transition-all duration-200 ${
                !activeCategory
                  ? 'bg-[#E73A5A] text-white shadow-[0_0_15px_rgba(231, 58, 90,0.3)] border-[#E73A5A] -translate-y-0.5'
                  : 'bg-white/5 text-white/80 hover:-translate-y-0.5'
              }`,
              content: 'font-black uppercase tracking-wider text-xs',
            }}
            variant="flat"
            onClick={() => setActiveCategory(null)}
          >
            <Sparkles className="w-3 h-3 inline mr-1" /> All
          </Chip>
          {categories.map(cat => (
            <Chip
              key={cat}
              classNames={{
                base: `cursor-pointer border border-white/10 rounded-lg transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#E73A5A] text-white shadow-[0_0_15px_rgba(231, 58, 90,0.3)] border-[#E73A5A] -translate-y-0.5'
                    : 'bg-white/5 text-white/80 hover:-translate-y-0.5'
                }`,
                content: 'font-black uppercase tracking-wider text-xs',
              }}
              variant="flat"
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            >
              {cat}
            </Chip>
          ))}
        </motion.div>
      )}

      {/* ── Content Area ────────────────────────────────────────────── */}
      {error ? (
        /* ── Error State ──────────────────────────────────────────── */
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card
            classNames={{
              base: 'bg-red-500/10 border-red-500/20 border rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
            }}
            shadow="none"
          >
            <CardBody className="p-8 text-center flex flex-col items-center">
              <AlertCircle size={48} className="text-[#E73A5A] mb-4" strokeWidth={2} />
              <h3 className="text-2xl font-black uppercase mb-2 text-[#E73A5A]">Connection Error</h3>
              <p className="font-bold text-white/80 mb-6 text-left">{error}</p>
              <Button
                onPress={fetchPublishedPosts}
                className="bg-[#E73A5A] hover:bg-[#E73A5A]/90 text-white font-black uppercase tracking-wider px-6 py-2 rounded-xl"
                size="lg"
                variant="flat"
              >
                Retry Connection
              </Button>
            </CardBody>
          </Card>
        </motion.div>

      ) : loading ? (
        /* ── Skeleton Loading State ────────────────────────────────── */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card
              key={i}
              classNames={{
                base: 'border border-white/10 rounded-2xl bg-white/5 overflow-hidden',
              }}
              shadow="none"
            >
              <CardBody className="p-6 space-y-4">
                <Skeleton
                  classNames={{
                    base: 'rounded-lg bg-white/5 border border-white/10',
                  }}
                  className="h-48 w-full"
                />
                <div className="space-y-3 pt-2">
                  <Skeleton
                    classNames={{ base: 'rounded-md bg-white/5' }}
                    className="h-5 w-20"
                  />
                  <Skeleton
                    classNames={{ base: 'rounded-md bg-white/5' }}
                    className="h-7 w-3/4"
                  />
                  <Skeleton
                    classNames={{ base: 'rounded-md bg-white/5' }}
                    className="h-4 w-full"
                  />
                  <Skeleton
                    classNames={{ base: 'rounded-md bg-white/5' }}
                    className="h-4 w-5/6"
                  />
                </div>
              </CardBody>
              <CardFooter className="px-6 pb-6 pt-0 flex justify-between items-center border-t border-white/5">
                <div className="flex gap-2 items-center">
                  <Skeleton classNames={{ base: 'rounded-full bg-white/5' }} className="h-8 w-8 animate-pulse" />
                  <Skeleton classNames={{ base: 'rounded-md bg-white/5' }} className="h-4 w-20 animate-pulse" />
                </div>
                <Skeleton classNames={{ base: 'rounded-md bg-white/5' }} className="h-4 w-16 animate-pulse" />
              </CardFooter>
            </Card>
          ))}
        </div>

      ) : categoryFilteredPosts.length === 0 ? (
        /* ── Empty State ──────────────────────────────────────────── */
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card
            classNames={{
              base: 'bg-white/5 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]',
            }}
            shadow="none"
          >
            <CardBody className="p-16 text-center flex flex-col items-center justify-center">
              <BookOpen size={64} className="text-white/20 mb-4" />
              <h3 className="text-2xl font-black uppercase mb-4 text-white/60">No transmissions found</h3>
              <p className="font-bold text-white/40 mb-6">Adjust your search parameters and try again.</p>
              {(search || activeCategory) && (
                <Button
                  onPress={() => { setSearch(''); setActiveCategory(null); }}
                  className="bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black uppercase tracking-wider"
                  size="lg"
                  variant="flat"
                >
                  Clear Filters
                </Button>
              )}
            </CardBody>
          </Card>
        </motion.div>

      ) : (
        /* ── Post Grid ────────────────────────────────────────────── */
        <AnimatePresence mode="wait">
          <motion.div
            key={`page-${currentPage}-${activeCategory || 'all'}`}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            {categoryFilteredPosts.map((post, index) => (
              <motion.div key={post.id || post.slug} variants={cardVariants}>
                <BlogCard
                  title={post.title}
                  category={post.expand?.category?.name || post.category || 'Uncategorized'}
                  description={post.excerpt || post.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                  author={post.author}
                  date={post.publication_date || post.created}
                  slug={post.slug}
                  imageRecord={post}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Pagination ──────────────────────────────────────────────── */}
      {!loading && !error && totalPages > 1 && (
        <motion.div
          className="flex justify-center pt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            classNames={{
              wrapper: 'gap-2',
              item: [
                'bg-white/5 text-white/80 font-black border border-white/10',
                'rounded-lg transition-all duration-200',
                'hover:-translate-y-0.5 hover:bg-white/10 hover:text-white',
                'data-[active=true]:bg-[#E73A5A] data-[active=true]:text-white data-[active=true]:-translate-y-0.5 data-[active=true]:shadow-[0_0_15px_rgba(231, 58, 90,0.3)] data-[active=true]:border-[#E73A5A]',
                'min-w-[40px] h-[40px]',
              ].join(' '),
              cursor: 'hidden',
              prev: 'bg-white/5 text-white border border-white/10 rounded-lg hover:-translate-y-0.5 min-w-[40px] h-[40px]',
              next: 'bg-white/5 text-white border border-white/10 rounded-lg hover:-translate-y-0.5 min-w-[40px] h-[40px]',
            }}
            size="lg"
          />
        </motion.div>
      )}
    </div>
  );
};

export default BlogListPage;
