import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/auth';

export default function StudentLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    if (!email.endsWith('@rvce.edu.in')) {
      alert('Only @rvce.edu.in emails are allowed');
      return;
    }
    try {
      const data = await login(email, password);
      localStorage.setItem('token', data.token);
      navigate('/student/dashboard');
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  return (
    <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <h3 style={{ fontSize: '28px', marginBottom: '32px', textAlign: 'center' }}>Student Login 👨‍🎓</h3>
        <form onSubmit={submit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter student email" style={{ width: '100%' }} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%' }} />
          </div>
          <button type="submit" style={{ width: '100%', marginBottom: '16px' }}>Login</button>
        </form>
        <div style={{ textAlign: 'center' }}>
          <Link to="/student/signup" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Don't have an account? Sign up</Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
