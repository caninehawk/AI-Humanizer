import React, { useState } from 'react';
import { Star, Trash2, Download, Clock, Zap, LogOut, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { CreditsMeter } from './ui/CreditsMeter';

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
  const navigate = useNavigate();

  const credits = {
    used: profile?.credits_used || 0,
    total: profile?.plan === 'Free' ? 10 : profile?.plan === 'Pro' ? 100 : 500
  };

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
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {profile?.name || user?.email}</h1>
            <div className="mb-6">
              <CreditsMeter />
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Account Information</h2>
                <p className="text-gray-600">Email: {user?.email}</p>
                {profile?.name && <p className="text-gray-600">Name: {profile.name}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 