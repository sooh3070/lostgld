// 📂 Path: src/pages/LifePage.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import useLifeEfficiencyData from '../hooks/useLifeEfficiencyData';
import LifeTable from '../components/ui/LifeTable';
import AdComponent from '../components/AdComponent';

function LifePage() {
  // useLifeEfficiencyData 훅에서 crystalPrice와 변경 핸들러를 가져옵니다.
  const {
    lifeData,
    setLifeData,
    handleInputChange,
    crystalPrice,
    handleCrystalChange
  } = useLifeEfficiencyData();

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

        <h5 className="page-subtitle" style={{ marginBottom: '0px' }}>
          <Link to="/life-tool/lumbering">'생활도구'</Link>에서 생활 도구 옵션 입력이 가능합니다 (획득 개수 반영)
          <br /> 보유중인 도약의 정수 사용시 크리스탈 가격을 0으로 변경해주세요.
        </h5>

        {/* 도약의 정수 비용 설명 (부제목 스타일 유지) */}
        <p className="page-subtitle" style={{ margin: '0px' }}>
          도약의 정수 비용 : &nbsp;
          <span className="crystal-highlight">
            {Number(crystalPrice).toLocaleString()} ÷ 3 = {Math.floor(crystalPrice / 3).toLocaleString()} 골드
          </span>
        </p>

        {/* 크리스탈 입력 및 도약의 정수 버튼 (우측 정렬) */}
        <div className="craft-input-group" >
          <span className="crystal-label" > 크리스탈 시세:</span>
          <input
            className="craft-input-field"
            type="text"
            value={crystalPrice}
            onFocus={(e) => e.target.select()} // ✅ 클릭 시 전체 선택
            onChange={(e) => handleCrystalChange(e.target.value)}
            placeholder="예: 3200"
          />
          <span className="crystal-label" style={{ marginRight: '15px' }}>G</span>
        </div>

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