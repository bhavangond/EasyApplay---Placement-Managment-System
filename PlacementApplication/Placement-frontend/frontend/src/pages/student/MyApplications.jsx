import React, { useEffect, useState } from 'react';
import { getApplied } from '../../api/student';

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const d = await getApplied();
        setApps(d);
      } catch (e) {
        alert(e.response?.data || e.message);
      }
    })();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h3>My Applications</h3>
      {apps.length === 0 && <div>No applications yet</div>}
      <ul>
        {apps.map(a => (
          <li key={a.id}>{a.job.companyName} - {a.job.role} - {a.status} - applied at {a.appliedAt}</li>
        ))}
      </ul>
    </div>
  );
}

