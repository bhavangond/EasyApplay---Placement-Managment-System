import React, { useEffect, useState } from 'react';
import { getAllJobs } from '../../api/admin';
import { Link } from 'react-router-dom';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const d = await getAllJobs();
        setJobs(d);
      } catch (e) {
        alert(e.response?.data || e.message);
      }
    })();
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '28px' }}>All Jobs (Admin)</h2>
        <Link to="/admin/create-job" className="btn">Create Job</Link>
      </div>

      {jobs.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No job postings found.</div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {jobs.map(j => (
            <div key={j.id} className="card job-card-admin" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fff' }}>{j.companyName}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: '500' }}>{j.role}</div>
                </div>
                {j.deadline && <div className="badge warn">Deadline: {j.deadline}</div>}
              </div>

              <div style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '14px' }}>
                {j.driveDetails || 'No details provided.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
