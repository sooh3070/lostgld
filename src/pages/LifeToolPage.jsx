import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import LumberingTool from '../components/tools/LumberingTool.jsx';
import GatheringTool from '../components/tools/GatheringTool.jsx';
import ArchaeologyTool from '../components/tools/ArchaeologyTool.jsx';
import FishingTool from '../components/tools/FishingTool.jsx';
import MiningTool from '../components/tools/MiningTool.jsx';
import HuntingTool from '../components/tools/HuntingTool.jsx';
import AdComponent from '../components/AdComponent.jsx';
import '../styles/LifeToolPage.css'; // 원래 네가 쓰던 파일만 유지

const LifeToolPage = () => {
  const { toolType } = useParams();
  const navigate = useNavigate();
  const [selectedTool, setSelectedTool] = useState(toolType || 'lumbering');

  const handleToolChange = (e) => {
    const selected = e.target.value;
    setSelectedTool(selected);
    navigate(`/life-tool/${selected}`);
  };

  const renderToolComponent = () => {
    switch (selectedTool) {
      case 'lumbering': return <LumberingTool />;
      case 'archaeology': return <ArchaeologyTool />;
      case 'mining': return <MiningTool />;
      case 'gathering': return <GatheringTool />;
      case 'fishing': return <FishingTool />;
      case 'hunting': return <HuntingTool />;
      default:
        return (
          <div className="text-info">
            생활 도구를 선택해 주세요.
          </div>
        );
    }
  };

  const toolName = {
    lumbering: '벌목',
    archaeology: '고고학',
    mining: '채광',
    gathering: '채집',
    fishing: '낚시',
    hunting: '수렵',
  }[selectedTool] || '생활 도구';

  const pageTitle = `${toolName} 계산기`;
  const pageDescription = `${toolName} 도구 계산기`;

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
          <title>{pageTitle} - 로스트골드</title>
          <meta name="description" content={pageDescription} />
          <meta name="keywords" content={`로스트아크, ${toolName}, 생활도구, 계산기`} />
          <meta name="author" content="로스트골드" />
        </Helmet>

        {/* 드롭다운 고정 구조 유지 */}
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

        <div>
          {renderToolComponent()}
        </div>

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
