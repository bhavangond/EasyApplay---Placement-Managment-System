import React, { useEffect, useState, useRef } from 'react';
import { getProfile, updateProfile, uploadResume, getJobs, getApplied, applyToJob } from '../../api/student';

import { Link } from 'react-router-dom';

import confetti from 'canvas-confetti';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function StudentDashboard() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applied, setApplied] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState('profile');
  const appliedIds = new Set(applied.map(a => a?.job?.id || a?.jobId || a?.id));
  const [expandedJob, setExpandedJob] = useState(null);

  // Student-only top icon bar (visible only inside this page)
  function StudentTopBar() {
    return (
      <div className="student-topbar card" style={{ padding: '8px', display: 'inline-flex', gap: '8px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button aria-pressed={openSection === 'profile'} className={`icon-btn ${openSection === 'profile' ? 'active' : ''}`} onClick={() => setOpenSection('profile')} title="Profile" style={{ background: openSection === 'profile' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'profile' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'profile' ? '0 4px 12px rgba(99,102,241,0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>👤</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Profile</div>
        </button>
        <button aria-pressed={openSection === 'jobs'} className={`icon-btn ${openSection === 'jobs' ? 'active' : ''}`} onClick={() => setOpenSection('jobs')} title="Jobs" style={{ background: openSection === 'jobs' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'jobs' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'jobs' ? '0 4px 12px rgba(99,102,241,0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>💼</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Jobs</div>
        </button>
        <button aria-pressed={openSection === 'applied'} className={`icon-btn ${openSection === 'applied' ? 'active' : ''}`} onClick={() => setOpenSection('applied')} title="My Applications" style={{ background: openSection === 'applied' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'applied' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'applied' ? '0 4px 12px rgba(99,102,241,0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>📄</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Applications</div>
        </button>
      </div>
    );
  }

  async function loadAll() {
    setLoading(true);
    try {
      const [p, j, a] = await Promise.all([getProfile(), getJobs(), getApplied()]);
      setProfile(p);
      setJobs(j);
      setApplied(a);
    } catch (err) {
      console.error(err);
      alert('Failed to load dashboard: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAll(); }, []);

  // Targeted Confetti Effect
  useEffect(() => {
    if (openSection === 'applied' && !loading) {
      // Wait for DOM to render
      setTimeout(() => {
        const selectedCards = document.querySelectorAll('.selected-application-card');
        selectedCards.forEach(card => {
          const rect = card.getBoundingClientRect();
          // Calculate center relative to viewport
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;

          confetti({
            particleCount: 100,
            spread: 70,
            origin: { x, y },
            zIndex: 2000,
            colors: ['#22c55e', '#ffffff', '#fbbf24'] // Green, White, Gold
          });
        });
      }, 500); // Short delay to ensure transition is complete
    }
  }, [openSection, loading, applied]);

  async function saveProfile() {
    try {
      const payload = { ...profile };
      const updated = await updateProfile(payload);
      setProfile(updated);
      setEditing(false);
      alert('Profile updated');
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  async function onUpload(e) {
    const f = e.target.files[0];
    if (!f) return;
    try {
      await uploadResume(f);
      alert('Resume uploaded');
      await loadAll();
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  async function handleApply(jobId) {
    if (!window.confirm('Apply for this job?')) return;
    try {
      const res = await applyToJob(jobId);
      alert(res);
      await loadAll();
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  if (loading) return <div className="page-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#fff' }}>Loading dashboard...</div>;

  function tileContent({ date, view }) {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const apps = applied.filter(a => {
        const job = a.job || a.jobDetails || {};
        const deadline = job.deadline;
        const oaDate = job.oaDate;
        const interviewDate = job.interviewDate;

        // Logic:
        // 1. If date matches deadline, show deadline
        // 2. If date matches OA date -> Check if applied
        // 3. If date matches Interview date -> Check if status is shortlisted

        if (deadline === dateStr) return true;
        if (oaDate === dateStr) return true;
        if (interviewDate === dateStr && (a.status === 'SHORTLISTED' || a.applicationStatus === 'SHORTLISTED' || a.status === 'SELECTED' || a.applicationStatus === 'SELECTED')) return true;

        return false;
      });

      if (apps.length > 0) {
        return (
          <div style={{ fontSize: '9px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {apps.map(a => {
              const job = a.job || a.jobDetails || {};
              let label = '';
              let bg = '';
              if (job.deadline === dateStr) { label = `⚠️ ${job.companyName}`; bg = 'var(--error)'; }
              else if (job.oaDate === dateStr) { label = `${job.companyName} - OA`; bg = 'var(--primary)'; }
              else if (job.interviewDate === dateStr) { label = `${job.companyName} - Interview`; bg = 'var(--success)'; }

              return (
                <div key={a.id} style={{
                  background: bg,
                  color: '#fff',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center'
                }}>
                  {label}
                </div>
              )
            })}
          </div>
        );
      }
    }
    return null;
  }

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px' }}>Student Dashboard</h2>
        <button className="secondary" style={{ padding: '8px 16px' }} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>Logout</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <StudentTopBar />
      </div>

      <div style={{ marginTop: 12 }}>
        {openSection === 'profile' && (
          <div className="animate-fade-in">
            {profile ? (
              <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                {/* Profile Card */}
                <div className="card profile-card" style={{ height: 'fit-content' }}>
                  {!editing ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 2fr', gap: '40px' }}>

                      {/* Left: Identity Card Style */}
                      <div style={{ textAlign: 'center', background: 'rgba(255,255,255,0.03)', padding: '32px', borderRadius: '20px', border: '1px solid var(--border)' }}>
                        <div className="avatar" style={{ width: '100px', height: '100px', fontSize: '36px', margin: '0 auto 16px', background: 'linear-gradient(135deg, var(--primary), var(--accent))' }}>
                          {(profile.name || 'U').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <h3 style={{ margin: '0 0 8px', fontSize: '24px' }}>{profile.name}</h3>
                        <div style={{ color: 'var(--accent)', fontWeight: '500', marginBottom: '8px' }}>{profile.usn}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>{profile.branch}</div>

                        <a className="btn" style={{ width: '100%', display: 'block', padding: '10px', fontSize: '14px', textDecoration: 'none', marginBottom: '12px' }} href={profile.resumePath || '#'} target="_blank" rel="noreferrer">
                          {profile.resumePath ? '📄 Download Resume' : '⚠️ No Resume Uploaded'}
                        </a>

                        <label className="file-label" style={{ cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', display: 'block' }}>
                          <span style={{ textDecoration: 'underline' }}>Update Resume</span>
                          <input type="file" onChange={onUpload} style={{ display: 'none' }} />
                        </label>
                      </div>

                      {/* Right: Details Grid */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                          <h4 style={{ margin: 0, fontSize: '20px', color: 'var(--text-muted)' }}>Academic & Personal Details</h4>
                          <button onClick={() => setEditing(true)} style={{ padding: '6px 16px', fontSize: '14px' }}>✏️ Edit Profile</button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>EMAIL</div>
                            <div style={{ fontSize: '16px' }}>{profile.email}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>PHONE</div>
                            <div style={{ fontSize: '16px' }}>{profile.phone || '—'}</div>
                          </div>

                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>CURRENT CGPA</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--success)' }}>{profile.cgpa ?? 'N/A'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>BACKLOGS</div>
                            <div style={{ fontSize: '24px', fontWeight: 'bold', color: (profile.backlog > 0 ? 'var(--danger)' : 'var(--text-muted)') }}>{profile.backlog ?? profile.backlogs ?? 0}</div>
                          </div>

                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>12TH PERCENTAGE</div>
                            <div style={{ fontSize: '18px' }}>{profile.percentage12 ? `${profile.percentage12}%` : '—'}</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>10TH PERCENTAGE</div>
                            <div style={{ fontSize: '18px' }}>{profile.percentage10 ? `${profile.percentage10}%` : '—'}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                      <div style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0 }}>Edit Profile</h3>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="form-row"><label>Full Name</label><input value={profile.name || ''} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
                        <div className="form-row"><label>Branch</label><input value={profile.branch || ''} onChange={e => setProfile({ ...profile, branch: e.target.value })} /></div>

                        <div className="form-row"><label>Phone Number</label><input value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></div>
                        <div className="form-row"><label>Current CGPA</label><input type="number" step="0.01" value={profile.cgpa ?? ''} onChange={e => setProfile({ ...profile, cgpa: e.target.value })} /></div>

                        <div className="form-row"><label>10th Percentage</label><input type="number" step="0.01" value={profile.percentage10 ?? ''} onChange={e => setProfile({ ...profile, percentage10: e.target.value })} /></div>
                        <div className="form-row"><label>12th Percentage</label><input type="number" step="0.01" value={profile.percentage12 ?? ''} onChange={e => setProfile({ ...profile, percentage12: e.target.value })} /></div>

                        <div className="form-row"><label>Backlogs</label><input type="number" min="0" value={profile.backlog ?? profile.backlogs ?? 0} onChange={e => setProfile({ ...profile, backlog: Number(e.target.value) })} /></div>
                      </div>

                      <div className="mt" style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: 'flex-end' }}>
                        <button className="secondary" onClick={() => setEditing(false)}>Cancel</button>
                        <button onClick={saveProfile} style={{ padding: '8px 32px' }}>Save Changes</button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            ) : <div>No profile found</div>}
          </div>
        )}

        {openSection === 'jobs' && (
          <div className="animate-fade-in">
            {jobs.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No active job openings at the moment.</div>
            ) : (
              <div className="jobs-row" style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '16px' }}>
                {jobs.map((j, idx) => {
                  const isOpen = expandedJob === j.id;
                  return (
                    <div key={j.id} className={`card job-card ${isOpen ? 'expanded' : 'collapsed'}`} style={{ animation: `fadeIn 0.3s ease forwards ${idx * 0.1}s`, opacity: 0, minWidth: '350px' }}>
                      <div className="job-head" onClick={() => setExpandedJob(isOpen ? null : j.id)} role="button" tabIndex={0} style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div className="company" style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{j.companyName}</div>
                          <div className="role" style={{ color: 'var(--accent)', marginTop: '4px' }}>{j.role}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div className="badge info">{j.type || 'Onsite'}</div>
                        </div>
                      </div>

                      <div className="job-details" style={{ marginTop: '16px', display: isOpen ? 'block' : 'none', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        <div className="job-desc" style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '14px', marginBottom: '16px' }}>{j.driveDetails || j.description || 'No description provided.'}</div>

                        <div className="job-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                          {(j.salary || j.stipend) && <div className="detail-item"><div className="detail-label">Package</div><div className="detail-value">{j.salary ?? j.stipend}</div></div>}
                          {j.location && <div className="detail-item"><div className="detail-label">Location</div><div className="detail-value">{j.location}</div></div>}
                          {j.minCgpa != null && <div className="detail-item"><div className="detail-label">Min CGPA</div><div className="detail-value">{j.minCgpa}</div></div>}
                          {j.deadline && <div className="detail-item"><div className="detail-label">Deadline</div><div className="detail-value">{j.deadline}</div></div>}
                        </div>

                        <div className="job-actions" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <button onClick={() => handleApply(j.id)} disabled={appliedIds.has(j.id)} className={appliedIds.has(j.id) ? 'secondary' : ''}>
                            {appliedIds.has(j.id) ? 'Applied ✅' : 'Apply Now'}
                          </button>
                          {j.jdPath && <a href={j.jdPath} target="_blank" rel="noreferrer" style={{ fontSize: '14px', textDecoration: 'underline' }}>View JD</a>}
                        </div>
                      </div>

                      {!isOpen && <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>Click to view details ▾</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {openSection === 'applied' && (
          <div className="animate-fade-in">
            {applied.length === 0 ? (
              <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>You haven't applied to any jobs yet.</div>
            ) : (
              <div className="applications-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {applied.map((a, idx) => {
                  const job = a.job || a.jobDetails || {};
                  const status = a.status || a.applicationStatus || 'APPLIED';
                  const statusColor = status === 'SELECTED' ? 'success' : status === 'REJECTED' ? 'danger' : 'info';
                  const isSelected = status === 'SELECTED';

                  return (
                    <div key={a.id} className={`application-card card ${isSelected ? 'selected-application-card' : ''}`} style={{ animation: `fadeIn 0.3s ease forwards ${idx * 0.1}s`, opacity: 0, position: 'relative', overflow: 'hidden' }}>
                      {isSelected && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--success)' }}></div>}
                      <div className="app-head" style={{ marginBottom: '12px' }}>
                        <div>
                          <div className="company" style={{ fontSize: '18px', fontWeight: 'bold' }}>{job.companyName || job.company || 'Company'}</div>
                          <div className="role" style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{job.role || job.title || 'Role'}</div>
                        </div>
                        <div className={`badge ${statusColor}`}>{status}</div>
                      </div>

                      <div className="app-body" style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <div>📅 Applied: {a.appliedAt || a.appliedOn || 'Unknown'}</div>
                          {job.salary && <div>💰 {job.salary}</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div >
  );
}
