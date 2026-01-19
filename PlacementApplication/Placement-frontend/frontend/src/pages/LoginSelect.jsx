import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

export default function LoginSelect() {
  const companiesRef = useRef(null);
  const aboutRef = useRef(null);
  const homeRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ paddingBottom: '30vh' }}>
      {/* Navigation Bar */}
      <nav className="card" style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1000,
        padding: '12px 32px',
        borderRadius: '99px',
        display: 'flex',
        gap: '32px',
        alignItems: 'center',
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#fff', cursor: 'pointer' }} onClick={() => scrollTo(homeRef)}>EasyApply</div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>
        <div style={{ display: 'flex', gap: '24px' }}>
          <button className="text-btn" onClick={() => scrollTo(homeRef)}>HOME</button>
          <button className="text-btn" onClick={() => scrollTo(companiesRef)}>COMPANIES VISITED</button>
          <button className="text-btn" onClick={() => scrollTo(aboutRef)}>ABOUT</button>
        </div>
      </nav>

      {/* Hero Section with Login */}
      <section ref={homeRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 20px 60px' }}>
        <h1 className="animate-fade-in" style={{ fontSize: '6rem', marginBottom: '24px', lineHeight: 1.1, background: 'linear-gradient(to bottom, #ffffff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: '800' }}>
          EasyApply<br />
          <span style={{ fontSize: '2rem', color: 'var(--text-muted)', WebkitTextFillColor: 'initial', fontWeight: '400', letterSpacing: '2px' }}>PLACEMENT PORTAL</span>
        </h1>
        <p className="animate-fade-in" style={{ fontSize: '1.4rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 48px', animationDelay: '0.1s' }}>
          Seamlessly connecting future innovators with world-class opportunities.
        </p>

        {/* Stats Button */}
        <div className="animate-fade-in" style={{ marginBottom: '48px', animationDelay: '0.15s' }}>
          <Link to="/statistics" style={{ display: 'inline-block', padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--accent), var(--primary))', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(6,182,212,0.4)', cursor: 'pointer', transition: 'transform 0.2s', textDecoration: 'none' }}>
            View Placement Statistics 📊
          </Link>
        </div>

        {/* Recruitment Process Timeline */}
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: '1000px', margin: '0 auto 64px', animationDelay: '0.18s', overflowX: 'auto', padding: '10px' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '32px', color: 'var(--text-muted)', fontWeight: '400' }}>Recruitment Process</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', minWidth: '800px' }}>
            {/* Connecting Line */}
            <div style={{ position: 'absolute', top: '24px', left: '50px', right: '50px', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }}></div>

            {[
              { icon: '💼', title: 'Job Posted', desc: 'Admin posts opportunity' },
              { icon: '📝', title: 'Apply', desc: 'Student submits application' },
              { icon: '📢', title: 'PPT', desc: 'Pre-Placement Talk' },
              { icon: '💻', title: 'OA', desc: 'Online Assessment' },
              { icon: '🎤', title: 'Interviews', desc: 'Technical & HR Rounds' },
              { icon: '🎉', title: 'Selection', desc: 'Offer Rolled Out' }
            ].map((step, idx) => (
              <div key={idx} style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', flex: 1 }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', backdropFilter: 'blur(10px)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  {step.icon}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '16px', color: '#fff' }}>{step.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', maxWidth: '100px' }}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Cards in Hero */}
        <div className="row animate-fade-in" style={{ justifyContent: 'center', gap: '32px', flexWrap: 'wrap', animationDelay: '0.2s' }}>
          <Link to="/student/login" className="card login-card" style={{ textDecoration: 'none', width: '300px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: '4px solid var(--accent)', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '48px', marginBottom: '4px', filter: 'drop-shadow(0 0 20px rgba(6,182,212,0.4))' }}>👨‍🎓</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>Student</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '8px 0 0' }}>Login to apply for jobs</p>
            </div>
            <span className="btn" style={{ width: '100%', marginTop: '8px', borderRadius: '8px', fontSize: '14px' }}>Student Login</span>
          </Link>

          <Link to="/admin/login" className="card login-card" style={{ textDecoration: 'none', width: '300px', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: '4px solid var(--secondary)', background: 'rgba(255,255,255,0.03)' }}>
            <div style={{ fontSize: '48px', marginBottom: '4px', filter: 'drop-shadow(0 0 20px rgba(236,72,153,0.4))' }}>⚡</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>Admin</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '8px 0 0' }}>Manage placement drives</p>
            </div>
            <span className="btn secondary" style={{ width: '100%', marginTop: '8px', borderRadius: '8px', fontSize: '14px' }}>Admin Login</span>
          </Link>
        </div>

        <div style={{ marginTop: '32px' }} className="animate-fade-in">
          <Link to="/student/signup" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '14px' }}>
            New Student? <span style={{ color: 'var(--accent)', textDecoration: 'underline' }}>Create an account</span>
          </Link>
        </div>
      </section >

      {/* Companies Section */}
      < section ref={companiesRef} style={{ minHeight: '60vh', padding: '80px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }
      }>
        <h2 style={{ fontSize: '3rem', marginBottom: '48px', textAlign: 'center' }}>Top Recruiters</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', justifyContent: 'center', maxWidth: '1000px' }}>
          {['Google', 'Microsoft', 'Amazon', 'Atlassian', 'Cisco', 'Samsung', 'Intel', 'Goldman Sachs', 'Morgan Stanley', 'JPMorgan', 'Oracle', 'Adobe', 'Mercedes Benz', 'Texas Instruments'].map(c => (
            <div key={c} className="card" style={{ padding: '24px 32px', fontSize: '20px', fontWeight: 'bold', color: 'rgba(255,255,255,0.8)', borderRadius: '16px', background: 'rgba(255,255,255,0.03)' }}>
              {c}
            </div>
          ))}
        </div>
      </section >

      {/* About Section */}
      < section ref={aboutRef} style={{ padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '3rem', marginBottom: '48px', textAlign: 'center' }}>About RV College of Engineering</h2>
        <div className="card" style={{ padding: '48px', lineHeight: '1.8', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
          <p style={{ marginBottom: '24px' }}>
            Rashtreeya Vidyalaya College of Engineering (RVCE) is an autonomous private technical co-educational college located in Bangalore, Karnataka, India. Established in 1963, RVCE is one of the earliest self-financing engineering colleges in the country.
          </p>
          <p style={{ marginBottom: '24px' }}>
            The institution is run by Rashtreeya Sikshana Samithi Trust (RSST), a not-for-profit trust. RVCE is recognized as a center of excellence in technical education and research. The college offers 12 undergraduate programs and 16 postgraduate programs.
          </p>
          <p>
            With a vision to achieve leadership in quality technical education, interdisciplinary research & innovation, with a focus on sustainable and inclusive technology, RVCE continues to be a top destination for aspiring engineers and top-tier recruiters alike.
          </p>
        </div>
      </section >

      <style>{`
        .text-btn {
          background: none;
          box-shadow: none;
          padding: 8px 16px;
          color: rgba(255,255,255,0.7);
          font-weight: 500;
        }
        .text-btn:hover {
          color: #fff;
          transform: translateY(-2px);
          background: rgba(255,255,255,0.05);
        }
        .primary-btn {
          padding: 8px 24px;
          border-radius: 99px;
          font-size: 14px;
          background: var(--primary);
        }
        .login-card {
           transition: transform 0.3s ease, border-color 0.3s ease;
        }
        .login-card:hover {
           transform: translateY(-10px);
           border-color: #fff;
        }
      `}</style>
    </div >
  );
}
