import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { fetchPveEfficiencyData } from '../services/LostArkApi';
import DynamicButtonGroup from '../components/ui/DynamicButtonGroup';
import PveTable from '../components/ui/PveTable';
import AdComponent from '../components/AdComponent';

const PvePage = () => {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("전체");

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchPveEfficiencyData();
        setOriginalData(fetchedData);
        setData(fetchedData);
      } catch (err) {
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setTimeout(() => setLoading(false), 100);
      }
    };

    loadData();
  }, []);

  const handleSort = () => {
    setData([...data].sort((a, b) => b.total_gold - a.total_gold));
    setSorted(!sorted);
  };

  const handleFilter = (filterType) => {
    setSelectedFilter(filterType);
    let filteredData = originalData;

    if (filterType === "카오스 던전(작전)") {
      filteredData = originalData.filter((mission) => mission.name.includes("작전"));
    } else if (filterType === "가디언 토벌") {
      filteredData = originalData.filter((mission) =>
        ["베스칼", "아게오로스", "스콜라키아", "드렉탈라스", "소나벨"].some((keyword) => mission.name.includes(keyword))
      );
    } else if (filterType === "카오스 게이트") {
      filteredData = originalData.filter((mission) => mission.name.includes("카오스 게이트"));
    }

    setData(filterType === "전체" ? originalData : filteredData);
  };

  const buttons = [
    {
      label: '총 획득 골드 정렬',
      onClick: handleSort,
      className: 'sort-button',
    },
  ];

  const filterButtons = [
    { label: "전체", onClick: () => handleFilter("전체") },
    { label: "카오스 던전(작전)", onClick: () => handleFilter("카오스 던전(작전)") },
    { label: "가디언 토벌", onClick: () => handleFilter("가디언 토벌") },
    { label: "카오스 게이트", onClick: () => handleFilter("카오스 게이트") },
  ];

  const pageTitle = 'PVE 효율 계산기 - 로스트골드';
  const pageDescription = '로스트아크 PVE 효율 계산기.';
  const keywords = 'PVE, 효율 계산기, 시간당 골드, 로스트골드, 아비도스, 스콜라키아, 아게오로스, 돌파석, 골드, 파괴석, 수호석, 운명의, 네프타';

  if (error) {
    return (
      <div className="page-container">
        <Helmet>
          <title>오류 | {pageTitle}</title>
          <meta name="description" content="데이터를 불러오는 중 오류가 발생했습니다." />
        </Helmet>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

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
          <title>{pageTitle}</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={keywords} />
          <meta name="author" content="로스트 골드" />
        </Helmet>

        {!loading && (
          <>
            <h1 className="page-title">
              PVE 효율 계산기
              <Link to="/pve-data/info" className="info-icon" title="PVE 효율 계산기 정보">
                &#9432;
              </Link>
            </h1>
            <h5 className="page-subtitle">
              ※ 이 페이지는 '거래가능' 아이템만 표기합니다.
              <br />
              ※ 모든 데이터는 평균값 기준이며 오차가 존재할 수 있습니다.
              <br />
              ※ 데이터 보정에 따라 표기값 변경이 있을 수 있습니다.
            </h5>

            <div className="filter-buttons">
              {filterButtons.map((button, index) => (
                <button
                  key={index}
                  onClick={button.onClick}
                  className={`filter-button ${selectedFilter === button.label ? "selected" : ""}`}
                >
                  {button.label}
                </button>
              ))}
            </div>

            <DynamicButtonGroup buttons={buttons} />
            {data.map((mission, index) => (
              <PveTable key={index} mission={mission} />
            ))}
          </>
        )}

        <AdComponent
          className="horizontal-ad"
          adClient="ca-pub-4349329556962059"
          adSlot="5655624736"
          adType="horizontal"
        />
      </div>
    </div>
  );
};

export default PvePage;
