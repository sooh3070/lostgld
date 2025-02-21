import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LumberingTool from '../components/tools/LumberingTool.jsx';
import GatheringTool from '../components/tools/GatheringTool.jsx';
import ArchaeologyTool from '../components/tools/ArchaeologyTool.jsx';
import FishingTool from '../components/tools/FishingTool.jsx';
import MiningTool from '../components/tools/MiningTool.jsx';
import HuntingTool from '../components/tools/HuntingTool.jsx';
import '../styles/LifeToolPage.css';
import AdComponent from '../components/AdComponent.jsx'; // 광고 컴포넌트 추가

const LifeToolPage = () => {
  const { toolType } = useParams();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState(toolType || 'lumbering'); // 기본값 'lumbering'

  const handleToolChange = (e) => {
    const selected = e.target.value;
    setSelectedTool(selected);
    navigate(`/life-tool/${selected}`);
  };

  const renderToolComponent = () => {
    switch (selectedTool) {
      case 'lumbering':
        return <LumberingTool />;
      case 'archaeology':
        return <ArchaeologyTool />;
      case 'mining':
        return <MiningTool />;    
      case 'gathering':
        return <GatheringTool />;
      case 'fishing':
        return <FishingTool />;
      case 'hunting':
        return <HuntingTool />;
      default:
        return (
          <div className="text-info">
            <h1>생활 도구 계산기</h1>
            <br />
            생활 도구를 선택해 주세요.
          </div>
        );
    }
  };

  const pageTitle = `${selectedTool === 'lumbering' ? '벌목' :
    selectedTool === 'archaeology' ? '고고학' :
    selectedTool === 'mining' ? '채광' :
    selectedTool === 'gathering' ? '채집' :
    selectedTool === 'fishing' ? '낚시' :
    selectedTool === 'hunting' ? '수렵' :
    ' 도구'} 계산기`;

  const pageDescription = `${pageTitle}`;

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
  
    <div className="life-tool-page">
      <Helmet>
        <title>{pageTitle} - 로스트골드</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="로스트아크, 생활 도구 계산기, 벌목 계산기, 벌목 도구 계산기, 고고학 계산기, 고고학 도구 계산기, 벌목 도구, 벌목 도구옵션, 벌목 도약, 아비도스 목재" />
        <meta name="author" content="로스트골드" />
      </Helmet>
      <header>      
        <div className="tool-selector">
          <label htmlFor="tool-dropdown">생활 도구 선택: </label>
          <select
            id="tool-dropdown"
            value={selectedTool}
            onChange={handleToolChange}
            className="tool-dropdown"
          >
            <option value="lumbering">벌목</option>
            <option value="archaeology">고고학</option>
            <option value="mining">채광</option>
            <option value="hunting">수렵</option>
            <option value="gathering">채집</option>
            <option value="fishing">낚시</option>
          </select>
        </div>
      </header>
      <div className="tool-component-container">
        {renderToolComponent()}
      </div>
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
};

export default LifeToolPage;
