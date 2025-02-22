import React, { useEffect, useState } from 'react';
import { fetchPveEfficiencyData, fetchLifeEfficiencyData } from '../services/LostArkApi';
import { Helmet } from 'react-helmet-async';
import '../styles/HomePage.css';
import AdComponent from '../components/AdComponent'; // 광고 컴포넌트 추가

function HomePage() {
  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pveData, lifeData] = await Promise.all([
          fetchPveEfficiencyData(),
          fetchLifeEfficiencyData(),
        ]);

        const combinedData = [...pveData, ...lifeData]
          .map((content) => ({
            name: content.name,
            gold_per_hour: content.gold_per_hour,
          }))
          .sort((a, b) => b.gold_per_hour - a.gold_per_hour);

        setMergedData(combinedData);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="loading-container">데이터를 불러오는 중입니다...</div>;
  }
  const pageTitle = '로스트골드 - 효율적인 골드 수급과 소비';
  const pageDescription =
  '로스트골드 | 효율적인 골드 수급과 소비';
  const keywords = '로스트골드, 시골 계산기';


  return (
    <div className="home-page">
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

      {/* 광고: 테이블 상단 */}
      <AdComponent
        className="horizontal-ad"
        adClient="ca-pub-4349329556962059"
        adSlot="5655624736"
        adType="horizontal"        
      />
      <div className="home-subtitle-container">
      {/* 왼쪽 박스 - 문의 및 후원 */}
        <div className="home-subtitle-right">
        <p className="home-subtitle3"><strong>문의 & 후원</strong></p>
        <p className="home-subtitle2">
            <br/><a href="https://open.kakao.com/o/smliDqfh" target="_blank" rel="noopener noreferrer">💬 문의하기 (카카오톡)</a>
            <br/><a href="https://toon.at/donate/lostgold" target="_blank" rel="noopener noreferrer">💰 투네이션 후원</a>
        </p>
        <br/>
        <p className="home-subtitle3"><strong>감사합니다</strong></p>
        <p className="home-subtitle2">
          prt3111
        </p>
        </div>

        {/* 오른쪽 박스 - 업데이트 내역 */}
        <div className="home-subtitle-right">
        <p className="home-subtitle3"><strong>업데이트</strong></p>
        <p className="home-subtitle2">
            <br/>2025.02.23 융화 재료 제작 | 사용자 가격입력 추가
            <br/>2025.02.10 생활 가루 계산기 | 복구
            <br/>2025.02.08 pve 효율 계산기 | 데이터 정확도 개선
            <br/>2025.02.07 생활도구 계산기 | 정확도 개선 (gld2)
            <br/>2025.02.07 생활도구 계산기 | 그래프 기능 추가 
            <br/>2025.01.26 pve 효율 계산기 | 1700컨텐츠 추가
            <br/>2025.01.15 생활 도구 계산기 | "보물주머니" 옵션 조정
          </p>
        </div>
      </div>



      {/* 컨텐츠 테이블 */}
      <div className="home-content">
        <table className="home-table">
          <thead>
            <tr>
              <th>컨텐츠명</th>
              <th>시간당 골드</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.map((content, index) => (
              <tr key={index}>
                <td>{content.name}</td>
                <td>{content.gold_per_hour.toLocaleString()} 골드</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default HomePage;
