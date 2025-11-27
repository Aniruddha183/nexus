'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Mic, Brain, BarChart3 } from 'lucide-react';

export default function Landing() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center border-b border-border">
        <div className="text-xl font-bold tracking-tight text-txt-main">NEXUS</div>
        <button 
          onClick={() => router.push('/setup')}
          className="text-sm font-medium text-txt-sec hover:text-txt-main transition-colors"
        >
          Launch Interface
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        
        <span className="inline-block px-3 py-1 mb-6 text-xs font-mono text-accent border border-border rounded-full">
          AI INTERVIEW PROTOCOL v2.5
        </span>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-txt-main mb-6 max-w-4xl leading-tight">
          Master the technical interview.
        </h1>

        <p className="text-lg md:text-xl text-txt-sec max-w-2xl mb-12 font-light leading-relaxed">
          Real-time voice simulation. Adaptive questioning. Deep analytical feedback.
          No distractions. Just performance.
        </p>

        <button 
          onClick={() => router.push('/setup')}
          className="group flex items-center gap-3 px-8 py-4 bg-txt-main text-bg rounded-full font-semibold hover:bg-white transition-all"
        >
          Start Session
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Minimal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl text-left">
          {[
            {
              icon: <Mic className="w-5 h-5 text-txt-main" />,
              title: "Voice First",
              desc: "Speak naturally. The AI processes audio in real-time with zero latency."
            },
            {
              icon: <Brain className="w-5 h-5 text-txt-main" />,
              title: "Adaptive Core",
              desc: "Questions evolve based on your responses and resume context."
            },
            {
              icon: <BarChart3 className="w-5 h-5 text-txt-main" />,
              title: "Precise Data",
              desc: "Get objective scoring on technical accuracy and communication."
            }
          ].map((feature, i) => (
            <div key={i} className="p-6 border border-border bg-surface/30 rounded-lg hover:border-accent transition-colors">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-txt-main mb-2">{feature.title}</h3>
              <p className="text-sm text-txt-sec leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-8 text-center text-xs text-border font-mono border-t border-border mx-6 max-w-6xl md:mx-auto w-full">
        NEXUS SYSTEMS • 2025
      </footer>
    </div>
  );
}