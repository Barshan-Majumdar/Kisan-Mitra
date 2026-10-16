import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ChevronDown, ChevronUp, CheckCircle, Circle, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import api from '../services/api';
import type { ToDoItem } from '../types';

export const ToDoList: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [todos, setTodos] = useState<ToDoItem[]>([]);
  const [openSection, setOpenSection] = useState<string | null>('Preparation');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      if (!isLoaded) return;

      try {
        const userEmail = user?.primaryEmailAddress?.emailAddress || 'demo@agriculture.com';

        const response = await api.get('/todos', {
          params: { userEmail }
        });

        const mappedData = response.data.map((item: any) => ({
          ...item,
          dueDate: new Date(item.dueDate).toLocaleDateString(),
        }));
        setTodos(mappedData);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodos();
  }, [isLoaded, user]);

  const toggleTodo = async (id: string | number) => {
    try {
      // Optimistic update
      setTodos(todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));

      await api.patch(`/todos/${id}`);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
      // Revert on error
      setTodos(todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    }
  };

  const toggleSection = (category: string) => {
    setOpenSection(openSection === category ? null : category);
  };

  const categories = Array.from(new Set(todos.map(t => t.category)));

  if (loading) {
    return <div className="text-center py-10">Loading tasks...</div>;
  }

  const totalTasks = todos.length;
  const completedTasks = todos.filter(t => t.completed).length;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in px-1">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">Farming Task Management</h2>
          <p className="text-sm text-stone-600 mt-1">Operational fieldwork checklist for your active advisories.</p>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white border border-stone-200/80 shadow-soft">
          <span className="text-xs font-semibold text-stone-600">Completion</span>
          <span className="text-sm font-extrabold text-emerald-700">{completionPct}%</span>
          <div className="w-16 h-2 rounded-full bg-stone-100 overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryTodos = todos.filter(t => t.category === category);
          const activeCount = categoryTodos.filter(t => !t.completed).length;
          const isOpen = openSection === category;

          return (
            <Card key={category} padding="none" className="rounded-3xl border border-stone-200/80 bg-white shadow-card overflow-hidden">
              <button
                onClick={() => toggleSection(category)}
                className="w-full flex items-center justify-between p-5 bg-[#FAF9F5] hover:bg-[#F2F2EB] transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-base text-stone-900 tracking-tight">{category}</h3>
                  <Badge variant={activeCount === 0 ? 'success' : 'neutral'} size="sm">
                    {activeCount === 0 ? 'All Complete' : `${activeCount} Pending`}
                  </Badge>
                </div>
                <div className="p-1.5 rounded-xl bg-white border border-stone-200/80 text-stone-500">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="divide-y divide-stone-100">
                  {categoryTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`p-4 sm:p-5 flex items-start gap-4 transition-colors ${todo.completed ? 'bg-emerald-50/20' : 'bg-white hover:bg-[#FAF9F5]/50'}`}
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`mt-0.5 shrink-0 transition-transform active:scale-90 ${todo.completed ? 'text-emerald-700' : 'text-stone-300 hover:text-stone-400'}`}
                      >
                        {todo.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`text-sm sm:text-base font-medium text-stone-900 ${todo.completed ? 'line-through text-stone-400' : ''}`}>
                          {todo.task}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-stone-500 font-medium">
                          <Calendar className="h-3.5 w-3.5 mr-1 text-stone-400" />
                          Target Due Date: {todo.dueDate}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
