import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile, uploadResume } from '../../api/student';

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);

  async function load() {
    try { const p = await getProfile(); setProfile(p); } catch (err) { alert(err.response?.data || err.message); }
  }
  useEffect(() => { load(); }, []);

  async function save() {
    try { const p = await updateProfile(profile); setProfile(p); setEditing(false); alert('Saved'); } catch (err) { alert(err.response?.data || err.message); }
  }

  async function onUpload(e) {
    const f = e.target.files[0];
    if (!f) return;
    try { const res = await uploadResume(f); alert(res); load(); } catch (err) { alert(err.response?.data || err.message); }
  }

  if (!profile) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h3>Profile</h3>
      {!editing ? (
        <div>
          <div>Name: {profile.name}</div>
          <div>Email: {profile.email}</div>
          <div>USN: {profile.usn}</div>
          <div>Backlogs: {profile.backlog ?? profile.backlogs ?? 0}</div>
          <div>Branch: {profile.branch}</div>
          <div>CGPA: {profile.cgpa}</div>
          <div>Resume: {profile.resumePath || 'Not uploaded'}</div>
          <button onClick={() => setEditing(true)}>Edit</button>
          <label style={{ marginLeft: 10 }}>
            Upload Resume <input type="file" onChange={onUpload} />
          </label>
        </div>
      ) : (
        <div>
          <div><input value={profile.branch || ''} onChange={e => setProfile({ ...profile, branch: e.target.value })} /></div>
          <div><input value={profile.cgpa || ''} onChange={e => setProfile({ ...profile, cgpa: Number(e.target.value) })} /></div>
          <div><input type="number" min="0" value={profile.backlog ?? 0} onChange={e => setProfile({ ...profile, backlog: Number(e.target.value) })} /></div>
          <button onClick={save}>Save</button>
        </div>
      )}
    </div>
  );
}

