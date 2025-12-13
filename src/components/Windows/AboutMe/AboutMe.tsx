'use client'

import React, { useState } from 'react'
import { 
  User, 
  Briefcase, 
  FolderOpen, 
  Cpu, 
  GraduationCap, 
  Mail, 
  Minus, 
  Square, 
  X, 
  Github, 
  Linkedin, 
  Globe, 
  Phone,
  MapPin,
  ExternalLink,
  LayoutGrid,
  MessageSquare,
  Search,
  Server,
  Award,
  ArrowUpRight
} from 'lucide-react'

interface AboutMeProps {
  onOpenWindow?: (windowId: string) => void
}

export default function AboutMe({ onOpenWindow }: AboutMeProps = {}) {
  const [activeTab, setActiveTab] = useState('overview')

  return (
    <div className="w-full h-full bg-[#1F1F1F] flex overflow-hidden font-sans text-white select-none">
      <style jsx>{`
        /* Custom scrollbar styling */
        :global(.calendar-scrollbar::-webkit-scrollbar) {
          width: 6px;
          height: 6px;
        }
        :global(.calendar-scrollbar::-webkit-scrollbar-track) {
          background: transparent;
        }
        :global(.calendar-scrollbar::-webkit-scrollbar-thumb) {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 3px;
        }
        :global(.calendar-scrollbar::-webkit-scrollbar-thumb:hover) {
          background: rgba(255, 255, 255, 0.25);
        }
      `}</style>
      
      {/* LEFT SIDEBAR */}
      <div className="w-[320px] flex flex-col p-6 relative">
            
            {/* 1. PROFILE CARD */}
            <div className="bg-[#2D2D2D] p-4 rounded-[8px] border border-white/5 flex items-center gap-4 mb-6 hover:bg-[#323232] transition-colors group cursor-default">
               <div className="w-[60px] h-[60px] rounded-full bg-[#8B5CF6] overflow-hidden border-2 border-[#1F1F1F] flex items-center justify-center shrink-0">
                  {/* Profile Picture */}
                  <img 
                    src={require('@/data/cloudinary-images.json').snkIcon} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
               </div>
               <div className="flex flex-col overflow-hidden">
                  <span className="text-[15px] font-bold text-white truncate">SNK</span>
                  <span className="text-[11px] text-[#60CDFF] mt-1">Full Stack Developer</span>
               </div>
            </div>

            {/* 2. CONTACT & SOCIALS */}
            <div className="flex-1 overflow-y-auto calendar-scrollbar">
               <h3 className="text-[13px] font-semibold text-white/40 mb-3 uppercase tracking-wider px-1">Contact & Socials</h3>
               <div className="space-y-1">
                  <ContactItem icon={<Mail size={16} />} label="shombhukaran21@gmail.com" link onClick={() => onOpenWindow?.('contact')} />
                  <ContactItem icon={<MapPin size={16} />} label="Kolkata, West Bengal" />
                  <div className="h-px bg-white/5 my-2 mx-1"></div>
                  <ContactItem icon={<Github size={16} />} label="github.com/sn7k" link onClick={() => window.open('https://github.com/sn7k', '_blank')} />
                  <ContactItem icon={<Linkedin size={16} />} label="linkedin.com/in/shombhunath" link onClick={() => window.open('https://www.linkedin.com/in/shombhunath-karan/', '_blank')} />
                  <ContactItem icon={<Globe size={16} />} label="snk.codes" link onClick={() => window.open('https://snk.codes', '_blank')} />
               </div>
            </div>

            {/* Bottom Status */}
            <div className="mt-auto pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-[12px] text-white/40">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Open to Work
                </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-1 flex flex-col">
             
             {/* TOP NAVIGATION TABS */}
             <div className="h-[50px] flex items-center px-6 gap-6">
                <TabItem 
                   label="Overview" 
                   active={activeTab === 'overview'} 
                   onClick={() => setActiveTab('overview')}
                />
                <TabItem 
                   label="Education" 
                   active={activeTab === 'education'} 
                   onClick={() => setActiveTab('education')}
                />
                 <TabItem 
                   label="Experience" 
                   active={activeTab === 'experience'} 
                   onClick={() => setActiveTab('experience')}
                />
                <TabItem 
                   label="Projects" 
                   active={activeTab === 'projects'} 
                   onClick={() => setActiveTab('projects')}
                />
             </div>

             {/* MAIN CONTENT AREA */}
             <div className="flex-1 overflow-y-auto calendar-scrollbar p-8">
                
                {/* --- OVERVIEW TAB (Profile & Skills) --- */}
                {activeTab === 'overview' && (
                   <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <h1 className="text-[24px] font-semibold mb-2">Hello, I&apos;m Shombhunath</h1>
                      <p className="text-[14px] text-white/50 mb-8">Aspiring Full-Stack Developer • MERN Stack Specialist</p>
                      
                      {/* Summary Card */}
                      <div className="bg-[#2D2D2D] p-6 rounded-[8px] border border-white/5 mb-8">
                         <h2 className="text-[16px] font-semibold text-white mb-3 flex items-center gap-2">
                            <User size={18} className="text-[#60CDFF]" /> About Me
                         </h2>
                         <p className="text-[14px] text-white/70 leading-relaxed">
                            Passionate Full-Stack Developer with hands-on experience in the MERN stack. 
                            I have built multiple real-world projects focusing on modern UI, secure authentication, 
                            and robust REST APIs. Proven team leadership through academic project management.
                         </p>
                      </div>

                      {/* TECHNICAL SKILLS */}
                      <h2 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
                         <Cpu size={20} className="text-green-400" /> Technical Skills
                      </h2>
                      <div className="grid grid-cols-2 gap-6 mb-8">
                         <div>
                            <h3 className="text-[13px] font-semibold text-white/50 uppercase mb-3">Frontend</h3>
                            <div className="bg-[#2D2D2D] rounded-[8px] border border-white/5 p-1">
                               <SkillRow icon={<div className="text-blue-400 font-bold text-xs">R</div>} name="React.js" />
                               <SkillRow icon={<div className="text-yellow-400 font-bold text-xs">JS</div>} name="JavaScript" />
                               <SkillRow icon={<div className="text-blue-500 font-bold text-xs">TS</div>} name="TypeScript" />
                               <SkillRow icon={<div className="text-cyan-400 font-bold text-xs">TW</div>} name="Tailwind CSS" />
                            </div>
                         </div>
                         
                         <div>
                            <h3 className="text-[13px] font-semibold text-white/50 uppercase mb-3">Backend</h3>
                            <div className="bg-[#2D2D2D] rounded-[8px] border border-white/5 p-1">
                               <SkillRow icon={<div className="text-green-500 font-bold text-xs">N</div>} name="Node.js" />
                               <SkillRow icon={<div className="text-white font-bold text-xs">EX</div>} name="Express.js" />
                               <SkillRow icon={<div className="text-green-400 font-bold text-xs">M</div>} name="MongoDB" />
                               <SkillRow icon={<div className="text-yellow-300 font-bold text-xs">PY</div>} name="Python" />
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                {/* --- EDUCATION TAB --- */}
                {activeTab === 'education' && (
                   <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <h1 className="text-[24px] font-semibold mb-6">Education</h1>
                      <div className="space-y-4">
                         <div className="bg-[#2D2D2D] p-5 rounded-[8px] border border-white/5">
                            <div className="flex justify-between items-start">
                               <div className="flex gap-4">
                                  <div className="w-10 h-10 rounded bg-blue-500/20 flex items-center justify-center text-blue-400">
                                     <GraduationCap size={20} />
                                  </div>
                                  <div>
                                     <h3 className="text-[16px] font-semibold text-white">Bachelor of Computer Applications</h3>
                                     <p className="text-[13px] text-white/60">Brainware University</p>
                                  </div>
                               </div>
                               <span className="text-[12px] bg-white/5 px-2 py-1 rounded text-white/60">2023 - 2027</span>
                            </div>
                         </div>

                         <div className="bg-[#2D2D2D] p-5 rounded-[8px] border border-white/5">
                            <div className="flex gap-4">
                               <div className="w-10 h-10 rounded bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                                  <Award size={20} />
                               </div>
                               <div>
                                  <h3 className="text-[16px] font-semibold text-white">Certifications</h3>
                                  <p className="text-[13px] text-white/60">Responsive Web Design (freeCodeCamp)</p>
                                  <p className="text-[13px] text-white/60 mt-1">Data Representation & Visualization</p>
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                )}

                 {/* --- EXPERIENCE TAB --- */}
                 {activeTab === 'experience' && (
                   <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <h1 className="text-[24px] font-semibold mb-6">Experience</h1>
                      <div className="bg-[#2D2D2D] p-5 rounded-[8px] border border-white/5">
                         <div className="flex justify-between items-start mb-2">
                            <div className="flex gap-4">
                               <div className="w-10 h-10 rounded bg-green-500/20 flex items-center justify-center text-green-400">
                                  <Server size={20} />
                               </div>
                               <div>
                                  <h3 className="text-[16px] font-semibold text-white">Backend Developer</h3>
                                  <p className="text-[13px] text-white/60">ManMed-Dynamics</p>
                               </div>
                            </div>
                            <span className="text-[12px] bg-white/5 px-2 py-1 rounded text-white/60">Aug 2025 - Present</span>
                         </div>
                         <p className="text-[13px] text-white/50 pl-[56px] leading-relaxed">
                            Leading API and database development for DOSE-CAL, a pediatric dosage & patient management app.
                         </p>
                      </div>
                   </div>
                )}

                {/* --- PROJECTS TAB (Moved to Last) --- */}
                {activeTab === 'projects' && (
                   <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-300">
                      <h1 className="text-[24px] font-semibold mb-6">Featured Projects</h1>
                      
                      <div className="grid grid-cols-3 gap-6 mb-8">
                         <ProjectCard 
                           title="Incampus" 
                           desc="College Social Media" 
                           icon={<LayoutGrid size={24} />} 
                           color="text-purple-400"
                           bg="bg-purple-500/10"
                         />
                         <ProjectCard 
                           title="Busseva" 
                           desc="Transport App" 
                           icon={<MapPin size={24} />} 
                           color="text-orange-400"
                           bg="bg-orange-500/10"
                         />
                         <ProjectCard 
                           title="Splitaa" 
                           desc="Expense Manager" 
                           icon={<Briefcase size={24} />} 
                           color="text-green-400"
                           bg="bg-green-500/10"
                         />
                      </div>
                   </div>
                )}

             </div>
          </div>

    </div>
  )
}

// ----------------------------------------------------------------------
// HELPER COMPONENTS
// ----------------------------------------------------------------------

function ContactItem({ icon, label, link, onClick }: { icon: React.ReactNode; label: string; link?: boolean; onClick?: () => void }) {
   return (
      <div 
         className={`flex items-center gap-3 px-3 py-2 rounded-[4px] ${link ? 'hover:bg-white/5 cursor-pointer group' : ''}`}
         onClick={onClick}
      >
         <div className="text-white/40 group-hover:text-white transition-colors">{icon}</div>
         <span className={`text-[13px] ${link ? 'text-white/70 group-hover:text-[#60CDFF]' : 'text-white/70'} transition-colors truncate`}>{label}</span>
         {link && <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 text-white/30 transition-opacity" />}
      </div>
   )
}

function TabItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
   return (
      <div 
         onClick={onClick} 
         className={`h-full flex items-center relative cursor-pointer px-1 ${active ? 'text-[#60CDFF] font-semibold' : 'text-white/70 hover:text-white transition-colors'}`}
      >
         <span className="text-[14px]">{label}</span>
         {active && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#60CDFF] rounded-t-full"></div>}
      </div>
   )
}

function SkillRow({ icon, name }: { icon: React.ReactNode; name: string }) {
   return (
      <div className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors cursor-default border-b border-white/5 last:border-0">
         <div className="w-8 h-8 rounded bg-[#1F1F1F] flex items-center justify-center">
            {icon}
         </div>
         <span className="text-[13px] text-white/80">{name}</span>
      </div>
   )
}

function ProjectCard({ title, desc, icon, color, bg }: { title: string; desc: string; icon: React.ReactNode; color: string; bg: string }) {
   return (
      <div className="bg-[#2D2D2D] p-5 rounded-[8px] border border-white/5 hover:bg-[#333] transition-colors cursor-pointer group flex flex-col items-center text-center gap-3">
         <div className={`w-14 h-14 rounded-[12px] flex items-center justify-center ${bg} ${color} group-hover:scale-110 transition-transform`}>
            {icon}
         </div>
         <div>
            <h3 className="text-[15px] font-semibold text-white group-hover:text-[#60CDFF] transition-colors">{title}</h3>
            <p className="text-[12px] text-white/50">{desc}</p>
         </div>
         <button className="mt-2 text-[12px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-[4px] text-white/70 flex items-center gap-2 transition-colors w-full justify-center">
            Open App <ArrowUpRight size={12} />
         </button>
      </div>
   )
}
