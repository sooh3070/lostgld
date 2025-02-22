// src/pages/CraftPage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCraftData,
  setCraftingFeeReduction,
  setCraftingSuccessRate,
  toggleSortByProfit,
} from '../store/craftSlice';
import CraftTable from '../components/craft/CraftTable';
import AdComponent from '../components/AdComponent';
import '../styles/CraftPage.css';

const CraftPage = () => {
  const dispatch = useDispatch();
  const {
    craftingFeeReduction,
    craftingSuccessRate,
    isLoading,
    sortByProfit,
  } = useSelector((state) => state.craft);

  useEffect(() => {
    dispatch(fetchCraftData({ 
      craftingFeeReduction, 
      craftingSuccessRate,
      keepSort: sortByProfit // 정렬 상태 유지
    }));
  }, [dispatch, craftingFeeReduction, craftingSuccessRate, sortByProfit]);

  const handleInputChange = (setter, value) => {
    const parsedValue = value === '' ? '' : parseInt(value, 10) || 0;
    dispatch(setter(parsedValue));
  };

  const handleSortToggle = () => {
    dispatch(toggleSortByProfit());
  };

  // API 새로고침 버튼 클릭 시 호출되는 핸들러
  const handleApiRefresh = () => {
    dispatch(fetchCraftData({
      craftingFeeReduction,
      craftingSuccessRate,
      keepSort: sortByProfit,
    }));
  };

  return (
    <div>
      <div className="top-ad-container">
        <AdComponent className="horizontal-ad" adClient="ca-pub-4349329556962059" adSlot="8783003456" adType="horizontal" />
      </div>
      <div className="craft-page">
        <h1>융화 재료 제작</h1>
        <div className="craft-input-group">
          <h5>
            ※ 대성공 확률 5%, 판매 수수료 5% 기본 적용 
            <br /> ※ 지연 ±1분 -→ 공식 API 갱신 주기(1분)로 인한 지연
          </h5>
          <label className="craft-input-label">
            제작 수수료 감소:
            <input
              type="number"
              value={craftingFeeReduction || ''}
              onChange={(e) => handleInputChange(setCraftingFeeReduction, e.target.value)}
              className="craft-input-field"
              placeholder="0"
            />%
          </label>
          <label className="craft-input-label">
            대성공 확률: 5% +
            <input
              type="number"
              value={craftingSuccessRate || ''}
              onChange={(e) => handleInputChange(setCraftingSuccessRate, e.target.value)}
              className="craft-input-field"
              placeholder="0"
            />%
          </label>
        </div>
        <div className="craft-input-group">
          {/* API 새로고침 버튼을 정렬 버튼 왼쪽에 추가 */}
          <button className="sort-button" onClick={handleApiRefresh}>
            API 새로고침
          </button>
          &nbsp; &nbsp;
          <button className="sort-button" onClick={handleSortToggle}>
            {sortByProfit ? '원래 순서로 보기' : '판매차익 기준으로 정렬'}
          </button>
        </div>
        {isLoading ? (
          <div className="loading-container">로딩 중...</div>
        ) : (
          <div className="craft-table-container">
            <CraftTable />
          </div>
        )}
        <AdComponent className="horizontal-ad" adClient="ca-pub-4349329556962059" adSlot="5655624736" adType="horizontal" />
      </div>
    </div>
  );
};

export default CraftPage;
