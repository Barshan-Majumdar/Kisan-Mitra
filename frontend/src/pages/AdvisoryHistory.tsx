import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Plus, Calendar, ChevronRight, MapPin } from 'lucide-react';
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

  useEffect(() => {
    const fetchAdvisories = async () => {
      if (!isLoaded) return; // Wait for Clerk to load

      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress || 'demo@agriculture.com'; // Fallback for dev/demo if auth skipped

        const response = await api.get('/advisories', {
          params: { userEmail }
        });

        // Map backend data to frontend structure
        const mappedData = response.data.map((item: any) => ({
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
      } finally {
        setLoading(false);
      }
    };

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
    return <div className="text-center py-10">Loading history...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advisory History</h1>
          <p className="text-gray-600">View your past and current crop advisories. Click to view details.</p>
        </div>
        <button
          onClick={() => navigate('/input')}
          className="btn bg-primary-600 text-white hover:bg-primary-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Advisory
        </button>
      </div>

      <div className="grid gap-4">
        {history.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div
              className="flex items-center justify-between"
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
            >
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${item.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.crop} Advisory</h3>
                  <div className="flex items-center text-sm text-gray-500 gap-3 mt-1">
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {item.location}
                    </span>
                    <span>•</span>
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleAddTask(item)}
                    className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
                  >
                    Add Task
                  </button>
                  <button
                    onClick={() => handleRemoveAdvisory(item.id)}
                    className="px-3 py-1 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {expandedId === item.id ? (
                  <ChevronRight className="h-5 w-5 text-gray-400 rotate-90 transition-transform" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400 transition-transform" />
                )}
              </div>
            </div>

            {/* Expanded Content: The AI Plan */}
            {expandedId === item.id && (
              <div
                className="mt-4 pt-4 border-t border-gray-100 text-gray-700 font-sans text-sm leading-relaxed cursor-text"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Detailed Farming Advisory Plan
                  </h4>
                  <span className="text-xs bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
                    Precision Agronomy
                  </span>
                </div>
                <div className="prose prose-sm max-w-none prose-emerald">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath, remarkGfm]}
                    rehypePlugins={[rehypeKatex, rehypeRaw]}
                    components={{
                      h1: ({ ...props }) => <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-5 mb-3 border-b pb-2 border-gray-100" {...props} />,
                      h2: ({ ...props }) => <h2 className="text-lg sm:text-xl font-bold text-gray-900 mt-5 mb-2.5 flex items-center gap-2 text-emerald-800" {...props} />,
                      h3: ({ ...props }) => <h3 className="text-base font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                      ul: ({ ...props }) => <ul className="list-disc pl-5 mb-3 space-y-1.5 text-gray-700" {...props} />,
                      ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-gray-700" {...props} />,
                      li: ({ ...props }) => <li className="text-gray-700 leading-relaxed" {...props} />,
                      strong: ({ ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                      p: ({ ...props }) => <p className="mb-3 text-gray-700 leading-relaxed" {...props} />,
                      table: ({ ...props }) => (
                        <div className="overflow-x-auto my-5 rounded-xl border border-gray-200 shadow-sm bg-white">
                          <table className="min-w-full divide-y divide-gray-200 text-left text-xs sm:text-sm" {...props} />
                        </div>
                      ),
                      thead: ({ ...props }) => <thead className="bg-emerald-50/90 text-emerald-950 font-semibold" {...props} />,
                      tbody: ({ ...props }) => <tbody className="divide-y divide-gray-100 bg-white" {...props} />,
                      tr: ({ ...props }) => <tr className="hover:bg-gray-50/80 transition-colors" {...props} />,
                      th: ({ ...props }) => <th className="px-4 py-3 font-semibold text-gray-900 tracking-wide text-xs uppercase" {...props} />,
                      td: ({ ...props }) => <td className="px-4 py-3 text-gray-700 align-top leading-relaxed border-r border-gray-50 last:border-r-0" {...props} />,
                      pre: ({ ...props }) => (
                        <div className="overflow-x-auto my-4 p-4 bg-gray-900 text-emerald-300 font-mono text-xs rounded-xl shadow-inner border border-gray-800">
                          <pre {...props} />
                        </div>
                      ),
                      code: ({ inline, ...props }: any) =>
                        inline ? (
                          <code className="bg-gray-100 text-emerald-800 font-mono text-xs px-1.5 py-0.5 rounded border border-gray-200 font-semibold" {...props} />
                        ) : (
                          <code className="font-mono text-xs text-emerald-300" {...props} />
                        ),
                      hr: () => <hr className="my-5 border-gray-200" />,
                      blockquote: ({ ...props }) => (
                        <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-3 bg-emerald-50/50 text-gray-700 italic rounded-r-lg" {...props} />
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
    </div>
  );
};
