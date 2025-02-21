import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useLifeEfficiencyData from '../hooks/useLifeEfficiencyData';
import LifeTable from '../components/ui/LifeTable';
import AdComponent from '../components/AdComponent'; // 광고 컴포넌트 추가
import '../styles/LifePage.css';

function LifePage() {
  const { lifeData, setLifeData, handleInputChange } = useLifeEfficiencyData();
  const [editing, setEditing] = useState(false);
  const [isSortedByGoldPerHour, setIsSortedByGoldPerHour] = useState(true); // 정렬 기준 상태

  // 시간당 골드 정렬
  const handleSortGoldPerHour = () => {
    const sortedData = [...lifeData].sort((a, b) => b.gold_per_hour - a.gold_per_hour);
    setLifeData(sortedData);
    setIsSortedByGoldPerHour(true); // 정렬 기준 상태 업데이트
  };

  // 획득 골드 정렬 (도약 X 골드 기준)
  const handleSortTotalGold = () => {
    const sortedData = [...lifeData].sort((a, b) => b.total_gold - a.total_gold);
    setLifeData(sortedData);
    setIsSortedByGoldPerHour(false); // 정렬 기준 상태 업데이트
  };

  // 버튼 클릭 핸들러
  const toggleSort = () => {
    if (isSortedByGoldPerHour) {
      handleSortTotalGold(); // 획득 골드 정렬
    } else {
      handleSortGoldPerHour(); // 시간당 골드 정렬
    }
  };

  const pageTitle = '생활 효율 계산기 - 로스트골드';
  const pageDescription =
    '로스트아크 생활 효율 계산기';
  const keywords = '로스트아크, 생활, 골드, 시간당 골드, 고고학, 벌목, 수렵, 채집, 채광, 낚시, 계산기, 수익, 효율, 비교, 아비도스, 목재, 유물, 태양 잉어';

  const canonicalUrl = 'https://lostgld.com/life-data';

  return (
  <div>
        {/* 상단 광고 영역 */}
    <div className="top-ad-container">
      <AdComponent
        className="horizontal-ad"
        adClient="ca-pub-4349329556962059"
        adSlot="8783003456"
        adType="horizontal"  
      />
    </div>
    <div className="efficiency-page">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content="로스트 골드" />
        <link rel="canonical" href={canonicalUrl} />
        
      </Helmet>
      <h1>
        생활 효율 계산기{' '}
        <Link to="/life-data/info" className="info-icon">
          &#9432;
        </Link>
      </h1>
      <h5>※ <Link to="/life-tool/lumbering">'생활도구'</Link>에서 생활 도구 옵션 입력이 가능합니다</h5>     
      <div className="button-group">
        <button className="sort-button" onClick={() => setEditing(!editing)}>
          {editing ? '수정 완료' : '획득 개수 수정'}
        </button>
        <button className="sort-button" onClick={toggleSort}>
          {isSortedByGoldPerHour ? '획득 골드 정렬' : '시간당 골드 정렬'}
        </button>
      </div>
      {lifeData.map((activity) => (
        <LifeTable
          key={activity.name}
          activity={activity}
          handleInputChange={handleInputChange}
          editing={editing}
        />
      ))}
      {/* 광고: 테이블 상단 */}
      <AdComponent
        className="horizontal-ad"
        adClient="ca-pub-4349329556962059"
        adSlot="5655624736"
        adType="horizontal"        
      />      
    </div>
  </div>
  );
}

export default LifePage;
