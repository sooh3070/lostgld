import React, { useState, useEffect } from 'react';
import { processCraftData } from '../components/craft/CraftHook';
import CraftTable from '../components/craft/CraftTable';
import AdComponent from '../components/AdComponent'; // 광고 컴포넌트 추가
import '../styles/CraftPage.css';

const CraftPage = () => {
  const getStoredValue = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? parseInt(storedValue, 10) : defaultValue;
  };

  const [craftingFeeReduction, setCraftingFeeReduction] = useState(() => getStoredValue('craftingFeeReduction', 13));
  const [craftingSuccessRate, setCraftingSuccessRate] = useState(() => getStoredValue('craftingSuccessRate', 0));
  const [craftData, setCraftData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortByProfit, setSortByProfit] = useState(false);

  useEffect(() => {
    localStorage.setItem('craftingFeeReduction', craftingFeeReduction);
  }, [craftingFeeReduction]);

  useEffect(() => {
    localStorage.setItem('craftingSuccessRate', craftingSuccessRate);
  }, [craftingSuccessRate]);

  const handleInputChange = (setter, key) => (event) => {
    const value = event.target.value;
    const parsedValue = value === '' ? '' : parseInt(value, 10) || 0;
    setter(parsedValue);
    localStorage.setItem(key, parsedValue);
  };

  const toggleItemSelected = (entryIndex, itemIndex) => {
    setCraftData((prevData) =>
      prevData.map((entry, eIndex) => {
        if (eIndex === entryIndex) {
          const selectedItems = entry.items.map((item, iIndex) => ({
            ...item,
            isSelected: iIndex >= 2 && iIndex === itemIndex,
          }));

          const fixedItems = [selectedItems[0], selectedItems[1]];
          const selectedItem = selectedItems.find((item, iIndex) => iIndex >= 2 && item.isSelected);
          const selectedTotal = selectedItem ? selectedItem.total : 0;
          const materialSum = Math.floor((fixedItems[0].total + fixedItems[1].total + selectedTotal) * 100) / 100;
          const craftingCost = Math.floor((parseFloat(entry.footer.craftingFee.replace('G', '')) + materialSum) * 100) / 100;
          const doublecraft = 5 + 5 * (craftingSuccessRate / 100);
          const profit = entry.header.price + ((entry.header.price - entry.header.charge) * doublecraft / 100) - craftingCost - entry.header.charge;

          return {
            ...entry,
            items: selectedItems,
            footer: {
              ...entry.footer,
              materialSum: `${materialSum}G`,
              craftingCost: `${craftingCost}G`,
            },
            header: {
              ...entry.header,
              profit,
              craftingCost,
            },
          };
        }
        return entry;
      })
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const processedData = await processCraftData(craftingFeeReduction, craftingSuccessRate);
      setCraftData(sortByProfit ? sortDataByProfit(processedData) : processedData);
      setIsLoading(false);
    };
    fetchData();
  }, [craftingFeeReduction, craftingSuccessRate, sortByProfit]);

  const sortDataByProfit = (data) => {
    return [...data].sort((a, b) => b.header.profit - a.header.profit);
  };

  const toggleSortByProfit = () => {
    setSortByProfit((prev) => !prev);
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
            <input type="number" value={craftingFeeReduction || ''} onChange={handleInputChange(setCraftingFeeReduction, 'craftingFeeReduction')} className="craft-input-field" placeholder="0" />%
          </label>
          <label className="craft-input-label">
            대성공 확률: 5% +
            <input type="number" value={craftingSuccessRate || ''} onChange={handleInputChange(setCraftingSuccessRate, 'craftingSuccessRate')} className="craft-input-field" placeholder="0" />%
          </label>
        </div>
        <div className="craft-input-group">
          <button className="sort-button" onClick={toggleSortByProfit}>{sortByProfit ? '원래 순서로 보기' : '판매차익 기준으로 정렬'}</button>
        </div>
        {isLoading ? (
          <div className="loading-container">로딩 중...</div>
        ) : (
          <div className="craft-table-container">
            <CraftTable data={craftData} onToggleItemSelected={toggleItemSelected} />
          </div>
        )}
        <AdComponent className="horizontal-ad" adClient="ca-pub-4349329556962059" adSlot="5655624736" adType="horizontal" />
      </div>
    </div>
  );
};

export default CraftPage;
