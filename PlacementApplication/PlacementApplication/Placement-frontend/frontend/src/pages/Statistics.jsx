import React from 'react';
import { Link } from 'react-router-dom';

export default function Statistics() {
    const stats = [
        { label: 'Highest Package', value: '92 LPA', icon: '🏆', color: '#fbbf24' },
        { label: 'Average Package', value: '35 LPA', icon: '📈', color: '#34d399' },
        { label: 'Total Offers', value: '917+', icon: '🤝', color: '#60a5fa' },
        { label: 'Recruiters', value: '249+', icon: 'sf', color: '#a78bfa' },
    ];

    return (
        <div className="page-container" style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

            {/* Header */}
            <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: '60px', marginTop: '40px' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '16px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Placement Statistics
                </h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>
                    RV College of Engineering - 2024 (Ongoing)
                </p>
            </div>

            {/* Stats Grid */}
            <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', maxWidth: '1200px', width: '100%', marginBottom: '60px' }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="card" style={{ padding: '32px', textAlign: 'center', borderTop: `4px solid ${stat.color}`, background: 'rgba(255,255,255,0.03)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{stat.icon}</div>
                        <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>{stat.value}</div>
                        <div style={{ fontSize: '16px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Detailed Highlights */}
            <div className="card animate-fade-in" style={{ maxWidth: '900px', width: '100%', padding: '40px', marginBottom: '40px' }}>
                <h2 style={{ fontSize: '24px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Detailed Highlights</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div>
                        <h3 style={{ color: 'var(--accent)', marginBottom: '12px' }}>2024 Batch (Ongoing)</h3>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: '2' }}>
                            <li>• 812 Students Placed so far</li>
                            <li>• 75% Placement Rate (CS/IS)</li>
                            <li>• Top Recruiters: Cisco, Amazon, Bosch</li>
                        </ul>
                    </div>
                    <div>
                        <h3 style={{ color: 'var(--accent)', marginBottom: '12px' }}>2023 Batch Highlights</h3>
                        <ul style={{ listStyle: 'none', padding: 0, color: 'var(--text-muted)', lineHeight: '2' }}>
                            <li>• Highest Package: 62 LPA (UG)</li>
                            <li>• Median Package: 10 LPA</li>
                            <li>• 1267 Offers Made</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <Link to="/" className="btn secondary" style={{ padding: '12px 32px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <span>←</span> Back to Home
            </Link>
        </div>
    );
}
