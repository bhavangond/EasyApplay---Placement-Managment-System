import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../../api/admin';

export default function CreateJob() {
  const [form, setForm] = useState({ companyName: '', role: '', driveDetails: '', deadline: '', minCgpa: '', allowedBranches: '', stipend: '', oaDate: '', interviewDate: '' });
  const navigate = useNavigate();

  function onChange(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault();
    try {
      const payload = { ...form, minCgpa: form.minCgpa ? Number(form.minCgpa) : 0 };
      await createJob(payload);
      alert('Created');
      navigate('/admin/jobs');
    } catch (err) { alert(err.response?.data || err.message); }
  }

  return (
    <div style={{ padding: 20 }}>
      <h3>Create Job</h3>
      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <input name="companyName" placeholder="Company" value={form.companyName} onChange={onChange} required />
        <input name="role" placeholder="Role" value={form.role} onChange={onChange} required />
        <textarea name="driveDetails" placeholder="Details" value={form.driveDetails} onChange={onChange} />
        <input name="deadline" placeholder="Deadline (YYYY-MM-DD)" value={form.deadline} onChange={onChange} />
        <input name="minCgpa" placeholder="Min CGPA" value={form.minCgpa} onChange={onChange} />
        <input name="allowedBranches" placeholder="Allowed Branches (comma separated)" value={form.allowedBranches} onChange={onChange} />
        <input name="stipend" placeholder="Stipend" value={form.stipend} onChange={onChange} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: 4 }}>OA Date</label>
            <input type="date" name="oaDate" value={form.oaDate} onChange={onChange} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', marginBottom: 4 }}>Interview Date</label>
            <input type="date" name="interviewDate" value={form.interviewDate} onChange={onChange} />
          </div>
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

