import React, { useState, useEffect } from 'react';
import { 
  Activity,
  Users,
  Calendar,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  UserPlus,
  Settings,
  Bell,
  Hash,
  Send,
  Smile,
  Paperclip,
  Video,
  Phone,
  AlertCircle,
  X
} from 'lucide-react';

// =============================================================================
// API CONFIGURATION - CENTRALIZED ENDPOINTS
// =============================================================================
const API_CONFIG = {
  BASE_URL: 'http://localhost:8000/api', // Change this to your backend URL
  ENDPOINTS: {
    DASHBOARD_STATS: '/dashboard/stats',
    RECENT_ACTIVITY: '/dashboard/recent-activity',
    USER_ROOMS: '/dashboard/rooms',
    ROOM_HISTORY: '/dashboard/rooms/history',
    CREATE_ROOM: '/dashboard/rooms',
    AVAILABLE_USERS: '/dashboard/users/available',
    CALENDAR_EVENTS: '/dashboard/calendar/events'
  }
};

// Helper function to build full API URLs
const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(API_CONFIG.BASE_URL + endpoint);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

// =============================================================================
// API SERVICE WITH PROPER BACKEND INTEGRATION
// =============================================================================
const apiService = {
  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DASHBOARD_STATS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header when integrating
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      return await response.json();
    } catch (error) {
      console.error('API Error - getDashboardStats:', error);
      // Fallback to mock data for development
      return {
        total_rooms: 8,
        active_rooms: 5,
        total_messages: 247,
        online_users: 12
      };
    }
  },
  
  // Get recent activity with limit parameter
  getRecentActivity: async (limit = 10) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.RECENT_ACTIVITY, { limit }), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch recent activity');
      return await response.json();
    } catch (error) {
      console.error('API Error - getRecentActivity:', error);
      // Fallback to mock data
      return [
        { id: 1, action: "Message sent in General", time: "2 minutes ago", type: "message", user_name: "John Doe" },
        { id: 2, action: "Joined room 'Project Alpha'", time: "1 hour ago", type: "room", user_name: "Jane Smith" },
        { id: 3, action: "Message sent in Team Chat", time: "3 hours ago", type: "message", user_name: "Mike Johnson" },
        { id: 4, action: "Created room 'Design Review'", time: "1 day ago", type: "room", user_name: "Sarah Wilson" }
      ];
    }
  },
  
  // Get user rooms
  getUserRooms: async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.USER_ROOMS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user rooms');
      return await response.json();
    } catch (error) {
      console.error('API Error - getUserRooms:', error);
      // Fallback to mock data
      return [
        { id: 1, name: "General", description: "General discussion", member_count: 8, last_message_at: "2024-01-15T10:30:00Z", is_active: true },
        { id: 2, name: "Project Alpha", description: "Alpha project coordination", member_count: 5, last_message_at: "2024-01-15T09:15:00Z", is_active: true },
        { id: 3, name: "Design Team", description: "Design discussions", member_count: 6, last_message_at: "2024-01-14T16:45:00Z", is_active: true },
        { id: 4, name: "Random", description: "Random conversations", member_count: 12, last_message_at: "2024-01-14T14:20:00Z", is_active: false }
      ];
    }
  },
  
  // Get room history with limit parameter
  getRoomHistory: async (limit = 50) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.ROOM_HISTORY, { limit }), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch room history');
      return await response.json();
    } catch (error) {
      console.error('API Error - getRoomHistory:', error);
      return [];
    }
  },
  
  // Get available users for room creation
  getAvailableUsers: async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AVAILABLE_USERS), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch available users');
      return await response.json();
    } catch (error) {
      console.error('API Error - getAvailableUsers:', error);
      // Fallback to mock data
      return [
        { id: 1, username: "john_doe", email: "john@example.com", is_online: true },
        { id: 2, username: "jane_smith", email: "jane@example.com", is_online: true },
        { id: 3, username: "mike_johnson", email: "mike@example.com", is_online: false },
        { id: 4, username: "sarah_wilson", email: "sarah@example.com", is_online: true }
      ];
    }
  },
  
  // Create a new room
  createRoom: async (roomData) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CREATE_ROOM), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          name: roomData.name,
          description: roomData.description,
          user_ids: roomData.user_ids
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create room');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error - createRoom:', error);
      // Fallback to mock response for development
      return {
        id: Math.floor(Math.random() * 1000),
        name: roomData.name,
        description: roomData.description,
        member_count: roomData.user_ids.length + 1,
        created_at: new Date().toISOString(),
        is_active: true
      };
    }
  },
  
  // Get calendar events
  getCalendarEvents: async (startDate = null, endDate = null) => {
    try {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CALENDAR_EVENTS, params), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch calendar events');
      return await response.json();
    } catch (error) {
      console.error('API Error - getCalendarEvents:', error);
      return [];
    }
  }
};

// =============================================================================
// CREATE ROOM MODAL COMPONENT
// =============================================================================
const CreateRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadAvailableUsers();
    }
  }, [isOpen]);

  const loadAvailableUsers = async () => {
    try {
      const users = await apiService.getAvailableUsers();
      setAvailableUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load available users');
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateRoom = async () => {
    if (!roomName.trim()) {
      setError('Room name is required');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const roomData = {
        name: roomName.trim(),
        description: roomDescription.trim(),
        user_ids: selectedUsers
      };
      
      const newRoom = await apiService.createRoom(roomData);
      onCreateRoom(newRoom);
      
      // Reset form
      setRoomName('');
      setRoomDescription('');
      setSelectedUsers([]);
      setSearchTerm('');
      onClose();
    } catch (error) {
      console.error('Error creating room:', error);
      setError(error.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Create New Room</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Room Name *
            </label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter room name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={roomDescription}
              onChange={(e) => setRoomDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter room description"
              rows="2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Members
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Search users..."
              />
            </div>

            <div className="max-h-40 overflow-y-auto space-y-2">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.username[0].toUpperCase()}
                        </span>
                      </div>
                      {user.is_online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => handleUserToggle(user.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateRoom}
            disabled={!roomName.trim() || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN DASHBOARD COMPONENT
// =============================================================================
const Dashboard = ({ user = { name: 'John Doe', email: 'john@example.com' } }) => {
  const [stats, setStats] = useState({
    total_rooms: 0,
    active_rooms: 0,
    total_messages: 0,
    online_users: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [userRooms, setUserRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, activitiesData, roomsData] = await Promise.all([
        apiService.getDashboardStats(),
        apiService.getRecentActivity(10), // Using limit parameter as per backend
        apiService.getUserRooms()
      ]);

      setStats(statsData);
      setRecentActivities(activitiesData);
      setUserRooms(roomsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = (newRoom) => {
    setUserRooms(prev => [newRoom, ...prev]);
    loadDashboardData(); // Refresh stats
  };

  const formatLastMessage = (timestamp) => {
    if (!timestamp) return 'No messages';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'message': return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case 'room': return <Hash className="h-4 w-4 text-green-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const statsCards = [
    { 
      label: "Total Rooms", 
      value: stats.total_rooms, 
      icon: Hash, 
      color: "bg-blue-500", 
      change: "+12%" 
    },
    { 
      label: "Active Rooms", 
      value: stats.active_rooms, 
      icon: Activity, 
      color: "bg-green-500", 
      change: "+8%" 
    },
    { 
      label: "Messages", 
      value: stats.total_messages, 
      icon: MessageSquare, 
      color: "bg-purple-500", 
      change: "+23%" 
    },
    { 
      label: "Online Users", 
      value: stats.online_users, 
      icon: Users, 
      color: "bg-orange-500", 
      change: "+5%" 
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your workspace today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center text-sm font-medium text-green-600">
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
                    {getActivityIcon(activity.type)}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                        {activity.user_name && (
                          <>
                            <span className="mx-1">•</span>
                            <span>{activity.user_name}</span>
                          </>
                        )}
                      </div>
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
              <button 
                onClick={() => setIsCreateRoomModalOpen(true)}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Plus className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm font-medium">Create New Room</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <UserPlus className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Invite Users</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">Schedule Event</span>
                </div>
              </button>
            </div>
          </div>

          {/* Your Rooms */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Your Rooms</h3>
              <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                View all
              </button>
            </div>
            <div className="space-y-3">
              {userRooms.slice(0, 4).map((room) => (
                <div key={room.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      room.is_active ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Hash className={`h-5 w-5 ${
                        room.is_active ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{room.name}</p>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Users className="h-3 w-3 mr-1" />
                        {room.member_count} members
                        <span className="mx-1">•</span>
                        {formatLastMessage(room.last_message_at)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Online Status */}
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">You're Online!</h3>
            <p className="text-indigo-100 text-sm mb-4">
              {stats.online_users} users are currently active
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm">Active now</span>
              </div>
              <button className="text-sm font-medium text-white/80 hover:text-white">
                Manage status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateRoomModalOpen}
        onClose={() => setIsCreateRoomModalOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
};

export default Dashboard;