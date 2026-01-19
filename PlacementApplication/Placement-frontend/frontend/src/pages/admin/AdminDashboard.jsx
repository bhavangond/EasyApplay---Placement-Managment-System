import React, { useEffect, useState } from 'react';
import { getAllApplications, updateApplicationStatus, getAllJobs, createJob, deleteJob, updateJob, getAllStudents } from '../../api/admin';

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [openSection, setOpenSection] = useState('applications'); // 'applications' | 'jobs' | 'create'

  // create job form state
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [minCgpa, setMinCgpa] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [allowedBranches, setAllowedBranches] = useState('');
  const [driveDetails, setDriveDetails] = useState('');
  const [stipend, setStipend] = useState('');
  const [oaDate, setOaDate] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  // edit job modal state
  const [editingJob, setEditingJob] = useState(null);
  const [editCompanyName, setEditCompanyName] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editMinCgpa, setEditMinCgpa] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editAllowedBranches, setEditAllowedBranches] = useState('');
  const [editDriveDetails, setEditDriveDetails] = useState('');
  const [editStipend, setEditStipend] = useState('');
  const [editOaDate, setEditOaDate] = useState('');
  const [editInterviewDate, setEditInterviewDate] = useState('');

  async function loadApplications() {
    setLoading(true);
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load applications: ' + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadApplications(); loadJobs(); }, []);

  async function loadJobs() {
    setJobsLoading(true);
    try {
      const data = await getAllJobs();
      setJobs(data);
    } catch (err) {
      console.error(err);
      alert('Failed to load jobs: ' + (err.response?.data || err.message));
    } finally {
      setJobsLoading(false);
    }
  }

  const [students, setStudents] = useState([]);
  async function loadStudents() {
    try {
      const data = await getAllStudents();
      setStudents(data);
      if (!data || data.length === 0) {
        // Optional: Notify if empty, but maybe annoying if genuinely empty.
        // console.log('No students found');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to load students: ' + (err.response?.data || err.message));
    }
  }

  useEffect(() => { if (openSection === 'students') loadStudents(); }, [openSection]);

  async function handleStatusChange(appId, newStatus) {
    try {
      await updateApplicationStatus(appId, newStatus);
      alert(`Status updated to ${newStatus}`);
      await loadApplications();
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  function openEditModal(job) {
    setEditingJob(job);
    setEditCompanyName(job.companyName || '');
    setEditRole(job.role || '');
    setEditMinCgpa(job.minCgpa || '0');
    setEditDeadline(job.deadline || '');
    setEditAllowedBranches(job.allowedBranches || '');
    setEditDriveDetails(job.driveDetails || '');
    setEditStipend(job.stipend || '');
    setEditOaDate(job.oaDate || '');
    setEditInterviewDate(job.interviewDate || '');
  }

  async function handleDeleteJob(jobId) {
    if (!window.confirm('Delete this job?')) return;
    try {
      await deleteJob(jobId);
      alert('Job deleted');
      await loadJobs();
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  async function handleSaveEdit() {
    if (!editingJob) return;
    try {
      const payload = {
        companyName: editCompanyName,
        role: editRole,
        minCgpa: Number(editMinCgpa || 0),
        deadline: editDeadline || null,
        allowedBranches: editAllowedBranches,
        driveDetails: editDriveDetails,
        stipend: editStipend,
        oaDate: editOaDate,
        interviewDate: editInterviewDate
      };
      await updateJob(editingJob.id, payload);
      alert('Job updated');
      setEditingJob(null);
      await loadJobs();
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  if (loading) return <div className="page-container" style={{ color: '#fff', textAlign: 'center' }}>Loading applications...</div>;

  function AdminTopBar() {
    return (
      <div className="admin-topbar card" style={{ padding: '8px', display: 'inline-flex', gap: '8px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
        <button aria-pressed={openSection === 'applications'} className={`icon-btn ${openSection === 'applications' ? 'active' : ''}`} onClick={() => setOpenSection('applications')} style={{ background: openSection === 'applications' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'applications' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'applications' ? '0 4px 12px rgba(99,102,241,0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>📋</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Applications</div>
        </button>
        <button aria-pressed={openSection === 'jobs'} className={`icon-btn ${openSection === 'jobs' ? 'active' : ''}`} onClick={() => setOpenSection('jobs')} style={{ background: openSection === 'jobs' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'jobs' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'jobs' ? '0 4px 12px rgba(99,102,241,0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>💼</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Jobs</div>
        </button>
        <button aria-pressed={openSection === 'create'} className={`icon-btn ${openSection === 'create' ? 'active' : ''}`} onClick={() => setOpenSection('create')} style={{ background: openSection === 'create' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'create' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'create' ? '0 4px 12px rgba(99,102,241,0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>➕</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Create Job</div>
        </button>
        <button aria-pressed={openSection === 'selected'} className={`icon-btn ${openSection === 'selected' ? 'active' : ''}`} onClick={() => setOpenSection('selected')} style={{ background: openSection === 'selected' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'selected' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'selected' ? '0 4px 12px rgba(99,102,241,0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>🎓</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Selected</div>
        </button>
        <button aria-pressed={openSection === 'students'} className={`icon-btn ${openSection === 'students' ? 'active' : ''}`} onClick={() => setOpenSection('students')} style={{ background: openSection === 'students' ? 'var(--primary)' : 'transparent', border: 'none', color: openSection === 'students' ? '#fff' : 'var(--text-muted)', boxShadow: openSection === 'students' ? '0 4px 12px rgba(59, 130, 246, 0.4)' : 'none' }}>
          <span style={{ fontSize: '18px' }}>👥</span>
          <div className="icon-label" style={{ fontSize: '12px', fontWeight: '500' }}>Students</div>
        </button>
      </div>
    );
  }

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px' }}>Admin Dashboard</h2>
        <button className="secondary" style={{ padding: '8px 16px' }} onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}>Logout</button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <AdminTopBar />
      </div>

      <div className="animate-fade-in">
        {openSection === 'applications' && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '16px' }}>Student Applications</h3>
            {applications.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No applications yet</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Student USN</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Student Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Company</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Role</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px' }}>{app.student?.usn}</td>
                      <td style={{ padding: '12px' }}>{app.student?.name}</td>
                      <td style={{ padding: '12px' }}>{app.job?.companyName}</td>
                      <td style={{ padding: '12px' }}>{app.job?.role}</td>
                      <td style={{ padding: '12px' }}>
                        <span className={`badge ${app.status === 'SELECTED' ? 'success' : app.status === 'SHORTLISTED' ? 'info' : 'warn'}`}>
                          {app.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {app.status !== 'SELECTED' && (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleStatusChange(app.id, 'SHORTLISTED')}
                              className="secondary"
                              style={{ padding: '4px 10px', fontSize: '12px' }}
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleStatusChange(app.id, 'SELECTED')}
                              style={{ padding: '4px 10px', fontSize: '12px', background: 'var(--success)' }}
                            >
                              Select
                            </button>
                          </div>
                        )}
                        {app.status === 'SELECTED' && <span style={{ color: 'var(--success)' }}>✓ Selected</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {openSection === 'jobs' && (
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Manage Jobs</h3>
            {jobsLoading ? (
              <div>Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No jobs created</div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {jobs.map(job => (
                  <div key={job.id} className="job-card-admin" style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    {editingJob && editingJob.id === job.id ? (
                      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <h4 style={{ color: 'var(--accent)' }}>Edit Job: {job.companyName}</h4>
                        <div className="form-row"><label>Company Name</label><input value={editCompanyName} onChange={e => setEditCompanyName(e.target.value)} /></div>
                        <div className="form-row"><label>Role</label><input value={editRole} onChange={e => setEditRole(e.target.value)} /></div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div className="form-row"><label>Min CGPA</label><input type="number" step="0.01" value={editMinCgpa} onChange={e => setEditMinCgpa(e.target.value)} /></div>
                          <div className="form-row"><label>Deadline</label><input type="date" value={editDeadline} onChange={e => setEditDeadline(e.target.value)} /></div>
                        </div>

                        <div className="form-row"><label>Allowed Branches</label><input value={editAllowedBranches} onChange={e => setEditAllowedBranches(e.target.value)} placeholder="e.g. CSE, ISE" /></div>
                        <div className="form-row"><label>Drive Details</label><textarea value={editDriveDetails} onChange={e => setEditDriveDetails(e.target.value)} style={{ minHeight: '80px' }} /></div>
                        <div className="form-row"><label>Stipend</label><input value={editStipend} onChange={e => setEditStipend(e.target.value)} /></div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div className="form-row">
                            <label>OA Date</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {editOaDate === 'TBD' ? <input disabled value="TBD" /> : <input type="date" value={editOaDate} onChange={e => setEditOaDate(e.target.value)} />}
                              <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                                <input type="checkbox" checked={editOaDate === 'TBD'} onChange={e => setEditOaDate(e.target.checked ? 'TBD' : '')} /> TBD
                              </label>
                            </div>
                          </div>
                          <div className="form-row">
                            <label>Interview Date</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {editInterviewDate === 'TBD' ? <input disabled value="TBD" /> : <input type="date" value={editInterviewDate} onChange={e => setEditInterviewDate(e.target.value)} />}
                              <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                                <input type="checkbox" checked={editInterviewDate === 'TBD'} onChange={e => setEditInterviewDate(e.target.checked ? 'TBD' : '')} /> TBD
                              </label>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={handleSaveEdit}>Save Changes</button>
                          <button className="secondary" onClick={() => setEditingJob(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{job.companyName} <span style={{ fontWeight: 'normal', color: 'var(--text-muted)', fontSize: '16px' }}>— {job.role}</span></div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            Min CGPA: {job.minCgpa} • Deadline: {job.deadline || 'N/A'}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button className="secondary" onClick={() => openEditModal(job)} style={{ padding: '6px 12px', fontSize: '13px' }}>Edit</button>
                          <button className="danger" onClick={() => handleDeleteJob(job.id)} style={{ padding: '6px 12px', fontSize: '13px' }}>Delete</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {openSection === 'create' && (
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Post New Job</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const payload = {
                  companyName,
                  role,
                  minCgpa: Number(minCgpa || 0),
                  deadline: deadline || null,
                  allowedBranches,
                  driveDetails,
                  stipend,
                  oaDate,
                  interviewDate
                };
                await createJob(payload);
                alert('Job created');
                setCompanyName(''); setRole(''); setMinCgpa('0'); setDeadline(''); setAllowedBranches(''); setDriveDetails(''); setStipend(''); setOaDate(''); setInterviewDate('');
                await loadJobs();
                setOpenSection('jobs');
              } catch (err) {
                alert(err.response?.data || err.message);
              }
            }}>
              <div className="form-row"><label>Company Name</label><input value={companyName} onChange={e => setCompanyName(e.target.value)} required /></div>
              <div className="form-row"><label>Role</label><input value={role} onChange={e => setRole(e.target.value)} required /></div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-row"><label>Min CGPA</label><input type="number" step="0.01" value={minCgpa} onChange={e => setMinCgpa(e.target.value)} /></div>
                <div className="form-row"><label>Deadline</label><input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
              </div>

              <div className="form-row"><label>Allowed Branches</label><input value={allowedBranches} onChange={e => setAllowedBranches(e.target.value)} placeholder="e.g. CSE, ISE (comma separated)" /></div>
              <div className="form-row"><label>Drive Details</label><textarea value={driveDetails} onChange={e => setDriveDetails(e.target.value)} style={{ minHeight: '100px' }} /></div>
              <div className="form-row"><label>Stipend / CTC</label><input value={stipend} onChange={e => setStipend(e.target.value)} /></div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: 12 }}>
                <div className="form-row">
                  <label>OA Date</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {oaDate === 'TBD' ? <input disabled value="TBD" /> : <input type="date" value={oaDate} onChange={e => setOaDate(e.target.value)} />}
                    <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input type="checkbox" checked={oaDate === 'TBD'} onChange={e => setOaDate(e.target.checked ? 'TBD' : '')} /> TBD
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <label>Interview Date</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {interviewDate === 'TBD' ? <input disabled value="TBD" /> : <input type="date" value={interviewDate} onChange={e => setInterviewDate(e.target.value)} />}
                    <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input type="checkbox" checked={interviewDate === 'TBD'} onChange={e => setInterviewDate(e.target.checked ? 'TBD' : '')} /> TBD
                    </label>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button type="submit" style={{ width: '100%' }}>Post Job</button>
              </div>
            </form>
          </div>
        )}
        {openSection === 'selected' && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <h3 style={{ marginBottom: '16px' }}>🎉 Selected Students</h3>
            {applications.filter(a => a.status === 'SELECTED').length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No students selected yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>USN</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Company</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Role</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Package</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.filter(a => a.status === 'SELECTED').map(app => (
                    <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{app.student?.usn}</td>
                      <td style={{ padding: '12px' }}>{app.student?.name}</td>
                      <td style={{ padding: '12px', color: 'var(--success)' }}>{app.job?.companyName}</td>
                      <td style={{ padding: '12px' }}>{app.job?.role}</td>
                      <td style={{ padding: '12px' }}>{app.job?.stipend || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {openSection === 'students' && (
          <div className="card" style={{ overflowX: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Registered Students</h3>
              <button onClick={loadStudents} className="secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>🔄 Refresh List</button>
            </div>
            {students.length === 0 ? (
              <div style={{ color: 'var(--text-muted)' }}>No students registered yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>USN</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Branch</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>CGPA</th>
                    <th style={{ textAlign: 'left', padding: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.usn}</td>
                      <td style={{ padding: '12px' }}>{s.name}</td>
                      <td style={{ padding: '12px' }}>{s.branch}</td>
                      <td style={{ padding: '12px' }}>{s.email}</td>
                      <td style={{ padding: '12px', color: 'var(--success)', fontWeight: 'bold' }}>{s.cgpa ?? 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        {s.resumePath && (
                          <a href={s.resumePath} target="_blank" rel="noreferrer" style={{ fontSize: '12px', textDecoration: 'underline' }}>View Resume</a>
                        )}
                        {!s.resumePath && <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>No Resume</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
