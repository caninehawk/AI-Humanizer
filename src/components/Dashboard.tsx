import React, { useState } from 'react';
import { Star, Trash2, Download, Clock, Zap, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Mock data for demonstration
const mockProjects = [
  {
    id: 1,
    inputText: "The quick brown fox jumps over the lazy dog. This is a sample AI-generated text that needs to be humanized.",
    outputText: "You know, that quick brown fox actually leaped right over the lazy dog. It's quite fascinating how this sample text, which was originally AI-generated, has been transformed to sound more natural.",
    timestamp: "2024-03-20T10:30:00",
    isFavorite: false
  },
  {
    id: 2,
    inputText: "Artificial Intelligence is transforming the way we work and live. It's becoming increasingly important in our daily lives.",
    outputText: "It's really quite remarkable how AI is changing our world. You can see it everywhere - from how we work to how we live our daily lives. It's becoming something we can't imagine living without.",
    timestamp: "2024-03-19T15:45:00",
    isFavorite: true
  }
];

interface CreditInfo {
  used: number;
  total: number;
}

export const Dashboard: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [projects, setProjects] = useState(mockProjects);
  const [credits, setCredits] = useState<CreditInfo>({ used: 15, total: 50 });

  const toggleFavorite = (id: number) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, isFavorite: !project.isFavorite } : project
    ));
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  const downloadProject = (project: typeof mockProjects[0]) => {
    const content = `Input: ${project.inputText}\n\nOutput: ${project.outputText}\n\nTimestamp: ${new Date(project.timestamp).toLocaleString()}`;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateProgress = () => {
    return (credits.used / credits.total) * 100;
  };

  const getProgressColor = () => {
    const progress = calculateProgress();
    if (progress >= 90) return 'bg-red-500';
    if (progress >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* User Info and Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {profile?.name || 'User'}</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Credit Tracker */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Credits</h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900">{profile?.credits || 0}</span>
              <span className="text-gray-500"> / {profile?.plan === 'Free' ? '20' : 'Unlimited'}</span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className={`h-2.5 rounded-full ${getProgressColor()} transition-all duration-300`}
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {profile?.plan === 'Free' ? `${20 - (profile?.credits || 0)} credits remaining` : 'Unlimited credits'}
            </p>
            {profile?.plan === 'Free' && (
              <a 
                href="#pricing" 
                className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
              >
                Upgrade your plan to get more credits →
              </a>
            )}
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Past Projects</h2>
        
        <div className="grid gap-6">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-sm">{formatDate(project.timestamp)}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(project.id)}
                    className={`p-2 rounded-full transition-colors ${
                      project.isFavorite 
                        ? 'text-yellow-400 hover:text-yellow-500' 
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                  >
                    <Star className="w-5 h-5" fill={project.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={() => downloadProject(project)}
                    className="p-2 rounded-full text-gray-400 hover:text-green-600 transition-colors"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-2 rounded-full text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Input Text</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                    {project.inputText.length > 150 
                      ? `${project.inputText.substring(0, 150)}...` 
                      : project.inputText}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">Humanized Output</h3>
                  <div className="bg-green-50 rounded-lg p-4 text-gray-700">
                    {project.outputText.length > 150 
                      ? `${project.outputText.substring(0, 150)}...` 
                      : project.outputText}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found. Start by humanizing some text!</p>
          </div>
        )}
      </div>
    </section>
  );
}; 