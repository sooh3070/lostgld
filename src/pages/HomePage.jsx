import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/HomePage.css';
import AdComponent from '../components/AdComponent';

function HomePage() {

  const pageTitle = '로스트골드 - 효율적인 골드 수급과 소비';
  const pageDescription = '로스트골드 | 효율적인 골드 수급과 소비';
  const keywords = '로스트골드, 시골 계산기';

  return (
    <div className="page-container">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
      </Helmet>

      {/* 상단 타이틀 */}
      <div className="home-header">
        <h1 className="home-title">
          &nbsp; 로스트골드 <img src="/clock_4.png" alt="사이트" className="title-icon" />
        </h1>
        <p className="home-subtitle">시간당 골드 - 한 시간 동안 얻을 수 있는 골드 획득량</p>
      </div>

      {/* 광고 */}
      <AdComponent
        className="horizontal-ad"
        adClient="ca-pub-4349329556962059"
        adSlot="5655624736"
        adType="horizontal"
      />


      {/* 카드 레이아웃 */}
      <div className="home-card-container">
        {[
          { title: '벌목 도구 계산기', link: '/life-tool/lumbering' },
          { title: '생활 가루 계산기', link: '/conversion' },
          { title: '융화 재료 제작기', link: '/craft' },
          { title: '생활 효율 계산기', link: '/life-data' },
          { title: '', link: '' },  //{ title: '아비도스/가토/카게', link: '/pve-data' },  
          { title: '', link: '' }, //{ title: '카멘 익스 계산기', link: '/toadbox' },
          { title: '', link: 'https://tier.lostgld.com', external: true },
          { title: '쿠키 관리', link: '/storage' },
        ].map((card, index) =>
          card.external ? (
            <a
              href={card.link}
              target="_blank"
              rel="noopener noreferrer"
              className="home-card"
              key={index}
            >
              <div className="card-title">{card.title}</div>
            </a>
          ) : (
            <Link to={card.link} className="home-card" key={index}>
              <div className="card-title">{card.title}</div>
            </Link>
          )
        )}
      </div>

      {/* 좌우 안내 박스 */}
      <div className="home-subtitle-container">
        {/* 후원 & 문의 */}
        <div className="home-subtitle-right">
          <p className="home-subtitle3"><strong>문의 & 후원</strong></p>
          <p className="home-subtitle2">
            <br /><a href="https://open.kakao.com/o/smliDqfh" target="_blank" rel="noopener noreferrer">💬 문의하기 (카카오톡)</a>
          </p>
          <br />
          <p className="home-subtitle3"><strong>감사합니다</strong></p>
          <p className="home-subtitle2">prt3111</p>
        </div>

        {/* 업데이트 내역 */}
        <div className="home-subtitle-right">
          <p className="home-subtitle3"><strong>업데이트</strong></p>
          <p className="home-subtitle2">
            <br />2025.10.16 밸런스 티어 추가
            <br />2025.09.25 생활도구 계산기 | 도구 프리셋 추가
            <br />2025.07.05 융화 재료 제작 | 일부 수정
            <br />2025.05.01 골두꺼비 기댓 값 계산기 추가
            <br />2025.04.30 다크모드 추가, UI 수정
            <br />2025.02.23 융화 재료 제작 | 사용자 가격입력 추가
            <br />2025.02.10 생활 가루 계산기 | 복구
            <br />2025.02.08 pve 효율 계산기 | 데이터 정확도 개선
            <br />2025.02.07 생활도구 계산기 | 정확도 개선 (gld2)
            <br />2025.02.07 생활도구 계산기 | 그래프 기능 추가
            <br />2025.01.26 pve 효율 계산기 | 1700컨텐츠 추가
            <br />2025.01.15 생활 도구 계산기 | "보물주머니" 옵션 조정
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;