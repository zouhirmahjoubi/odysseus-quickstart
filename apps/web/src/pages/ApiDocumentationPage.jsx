
import React from 'react';
import { Helmet } from 'react-helmet';
import { BookOpen, Key, Code, Terminal } from 'lucide-react';

const ApiDocumentationPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-8">
      <Helmet><title>API Documentation - OdysseusAI</title></Helmet>
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <div className="neo-card bg-white sticky top-24 p-4">
          <h3 className="font-black space-grotesk text-lg mb-4 border-b-[3px] border-black pb-2">Contents</h3>
          <ul className="space-y-2 font-bold text-sm">
            <li><a href="#overview" className="hover:text-[var(--primary-accent)]">Overview</a></li>
            <li><a href="#authentication" className="hover:text-[var(--primary-accent)]">Authentication</a></li>
            <li><a href="#endpoints" className="hover:text-[var(--primary-accent)]">Core Endpoints</a></li>
            <li><a href="#webhooks" className="hover:text-[var(--primary-accent)]">Webhooks</a></li>
            <li><a href="#errors" className="hover:text-[var(--primary-accent)]">Error Handling</a></li>
          </ul>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 space-y-12">
        <div className="border-b-[3px] border-black pb-8">
          <h1 className="text-5xl font-black space-grotesk mb-4 flex items-center gap-3">
            <BookOpen size={40} /> API Reference
          </h1>
          <p className="text-xl font-bold text-gray-600">
            Integrate OdysseusAI agents and analytics directly into your applications.
          </p>
        </div>

        <section id="overview" className="neo-card bg-[var(--background-light)]">
          <h2 className="text-2xl font-black space-grotesk mb-4">Overview</h2>
          <p className="font-medium mb-4">
            The OdysseusAI API is organized around REST. Our API has predictable resource-oriented URLs, accepts form-encoded request bodies, returns JSON-encoded responses, and uses standard HTTP response codes, authentication, and verbs.
          </p>
          <div className="bg-black text-white p-4 neo-border font-jetbrains-mono text-sm">
            Base URL: https://api.odysseusai.com/v1
          </div>
        </section>

        <section id="authentication" className="neo-card bg-white">
          <h2 className="text-2xl font-black space-grotesk mb-4 flex items-center gap-2"><Key size={24}/> Authentication</h2>
          <p className="font-medium mb-4">
            Authenticate your API requests by including your secret API key in the request headers. You can manage your API keys in the <a href="/settings/api-keys" className="text-blue-600 underline font-bold">API Keys Dashboard</a>.
          </p>
          <div className="bg-black text-[var(--primary-accent)] p-4 neo-border font-jetbrains-mono text-sm mb-4">
            Authorization: Bearer YOUR_API_KEY
          </div>
          <p className="text-sm font-bold text-red-600">
            Warning: Do not share your secret API keys in publicly accessible areas such as GitHub, client-side code, and so forth.
          </p>
        </section>

        <section id="endpoints" className="space-y-6">
          <h2 className="text-3xl font-black space-grotesk border-b-[3px] border-black pb-2">Core Endpoints</h2>
          
          <div className="neo-card bg-white p-0 overflow-hidden">
            <div className="bg-gray-100 p-4 border-b-[3px] border-black flex items-center gap-4">
              <span className="neo-badge bg-[var(--secondary-accent)] text-black text-sm">GET</span>
              <span className="font-jetbrains-mono font-bold">/v1/agents</span>
            </div>
            <div className="p-6">
              <p className="font-medium mb-4">Returns a list of your installed agents.</p>
              <h4 className="font-black mb-2">Example Request (cURL)</h4>
              <pre className="bg-black text-white p-4 neo-border font-jetbrains-mono text-sm overflow-x-auto">
{`curl -X GET https://api.odysseusai.com/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
              </pre>
            </div>
          </div>

          <div className="neo-card bg-white p-0 overflow-hidden">
            <div className="bg-gray-100 p-4 border-b-[3px] border-black flex items-center gap-4">
              <span className="neo-badge bg-[var(--primary-accent)] text-black text-sm">POST</span>
              <span className="font-jetbrains-mono font-bold">/v1/agents/:id/test</span>
            </div>
            <div className="p-6">
              <p className="font-medium mb-4">Execute a test run on a specific agent.</p>
              <h4 className="font-black mb-2">Example Request (JavaScript)</h4>
              <pre className="bg-black text-white p-4 neo-border font-jetbrains-mono text-sm overflow-x-auto">
{`const response = await fetch('https://api.odysseusai.com/v1/agents/ag_123/test', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: "Analyze this dataset..."
  })
});
const data = await response.json();`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ApiDocumentationPage;
