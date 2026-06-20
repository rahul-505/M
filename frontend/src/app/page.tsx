'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, FileText, Phone, Moon, Sun, Search, AlertTriangle, 
  Send, Calendar, MapPin, LayoutDashboard, 
  MessageSquare, Stethoscope, Pill, User, Ambulance, HeartPulse,
  Brain, Droplet, Bone, Ear, Loader2
} from 'lucide-react';

// --- DATA FROM YOUR BLUEPRINT ---
const specialties = [
  { name: 'Cardiologist', icon: HeartPulse, color: 'text-red-500', count: 12 },
  { name: 'Neurologist', icon: Brain, color: 'text-purple-500', count: 8 },
  { name: 'Gen. Physician', icon: Stethoscope, color: 'text-green-500', count: 24 },
  { name: 'Dermatologist', icon: Droplet, color: 'text-orange-500', count: 11 },
  { name: 'Orthopaedic', icon: Bone, color: 'text-blue-500', count: 7 },
  { name: 'ENT Specialist', icon: Ear, color: 'text-amber-500', count: 6 }
];

const doctors = [
  { name: 'Dr. Anil Sharma', spec: 'Cardiologist', exp: 'MBBS, MD — 14 yrs', hosp: 'Apollo Jubilee Hills', rating: '4.9', initial: 'AS', color: 'bg-blue-100 text-blue-700' },
  { name: 'Dr. Priya Reddy', spec: 'Neurologist', exp: 'MBBS, DM — 9 yrs', hosp: 'KIMS Hospital', rating: '4.8', initial: 'PR', color: 'bg-purple-100 text-purple-700' },
  { name: 'Dr. Suresh Kumar', spec: 'Gen. Physician', exp: 'MBBS — 7 yrs', hosp: 'Yashoda Hospital', rating: '4.7', initial: 'SK', color: 'bg-green-100 text-green-700' },
  { name: 'Dr. Meena Varma', spec: 'Dermatologist', exp: 'MBBS, DVD — 11 yrs', hosp: 'Care Hospital', rating: '4.6', initial: 'MV', color: 'bg-amber-100 text-amber-700' },
  { name: 'Dr. Ravi Bhatia', spec: 'Orthopaedic', exp: 'MS Ortho — 12 yrs', hosp: 'Sunshine Hospital', rating: '4.8', initial: 'RB', color: 'bg-sky-100 text-sky-700' }
];

export default function MedMindApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  
  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hello! I'm MedMind AI. Describe your symptoms in detail — location, severity (1-10), and how long you've had them. I'll help identify which specialist you need." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Med Search State
  const [medInput, setMedInput] = useState('');
  const [medResult, setMedResult] = useState<{name: string, info: string} | null>(null);
  const [isMedSearching, setIsMedSearching] = useState(false);

  // Specialist State
  const [selectedSpec, setSelectedSpec] = useState('All');
  const [news, setNews] = useState([
  {
    title: "WHO Reports Progress in Global Vaccination Programs",
    description: "Recent initiatives have increased vaccination coverage across several regions."
  },
  {
    title: "New AI Tools Transform Healthcare Diagnostics",
    description: "AI-assisted diagnosis systems are helping doctors detect diseases faster."
  },
  {
    title: "Heart Health Awareness Campaign Launches Nationwide",
    description: "Experts encourage regular exercise and healthy diets to reduce cardiac risks."
  },
  {
    title: "Breakthrough Research in Diabetes Treatment",
    description: "Scientists announce promising clinical trial results."
  }
]);

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
      // Send the user's message to our Python FastAPI server
      const response = await fetch('https://medmind-backend-d2rv.onrender.com/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();
      
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
      
    } catch (error) {
      setIsTyping(false);
      setMessages(prev => [...prev, { role: 'bot', content: "Unable to reach AI service at the moment. Please ensure the backend server is running." }]);
    }
  };

  const handleMedSearch = async (text: string) => {
    setMedInput(text);
    setIsMedSearching(true);
    setMedResult(null);

    try {
      // 1. Send the medicine name to our Python FastAPI server
      const response = await fetch('https://medmind-backend-d2rv.onrender.com/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicine_name: text })
      });
      
      // 2. Wait for the AI to process and return the data
      const data = await response.json();
      
      // 3. Display the AI's response in the medicine result box
      setIsMedSearching(false);
      setMedResult({
        name: text.toUpperCase(),
        info: data.reply
      });
      
    } catch (error) {
      setIsMedSearching(false);
      setMedResult({
        name: "SERVICE UNAVAILABLE",
        info: "Medicine information service is currently unavailable."
      });
    }
  };

  // // --- RENDER LOGIN SCREEN ---
  
  // --- RENDER MAIN APP ---
  const navItems = [
    { id: 'home', label: 'Dashboard', icon: LayoutDashboard, group: 'Main' },
    { id: 'chat', label: 'Symptom Checker', icon: MessageSquare, group: 'Main' },
    { id: 'specialists', label: 'Find Specialist', icon: Stethoscope, group: 'Main' },
    { id: 'medicines', label: 'Medicine Info', icon: Pill, group: 'Tools' },
    { id: 'news', label: 'Health News', icon: Activity, group: 'Tools' },
    { id: 'records', label: 'Health Records', icon: FileText, group: 'Tools' },
    { id: 'profile', label: 'My Profile', icon: User, group: 'Tools' },
    { id: 'emergency', label: 'Emergency', icon: Ambulance, group: 'Urgent' },
  ];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-[220px] bg-[#0A1628] flex flex-col flex-shrink-0">
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white font-bold rounded-sm"><HeartPulse size={18} /></div>
          <div>
            <div className="text-white text-sm font-bold tracking-tight">MedMind</div>
            <div className="text-slate-400 text-[10px]">AI Health Platform</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {['Main', 'Tools', 'Urgent'].map(group => (
            <div key={group} className="mb-4">
              <div className="px-4 py-2 text-[10px] font-bold tracking-widest text-slate-500 uppercase">{group}</div>
              {navItems.filter(item => item.group === group).map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-medium transition-colors border-l-2 ${
                      isActive ? 'bg-blue-600/15 text-blue-400 border-blue-500' : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={16} /> {item.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white text-xs font-bold rounded-sm">PR</div>
          <div className="flex-1">
            <div className="text-slate-200 text-xs font-medium">Rahul P.</div>
            <div className="text-slate-500 text-[10px]">Patient MED-0042</div>
          </div>
          {/* <button onClick={() => setIsLoggedIn(false)} className="text-slate-400 hover:text-white"> */}
            {/* <LogOut size={14} /> */}
          {/* </button> */}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-900">
        
        {/* TOPBAR */}
        <div className="h-14 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">
              {navItems.find(i => i.id === activeTab)?.label}
            </h2>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Overview Today</div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setDarkMode(!darkMode)} className="text-slate-500 dark:text-slate-400 hover:text-blue-600">
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 font-bold rounded-sm">2 ALERTS</span>
            <button onClick={() => setActiveTab('emergency')} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-sm uppercase tracking-wide">
              <AlertTriangle size={14} /> SOS
            </button>
          </div>
        </div>

        {/* SCROLLABLE PAGE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB: HOME */}
          {activeTab === 'home' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <div className="bg-blue-600 text-white p-3 rounded-sm flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold flex items-center gap-2"><Calendar size={14} /> Upcoming: Dr. Anil Sharma (Cardiologist) Jun 14, 2026</div>
                  <div className="text-[10px] text-blue-200 mt-1">Apollo Hospital, Jubilee Hills 4 days away</div>
                </div>
                <button className="bg-white text-blue-600 text-[11px] font-bold px-3 py-1.5 rounded-sm">Reschedule</button>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-sm border-l-4 border-l-red-500">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Heart Rate</div>
                  <div className="text-2xl font-black mt-1 text-slate-800 dark:text-white">72 <span className="text-sm font-normal">bpm</span></div>
                  <div className="mt-2 inline-block bg-green-100 text-green-800 text-[10px] px-2 py-0.5 font-bold rounded-sm">Normal</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-sm border-l-4 border-l-green-500">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Blood Pressure</div>
                  <div className="text-2xl font-black mt-1 text-slate-800 dark:text-white">120<span className="text-sm font-normal">/80</span></div>
                  <div className="mt-2 inline-block bg-green-100 text-green-800 text-[10px] px-2 py-0.5 font-bold rounded-sm">Healthy</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-sm border-l-4 border-l-amber-500">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Sleep Last Night</div>
                  <div className="text-2xl font-black mt-1 text-slate-800 dark:text-white">6.5 <span className="text-sm font-normal">hrs</span></div>
                  <div className="mt-2 inline-block bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 font-bold rounded-sm">Below target</div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-sm border-l-4 border-l-blue-500">
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">BMI</div>
                  <div className="text-2xl font-black mt-1 text-slate-800 dark:text-white">22.2</div>
                  <div className="mt-2 inline-block bg-green-100 text-green-800 text-[10px] px-2 py-0.5 font-bold rounded-sm">Normal range</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div onClick={() => setActiveTab('chat')} className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-sm cursor-pointer hover:border-blue-500 text-center transition">
                      <MessageSquare className="mx-auto mb-2 text-blue-600" size={24} />
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Check Symptoms</div>
                    </div>
                    <div onClick={() => setActiveTab('specialists')} className="bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-sm cursor-pointer hover:border-blue-500 text-center transition">
                      <Stethoscope className="mx-auto mb-2 text-green-600" size={24} />
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Find Doctor</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">Recent Activity</h3>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm divide-y divide-slate-100 dark:divide-slate-700">
                    <div className="p-3 text-xs flex justify-between items-center">
                      <div><div className="font-bold">Symptom check</div><div className="text-[10px] text-slate-500">Routed to Neurologist</div></div>
                      <span className="bg-blue-100 text-blue-800 px-2 py-0.5 text-[10px] font-bold rounded-sm">Done</span>
                    </div>
                    <div className="p-3 text-xs flex justify-between items-center">
                      <div><div className="font-bold">Medicine</div><div className="text-[10px] text-slate-500">Paracetamol Info</div></div>
                      <span className="bg-green-100 text-green-800 px-2 py-0.5 text-[10px] font-bold rounded-sm">Done</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CHAT (SYMPTOM CHECKER) */}
          {activeTab === 'chat' && (
            <div className="max-w-5xl mx-auto grid grid-cols-[1.5fr_1fr] gap-6">
              <div className="flex flex-col h-[70vh]">
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">AI Symptom Checker</h3>
                <div className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-800/50">
                    {messages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 text-xs rounded-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 dark:text-slate-200 border-l-4 border-l-blue-600 whitespace-pre-wrap'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 border-l-4 border-l-blue-600 p-3 text-xs flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {['Chest pain', 'Severe headache', 'Stomach pain', 'Skin rash'].map(s => (
                        <button key={s} onClick={() => handleChatSubmit(undefined, s)} className="text-[10px] px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-blue-600 hover:text-white rounded-sm transition">
                          {s}
                        </button>
                      ))}
                    </div>
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <input 
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your symptoms here..." 
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs px-3 py-2 outline-none focus:border-blue-500 rounded-sm"
                      />
                      <button type="submit" disabled={!chatInput.trim() || isTyping} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-sm flex items-center gap-2 disabled:opacity-50">
                        <Send size={14} /> Send
                      </button>
                    </form>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">Specialist Routing Map</h3>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm text-xs divide-y divide-slate-100 dark:divide-slate-700">
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
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">Browse by Specialty</h3>
              <div className="grid grid-cols-6 gap-3">
                <div 
                  onClick={() => setSelectedSpec('All')}
                  className={`bg-white dark:bg-slate-800 p-3 border rounded-sm text-center cursor-pointer transition ${selectedSpec === 'All' ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                >
                  <div className="text-[11px] font-bold mt-1">All Doctors</div>
                </div>
                {specialties.map(spec => {
                  const Icon = spec.icon;
                  return (
                    <div 
                      key={spec.name} 
                      onClick={() => setSelectedSpec(spec.name)}
                      className={`bg-white dark:bg-slate-800 p-3 border rounded-sm text-center cursor-pointer transition ${selectedSpec === spec.name ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                    >
                      <Icon className={`mx-auto mb-1 ${spec.color}`} size={20} />
                      <div className="text-[10px] font-bold">{spec.name}</div>
                    </div>
                  )
                })}
              </div>

              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2 mt-8">Available Doctors</h3>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm divide-y divide-slate-100 dark:divide-slate-700">
                <div className="grid grid-cols-[40px_1fr_150px_120px_80px_80px] p-3 text-[10px] font-bold text-slate-500 uppercase">
                  <span></span><span>Doctor</span><span>Hospital</span><span>Specialty</span><span>Rating</span><span>Action</span>
                </div>
                {doctors.filter(d => selectedSpec === 'All' || d.spec === selectedSpec).map(doc => (
                  <div key={doc.name} className="grid grid-cols-[40px_1fr_150px_120px_80px_80px] p-3 text-xs items-center hover:bg-slate-50 dark:hover:bg-slate-800/80 transition">
                    <div className={`w-8 h-8 rounded-sm flex items-center justify-center font-bold text-xs ${doc.color}`}>{doc.initial}</div>
                    <div><div className="font-bold">{doc.name}</div><div className="text-[10px] text-slate-500">{doc.exp}</div></div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400">{doc.hosp}</div>
                    <div><span className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 text-[10px] font-bold rounded-sm">{doc.spec}</span></div>
                    <div className="font-bold text-amber-500">{doc.rating} ★</div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-sm">Book</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: MEDICINES */}
          {activeTab === 'medicines' && (
            <div className="max-w-5xl mx-auto grid grid-cols-[1.5fr_1fr] gap-6">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">Medicine Information</h3>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-sm mb-6">
                  <div className="flex gap-0 mb-4">
                    <input 
                      type="text" 
                      value={medInput}
                      onChange={(e) => setMedInput(e.target.value)}
                      placeholder="Search: Paracetamol, Aspirin..." 
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs px-3 py-2 outline-none focus:border-blue-500 rounded-l-sm"
                      onKeyDown={(e) => e.key === 'Enter' && medInput && handleMedSearch(medInput)}
                    />
                    <button 
                      onClick={() => medInput && handleMedSearch(medInput)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-xs font-bold rounded-r-sm flex items-center gap-2"
                    >
                      <Search size={14} /> Search
                    </button>
                  </div>
                  
                  <div className="border border-slate-200 dark:border-slate-700 p-4 min-h-[150px] bg-slate-50 dark:bg-slate-800/50 rounded-sm">
                    {isMedSearching ? (
                      <div className="text-center text-slate-500 mt-8 text-xs"><Loader2 className="mx-auto mb-2 animate-spin text-blue-600" size={24} /> Looking up info...</div>
                    ) : medResult ? (
                      <div className="text-xs whitespace-pre-wrap leading-relaxed">
                        <div className="font-bold text-blue-600 mb-2">{medResult.name}</div>
                        {medResult.info}
                      </div>
                    ) : (
                      <div className="text-center text-slate-400 mt-8 text-xs"><Pill className="mx-auto mb-2 opacity-50" size={24} /> Search a medicine to get plain-language info</div>
                    )}
                  </div>
                </div>

                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">Common Searches</h3>
                <div className="flex flex-wrap gap-2">
                  {['Paracetamol', 'Aspirin', 'Metformin', 'Amoxicillin'].map(m => (
                    <button key={m} onClick={() => handleMedSearch(m)} className="text-[10px] px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 rounded-sm font-medium">{m}</button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-blue-600 pl-2">Safety Guide</h3>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                  <div className="grid grid-cols-2 p-3 font-bold text-slate-500 uppercase text-[10px]"><span>Always Do</span><span>Never Do</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-green-600 font-bold">Read the label first</span><span className="text-red-600 font-bold">Skip doses randomly</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-green-600 font-bold">Tell doctor all meds</span><span className="text-red-600 font-bold">Share prescription</span></div>
                  <div className="grid grid-cols-2 p-3"><span className="text-green-600 font-bold">Complete the course</span><span className="text-red-600 font-bold">Double dose if missed</span></div>
                </div>
              </div>
            </div>
          )}
          {/* TAB: NEWS */}
          {activeTab === 'news' && (
            <div className="max-w-5xl mx-auto">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-4 border-l-2 border-blue-600 pl-2">
                Latest Health News
              </h3>

              <div className="grid gap-4">
                {news.map((article, index) => (
                  <div
                    key={index}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-sm"
                  >
                    <h4 className="font-bold text-sm mb-2">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {article.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: EMERGENCY */}
          {activeTab === 'emergency' && (
            <div className="max-w-5xl mx-auto space-y-6">
              <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black text-sm tracking-widest py-4 rounded-sm flex items-center justify-center gap-3 shadow-lg shadow-red-600/20 transition">
                <AlertTriangle /> SEND SOS — SHARE MY LOCATION NOW
              </button>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-sm text-center">
                  <div className="text-red-700 dark:text-red-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"><Ambulance size={14}/> Ambulance</div>
                  <div className="text-3xl font-black text-red-600 mt-2">108</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-sm text-center">
                  <div className="text-green-700 dark:text-green-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"><Phone size={14}/> Helpline</div>
                  <div className="text-3xl font-black text-green-600 mt-2">104</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-sm text-center col-span-2 md:col-span-2 flex flex-col justify-center">
                  <div className="text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase flex items-center justify-center gap-1"><MapPin size={14}/> Nearest Hospital</div>
                  <div className="text-lg font-black text-blue-600 mt-2">Apollo Jubilee Hills</div>
                  <div className="text-[10px] text-blue-600/70 mt-1">2.3 km Open 24/7</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-red-600 pl-2">First Aid — Quick Guide</h3>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Cardiac Arrest</span><span className="text-slate-600 dark:text-slate-400">30 compressions + 2 breaths. Call 108 immediately.</span></div>
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Choking</span><span className="text-slate-600 dark:text-slate-400">5 back blows, then 5 abdominal thrusts.</span></div>
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Burns</span><span className="text-slate-600 dark:text-slate-400">Cool running water 10–20 min. No ice.</span></div>
                    <div className="grid grid-cols-[120px_1fr] p-3"><span className="font-bold">Stroke</span><span className="text-slate-600 dark:text-slate-400">FAST: Face drooping, Arm weak, Speech slurred, Time.</span></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-3 border-l-2 border-red-600 pl-2">Nearby Hospitals (Hyderabad)</h3>
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-sm divide-y divide-slate-100 dark:divide-slate-700 text-xs">
                    <div className="flex justify-between p-3 items-center"><div><div className="font-bold">Apollo Hospital</div><div className="text-[10px] text-slate-500">Jubilee Hills 2.3 km</div></div><span className="bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold rounded-sm">24/7 ER</span></div>
                    <div className="flex justify-between p-3 items-center"><div><div className="font-bold">KIMS Hospital</div><div className="text-[10px] text-slate-500">Kondapur 3.1 km</div></div><span className="bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold rounded-sm">24/7 ER</span></div>
                    <div className="flex justify-between p-3 items-center"><div><div className="font-bold">Yashoda Hospital</div><div className="text-[10px] text-slate-500">Somajiguda 4.8 km</div></div><span className="bg-red-100 text-red-800 px-2 py-0.5 text-[10px] font-bold rounded-sm">24/7 ER</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK FOR RECORDS & PROFILE */}
          {(activeTab === 'records' || activeTab === 'profile') && (
            <div className="max-w-5xl mx-auto text-center py-20">
              <FileText className="mx-auto text-slate-300 dark:text-slate-600 mb-4" size={48} />
              <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300">{activeTab === 'records' ? 'Health Records' : 'Patient Profile'}</h2>
              <p className="text-sm text-slate-500 mt-2">This section is ready to be connected to the FastAPI database.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
