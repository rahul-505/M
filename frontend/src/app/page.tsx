'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, FileText, Phone, Search,
  Send, MapPin, LayoutDashboard,
  MessageSquare, Stethoscope, Pill, User, Ambulance, HeartPulse,
  Brain, Droplet, Bone, Ear, Loader2, Gauge, Moon as MoonIcon, Scale,
  AlertTriangle,
} from 'lucide-react';

import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import AppointmentBanner from '@/components/AppointmentBanner';
import RecentActivity from '@/components/RecentActivity';
import StatCard from '@/components/ui/StatCard';
import ActionCard from '@/components/ui/ActionCard';
import Badge from '@/components/ui/Badge';
import SectionHeading from '@/components/ui/SectionHeading';
import type {
  NavItem, Specialty, Doctor, ChatMessage, MedResult, NewsArticle,
  StatCardData, ActivityItem,
} from '@/lib/types';

// --- STATIC APP DATA ---
const specialties: Specialty[] = [
  { name: 'Cardiologist', icon: HeartPulse, color: 'text-rose-500', count: 12 },
  { name: 'Neurologist', icon: Brain, color: 'text-purple-500', count: 8 },
  { name: 'Gen. Physician', icon: Stethoscope, color: 'text-emerald-500', count: 24 },
  { name: 'Dermatologist', icon: Droplet, color: 'text-orange-500', count: 11 },
  { name: 'Orthopaedic', icon: Bone, color: 'text-blue-500', count: 7 },
  { name: 'ENT Specialist', icon: Ear, color: 'text-amber-500', count: 6 },
];

const doctors: Doctor[] = [
  { name: 'Dr. Anil Sharma', spec: 'Cardiologist', exp: 'MBBS, MD — 14 yrs', hosp: 'Apollo Jubilee Hills', rating: '4.9', initial: 'AS', color: 'bg-blue-100 text-blue-700' },
  { name: 'Dr. Priya Reddy', spec: 'Neurologist', exp: 'MBBS, DM — 9 yrs', hosp: 'KIMS Hospital', rating: '4.8', initial: 'PR', color: 'bg-purple-100 text-purple-700' },
  { name: 'Dr. Suresh Kumar', spec: 'Gen. Physician', exp: 'MBBS — 7 yrs', hosp: 'Yashoda Hospital', rating: '4.7', initial: 'SK', color: 'bg-emerald-100 text-emerald-700' },
  { name: 'Dr. Meena Varma', spec: 'Dermatologist', exp: 'MBBS, DVD — 11 yrs', hosp: 'Care Hospital', rating: '4.6', initial: 'MV', color: 'bg-amber-100 text-amber-700' },
  { name: 'Dr. Ravi Bhatia', spec: 'Orthopaedic', exp: 'MS Ortho — 12 yrs', hosp: 'Sunshine Hospital', rating: '4.8', initial: 'RB', color: 'bg-sky-100 text-sky-700' },
];

const navItems: NavItem[] = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
  { id: 'chat', label: 'Symptom Checker', icon: MessageSquare, group: 'Main' },
  { id: 'specialists', label: 'Find Specialist', icon: Stethoscope, group: 'Main' },
  { id: 'medicines', label: 'Medicine Info', icon: Pill, group: 'Tools' },
  { id: 'news', label: 'Health News', icon: Activity, group: 'Tools' },
  { id: 'records', label: 'Health Records', icon: FileText, group: 'Tools' },
  { id: 'profile', label: 'My Profile', icon: User, group: 'Tools' },
  { id: 'emergency', label: 'Emergency', icon: Ambulance, group: 'Urgent' },
];

const statCards: StatCardData[] = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', icon: HeartPulse, tone: 'success', statusLabel: 'Normal', trend: [70, 74, 71, 73, 72, 72] },
  { label: 'Blood Pressure', value: '120/80', icon: Gauge, tone: 'success', statusLabel: 'Healthy', trend: [122, 121, 119, 120, 121, 120] },
  { label: 'Sleep Last Night', value: '6.5', unit: 'hrs', icon: MoonIcon, tone: 'warning', statusLabel: 'Below target', trend: [7.2, 6.8, 6.5, 7.0, 6.2, 6.5] },
  { label: 'BMI', value: '22.2', icon: Scale, tone: 'success', statusLabel: 'Normal range', trend: [22.5, 22.4, 22.3, 22.3, 22.2, 22.2] },
];

const recentActivity: ActivityItem[] = [
  { title: 'Symptom check', subtitle: 'Routed to Neurologist', tone: 'info', statusLabel: 'Done', date: 'Today' },
  { title: 'Medicine lookup', subtitle: 'Paracetamol info', tone: 'success', statusLabel: 'Done', date: 'Yesterday' },
];

const quickReplies = ['Chest pain', 'Severe headache', 'Stomach pain', 'Skin rash'];
const commonMedicines = ['Paracetamol', 'Aspirin', 'Metformin', 'Amoxicillin'];

export default function MedMindApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'bot', content: "Hello! I'm MedMind AI. Describe your symptoms in detail — location, severity (1-10), and how long you've had them. I'll help identify which specialist you need." },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Med Search State
  const [medInput, setMedInput] = useState('');
  const [medResult, setMedResult] = useState<MedResult | null>(null);
  const [isMedSearching, setIsMedSearching] = useState(false);

  // Specialist State
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [news, setNews] = useState<NewsArticle[]>([]);

  const fetchNews = async () => {
    try {
      const response = await fetch('https://medmind-backend-d2rv.onrender.com/api/news');
      const data = await response.json();
      setNews(data.news || []);
    } catch (error) {
      console.error('Failed to fetch health news:', error);
    }
  };

  useEffect(() => {
    // Fetch-on-mount: setNews only runs after the awaited response, not synchronously in the effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNews();
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // --- REAL PYTHON BACKEND CONNECTION ---
  const handleChatSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const text = overrideText || chatInput;
    if (!text.trim()) return;

    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await fetch('https://medmind-backend-d2rv.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
    } catch (error) {
      console.error('Failed to reach chat API:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: 'Unable to reach AI service at the moment. Please ensure the backend server is running.' }]);
    }
  };

  const handleMedSearch = async (text: string) => {
    setMedInput(text);
    setIsMedSearching(true);
    setMedResult(null);

    try {
      const response = await fetch('https://medmind-backend-d2rv.onrender.com/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicine_name: text }),
      });

      const data = await response.json();

      setIsMedSearching(false);
      setMedResult({
        name: text.toUpperCase(),
        info: data.reply,
      });
    } catch (error) {
      console.error('Failed to reach medicine API:', error);
      setIsMedSearching(false);
      setMedResult({
        name: 'SERVICE UNAVAILABLE',
        info: 'Medicine information service is currently unavailable.',
      });
    }
  };

  const activeNavItem = navItems.find(i => i.id === activeTab);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 overflow-hidden">

      <Sidebar navItems={navItems} activeTab={activeTab} onSelect={setActiveTab} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950">

        <Topbar
          title={activeNavItem?.label}
          subtitle="Overview Today"
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          alertCount={2}
          onSos={() => setActiveTab('emergency')}
        />

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <AppointmentBanner
                doctorName="Dr. Anil Sharma"
                specialty="Cardiologist"
                date="Jun 14, 2026"
                daysAway={4}
                location="Apollo Hospital, Jubilee Hills"
                onReschedule={() => {}}
              />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {statCards.map(stat => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <SectionHeading>Quick Actions</SectionHeading>
                  <div className="grid grid-cols-2 gap-2">
                    <ActionCard
                      icon={MessageSquare}
                      iconClassName="text-blue-600"
                      title="Check Symptoms"
                      subtitle="Chat with the AI checker"
                      onClick={() => setActiveTab('chat')}
                    />
                    <ActionCard
                      icon={Stethoscope}
                      iconClassName="text-emerald-600"
                      title="Find Doctor"
                      subtitle="Browse specialists nearby"
                      onClick={() => setActiveTab('specialists')}
                    />
                  </div>
                </div>
                <div>
                  <SectionHeading>Recent Activity</SectionHeading>
                  <RecentActivity items={recentActivity} />
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHAT (SYMPTOM CHECKER) */}
          {activeTab === 'chat' && (
            <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.5fr_1fr] gap-6">
              <div className="flex flex-col h-[70vh]">
                <SectionHeading>AI Symptom Checker</SectionHeading>
                <div className="flex-1 bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col overflow-hidden shadow-sm">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/40" role="log" aria-live="polite" aria-label="Chat transcript">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 text-xs rounded-xl leading-relaxed transition-all duration-200 ${
                          msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 border-l-4 border-l-blue-600 whitespace-pre-wrap'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start" aria-label="MedMind AI is typing">
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-l-4 border-l-blue-600 rounded-xl p-3 text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {quickReplies.map(s => (
                        <button
                          key={s}
                          onClick={() => handleChatSubmit(undefined, s)}
                          className="text-[10px] px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 rounded-full transition-all duration-200"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <label htmlFor="chat-input" className="sr-only">Describe your symptoms</label>
                      <input
                        id="chat-input"
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your symptoms here..."
                        className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-lg transition-all duration-200"
                      />
                      <button type="submit" disabled={!chatInput.trim() || isTyping} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-2 disabled:opacity-50 transition-all duration-200">
                        <Send size={14} aria-hidden="true" /> Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div>
                <SectionHeading>Specialist Routing Map</SectionHeading>
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl text-xs divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
                  <div className="grid grid-cols-2 p-3 font-bold text-slate-500 uppercase text-[10px]"><span>Symptoms</span><span>Specialist</span></div>
                  <div className="grid grid-cols-2 p-3 items-center"><span>Chest pain, palpitations</span><span className="font-bold text-blue-600">Cardiologist</span></div>
                  <div className="grid grid-cols-2 p-3 items-center"><span>Headache, dizziness</span><span className="font-bold text-blue-600">Neurologist</span></div>
                  <div className="grid grid-cols-2 p-3 items-center"><span>Stomach, nausea</span><span className="font-bold text-blue-600">Gastroenterologist</span></div>
                  <div className="grid grid-cols-2 p-3 items-center"><span>Skin rash, itching</span><span className="font-bold text-blue-600">Dermatologist</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SPECIALISTS */}
          {activeTab === 'specialists' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <SectionHeading>Browse by Specialty</SectionHeading>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                <button
                  onClick={() => setSelectedSpec('All')}
                  className={`bg-white dark:bg-slate-900/60 backdrop-blur-sm p-3 border rounded-xl text-center cursor-pointer transition-all duration-200 ${selectedSpec === 'All' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
                >
                  <div className="text-[11px] font-bold mt-1">All Doctors</div>
                </button>
                {specialties.map(spec => {
                  const Icon = spec.icon;
                  return (
                    <button
                      key={spec.name}
                      onClick={() => setSelectedSpec(spec.name)}
                      className={`bg-white dark:bg-slate-900/60 backdrop-blur-sm p-3 border rounded-xl text-center cursor-pointer transition-all duration-200 ${selectedSpec === spec.name ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-800 hover:border-blue-400'}`}
                    >
                      <Icon className={`mx-auto mb-1 ${spec.color}`} size={20} aria-hidden="true" />
                      <div className="text-[10px] font-bold">{spec.name}</div>
                    </button>
                  );
                })}
              </div>

              <SectionHeading className="mt-8">Available Doctors</SectionHeading>
              <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 overflow-x-auto shadow-sm">
                <div className="grid grid-cols-[40px_1fr_150px_120px_80px_80px] min-w-[640px] p-3 text-[10px] font-bold text-slate-500 uppercase">
                  <span></span><span>Doctor</span><span>Hospital</span><span>Specialty</span><span>Rating</span><span>Action</span>
                </div>
                {doctors.filter(d => selectedSpec === 'All' || d.spec === selectedSpec).map(doc => (
                  <div key={doc.name} className="grid grid-cols-[40px_1fr_150px_120px_80px_80px] min-w-[640px] p-3 text-xs items-center hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors duration-200">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${doc.color}`}>{doc.initial}</div>
                    <div><div className="font-bold">{doc.name}</div><div className="text-[10px] text-slate-500">{doc.exp}</div></div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">{doc.hosp}</div>
                    <div><Badge tone="neutral">{doc.spec}</Badge></div>
                    <div className="font-bold text-amber-500">{doc.rating} ★</div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg transition-all duration-200">Book</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MEDICINES */}
          {activeTab === 'medicines' && (
            <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.5fr_1fr] gap-6">
              <div>
                <SectionHeading>Medicine Information</SectionHeading>
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-4 rounded-xl mb-6 shadow-sm">
                  <div className="flex gap-0 mb-4">
                    <label htmlFor="med-input" className="sr-only">Search medicine name</label>
                    <input
                      id="med-input"
                      type="text"
                      value={medInput}
                      onChange={(e) => setMedInput(e.target.value)}
                      placeholder="Search: Paracetamol, Aspirin..."
                      className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-xs px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-l-lg transition-all duration-200"
                      onKeyDown={(e) => e.key === 'Enter' && medInput && handleMedSearch(medInput)}
                    />
                    <button
                      onClick={() => medInput && handleMedSearch(medInput)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-r-lg flex items-center gap-2 transition-all duration-200"
                    >
                      <Search size={14} aria-hidden="true" /> Search
                    </button>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 p-4 min-h-[150px] bg-slate-50 dark:bg-slate-900/40 rounded-lg" role="status" aria-live="polite">
                    {isMedSearching ? (
                      <div className="text-center text-slate-500 mt-8 text-xs"><Loader2 className="mx-auto mb-2 animate-spin text-blue-600" size={24} aria-hidden="true" /> Looking up info...</div>
                    ) : medResult ? (
                      <div className="text-xs whitespace-pre-wrap leading-relaxed">
                        <div className="font-bold text-blue-600 mb-2">{medResult.name}</div>
                        {medResult.info}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 mt-8 text-xs"><Pill className="mx-auto mb-2 opacity-50" size={24} aria-hidden="true" /> Search a medicine to get plain-language info</div>
                    )}
                  </div>
                </div>

                <SectionHeading>Common Searches</SectionHeading>
                <div className="flex flex-wrap gap-2">
                  {commonMedicines.map(m => (
                    <button key={m} onClick={() => handleMedSearch(m)} className="text-[10px] px-3 py-1.5 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 hover:border-blue-500 rounded-full font-medium transition-all duration-200">{m}</button>
                  ))}
                </div>
              </div>

              <div>
                <SectionHeading>Safety Guide</SectionHeading>
                <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs shadow-sm">
                  <div className="grid grid-cols-2 p-3 font-bold text-slate-500 uppercase text-[10px]"><span>Always Do</span><span>Never Do</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-emerald-600 font-bold">Read the label first</span><span className="text-rose-600 font-bold">Skip doses randomly</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-emerald-600 font-bold">Tell doctor all meds</span><span className="text-rose-600 font-bold">Share prescription</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-emerald-600 font-bold">Complete the course</span><span className="text-rose-600 font-bold">Double dose if missed</span></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NEWS */}
          {activeTab === 'news' && (
            <div className="max-w-5xl mx-auto">
              <SectionHeading className="mb-4">Latest Health News</SectionHeading>

              <div className="grid gap-4">
                {news.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <h4 className="font-bold text-sm mb-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {article.description || 'No description available'}
                    </p>
                    {article.link && (
                      <a
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-600 text-xs mt-2 inline-block transition-colors duration-200"
                      >
                        Read More →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EMERGENCY */}
          {activeTab === 'emergency' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-sm tracking-widest py-4 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-rose-600/20 transition-all duration-200">
                <AlertTriangle aria-hidden="true" /> SEND SOS — SHARE MY LOCATION NOW
              </button>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-4 rounded-xl text-center">
                  <div className="text-rose-700 dark:text-rose-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"><Ambulance size={14} aria-hidden="true" /> Ambulance</div>
                  <div className="text-3xl font-black text-rose-600 mt-2">108</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-xl text-center">
                  <div className="text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"><Phone size={14} aria-hidden="true" /> Helpline</div>
                  <div className="text-3xl font-black text-emerald-600 mt-2">104</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl text-center col-span-2 md:col-span-2 flex flex-col justify-center">
                  <div className="text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"><MapPin size={14} aria-hidden="true" /> Nearest Hospital</div>
                  <div className="text-lg font-black text-blue-600 mt-2">Apollo Jubilee Hills</div>
                  <div className="text-[10px] text-blue-600/70 mt-1">2.3 km Open 24/7</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <SectionHeading accent="rose">First Aid — Quick Guide</SectionHeading>
                  <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs shadow-sm">
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Cardiac Arrest</span><span className="text-slate-600 dark:text-slate-400">30 compressions + 2 breaths. Call 108 immediately.</span></div>
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Choking</span><span className="text-slate-600 dark:text-slate-400">5 back blows, then 5 abdominal thrusts.</span></div>
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Burns</span><span className="text-slate-600 dark:text-slate-400">Cool running water 10–20 min. No ice.</span></div>
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Stroke</span><span className="text-slate-600 dark:text-slate-400">FAST: Face drooping, Arm weak, Speech slurred, Time.</span></div>
                  </div>
                </div>
                <div>
                  <SectionHeading accent="rose">Nearby Hospitals (Hyderabad)</SectionHeading>
                  <div className="bg-white dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs shadow-sm">
                    <div className="flex justify-between p-3 items-center"><div><div className="font-bold">Apollo Hospital</div><div className="text-[10px] text-slate-500">Jubilee Hills 2.3 km</div></div><Badge tone="critical">24/7 ER</Badge></div>
                    <div className="flex justify-between p-3 items-center"><div><div className="font-bold">KIMS Hospital</div><div className="text-[10px] text-slate-500">Kondapur 3.1 km</div></div><Badge tone="critical">24/7 ER</Badge></div>
                    <div className="flex justify-between p-3 items-center"><div><div className="font-bold">Yashoda Hospital</div><div className="text-[10px] text-slate-500">Somajiguda 4.8 km</div></div><Badge tone="critical">24/7 ER</Badge></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK FOR RECORDS & PROFILE */}
          {(activeTab === 'records' || activeTab === 'profile') && (
            <div className="max-w-5xl mx-auto text-center py-20">
              <FileText className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} aria-hidden="true" />
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">{activeTab === 'records' ? 'Health Records' : 'Patient Profile'}</h2>
              <p className="text-sm text-slate-500 mt-2">This section is ready to be connected to the FastAPI database.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
