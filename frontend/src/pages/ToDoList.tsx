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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Your Farming Plan</h2>
        <p className="text-gray-600">Follow these steps for a successful harvest.</p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => {
          const categoryTodos = todos.filter(t => t.category === category);
          const activeCount = categoryTodos.filter(t => !t.completed).length;
          const isOpen = openSection === category;

          return (
            <Card key={category} className="overflow-hidden">
              <button
                onClick={() => toggleSection(category)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{category}</h3>
                  <Badge variant={activeCount === 0 ? 'success' : 'neutral'}>
                    {activeCount} Tasks Pending
                  </Badge>
                </div>
                {isOpen ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
              </button>

              {isOpen && (
                <div className="divide-y divide-gray-100">
                  {categoryTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className={`p-4 flex items-start gap-4 transition-colors ${todo.completed ? 'bg-green-50/50' : 'bg-white'}`}
                    >
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`mt-0.5 shrink-0 ${todo.completed ? 'text-green-600' : 'text-gray-300 hover:text-gray-400'}`}
                      >
                        {todo.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`text-gray-900 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                          {todo.task}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Due: {todo.dueDate}
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
