import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useLifeEfficiencyData from '../hooks/useLifeEfficiencyData';
import LifeTable from '../components/ui/LifeTable';
import AdComponent from '../components/AdComponent';

function LifePage() {
  const { lifeData, setLifeData, handleInputChange } = useLifeEfficiencyData();
  const [editing, setEditing] = useState(false);
  const [isSortedByGoldPerHour, setIsSortedByGoldPerHour] = useState(true);

  const handleSortGoldPerHour = () => {
    const sortedData = [...lifeData].sort((a, b) => b.gold_per_hour - a.gold_per_hour);
    setLifeData(sortedData);
    setIsSortedByGoldPerHour(true);
  };

  const handleSortTotalGold = () => {
    const sortedData = [...lifeData].sort((a, b) => b.total_gold - a.total_gold);
    setLifeData(sortedData);
    setIsSortedByGoldPerHour(false);
  };

  const toggleSort = () => {
    if (isSortedByGoldPerHour) {
      handleSortTotalGold();
    } else {
      handleSortGoldPerHour();
    }
  };

  return (
    <div>
      <div className="top-ad-container">
        <AdComponent
          className="horizontal-ad"
          adClient="ca-pub-4349329556962059"
          adSlot="8783003456"
          adType="horizontal"
        />
      </div>

      <div className="page-container">
        <Helmet>
          <title>생활 효율 계산기 - 로스트골드</title>
          <meta name="description" content="로스트아크 생활 효율 계산기" />
          <link rel="canonical" href="https://lostgld.com/life-data" />
        </Helmet>

        <h1 className="page-title">
          생활 효율 계산기{' '}
          <Link to="/life-data/info" className="info-icon">&#9432;</Link>
        </h1>

        <h5 className="page-subtitle">
          ※ <Link to="/life-tool/lumbering">'생활도구'</Link>에서 생활 도구 옵션 입력이 가능합니다
        </h5>

        <div className="button-group">
          <button className="button-primary" onClick={() => setEditing(!editing)}>
            {editing ? '수정 완료' : '획득 개수 수정'}
          </button>
          <button className="button-primary" onClick={toggleSort}>
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
