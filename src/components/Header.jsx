import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
  const [hovered, setHovered] = useState(false);

  return (
    <header className="header">
      <div className="header-content">
        {/* 로고: 홈페이지로 라우팅 */}
        <Link 
          to="/" 
          className="header-logo"
          onMouseEnter={() => setHovered(true)} // 마우스 진입 시 상태 변경
          onMouseLeave={() => setHovered(false)} // 마우스 나갈 시 상태 변경
        >
          <img
            src={hovered ? '/clock_4_1.png' : '/clock_4.png'} // 상태에 따라 이미지 변경
            alt="홈으로"
            className="logo-image"
          />
        </Link>

        {/* 네비게이션 메뉴 */}
        <nav className="header-nav">
          <Link to="/life-data" className="header-link">생활 효율</Link>
          <Link to="/pve-data" className="header-link">pve 효율</Link>
          <Link to="/life-tool/lumbering" className="header-link">생활 도구</Link> {/* LifeToolPage 추가 */}
          <Link to="/craft" className="header-link">융화 재료 </Link> &nbsp; &nbsp; &nbsp;
          <Link to="/storage" className="header-link">쿠키 관리</Link> 
          <Link to="/conversion" className="header-link">생활 가루</Link> 
        </nav>
      </div>
    </header>
  );
}

export default Header;
