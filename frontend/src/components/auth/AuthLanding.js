import React, { useState, useEffect } from 'react';
import { MessageCircle, Users, Heart, Send, Star, Zap, Coffee, Music } from 'lucide-react';

const AuthLanding = ({ onChooseAuth }) => {
  const [activePanel, setActivePanel] = useState(null);
  const [animatedElements, setAnimatedElements] = useState([]);

  // Create floating animated elements
  useEffect(() => {
    const elements = [
      { icon: MessageCircle, delay: 0, duration: 15 },
      { icon: Users, delay: 2, duration: 18 },
      { icon: Heart, delay: 4, duration: 20 },
      { icon: Send, delay: 1, duration: 16 },
      { icon: Star, delay: 3, duration: 17 },
      { icon: Zap, delay: 5, duration: 19 },
      { icon: Coffee, delay: 6, duration: 14 },
      { icon: Music, delay: 7, duration: 21 }
    ];
    setAnimatedElements(elements);
  }, []);

  const FloatingElement = ({ icon: Icon, delay, duration, index }) => (
    <div
      className={`absolute opacity-10 text-white animate-float-${index}`}
      style={{
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`
      }}
    >
      <Icon size={Math.random() * 30 + 20} />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {animatedElements.map((element, index) => (
          <FloatingElement
            key={index}
            icon={element.icon}
            delay={element.delay}
            duration={element.duration}
            index={index}
          />
        ))}
      </div>

      {/* Main Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <MessageCircle className="relative h-16 w-16 text-white mx-auto" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              Chat<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400">Verse</span>
            </h1>
            <p className="text-xl text-gray-300 animate-fade-in-delay">
              Connect, Chat, and Share Amazing Moments
            </p>
          </div>

          {/* Sliding Door Container */}
          <div className="relative h-96 bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 overflow-hidden shadow-2xl">
            {/* Login Panel */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-blue-500/80 to-cyan-500/80 backdrop-blur-sm transition-all duration-700 cursor-pointer ${
                activePanel === 'login' ? 'translate-x-0' : activePanel === 'register' ? '-translate-x-full' : 'translate-x-0'
              }`}
              onMouseEnter={() => setActivePanel('login')}
              onMouseLeave={() => setActivePanel(null)}
              onClick={() => onChooseAuth('login')}
            >
              <div className="h-full flex flex-col items-center justify-center p-8 text-white">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                  <Users className="relative h-16 w-16" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
                <p className="text-lg text-center mb-6 opacity-90">
                  Sign in to continue your conversations and catch up with friends
                </p>
                <div className="flex items-center space-x-2 text-sm opacity-75">
                  <MessageCircle size={16} />
                  <span>Resume Chats</span>
                  <Heart size={16} />
                  <span>Connect</span>
                  <Zap size={16} />
                  <span>Be Active</span>
                </div>
              </div>
            </div>

            {/* Register Panel */}
            <div
              className={`absolute inset-0 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-sm transition-all duration-700 cursor-pointer ${
                activePanel === 'register' ? 'translate-x-0' : activePanel === 'login' ? 'translate-x-full' : 'translate-x-0'
              }`}
              onMouseEnter={() => setActivePanel('register')}
              onMouseLeave={() => setActivePanel(null)}
              onClick={() => onChooseAuth('register')}
            >
              <div className="h-full flex flex-col items-center justify-center p-8 text-white">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse"></div>
                  <Star className="relative h-16 w-16" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Join the Fun!</h2>
                <p className="text-lg text-center mb-6 opacity-90">
                  Create your account and start building amazing connections
                </p>
                <div className="flex items-center space-x-2 text-sm opacity-75">
                  <Users size={16} />
                  <span>Make Friends</span>
                  <Send size={16} />
                  <span>Share Moments</span>
                  <Coffee size={16} />
                  <span>Have Fun</span>
                </div>
              </div>
            </div>

            {/* Center Divider */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/30 transform -translate-x-1/2 z-10"></div>
            
            {/* Center Circle */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-12 h-12 bg-white/20 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Hover Instructions */}
            <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/70 text-sm transition-opacity duration-300 ${
              activePanel ? 'opacity-0' : 'opacity-100'
            }`}>
              Hover to explore • Click to continue
            </div>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {[
              { icon: MessageCircle, text: "Real-time Chat" },
              { icon: Users, text: "Group Chats" },
              { icon: Heart, text: "Express Yourself" },
              { icon: Send, text: "Instant Messages" }
            ].map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-white/80 border border-white/20"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <feature.icon size={16} />
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          50% { transform: translateX(20px) rotate(-90deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translate(0px, 0px) rotate(0deg); }
          33% { transform: translate(10px, -10px) rotate(120deg); }
          66% { transform: translate(-10px, 10px) rotate(240deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
        
        @keyframes float-4 {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(15px) rotate(90deg); }
          75% { transform: translateX(-15px) rotate(270deg); }
        }
        
        @keyframes float-5 {
          0%, 100% { transform: translate(0px, 0px); }
          50% { transform: translate(25px, -25px); }
        }
        
        @keyframes float-6 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(30px) rotate(180deg); }
        }
        
        @keyframes float-7 {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.2) rotate(360deg); }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 1s ease-out 0.3s both;
        }
        
        .animate-float-0 { animation: float-0 var(--duration, 15s) ease-in-out infinite; }
        .animate-float-1 { animation: float-1 var(--duration, 18s) ease-in-out infinite; }
        .animate-float-2 { animation: float-2 var(--duration, 20s) ease-in-out infinite; }
        .animate-float-3 { animation: float-3 var(--duration, 16s) ease-in-out infinite; }
        .animate-float-4 { animation: float-4 var(--duration, 17s) ease-in-out infinite; }
        .animate-float-5 { animation: float-5 var(--duration, 19s) ease-in-out infinite; }
        .animate-float-6 { animation: float-6 var(--duration, 14s) ease-in-out infinite; }
        .animate-float-7 { animation: float-7 var(--duration, 21s) ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default AuthLanding;