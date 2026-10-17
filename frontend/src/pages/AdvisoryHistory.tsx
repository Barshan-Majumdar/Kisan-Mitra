import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Plus, Calendar, ChevronRight, MapPin, RefreshCw, Sprout, Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';

// Pre-process markdown to normalize line breaks without mutating table structure
const normalizeMarkdown = (rawText: string) => {
  if (!rawText) return "";
  return String(rawText)
    .replace(/\\r\\n/g, '\n')
    .replace(/\\n/g, '\n')
    .trim();
};

export const AdvisoryHistory: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const fetchAdvisories = async () => {
    setLoading(true);
    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress || 'demo@agriculture.com'; // Fallback for dev/demo if auth skipped

      const response = await api.get('/advisories', {
        params: { userEmail }
      });

      // Map backend data safely to frontend structure
      const rawList = Array.isArray(response.data) ? response.data : (response.data?.advisories || []);
      const mappedData = rawList.map((item: any) => ({
        id: item.id,
        date: item.date,
        crop: item.crop?.name || 'Unknown Crop',
        location: item.location,
        status: item.status,
        stage: item.stage,
        message: item.message // Include the plan
      }));
      setHistory(mappedData);
    } catch (error) {
      console.error('Failed to fetch advisories:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load
    fetchAdvisories();
  }, [isLoaded, user]);

  const handleRemoveAdvisory = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this advisory?')) return;

    try {
      await api.delete(`/advisories/${id}`);
      setHistory(history.filter(item => item.id !== id));
    } catch (error) {
      console.error('Failed to remove advisory:', error);
      alert('Failed to remove advisory. Please try again.');
    }
  };

  const handleAddTask = async (item: any) => {
    try {
      if (!user?.primaryEmailAddress?.emailAddress) {
        alert("Please sign in to add tasks.");
        return;
      }

      const taskData = {
        category: 'Preparation',
        task: `Follow farming plan for ${item.crop} at ${item.location}`,
        dueDate: new Date().toISOString(),
        userEmail: user.primaryEmailAddress.emailAddress
      };

      await api.post('/todos', taskData);
      alert('Task added to your To-Do list!');
    } catch (error) {
      console.error('Failed to add task:', error);
      alert('Failed to add task.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in px-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Crop Advisory Records
            </h1>
            <p className="text-sm sm:text-base text-stone-600">
              Precision farming guides and nutrient schedules generated for your farm plots.
            </p>
          </div>
        </div>
        <div className="p-12 text-center rounded-3xl bg-white border border-stone-200/80 shadow-soft">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto text-emerald-700 mb-3" />
          <p className="text-sm font-semibold text-stone-700">Loading your crop advisories...</p>
          <p className="text-xs text-stone-400 mt-1">Connecting to agricultural database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Crop Advisory Records
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Precision farming guides and nutrient schedules generated for your farm plots.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchAdvisories}
            className="p-3 rounded-2xl bg-white border border-stone-200/80 hover:bg-[#FAF9F5] text-stone-600 shadow-soft transition-all active:scale-95"
            title="Refresh advisories"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => navigate('/input')}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 text-sm shadow-soft hover:shadow-card active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Advisory
          </button>
        </div>
      </div>

      {history.length === 0 ? (
        <Card className="p-8 sm:p-12 text-center rounded-3xl border border-stone-200/80 bg-white shadow-soft">
          <div className="inline-flex p-4 rounded-3xl bg-emerald-50 text-emerald-700 mb-4 border border-emerald-200/60">
            <Sprout className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-extrabold text-stone-900 mb-2">No Saved Crop Advisories Yet</h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
            Generate customized AI farming guides, complete with land preparation, critical irrigation timings, and pest management schedules for your crops.
          </p>
          <button
            onClick={() => navigate('/input')}
            className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 text-sm shadow-soft hover:shadow-card active:scale-[0.98] transition-all"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate First Advisory
          </button>
        </Card>
      ) : (
        <div className="grid gap-4">
        {history.map((item) => (
          <Card
            key={item.id}
            padding="none"
            className="rounded-3xl border border-stone-200/80 bg-white shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden"
          >
            <div
              className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-[#FAF9F5]/70 transition-colors"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shadow-soft shrink-0 ${
                  item.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80' : 'bg-stone-100 text-stone-600 border border-stone-200'
                }`}>
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-stone-900 tracking-tight">{item.crop} Advisory</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                      {item.stage || 'Agronomy'}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-stone-500 gap-2.5 mt-1 font-medium">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-stone-400" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span>{new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleAddTask(item)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 rounded-full border border-emerald-200/80 transition-all active:scale-95 shadow-sm"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => handleRemoveAdvisory(item.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100/80 rounded-full border border-rose-200/80 transition-all active:scale-95"
                  >
                    Remove
                  </button>
                </div>
                <div className="p-2 rounded-2xl bg-[#FAF9F5] border border-stone-200/80 text-stone-500">
                  <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${expandedId === item.id ? 'rotate-90 text-emerald-700' : ''}`} />
                </div>
              </div>
            </div>

            {/* Expanded Content: The AI Plan */}
            {expandedId === item.id && (
              <div
                className="px-6 pb-6 pt-2 border-t border-stone-100 text-stone-700 text-sm leading-relaxed cursor-text bg-[#FCFCFA]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4 pt-4 border-b border-stone-200/60 pb-3">
                  <h4 className="font-bold text-stone-900 text-base flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                    Detailed Agronomic Schedule & Field Strategy
                  </h4>
                  <span className="text-xs bg-white text-stone-700 font-semibold px-3 py-1 rounded-full border border-stone-200/80 shadow-soft">
                    Precision Protocol
                  </span>
                </div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    components={{
                      h1: ({ ...props }) => <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-6 mb-3 border-b pb-2 border-stone-200 tracking-tight" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-lg sm:text-xl font-bold text-emerald-900 mt-6 mb-2.5 flex items-center gap-2 tracking-tight" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-base font-bold text-stone-800 mt-5 mb-2" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3.5 space-y-1.5 text-stone-700" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3.5 space-y-1.5 text-stone-700" {...props} />,
                      li: ({ ...props }) => <li className="text-stone-700 leading-relaxed" {...props} />,
                      strong: ({ ...props }) => <strong className="font-bold text-stone-900" {...props} />,
                      p: ({ ...props }) => <p className="mb-3.5 text-stone-700 leading-relaxed" {...props} />,
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-5 rounded-2xl border border-stone-200/90 shadow-soft bg-white">
                          <table className="min-w-full divide-y divide-stone-200 text-left text-xs sm:text-sm" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-[#FAF9F5] text-stone-900 font-bold border-b border-stone-200" {...props} />,
                      tbody: ({ ...props }) => <tbody className="divide-y divide-stone-100 bg-white" {...props} />,
                      tr: ({ ...props }) => <tr className="hover:bg-[#FAF9F5]/80 transition-colors" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-3.5 font-bold text-stone-900 tracking-wider text-xs uppercase" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 text-stone-700 align-top leading-relaxed border-r border-stone-50 last:border-r-0" {...props} />,
                      pre: ({ ...props }) => (
                        <div className="overflow-x-auto my-4 p-4 bg-stone-900 text-emerald-300 font-mono text-xs rounded-2xl shadow-inner border border-stone-800">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ inline, ...props }: any) =>
                        inline ? (
                          <code className="bg-[#F5F5F0] text-emerald-900 font-mono text-xs px-2 py-0.5 rounded-lg border border-stone-200 font-semibold" {...props} />
                        ) : (
                          <code className="font-mono text-xs text-emerald-300" {...props} />
                        ),
                      hr: () => <hr className="my-6 border-stone-200" />,
                      blockquote: ({ ...props }) => (
                        <blockquote className="border-l-4 border-emerald-600 pl-4 py-2.5 my-3.5 bg-emerald-50/50 text-stone-700 italic rounded-r-2xl" {...props} />
                      )
                    }}
                  >
                    {normalizeMarkdown(item.message || "No detailed plan available.")}
                  </ReactMarkdown>
                </div>
              </div>
            )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
