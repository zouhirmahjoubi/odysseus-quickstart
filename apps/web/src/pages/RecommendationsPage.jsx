
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Sparkles, Bot, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      apiServerClient.fetch('/recommendations/agents', { headers: { 'x-user-id': user.id } })
        .then(res => res.json())
        .then(data => setRecommendations(data.recommendations || []))
        .catch(() => toast.error('Failed to load recommendations'))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handleFeedback = async (id, type) => {
    if (!user) return;
    try {
      await apiServerClient.fetch('/recommendations/feedback', {
        method: 'POST',
        headers: { 'x-user-id': user.id, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recommendation_id: id, feedback: type })
      });
      toast.success('Feedback recorded. We will adjust your suggestions.');
      // Remove from list optimistically
      setRecommendations(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      toast.error('Failed to submit feedback');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>For You - OdysseusAI</title></Helmet>

      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-[var(--primary-accent)] neo-border mb-6 shadow-[4px_4px_0px_0px_#000000]">
          <Sparkles size={32} className="text-black" />
        </div>
        <h1 className="text-5xl font-black space-grotesk mb-4">Recommended For You</h1>
        <p className="text-xl font-bold text-gray-600 max-w-2xl mx-auto">
          AI-curated agents and workflows based on your workspace activity.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          {[1,2,3,4].map(i => <div key={i} className="h-48 bg-white neo-border"></div>)}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="neo-card bg-white text-center py-20">
          <Sparkles size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-2xl font-black mb-2">No recommendations yet</h3>
          <p className="font-bold text-gray-500">Keep exploring and using agents. We'll learn what you need.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recommendations.map(rec => (
            <div key={rec.id} className="neo-card bg-white flex flex-col relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-[var(--secondary-accent)] px-4 py-1 font-black text-sm border-b-[3px] border-l-[3px] border-black">
                {rec.score}% Match
              </div>
              
              <div className="flex items-start gap-4 mb-4 pt-4">
                <div className="w-16 h-16 bg-[var(--tertiary-accent)] neo-border flex items-center justify-center flex-shrink-0">
                  <Bot size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black space-grotesk mb-1">{rec.name || 'AI Agent'}</h3>
                  <p className="font-bold text-sm text-[var(--primary-accent)] uppercase tracking-wide bg-black inline-block px-2 py-0.5">Why we picked this</p>
                  <p className="font-medium mt-2 text-gray-600 italic">"{rec.reason || 'Based on your recent workflow activity.'}"</p>
                </div>
              </div>
              
              <div className="flex gap-4 mt-auto pt-6">
                <Link to={`/market-agents/${rec.agent_id}`} className="neo-button bg-black text-white flex-grow px-0">
                  View Details <ArrowRight size={16} className="ml-2" />
                </Link>
                <button onClick={() => handleFeedback(rec.id, 'like')} className="neo-button bg-[var(--secondary-accent)] px-4" aria-label="More like this"><ThumbsUp size={20} /></button>
                <button onClick={() => handleFeedback(rec.id, 'dislike')} className="neo-button bg-gray-200 px-4" aria-label="Less like this"><ThumbsDown size={20} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationsPage;
