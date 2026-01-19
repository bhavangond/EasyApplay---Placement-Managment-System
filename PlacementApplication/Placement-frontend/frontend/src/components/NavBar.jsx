import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function parseJwt(token) {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (e) { return null; }
}

export default function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const payload = token ? parseJwt(token) : null;

  const isAdmin = !!payload && (payload.role === 'ROLE_ADMIN' || (Array.isArray(payload.roles) && payload.roles.includes('ROLE_ADMIN')));
  const isStudent = !!payload && (payload.role === 'ROLE_STUDENT' || (Array.isArray(payload.roles) && payload.roles.includes('ROLE_STUDENT')));
  const displayRole = payload?.role || (Array.isArray(payload?.roles) ? payload.roles.join(',') : null);
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null); // 'student' | 'admin' | null
  const navRef = useRef(null);

  // Hide role-specific dropdowns on public auth pages (home/login/signup)
  const publicPaths = ['/', '/student/login', '/student/signup', '/admin/login'];
  const hideMenus = publicPaths.includes(location.pathname);

  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  useEffect(() => {
    function handleDocClick(e) {
      if (!navRef.current) return;
      if (!navRef.current.contains(e.target)) setOpenDropdown(null);
    }
    function handleEsc(e){ if(e.key === 'Escape') setOpenDropdown(null); }
    document.addEventListener('click', handleDocClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('click', handleDocClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <nav ref={navRef} className="topnav card" role="navigation">
      <div className="topnav-inner">
      <ul className="nav-menu">
        <li className="nav-item"><Link to="/">Home</Link></li>

        {/* Student dropdown intentionally removed from top nav. Student-specific navigation
            is shown inside the Student Dashboard page as an icon bar. */}

        {/* Admin dropdown intentionally removed from top nav. Admin navigation
            is shown inside the Admin Dashboard page as an icon bar. */}
      </ul>

      <div className="nav-right">
        {token ? (
          <>
            <span className="muted" style={{ marginRight: 12 }}>{displayRole ?? 'User'}</span>
            <button className="secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <Link to="/student/login">Login</Link>
        )}
      </div>
      </div>
    </nav>
  );
}
