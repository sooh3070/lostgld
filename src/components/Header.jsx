import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const [hovered, setHovered] = useState(false);
  const [theme, setTheme] = useState('light');

  // 초기 테마 로딩
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  // 다크 모드 토글
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* 왼쪽: 로고 */}
        <Link
          to="/"
          className="header-logo"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src='/clock_4.png'
            alt="홈으로"
            className="logo-image"
          />
        </Link>

        {/* 오른쪽: 메뉴 + 토글 */}
        <div className="header-right">
          <nav className="header-nav">
            <Link to="/life-data" className="header-link">생활 효율</Link>
            <Link to="/pve-data" className="header-link">pve 효율</Link>
            <Link to="/life-tool/lumbering" className="header-link">생활 도구</Link>
            <Link to="/craft" className="header-link">융화 재료</Link>
          </nav>

          <button className="theme-toggle-button" onClick={toggleTheme}>
            {theme === 'dark' ? '💡' : '🌑'}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
