
import React from 'react';
import { Brain, Lightbulb, Target, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const ProfileDashboard: React.FC = () => {
  const { user } = useApp();

  if (!user) return null;

  const getProfileCompletion = () => {
    const total = user.interests.length + user.skills.length + user.topics.length + user.personality_traits.length;
    return Math.min(Math.round((total / 10) * 100), 100);
  };

  const KnowledgeCard: React.FC<{
    title: string;
    items: string[];
    icon: React.ReactNode;
    color: string;
  }> = ({ title, items, icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2 mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
          {items.length}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.slice(0, 3).map((item, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            No {title.toLowerCase()} yet
          </span>
        )}
        {items.length > 3 && (
          <span className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 rounded-full text-sm">
            +{items.length - 3} more
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
      <div className="p-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold">{user.user_name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.user_name}</h2>
              <p className="text-blue-100">AI Assistant User</p>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span>Profile Completion</span>
              <span>{getProfileCompletion()}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-300"
                style={{ width: `${getProfileCompletion()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Knowledge Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Knowledge Profile
          </h3>
          
          <KnowledgeCard
            title="Interests"
            items={user.interests}
            icon={<Lightbulb className="w-5 h-5 text-white" />}
            color="bg-yellow-500"
          />
          
          <KnowledgeCard
            title="Skills"
            items={user.skills}
            icon={<Target className="w-5 h-5 text-white" />}
            color="bg-green-500"
          />
          
          <KnowledgeCard
            title="Topics"
            items={user.topics}
            icon={<Brain className="w-5 h-5 text-white" />}
            color="bg-blue-500"
          />
          
          <KnowledgeCard
            title="Personality"
            items={user.personality_traits}
            icon={<Sparkles className="w-5 h-5 text-white" />}
            color="bg-purple-500"
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
            <TrendingUp className="w-4 h-4 mr-2" />
            Quick Stats
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Knowledge Items</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {user.interests.length + user.skills.length + user.topics.length + user.personality_traits.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Most Active Category</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {[
                  { name: 'Interests', count: user.interests.length },
                  { name: 'Skills', count: user.skills.length },
                  { name: 'Topics', count: user.topics.length },
                  { name: 'Personality', count: user.personality_traits.length }
                ].sort((a, b) => b.count - a.count)[0]?.name || 'None'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
