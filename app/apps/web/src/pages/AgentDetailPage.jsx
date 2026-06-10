
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Star, Download, BookOpen, LifeBuoy, CheckCircle, Bot } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

const AgentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgent = async () => {
      try {
        const record = await pb.collection('market_agents').getOne(id, { $autoCancel: false });
        setAgent(record);
      } catch (err) {
        console.error(err);
        navigate('/market-agents');
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl">Loading Agent...</div>;
  if (!agent) return null;

  return (
    <div className="bg-[hsl(var(--background))] min-h-screen pb-20">
      <Helmet><title>{agent.name} - OdysseusAI</title></Helmet>

      <div className="w-full bg-[var(--background-light)] dark:bg-black border-b-[3px] border-black pt-12 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          <Link to="/market-agents" className="inline-flex items-center font-bold mb-8 hover:underline">
            <ArrowLeft size={16} className="mr-2" /> Back to Market
          </Link>
          
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 bg-[var(--secondary-accent)] neo-border flex items-center justify-center flex-shrink-0 overflow-hidden">
              {agent.logo ? (
                <img src={pb.files.getUrl(agent, agent.logo)} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <Bot size={64} className="text-black" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <span className="neo-badge bg-[var(--primary-accent)] text-black">{agent.type}</span>
                <span className="neo-badge bg-white text-black">{agent.category}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black space-grotesk leading-tight mb-4">{agent.name}</h1>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 max-w-3xl">{agent.description}</p>
            </div>
            
            <div className="neo-card bg-white w-full md:w-72 flex-shrink-0">
              <div className="text-3xl font-black mb-2">{agent.price === 0 ? 'Free' : `$${agent.price}`}</div>
              <div className="flex items-center text-yellow-500 font-bold mb-6">
                <Star size={20} className="fill-current mr-1" />
                <span className="text-black dark:text-white">{agent.rating || 'New'} ({agent.reviews || 0} reviews)</span>
              </div>
              <Link to={`/setup-agent/${agent.id}`} className="neo-button bg-[var(--primary-accent)] text-black w-full mb-3">
                <Download size={20} className="mr-2" /> Install Agent
              </Link>
              <Link to={`/test-agent/${agent.id}`} className="neo-button bg-white text-black w-full">
                Test Drive
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2 space-y-12">
          <section>
            <h2 className="text-3xl font-black space-grotesk mb-6 border-b-[3px] border-black pb-2">Overview</h2>
            <div className="prose max-w-none font-medium text-lg whitespace-pre-wrap">
              {agent.long_description || agent.description}
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black space-grotesk mb-6 border-b-[3px] border-black pb-2">Features</h2>
            <ul className="space-y-4">
              {(agent.features || ['Advanced reasoning', 'Custom tool integration', 'Memory management']).map((feature, i) => (
                <li key={i} className="flex items-start font-bold text-lg">
                  <CheckCircle size={24} className="text-[var(--primary-accent)] mr-3 flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-8">
          <div className="neo-card bg-[var(--background-light)] dark:bg-black">
            <h3 className="text-xl font-black space-grotesk mb-4">Requirements</h3>
            <ul className="space-y-2 font-bold text-sm">
              {(agent.requirements || ['OpenAI API Key', 'Python 3.10+']).map((req, i) => (
                <li key={i} className="flex items-center before:content-['•'] before:mr-2">{req}</li>
              ))}
            </ul>
          </div>

          <div className="neo-card bg-white">
            <h3 className="text-xl font-black space-grotesk mb-4">Resources</h3>
            <div className="space-y-3">
              <a href={agent.documentation_url || '#'} target="_blank" rel="noreferrer" className="flex items-center font-bold hover:text-[var(--primary-accent)] transition-colors">
                <BookOpen size={18} className="mr-2" /> Documentation
              </a>
              <a href={`mailto:${agent.support_email || 'support@odysseusai.com'}`} className="flex items-center font-bold hover:text-[var(--primary-accent)] transition-colors">
                <LifeBuoy size={18} className="mr-2" /> Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetailPage;
