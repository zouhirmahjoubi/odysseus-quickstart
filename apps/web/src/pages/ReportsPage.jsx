
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { FileText, Plus, Download, Calendar, Trash2 } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const ReportsPage = () => {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await apiServerClient.fetch('/reports', { headers: { 'x-user-id': user.id } });
      const data = await res.json();
      setReports(data.items || []);
    } catch (err) {
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report?')) return;
    try {
      await apiServerClient.fetch(`/reports/${id}`, { method: 'DELETE', headers: { 'x-user-id': user.id } });
      toast.success('Report deleted');
      fetchReports();
    } catch (err) {
      toast.error('Failed to delete report');
    }
  };

  const handleGenerate = async (id) => {
    try {
      toast.info('Generating report...');
      await apiServerClient.fetch(`/reports/${id}/generate`, { method: 'POST', headers: { 'x-user-id': user.id } });
      toast.success('Report generated successfully! Check your downloads.');
      fetchReports();
    } catch (err) {
      toast.error('Generation failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Helmet><title>Analytics Reports - OdysseusAI</title></Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b-[3px] border-black pb-6 gap-4">
        <div>
          <h1 className="text-4xl font-black space-grotesk flex items-center gap-3">
            <FileText size={36} className="text-[var(--primary-accent)]" /> Custom Reports
          </h1>
          <p className="font-bold text-gray-600 mt-2">Generate, schedule, and export detailed system analytics.</p>
        </div>
        <button className="neo-button bg-black text-white whitespace-nowrap">
          <Plus size={20} className="mr-2" /> New Report
        </button>
      </div>

      <div className="neo-card p-0 overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-[hsl(var(--background))] border-b-[3px] border-black uppercase tracking-wide text-sm">
              <th className="p-5 font-black">Report Name & Type</th>
              <th className="p-5 font-black">Schedule</th>
              <th className="p-5 font-black">Last Generated</th>
              <th className="p-5 font-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center font-bold">Loading Reports...</td></tr>
            ) : reports.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center font-bold text-gray-500">No reports configured.</td></tr>
            ) : (
              reports.map(report => (
                <tr key={report.id} className="border-b border-dashed border-gray-300 hover:bg-gray-50">
                  <td className="p-5">
                    <p className="font-black text-lg">{report.name}</p>
                    <span className="neo-badge bg-[var(--tertiary-accent)] mt-1">{report.type?.replace('_', ' ')}</span>
                  </td>
                  <td className="p-5 font-medium text-sm">
                    {report.schedule_config ? (
                      <span className="flex items-center gap-1"><Calendar size={14} /> Scheduled</span>
                    ) : 'Manual Run Only'}
                  </td>
                  <td className="p-5 font-medium text-sm">
                    {report.last_generated_date ? new Date(report.last_generated_date).toLocaleString() : 'Never'}
                  </td>
                  <td className="p-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleGenerate(report.id)} className="p-2 neo-border bg-[var(--secondary-accent)] hover:bg-[var(--primary-accent)]" title="Generate & Download"><Download size={16} /></button>
                      <button onClick={() => handleDelete(report.id)} className="p-2 neo-border bg-white hover:bg-[hsl(var(--destructive))] hover:text-white" title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
