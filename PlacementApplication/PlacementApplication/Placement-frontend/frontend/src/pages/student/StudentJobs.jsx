import React, { useEffect, useState } from 'react';
import { getJobs, applyToJob } from '../../api/student';

export default function StudentJobs() {
  const [jobs, setJobs] = useState([]);

  async function load() {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      alert('Unable to load jobs: ' + (err.response?.data || err.message));
    }
  }

  useEffect(() => { load(); }, []);

  async function onApply(jobId) {
    if (!window.confirm('Apply for this job?')) return;
    try {
      const res = await applyToJob(jobId);
      alert(res);
    } catch (err) {
      alert(err.response?.data || err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Available Jobs</h3>
      {jobs.length === 0 && <div>No jobs</div>}
      <ul>
        {jobs.map(j => (
          <li key={j.id} style={{ border: '1px solid #ddd', padding: 10, margin: 10 }}>
            <strong>{j.companyName} - {j.role}</strong>
            <div>{j.driveDetails}</div>
            <div>Deadline: {j.deadline}</div>
            <div>Min CGPA: {j.minCgpa || 'N/A'}</div>
            <button onClick={() => onApply(j.id)}>Apply</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

