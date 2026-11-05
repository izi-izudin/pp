import React from 'react';
import { 
  ArrowRight, 
  Play, 
  ExternalLink, 
  Sparkles, 
  Terminal, 
  Bot, 
  MessageSquare, 
  CheckCircle,
  Quote,
  Mail,
  MapPin,
  Clock,
  Layers,
  Code2,
  Cpu,
  Palette
} from 'lucide-react';
import type { NavigationTab } from '../types.js';

interface PortfolioViewProps {
  onNavigate: (tab: NavigationTab) => void;
  openContactModal: () => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onNavigate, openContactModal }) => {
  const stats = [
    { value: '08+', label: 'YEARS EXPERIENCE', icon: '🚀' },
    { value: '120+', label: 'PROJECTS COMPLETED', icon: '</>' },
    { value: '68+', label: 'HAPPY CLIENTS', icon: '👥' },
    { value: '15', label: 'AWARDS WON', icon: '🏆' },
  ];

  const services = [
    {
      title: 'INTERACTIVE WEBSITES',
      desc: 'Engage, impress, and convert with stunning 3D WebGL, interactive animations, and responsive layouts.',
      icon: <Layers className="w-6 h-6 text-cyan-400" />,
      tag: 'WebGL / Three.js'
    },
    {
      title: 'WEB APPLICATIONS',
      desc: 'Custom web apps built with modern stacks for enterprise performance, zero-latency, and high scalability.',
      icon: <Code2 className="w-6 h-6 text-purple-400" />,
      tag: 'Full-Stack React & Node'
    },
    {
      title: 'CREATIVE CODING',
      desc: 'Generative art, algorithmic interactions, canvas shaders, and futuristic visual soundscapes.',
      icon: <Cpu className="w-6 h-6 text-pink-400" />,
      tag: 'GLSL / Audio Synthesis'
    },
    {
      title: 'UI/UX & DESIGN',
      desc: 'Pixel-perfect cyber aesthetics with seamless ergonomic UX to create truly memorable digital experiences.',
      icon: <Palette className="w-6 h-6 text-emerald-400" />,
      tag: 'Cyberpunk & Neo-Brutalism'
    },
  ];

  const featuredProjects = [
    {
      id: 'proj-1',
      title: 'ECHOES OF TOMORROW',
      subtitle: 'Web Experience',
      desc: 'Cyberpunk interactive 3D audiovisual world with real-time audio synchronization.',
      color: 'from-pink-600/30 via-purple-600/20 to-transparent',
      borderColor: 'border-pink-500/40',
      badge: 'Interactive 3D',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'proj-2',
      title: 'NEON ATLAS',
      subtitle: 'Interactive Web',
      desc: 'Geospatial cyber-cartography and real-time city telemetry visualization.',
      color: 'from-cyan-600/30 via-indigo-600/20 to-transparent',
      borderColor: 'border-cyan-500/40',
      badge: 'Geospatial Web',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'proj-3',
      title: 'LUNAR DRIFT',
      subtitle: 'Digital Experience',
      desc: 'Real-time particle simulation engine running in high-performance browser canvas.',
      color: 'from-blue-600/30 via-cyan-600/20 to-transparent',
      borderColor: 'border-blue-500/40',
      badge: 'Particle Engine',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=700&q=80'
    },
    {
      id: 'proj-4',
      title: 'QUANTUM DASHBOARD',
      subtitle: 'Web Application',
      desc: 'Enterprise monitoring suite with integrated API Playground, IZI AI Chatbot, and Meta WhatsApp Center.',
      color: 'from-purple-600/30 via-pink-600/20 to-transparent',
      borderColor: 'border-purple-500/40',
      badge: 'Live Full-Stack',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=700&q=80'
    },
  ];

  const tools = [
    { name: 'HTML5', color: '#e34f26' },
    { name: 'CSS3', color: '#1572b6' },
    { name: 'JavaScript', color: '#f7df1e' },
    { name: 'TypeScript', color: '#3178c6' },
    { name: 'React', color: '#61dafb' },
    { name: 'Next.js', color: '#ffffff' },
    { name: 'Three.js', color: '#049ef4' },
    { name: 'GSAP', color: '#88ce02' },
    { name: 'Tailwind CSS', color: '#38bdf8' },
    { name: 'Node.js', color: '#539e43' },
    { name: 'Git', color: '#f05032' },
    { name: 'Figma', color: '#f24e1e' }
  ];

  const processSteps = [
    { num: '01', title: 'DISCOVER', desc: 'Understanding goals, audience, and the creative direction.' },
    { num: '02', PLAN: 'PLAN', title: 'PLAN', desc: 'Strategy, wireframes, architecture, and interaction planning.' },
    { num: '03', title: 'DESIGN', desc: 'Crafting stunning UI with focus on aesthetic sensory experience.' },
    { num: '04', title: 'DEVELOP', desc: 'Bringing ideas to life with clean, modular, scalable code.' },
    { num: '05', title: 'DEPLOY', desc: 'Rigorous testing, optimization, and launching seamless systems.' },
  ];

  const testimonials = [
    {
      name: 'Sophie Bennett',
      role: 'Product Designer',
      text: 'Izi is an exceptional developer who turns complex ideas into beautiful digital experiences. The fluidity and polish is unmatched.'
    },
    {
      name: 'Liam Carter',
      role: 'CEO, Innovate Labs',
      text: 'Professional, creative, and super easy to work with. The final product exceeded all expectations in both performance and aesthetics.'
    },
    {
      name: 'Maya Lopez',
      role: 'Marketing Director',
      text: 'The attention to detail and animations Kai delivers are absolutely next level. Our conversion jumped 40% after the launch.'
    }
  ];

  return (
    <div className="relative overflow-hidden pb-16">
      {/* Background Cyber Ambient Lights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-[#7928ca]/20 via-[#00f0ff]/10 to-transparent blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-[#ff007f]/10 blur-3xl -z-10 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-16 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121633] border border-pink-500/40 text-pink-400 font-mono text-xs tracking-wider">
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
              CREATIVE CODER ///
            </div>

            <h1 className="text-5xl sm:text-7xl font-display font-black tracking-tight leading-none text-white drop-shadow-[0_0_35px_rgba(0,240,255,0.3)]">
              IZI <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-500">
                IZUDIN
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 font-medium max-w-xl leading-relaxed">
              I BUILD IMMERSIVE WEB EXPERIENCES AT THE INTERSECTION OF{' '}
              <span className="text-pink-400 font-semibold underline decoration-pink-500/50">CODE</span> &{' '}
              <span className="text-cyan-400 font-semibold underline decoration-cyan-500/50">DESIGN</span>.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('projects')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-pink-500/25 hover:shadow-cyan-500/40 transition transform active:scale-95 cursor-pointer"
              >
                <span>VIEW PROJECTS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('about-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0f1430] hover:bg-[#161c44] border border-[#263168] text-white font-medium text-sm transition cursor-pointer"
              >
                <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span>ABOUT ME</span>
              </button>

              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/40 text-cyan-300 text-xs font-mono transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>OPEN WORKSPACE DASHBOARD</span>
              </button>
            </div>

            {/* Quick Quick Access Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Quick Access:</span>
              <button
                onClick={() => onNavigate('api-center')}
                className="px-2.5 py-1 rounded bg-[#0e1333] hover:bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>API Playground</span>
              </button>
              <button
                onClick={() => onNavigate('ai-chat')}
                className="px-2.5 py-1 rounded bg-[#0e1333] hover:bg-purple-950/60 border border-purple-500/30 text-purple-300 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <Bot className="w-3 h-3 text-purple-400" />
                <span>IZI AI Assistant</span>
              </button>
              <button
                onClick={() => onNavigate('whatsapp')}
                className="px-2.5 py-1 rounded bg-[#0e1333] hover:bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-3 h-3 text-emerald-400" />
                <span>WhatsApp Center</span>
              </button>
            </div>
          </div>

          {/* Right Hero Visual Column (Faithful to photo with glowing cyber halo) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Outer Neon Ring Glow */}
              <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 opacity-80 blur-xl group-hover:opacity-100 transition duration-1000 animate-pulse"></div>

              {/* Main Avatar Container */}
              <div className="relative w-72 h-72 sm:w-88 sm:h-88 rounded-full p-[3px] bg-gradient-to-tr from-pink-500 via-purple-500 to-cyan-400 shadow-[0_0_50px_rgba(147,51,234,0.4)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#070a20] relative">
                  {/* Portrait Asset directly referencing user uploaded asset */}
                  <img
                    src="/public/assets/aistudio/file_00000000438c82118edec4a77fe770e5_ff863572.png"
                    alt="Izi Izudin - Creative Coder"
                    className="w-full h-full object-cover object-top filter contrast-105"
                  />
                  {/* Overlay Cyber Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060818] via-transparent to-transparent opacity-60"></div>
                </div>
              </div>

              {/* Floating Status Pill */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a0e28]/95 border border-cyan-400/50 shadow-lg shadow-cyan-500/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-mono text-xs font-semibold text-cyan-300 whitespace-nowrap">
                  KAI+ CREATIVE CODER
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 sm:p-6 rounded-2xl bg-[#090d26]/80 border border-[#1d2757] backdrop-blur-md shadow-2xl">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-3 rounded-xl bg-[#0e1438]/50 border border-[#1f2a60]/50 hover:border-cyan-500/40 transition group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-950 to-purple-950 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-lg group-hover:scale-110 transition">
                {s.icon}
              </div>
              <div>
                <div className="font-display font-black text-2xl sm:text-3xl text-white group-hover:text-cyan-300 transition">
                  {s.value}
                </div>
                <div className="text-[11px] font-mono text-slate-400 tracking-wider">
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#141b3d]">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121633] border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-4">
          /// ABOUT ME
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-display font-black text-white leading-tight">
              I TURN IDEAS INTO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-400">
                DIGITAL REALITIES.
              </span>
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              I'm <strong className="text-white font-semibold">Izi Izudin</strong>, a creative coder and digital artisan crafting bold, interactive experiences for the web. I love blending aesthetics with performance to build things that not only look futuristic, but feel alive.
            </p>

            <p className="text-slate-400 text-sm leading-relaxed">
              Specializing in high-performance WebGL, real-time reactive architectures, AI-grounded interactive workspaces, and official Meta WhatsApp Cloud API infrastructure.
            </p>

            <div className="pt-2">
              <button
                onClick={openContactModal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium text-xs tracking-wider shadow-lg shadow-purple-500/20 hover:opacity-95 transition cursor-pointer"
              >
                <span>MORE ABOUT ME</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* About Cyber Graphic Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1130] to-[#070a20] border border-cyan-500/30 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl"></div>
              
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-[#040612] border border-[#1b2552] flex items-center justify-center relative">
                {/* Visual Wireframe placeholder representation */}
                <div className="text-center p-6 space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 animate-pulse">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="font-display font-bold text-white text-base">IZI IZUDIN</div>
                  <div className="text-xs text-cyan-400 font-mono">Creative Coder &amp; Tech Lead</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                <span>📍 Pandeglang, Indonesia</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#141b3d]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121633] border border-pink-500/40 text-pink-400 font-mono text-xs mb-2">
              /// SERVICES
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              WHAT I BRING TO THE TABLE
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#090d26] border border-[#1b2552] hover:border-cyan-500/50 transition duration-300 flex flex-col justify-between group shadow-lg hover:shadow-cyan-500/10"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#11173d] border border-[#232f66] flex items-center justify-center mb-4 group-hover:scale-105 transition">
                  {srv.icon}
                </div>
                <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
                  {srv.tag}
                </div>
                <h3 className="text-base font-display font-bold text-white mb-2 group-hover:text-cyan-300 transition">
                  {srv.title}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {srv.desc}
                </p>
              </div>

              <button
                onClick={openContactModal}
                className="mt-6 flex items-center gap-1.5 text-xs font-mono text-pink-400 hover:text-pink-300 group-hover:translate-x-1 transition cursor-pointer"
              >
                <span>VIEW DETAILS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#141b3d]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121633] border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-2">
              /// FEATURED PROJECTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
              CRAFTED WITH PRECISION
            </h2>
          </div>

          <button
            onClick={() => onNavigate('projects')}
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono text-xs font-semibold cursor-pointer"
          >
            <span>VIEW ALL PROJECTS</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProjects.map((proj) => (
            <div
              key={proj.id}
              onClick={() => onNavigate('projects')}
              className={`group relative rounded-2xl bg-[#090d26] border ${proj.borderColor} overflow-hidden shadow-xl hover:shadow-cyan-500/20 transition cursor-pointer flex flex-col justify-between`}
            >
              <div className="aspect-video w-full overflow-hidden bg-slate-900 relative">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${proj.color}`}></div>
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30">
                  {proj.badge}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition">
                    {proj.title}
                  </h3>
                  <div className="text-xs text-pink-400 font-mono mb-2">
                    {proj.subtitle}
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {proj.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1a2350] flex items-center justify-between text-xs text-cyan-400 font-mono">
                  <span>Explore Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools I Use */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 border-t border-[#141b3d]">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121633] border border-pink-500/40 text-pink-400 font-mono text-xs mb-2">
            /// TOOLS I USE
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
            MODERN TECHNOLOGY STACK
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
          {tools.map((t, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a0f2b] border border-[#1b2554] hover:border-cyan-400/50 transition cursor-default shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.color }}></span>
              <span className="text-xs font-mono font-medium text-slate-300">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* My Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#141b3d]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121633] border border-cyan-500/40 text-cyan-400 font-mono text-xs mb-2">
            /// MY PROCESS
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            FROM CONCEPT TO DEPLOYMENT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {processSteps.map((step) => (
            <div
              key={step.num}
              className="p-5 rounded-2xl bg-[#090d26] border border-[#1a2350] hover:border-cyan-500/40 transition relative group"
            >
              <div className="font-display font-black text-3xl text-slate-700 group-hover:text-cyan-400 transition mb-2">
                {step.num}
              </div>
              <h3 className="font-display font-bold text-sm text-white mb-1">
                {step.title}
              </h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Kind Words (Testimonials) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-[#141b3d]">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121633] border border-pink-500/40 text-pink-400 font-mono text-xs mb-2">
            /// KIND WORDS
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white">
            WHAT PARTNERS SAY
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[#090d26] border border-[#1b2552] flex flex-col justify-between"
            >
              <Quote className="w-7 h-7 text-cyan-400/40 mb-3" />
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic mb-6">
                "{t.text}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-[#172048]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{t.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0d1238] via-[#1a123f] to-[#1e0f33] border border-pink-500/40 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                LET'S BUILD SOMETHING
              </div>
              <h2 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight">
                EXTRAORDINARY.
              </h2>
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-cyan-400" />
                  <span>hello@izi-izudin.dev</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-pink-400" />
                  <span>Pandeglang, Indonesia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Open for Projects</span>
                </div>
              </div>
            </div>

            <button
              onClick={openContactModal}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-cyan-500 text-white font-display font-bold text-sm tracking-wider shadow-xl shadow-pink-500/30 hover:opacity-95 transition transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              START A PROJECT &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Footer copyright */}
      <footer className="mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-[#12193e] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
        <div>
          <span className="text-white font-bold">IZI IZUDIN +</span> &copy; 2026 All rights reserved.
        </div>
        <div>
          DESIGNED &amp; CODED WITH <span className="text-pink-500">❤</span> BY IZI IZUDIN
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hover:text-cyan-300 cursor-pointer">GitHub</span>
          <span className="hover:text-cyan-300 cursor-pointer">Twitter</span>
          <span className="hover:text-cyan-300 cursor-pointer">LinkedIn</span>
          <span className="hover:text-cyan-300 cursor-pointer">Instagram</span>
        </div>
      </footer>
    </div>
  );
};
