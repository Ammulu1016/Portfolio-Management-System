import React, { useState, useEffect, useRef } from 'react';

const API = 'http://localhost:8003';
const apiFetch = (path) => fetch(`${API}${path}`).then(r => r.json()).catch(() => null);

// ── Design tokens ───────────────────────────────────────────────
const T = {
  bg: '#050a14',
  surface: 'rgba(255,255,255,0.03)',
  border: 'rgba(255,255,255,0.08)',
  text: '#f0f4ff',
  muted: '#6b7a99',
  accent: '#64ffda',
  accentDim: 'rgba(100,255,218,0.1)',
  blue: '#7b9cff',
  font: "'Syne', 'Space Grotesk', system-ui, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
};

const useScrollReveal = () => {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  });
};

const revealStyle = { opacity: 0, transform: 'translateY(30px)', transition: 'opacity 0.6s ease, transform 0.6s ease' };

// ── Seed data (used when API returns nothing) ────────────────────
const DEMO = {
  profile: {
    name: 'Arjun Sharma', title: 'Full Stack Developer & AI Enthusiast',
    bio: 'I build scalable web applications and love exploring the intersection of AI and software engineering. 3+ years crafting clean code and elegant solutions.',
    email: 'arjun@example.com', location: 'Hyderabad, India',
    github_url: 'https://github.com', linkedin_url: 'https://linkedin.com',
  },
  projects: [
    { id: 1, title: 'Ecommerce Platform', description: 'Full-stack shopping app with JWT auth, cart management, Razorpay integration, and admin dashboard.', tech_stack: 'FastAPI,React,PostgreSQL,Redis', github_url: '#', is_featured: true },
    { id: 2, title: 'Blood Bank System', description: 'Real-time blood inventory management with appointment scheduling and SMS/email notifications.', tech_stack: 'FastAPI,React,PostgreSQL,Twilio', github_url: '#', is_featured: true },
    { id: 3, title: 'AI Task Tracker', description: 'Smart productivity app with NLP-based priority suggestions, Kanban board, and analytics dashboard.', tech_stack: 'FastAPI,React,PostgreSQL,NLP', github_url: '#', is_featured: true },
    { id: 4, title: 'Portfolio CMS', description: 'Dynamic portfolio with admin panel, contact form, and PostgreSQL-backed content management.', tech_stack: 'FastAPI,React,PostgreSQL', github_url: '#', is_featured: false },
  ],
  skills: [
    { id: 1, name: 'Python', category: 'Backend', proficiency: 90 },
    { id: 2, name: 'FastAPI', category: 'Backend', proficiency: 85 },
    { id: 3, name: 'React', category: 'Frontend', proficiency: 88 },
    { id: 4, name: 'PostgreSQL', category: 'Database', proficiency: 80 },
    { id: 5, name: 'Docker', category: 'DevOps', proficiency: 72 },
    { id: 6, name: 'TypeScript', category: 'Frontend', proficiency: 78 },
    { id: 7, name: 'Redis', category: 'Database', proficiency: 65 },
    { id: 8, name: 'AWS', category: 'DevOps', proficiency: 68 },
  ],
  experience: [
    { id: 1, company: 'TechCorp Solutions', role: 'Full Stack Developer', duration: 'Jan 2023 – Present', description: 'Built microservices with FastAPI, led frontend migration to React 18, improved API performance by 40%.', is_current: true },
    { id: 2, company: 'StartupXYZ', role: 'Backend Developer Intern', duration: 'Jun 2022 – Dec 2022', description: 'Developed REST APIs, integrated payment gateways, and wrote unit tests increasing coverage to 85%.', is_current: false },
  ],
};

// ── Components ─────────────────────────────────────────────────

function Navbar({ active, setActive }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, transition: 'all 0.3s', background: scrolled ? 'rgba(5,10,20,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? `1px solid ${T.border}` : 'none', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
      <span style={{ color: T.accent, fontFamily: T.mono, fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>{'<AS />'}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        {['About', 'Projects', 'Skills', 'Experience', 'Contact'].map(s => (
          <a key={s} href={`#${s.toLowerCase()}`} style={{ color: active === s.toLowerCase() ? T.accent : T.muted, textDecoration: 'none', fontSize: 13, fontFamily: T.mono, padding: '6px 14px', borderRadius: 6, transition: 'color 0.2s', background: active === s.toLowerCase() ? T.accentDim : 'transparent' }}
            onClick={() => setActive(s.toLowerCase())}>{s}</a>
        ))}
      </div>
    </nav>
  );
}

function Hero({ profile }) {
  return (
    <section id="about" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '0 2rem', maxWidth: 900, margin: '0 auto' }}>
      <div>
        <div style={{ fontFamily: T.mono, color: T.accent, fontSize: 14, marginBottom: 16, opacity: 0.8 }}>Hi, my name is</div>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontFamily: T.font, fontWeight: 700, color: T.text, margin: '0 0 8px', lineHeight: 1.1 }}>
          {profile?.name || 'Your Name'}
        </h1>
        <h2 style={{ fontSize: 'clamp(24px, 5vw, 48px)', fontFamily: T.font, fontWeight: 400, color: T.muted, margin: '0 0 24px', lineHeight: 1.2 }}>
          {profile?.title || 'Full Stack Developer'}
        </h2>
        <p style={{ maxWidth: 520, color: T.muted, lineHeight: 1.8, fontSize: 15, marginBottom: 32 }}>
          {profile?.bio}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <a href="#projects" style={{ background: 'transparent', color: T.accent, border: `1px solid ${T.accent}`, padding: '12px 28px', borderRadius: 4, textDecoration: 'none', fontFamily: T.mono, fontSize: 13, transition: 'background 0.2s' }}
            onMouseEnter={e => e.target.style.background = T.accentDim}
            onMouseLeave={e => e.target.style.background = 'transparent'}>
            View My Work
          </a>
          {profile?.github_url && (
            <a href={profile.github_url} target="_blank" rel="noreferrer" style={{ color: T.muted, border: `1px solid ${T.border}`, padding: '12px 24px', borderRadius: 4, textDecoration: 'none', fontFamily: T.mono, fontSize: 13 }}>
              GitHub ↗
            </a>
          )}
        </div>
        {profile?.location && (
          <div style={{ marginTop: 24, fontFamily: T.mono, fontSize: 12, color: T.muted }}>
            📍 {profile.location}
          </div>
        )}
      </div>
    </section>
  );
}

function Projects({ projects }) {
  const TECH_COLORS = { FastAPI: '#009688', React: '#61dafb', PostgreSQL: '#336791', Python: '#3776ab', Redis: '#dc382d', Docker: '#2496ed', NLP: T.accent, Twilio: '#f22f46', MySQL: '#4479a1' };

  return (
    <section id="projects" style={{ padding: '80px 2rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="reveal" style={{ ...revealStyle, marginBottom: 48 }}>
        <div style={{ fontFamily: T.mono, color: T.accent, fontSize: 13, marginBottom: 8 }}>02. What I've Built</div>
        <h2 style={{ fontSize: 36, fontFamily: T.font, fontWeight: 700, color: T.text, margin: 0 }}>Projects</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {projects.map((p, i) => (
          <div key={p.id} className="reveal" style={{ ...revealStyle, transitionDelay: `${i * 80}ms`, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '1.5rem', display: 'flex', flexDirection: 'column', transition: 'border-color 0.3s, transform 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent + '55'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 28 }}>📁</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {p.github_url && <a href={p.github_url} target="_blank" rel="noreferrer" style={{ color: T.muted, textDecoration: 'none', fontSize: 18 }} title="GitHub">⌥</a>}
                {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" style={{ color: T.muted, textDecoration: 'none', fontSize: 18 }} title="Live Demo">↗</a>}
              </div>
            </div>
            <div style={{ fontFamily: T.font, fontWeight: 600, fontSize: 18, color: T.text, marginBottom: 10 }}>
              {p.is_featured && <span style={{ color: T.accent, fontSize: 11, fontFamily: T.mono, display: 'block', marginBottom: 4 }}>⭐ Featured</span>}
              {p.title}
            </div>
            <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{p.description}</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {p.tech_stack.split(',').map(t => (
                <span key={t} style={{ fontFamily: T.mono, fontSize: 11, color: TECH_COLORS[t.trim()] || T.accent, background: (TECH_COLORS[t.trim()] || T.accent) + '15', padding: '3px 8px', borderRadius: 4 }}>
                  {t.trim()}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Skills({ skills }) {
  const groups = skills.reduce((acc, s) => { (acc[s.category] = acc[s.category] || []).push(s); return acc; }, {});

  return (
    <section id="skills" style={{ padding: '80px 2rem', maxWidth: 900, margin: '0 auto' }}>
      <div className="reveal" style={{ ...revealStyle, marginBottom: 48 }}>
        <div style={{ fontFamily: T.mono, color: T.accent, fontSize: 13, marginBottom: 8 }}>03. What I Know</div>
        <h2 style={{ fontSize: 36, fontFamily: T.font, fontWeight: 700, color: T.text, margin: 0 }}>Skills</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
        {Object.entries(groups).map(([category, items]) => (
          <div key={category} className="reveal" style={{ ...revealStyle, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '1.25rem' }}>
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, marginBottom: 16, textTransform: 'uppercase', letterSpacing: 1 }}>{category}</div>
            {items.map(skill => (
              <div key={skill.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: T.text, marginBottom: 5 }}>
                  <span>{skill.name}</span>
                  <span style={{ fontFamily: T.mono, color: T.muted, fontSize: 11 }}>{skill.proficiency}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${skill.proficiency}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.blue})`, borderRadius: 2, transition: 'width 1s ease' }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function Experience({ experience }) {
  return (
    <section id="experience" style={{ padding: '80px 2rem', maxWidth: 700, margin: '0 auto' }}>
      <div className="reveal" style={{ ...revealStyle, marginBottom: 48 }}>
        <div style={{ fontFamily: T.mono, color: T.accent, fontSize: 13, marginBottom: 8 }}>04. Where I've Worked</div>
        <h2 style={{ fontSize: 36, fontFamily: T.font, fontWeight: 700, color: T.text, margin: 0 }}>Experience</h2>
      </div>
      <div style={{ position: 'relative', paddingLeft: 28 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: `linear-gradient(${T.accent}, transparent)` }} />
        {experience.map((exp, i) => (
          <div key={exp.id} className="reveal" style={{ ...revealStyle, transitionDelay: `${i * 100}ms`, position: 'relative', marginBottom: 36, paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: -32, top: 4, width: 10, height: 10, borderRadius: '50%', background: exp.is_current ? T.accent : T.muted, border: `2px solid ${T.bg}`, boxShadow: exp.is_current ? `0 0 10px ${T.accent}` : 'none' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
              <span style={{ fontFamily: T.font, fontWeight: 600, fontSize: 16, color: T.text }}>{exp.role}</span>
              {exp.is_current && <span style={{ fontFamily: T.mono, fontSize: 11, color: T.accent, background: T.accentDim, padding: '2px 8px', borderRadius: 12 }}>Current</span>}
            </div>
            <div style={{ fontFamily: T.mono, fontSize: 12, color: T.accent, marginBottom: 4 }}>{exp.company}</div>
            <div style={{ fontFamily: T.mono, fontSize: 11, color: T.muted, marginBottom: 10 }}>{exp.duration}</div>
            <p style={{ color: T.muted, fontSize: 14, lineHeight: 1.7, margin: 0 }}>{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');

  const submit = async () => {
    if (!form.name || !form.email || !form.message) return setStatus('Please fill all required fields.');
    try {
      const res = await fetch(`${API}/portfolio/contact`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      const data = await res.json();
      setStatus(data.message || 'Message sent!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (e) { setStatus('Failed to send. Please try email directly.'); }
  };

  return (
    <section id="contact" style={{ padding: '80px 2rem 120px', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div className="reveal" style={{ ...revealStyle }}>
        <div style={{ fontFamily: T.mono, color: T.accent, fontSize: 13, marginBottom: 8 }}>05. What's Next?</div>
        <h2 style={{ fontSize: 36, fontFamily: T.font, fontWeight: 700, color: T.text, marginBottom: 16 }}>Get In Touch</h2>
        <p style={{ color: T.muted, lineHeight: 1.8, marginBottom: 32, fontSize: 15 }}>
          I'm currently open to new opportunities. Whether you have a question or just want to say hi, my inbox is always open!
        </p>
        <div style={{ textAlign: 'left', background: T.surface, border: `1px solid ${T.border}`, borderRadius: 12, padding: '1.5rem' }}>
          {[
            { key: 'name', label: 'Name *', type: 'text' },
            { key: 'email', label: 'Email *', type: 'email' },
            { key: 'subject', label: 'Subject', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontFamily: T.mono, fontSize: 11, color: T.muted, marginBottom: 4 }}>{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                style={{ width: '100%', padding: '10px 12px', background: '#010409', border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, boxSizing: 'border-box', outline: 'none', fontFamily: T.font }} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontFamily: T.mono, fontSize: 11, color: T.muted, marginBottom: 4 }}>Message *</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4}
              style={{ width: '100%', padding: '10px 12px', background: '#010409', border: `1px solid ${T.border}`, borderRadius: 6, color: T.text, fontSize: 13, boxSizing: 'border-box', resize: 'vertical', fontFamily: T.font }} />
          </div>
          {status && <div style={{ color: status.includes('Thank') || status.includes('sent') ? T.accent : '#f87171', fontSize: 13, marginBottom: 12, fontFamily: T.mono }}>{status}</div>}
          <button onClick={submit}
            style={{ background: 'transparent', color: T.accent, border: `1px solid ${T.accent}`, padding: '12px 28px', borderRadius: 4, cursor: 'pointer', fontFamily: T.mono, fontSize: 13, width: '100%', transition: 'background 0.2s' }}
            onMouseEnter={e => e.target.style.background = T.accentDim}
            onMouseLeave={e => e.target.style.background = 'transparent'}>
            Send Message
          </button>
        </div>
        {profile?.email && (
          <p style={{ marginTop: 24, fontFamily: T.mono, fontSize: 13, color: T.muted }}>
            Or email me directly: <a href={`mailto:${profile.email}`} style={{ color: T.accent }}>{profile.email}</a>
          </p>
        )}
      </div>
    </section>
  );
}

// ── Root App ────────────────────────────────────────────────────
export default function App() {
  const [data, setData] = useState({ profile: DEMO.profile, projects: DEMO.projects, skills: DEMO.skills, experience: DEMO.experience });
  const [active, setActive] = useState('about');

  useEffect(() => {
    Promise.all([
      apiFetch('/portfolio/profile'),
      apiFetch('/portfolio/projects'),
      apiFetch('/portfolio/skills'),
      apiFetch('/portfolio/experience'),
    ]).then(([profile, projects, skills, experience]) => {
      setData({
        profile: profile || DEMO.profile,
        projects: projects?.length ? projects : DEMO.projects,
        skills: skills?.length ? skills : DEMO.skills,
        experience: experience?.length ? experience : DEMO.experience,
      });
    });
  }, []);

  useScrollReveal();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { threshold: 0.4 });
    ['about', 'projects', 'skills', 'experience', 'contact'].forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: T.bg, color: T.text, fontFamily: T.font, minHeight: '100vh' }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
      <Navbar active={active} setActive={setActive} />
      <div style={{ paddingTop: 64 }}>
        <Hero profile={data.profile} />
        <Projects projects={data.projects} />
        <Skills skills={data.skills} />
        <Experience experience={data.experience} />
        <Contact profile={data.profile} />
      </div>
      <footer style={{ textAlign: 'center', padding: '1.5rem', fontFamily: T.mono, fontSize: 12, color: T.muted, borderTop: `1px solid ${T.border}` }}>
        Built with FastAPI + React · {data.profile?.name || 'Portfolio'}
      </footer>
    </div>
  );
}
