import React from 'react';
import { 
  Activity,
  Users,
  Calendar,
  FileText,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';

const Dashboard = ({ user }) => {
  // Sample data
  const recentActivities = [
    { id: 1, action: "Created new project", time: "2 hours ago", type: "project" },
    { id: 2, action: "Updated profile settings", time: "1 day ago", type: "profile" },
    { id: 3, action: "Joined team collaboration", time: "2 days ago", type: "team" },
    { id: 4, action: "Completed task review", time: "3 days ago", type: "task" }
  ];

  const stats = [
    { label: "Total Projects", value: "12", icon: FileText, color: "bg-blue-500", change: "+2.5%" },
    { label: "Team Members", value: "8", icon: Users, color: "bg-green-500", change: "+12%" },
    { label: "Completed Tasks", value: "47", icon: Activity, color: "bg-purple-500", change: "+8.2%" },
    { label: "Upcoming Events", value: "5", icon: Calendar, color: "bg-orange-500", change: "-1.4%" }
  ];

  const upcomingTasks = [
    { id: 1, title: "Review project proposal", due: "Today", priority: "high" },
    { id: 2, title: "Team meeting preparation", due: "Tomorrow", priority: "medium" },
    { id: 3, title: "Client presentation", due: "Friday", priority: "high" },
    { id: 4, title: "Code review session", due: "Next week", priority: "low" }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name || 'there'}! 👋
        </h2>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className={`flex items-center text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="h-4 w-4 mr-1" />
                {stat.change}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">Create New Project</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Invite Team Member</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Schedule Meeting</span>
                </div>
              </button>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{task.due}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <CheckCircle className="h-4 w-4 text-gray-400 hover:text-green-500 cursor-pointer" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Monthly Progress</h3>
            <p className="text-indigo-100 text-sm mb-4">You're doing great! Keep it up.</p>
            <div className="bg-white/20 rounded-full h-2 mb-2">
              <div className="bg-white rounded-full h-2 w-3/4 transition-all duration-300"></div>
            </div>
            <p className="text-sm text-indigo-100">75% Complete</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;