import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import HomePage from './pages/HomePage.jsx';
import LifePage from './pages/LifePage.jsx';
import PveEfficiencyPage from './pages/PvePage.jsx';
import LifePageInfo from './pages/Info/LifePageInfo.jsx';
import PvePageInfo from './pages/Info/PvePageInfo.jsx';
import LumberingInfo from './pages/Info/LumberingInfo.jsx';
import LifeToolPage from './pages/LifeToolPage.jsx';
import LocalStorageManager from './pages/LocalStorageManager.jsx';
import ConversionPage from './pages/ConversionPage.jsx';
import AdComponent from './components/AdComponent.jsx';
import CraftPage from './pages/CraftPage.jsx';
import ToadboxCalculator from './pages/ToadboxCalculator.jsx';
import PrivacyPolicy from './moim/PrivacyPolicy.jsx'; // ✅ 추가
import './App.css';
import './styles/theme.css'
import './styles/layout.css';

function App() {
  const location = useLocation();

  // ✅ 특정 경로에서 헤더 숨기기
  const hideHeader = location.pathname === "/privacy-policy";

  return (
    <HelmetProvider>
      {/* 공통 헤더 (조건부 렌더링) */}
      {!hideHeader && <Header />}

      {/* 왼쪽 사이드 광고 (PrivacyPolicy일 땐 숨기고 싶으면 같은 조건 적용 가능) */}
      {!hideHeader && (
        <div className="side-ad side-ad-left">
          <AdComponent
            className="side-ad"
            adClient="ca-pub-4349329556962059"
            adSlot="8757131495"
            adType="vertical"
          />
        </div>
      )}

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
          <Route path="/toadbox" element={<ToadboxCalculator />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} /> {/* ✅ 추가 */}
        </Routes>
      </div>

      {/* 오른쪽 사이드 광고 */}
      {!hideHeader && (
        <div className="side-ad side-ad-right">
          <AdComponent
            className="side-ad"
            adClient="ca-pub-4349329556962059"
            adSlot="8757131495"
            adType="vertical"
          />
        </div>
      )}

      {/* 푸터는 계속 보여줄 건지? */}
      <Footer />
    </HelmetProvider>
  );
}

export default App;
