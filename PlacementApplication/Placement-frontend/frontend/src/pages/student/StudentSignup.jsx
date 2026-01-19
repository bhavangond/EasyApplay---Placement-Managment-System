import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerStudent } from '../../api/auth';

export default function StudentSignup() {
  const [form, setForm] = useState({ name: '', usn: '', branch: '', email: '', phone: '', password: '', cgpa: '', percentage10: '', percentage12: '', backlog: 0 });
  const navigate = useNavigate();

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    if (!form.email.endsWith('@rvce.edu.in')) {
      alert('Only @rvce.edu.in emails are allowed');
      return;
    }
    try {
      const dto = {
        ...form,
        cgpa: form.cgpa ? Number(form.cgpa) : 0,
        percentage10: form.percentage10 ? Number(form.percentage10) : 0,
        percentage12: form.percentage12 ? Number(form.percentage12) : 0,
        backlog: form.backlog ? Number(form.backlog) : 0
      };
      const data = await registerStudent(dto);
      // localStorage.setItem('token', data.token); // Dont auto-login
      alert('Registration Successful! Please login with your credentials.');
      navigate('/student/login');
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  const stepperBtnStyle = {
    width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'var(--primary)', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
  };

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '900px', padding: '40px' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '32px', textAlign: 'center' }}>Student Registration 📝</h3>

        <form onSubmit={submit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Left Column */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Full Name</label>
              <input name="name" placeholder="Enter full name" value={form.name} onChange={onChange} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>USN</label>
              <input name="usn" placeholder="e.g. 1RV23CS001" value={form.usn} onChange={onChange} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email Address</label>
              <input name="email" type="email" placeholder="student@rvce.edu.in" value={form.email} onChange={onChange} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
              <input name="password" type="password" placeholder="Create a password" value={form.password} onChange={onChange} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Mobile Number</label>
              <input name="phone" placeholder="Enter mobile number" value={form.phone} onChange={onChange} required />
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Branch</label>
              <input name="branch" placeholder="e.g. cse, ise, ece" value={form.branch} onChange={onChange} required />
            </div>
            <div style={{ marginBottom: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>10th %</label>
                <input name="percentage10" type="number" step="0.01" placeholder="90.5" value={form.percentage10} onChange={onChange} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>12th %</label>
                <input name="percentage12" type="number" step="0.01" placeholder="88.2" value={form.percentage12} onChange={onChange} />
              </div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Current CGPA</label>
              <input name="cgpa" type="number" step="0.01" placeholder="e.g. 8.75" value={form.cgpa} onChange={onChange} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Active Backlogs</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '12px', border: '1px solid var(--border)', width: 'fit-content' }}>
                <button type="button" style={stepperBtnStyle} onClick={() => setForm(f => ({ ...f, backlog: Math.max(0, f.backlog - 1) }))}>-</button>
                <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '24px', textAlign: 'center' }}>{form.backlog}</span>
                <button type="button" style={stepperBtnStyle} onClick={() => setForm(f => ({ ...f, backlog: f.backlog + 1 }))}>+</button>
              </div>
            </div>
          </div>

          <div style={{ gridColumn: 'span 2', marginTop: '16px' }}>
            <button type="submit" style={{ width: '100%', padding: '14px', fontSize: '16px' }}>Register Account</button>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link to="/student/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Already have an account? Login</Link>
            </div>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>← Back to Home</Link>
            </div>
          </div>
        </form>
      </div>
      <style>{`
        @media (max-width: 768px) {
            form { grid-template-columns: 1fr !important; }
            div[style*="gridColumn: 'span 2'"] { grid-column: span 1 !important; }
        }
     `}</style>
    </div>
  );
}
