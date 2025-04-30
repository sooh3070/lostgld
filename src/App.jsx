import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async'; // HelmetProvider 추가
import Header from './components/Header.jsx'; // 공통 헤더
import Footer from './components/Footer.jsx'; // 공통 푸터
import HomePage from './pages/HomePage.jsx'; // 홈 페이지
import LifePage from './pages/LifePage.jsx'; // 생활 효율 페이지
import PveEfficiencyPage from './pages/PvePage.jsx'; // PVE 효율 페이지
import LifePageInfo from './pages/Info/LifePageInfo.jsx';
import PvePageInfo from './pages/Info/PvePageInfo.jsx';
import LumberingInfo from './pages/Info/LumberingInfo.jsx';
import LifeToolPage from './pages/LifeToolPage.jsx'; // 생활 도구 페이지
import LocalStorageManager from './pages/LocalStorageManager.jsx'; // 쿠키 관리
import ConversionPage from './pages/ConversionPage.jsx';
import AdComponent from './components/AdComponent.jsx'; // 사이드 광고 컴포넌트 추가
import CraftPage from './pages/CraftPage.jsx';
import './App.css'; // 전체 스타일
import './styles/theme.css'
import './styles/layout.css';

function App() {
  return (
    <HelmetProvider>
      {/* 공통 헤더 */}
      <Header />  
        {/* 왼쪽 사이드 광고 */}
        <div className="side-ad side-ad-left">
          <AdComponent 
            className="side-ad"
            adClient="ca-pub-4349329556962059"
            adSlot="8757131495"
            adType='vertiacal'
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/life-data" element={<LifePage />} />
            <Route path="/life-data/info" element={<LifePageInfo />} />
            <Route path="/pve-data" element={<PveEfficiencyPage />} />
            <Route path="/pve-data/info" element={<PvePageInfo />} />
            <Route path="/life-tool/lumber/info" element={<LumberingInfo />} />
            <Route path="/life-tool/:toolType" element={<LifeToolPage />} />
            <Route path="/storage" element={<LocalStorageManager />} />
            <Route path="/conversion" element={<ConversionPage />} />
            <Route path="/craft" element={<CraftPage />} />
          </Routes>
        </div>

        {/* 오른쪽 사이드 광고 */}
        <div className="side-ad side-ad-right">
          <AdComponent
            className="side-ad"                   
            adClient="ca-pub-4349329556962059"
            adSlot="8757131495"
            adType='vertiacal'
          />
        </div>

      {/* 공통 푸터 */}
      <Footer />
    </HelmetProvider>
  );
}

export default App;
