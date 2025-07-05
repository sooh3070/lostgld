import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCraftData,
  setCraftingFeeReduction,
  setCraftingSuccessRate,
  toggleSortByProfit,
  updateItemPrice,
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
    craftData,
  } = useSelector((state) => state.craft);

  useEffect(() => {
    dispatch(fetchCraftData({
      craftingFeeReduction,
      craftingSuccessRate,
      keepSort: sortByProfit,
    }));
  }, [dispatch, craftingFeeReduction, craftingSuccessRate, sortByProfit]);

  const handleInputChange = (setter, value) => {
    const parsedValue = value === '' ? '' : parseInt(value, 10) || 0;
    dispatch(setter(parsedValue));
  };

  const handleSortToggle = () => {
    dispatch(toggleSortByProfit());
  };

  const handleApiRefresh = () => {
    dispatch(fetchCraftData({
      craftingFeeReduction,
      craftingSuccessRate,
      keepSort: sortByProfit,
    }));
  };

  const HEADER_PREFIXES = [
    '오레하 융화 재료',
    '상급 오레하 융화 재료',
    '최상급 오레하 융화 재료',
    '아비도스 융화 재료',
  ];

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
        <h1 className="page-title">융화 재료 제작</h1>

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

        {/* ✅ 이미지 기반 개당 시세 입력 영역 */}
        <div className="craft-input-group">
          {HEADER_PREFIXES.map((prefix) => {
            const matchingEntries = craftData
              .map((entry, index) => ({ entry, index }))
              .filter(({ entry }) => entry.header.name.startsWith(prefix));

            if (matchingEntries.length === 0) return null;

            const { icon, price1 } = matchingEntries[0].entry.header;

            return (
              <div key={prefix} className="price-input-with-icon">
                <img src={icon} alt={prefix} className="price-icon" />
                <input
                  type="number"
                  value={price1}
                  onChange={(e) => {
                    const value = parseInt(e.target.value, 10) || '';
                    matchingEntries.forEach(({ index }) => {
                      dispatch(updateItemPrice({
                        entryIndex: index,
                        itemIndex: null,
                        newPrice: value,
                        target: 'headerPrice1',
                      }));
                    });
                  }}
                  className="craft-input-field"
                  placeholder="0"
                />
                <span>G</span>
              </div>
            );
          })}
        </div>

        {/* 버튼 */}
        <div className="craft-input-group">
          <button className="sort-button" onClick={handleApiRefresh}>
            API 새로고침
          </button>
          &nbsp;&nbsp;
          <button className="sort-button" onClick={handleSortToggle}>
            판매차익 기준으로 정렬
          </button>
        </div>

        {/* 테이블 */}
        {isLoading ? (
          <div className="loading-container">로딩 중...</div>
        ) : (
          <div className="craft-table-container">
            <CraftTable />
          </div>
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

export default CraftPage;
