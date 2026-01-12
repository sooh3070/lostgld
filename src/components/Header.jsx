import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
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
    <>
      {/* PC/태블릿 상단 헤더 */}
      <header className="header desktop-header">
        <div className="header-content">
          {/* 로고 */}
          <Link to="/" className="header-logo">
            <img src="/clock_4.png" alt="홈으로" className="logo-image" />
          </Link>

          {/* 오른쪽 영역: 메뉴 + 토글 */}
          <div className="header-right">
            <nav className="header-nav">
              <Link to="/life-data" className="header-link">생활 효율</Link>
              <Link to="/life-tool/lumbering" className="header-link">생활 도구</Link>
              <Link to="/craft" className="header-link">융화 재료</Link>
            </nav>

            <button className="theme-toggle-button" onClick={toggleTheme}>
              {theme === 'dark' ? '💡' : '🌑'}
            </button>
          </div>
        </div>
      </header>

      {/* 모바일 하단 네비게이션 바 */}
      <nav className="mobile-nav">
        <Link to="/" className="mobile-nav-item">
          <img src="/clock_4.png" alt="홈으로" className="mobile-logo" />
        </Link>
        <Link to="/life-data" className="mobile-nav-item">생활</Link>
        <Link to="/pve-data" className="mobile-nav-item">PVE</Link>
        <Link to="/life-tool/lumbering" className="mobile-nav-item">도구</Link>
        <Link to="/craft" className="mobile-nav-item">재료</Link>
        <button className="mobile-nav-item" onClick={toggleTheme}>
          {theme === 'dark' ? '💡' : '🌑'}
        </button>
      </nav>
    </>
  );
}

export default Header;
