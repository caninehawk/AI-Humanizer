import React, { useEffect, useState } from 'react';
import { Star, Trash2, Download, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('public:projects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'projects', filter: `user_id=eq.${user.id}` },
        () => {
          fetchProjects();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      await supabase.from('projects').delete().eq('id', id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      setError('Failed to delete project.');
    }
  };

  const handleDownload = (project: any) => {
    const content = `Input: ${project.input_text}\n\nOutput: ${project.output_text}\n\nTimestamp: ${new Date(project.created_at).toLocaleString()}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `humanized-text-${project.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFavorite = async (id: string) => {
    // Toggle favorite (add a 'favorite' field in your DB for real use)
    setProjects((prev) => prev.map((p) => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-0" style={{ marginBottom: 0, paddingBottom: 0 }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Past Projects</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : projects.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No projects yet.</div>
          ) : (
            <div className="max-h-96 overflow-y-auto pr-2 mb-0" style={{ marginBottom: 0, paddingBottom: 0 }}>
              <div className="grid gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-2 text-gray-500 text-xs">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(project.created_at).toLocaleString()}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold text-gray-700">Input:</span>
                        <span className="ml-2 text-gray-600 line-clamp-2">{project.input_text.slice(0, 100)}{project.input_text.length > 100 ? '...' : ''}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Output:</span>
                        <span className="ml-2 text-gray-600 line-clamp-2">{project.output_text.slice(0, 100)}{project.output_text.length > 100 ? '...' : ''}</span>
                      </div>
                    </div>
                    <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 md:ml-6">
                      <button onClick={() => handleFavorite(project.id)} className={`p-2 rounded-full border ${project.isFavorite ? 'bg-yellow-100 border-yellow-400' : 'bg-gray-100 border-gray-300'} hover:bg-yellow-200`} title="Favorite">
                        <Star className={`w-5 h-5 ${project.isFavorite ? 'text-yellow-500 fill-yellow-400' : 'text-gray-400'}`} />
                      </button>
                      <button onClick={() => handleDownload(project)} className="p-2 rounded-full bg-gray-100 border border-gray-300 hover:bg-blue-100" title="Download">
                        <Download className="w-5 h-5 text-blue-500" />
                      </button>
                      <button onClick={() => handleDelete(project.id)} className="p-2 rounded-full bg-gray-100 border border-gray-300 hover:bg-red-100" title="Delete">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div style={{ margin: 0, padding: 0, height: 0 }} />
    </div>
  );
};