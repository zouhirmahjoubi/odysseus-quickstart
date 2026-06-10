
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { Activity, ArrowLeft, RefreshCw } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

const WebhookLogsPage = () => {
  const { webhookId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const url = webhookId ? `/webhooks/${webhookId}/logs` : '/webhooks/all/logs'; // Fallback if API supports it, though API docs mention /webhooks/:webhookId/logs
      const res = await apiServerClient.fetch(url);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.items || data || []);
      }
    } catch (err) {
      toast.error('Failed to load webhook logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (webhookId) fetchLogs();
    else toast.error('Webhook ID required for logs');
  }, [webhookId]);

  const handleRetry = async (logId) => {
    try {
      const res = await apiServerClient.fetch(`/webhooks/${webhookId}/logs/${logId}/retry`, { method: 'POST' });
      if (!res.ok) throw new Error('Retry failed');
      toast.success('Retry dispatched');
      fetchLogs();
      setSelectedLog(null);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Webhook Logs - OdysseusAI</title></Helmet>

      <div className="mb-8">
        <Link to="/settings/webhooks" className="inline-flex items-center font-bold mb-6 hover:underline">
          <ArrowLeft size={16} className="mr-2" /> Back to Webhooks
        </Link>
        <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
          <Activity size={36} className="text-[var(--primary-accent)]" /> Delivery Logs
        </h1>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white min-h-[500px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black uppercase tracking-wide text-sm">
              <th className="p-4 font-black">Timestamp</th>
              <th className="p-4 font-black">Event Type</th>
              <th className="p-4 font-black">Status</th>
              <th className="p-4 font-black">HTTP</th>
              <th className="p-4 font-black text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold">Loading Logs...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center font-bold text-gray-500">No logs recorded yet.</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50">
                  <td className="p-4 font-bold text-sm">{new Date(log.created_date || log.created).toLocaleString()}</td>
                  <td className="p-4 font-bold font-jetbrains-mono text-sm">{log.event_type}</td>
                  <td className="p-4">
                    <span className={`neo-badge ${log.status === 'success' ? 'neo-badge-success' : log.status === 'pending' ? 'neo-badge-warning' : 'neo-badge-error'}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 font-bold font-jetbrains-mono text-sm">{log.response_code || '-'}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => setSelectedLog(log)} className="neo-button bg-black text-white px-4 py-1.5 text-sm">View Payload</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm py-10">
          <div className="neo-card bg-white w-full max-w-4xl max-h-full flex flex-col relative my-auto">
            <div className="flex justify-between items-center border-b-[3px] border-black pb-4 mb-4 shrink-0">
              <h2 className="text-2xl font-black space-grotesk">Delivery Details</h2>
              <span className={`neo-badge ${selectedLog.status === 'success' ? 'neo-badge-success' : 'neo-badge-error'}`}>
                {selectedLog.status.toUpperCase()} • {selectedLog.response_code || 'No Response'}
              </span>
            </div>
            
            <div className="overflow-y-auto space-y-6 pr-2">
              <div>
                <h3 className="font-black mb-2 text-sm uppercase tracking-wide">Request Payload</h3>
                <pre className="neo-code-block">{JSON.stringify(selectedLog.request_body, null, 2) || 'No body'}</pre>
              </div>
              
              <div>
                <h3 className="font-black mb-2 text-sm uppercase tracking-wide">Response</h3>
                <pre className="neo-code-block">{selectedLog.response_body || 'No response body'}</pre>
              </div>
            </div>

            <div className="flex justify-between items-center border-t-[3px] border-black pt-4 mt-6 shrink-0">
              <button onClick={() => setSelectedLog(null)} className="neo-button bg-gray-200">Close</button>
              {selectedLog.status !== 'success' && (
                <button onClick={() => handleRetry(selectedLog.id)} className="neo-button bg-[var(--primary-accent)] text-black">
                  <RefreshCw size={18} className="mr-2" /> Retry Delivery
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebhookLogsPage;
