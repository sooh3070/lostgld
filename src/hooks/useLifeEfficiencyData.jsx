import { useState, useEffect, useCallback } from 'react';
import { fetchLifeEfficiencyData } from '../services/LostArkApi';

export default function useLifeEfficiencyData() {
  const [lifeData, setLifeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  // 크리스탈 가격 상태 추가
  const [crystalPrice, setCrystalPrice] = useState(0);

  const [userInput, setUserInput] = useState(() => {
    const storedInput = localStorage.getItem('userInput');
    return storedInput ? JSON.parse(storedInput) : {};
  });

  const parseDuration = (duration) => {
    const [minutes, seconds] = duration.split(/[분초]/).filter(Boolean).map(Number);
    return minutes + (seconds || 0) / 60;
  };

  // 통합 재계산 로직 (아이템 수량 변경 or 크리스탈 가격 변경 시 호출)
  const calculateData = useCallback((data, input, currentCrystalPrice) => {
    return data.map((activity) => {
      const updatedItems = activity.items.map((item) => {
        const key = `${activity.name}-${item.name}`;
        const userValue = input[key];
        const count = userValue !== undefined ? parseInt(userValue, 10) || 0 : item.count;
        const price = item.price || 0;

        return {
          ...item,
          count,
          total_price: Math.floor((count * price) / 100), // 번들 단위가 100이라고 가정 (코드엔 100으로 되어있음)
          isHighlighted: userValue !== undefined,
        };
      });

      // 1. 총 획득 골드 (도약 미사용, 순수 아이템 가치)
      const totalGold = updatedItems.reduce(
        (sum, currentItem) => sum + currentItem.total_price,
        0
      );

      // 2. 도약의 정수 비용 계산 (사용자 공식: 100크리스탈 가격 / 3)
      // Math.floor(crystalPrice / 3) 가 도약 1회분(또는 1만 생기분) 비용
      const leapCost = Math.floor(currentCrystalPrice / 3);

      // 3. 도약 사용 시 순수익 (총 획득 골드 - 도약 비용)
      // *주의: 사용자의 Python 코드는 total_gold(Gross)에서 비용을 뺍니다.
      const totalGoldWithLeaf = totalGold - leapCost;

      return {
        ...activity,
        items: updatedItems,
        total_gold: totalGold,
        total_gold_withleaf: totalGoldWithLeaf,
        gold_per_hour: Math.floor(
          (totalGoldWithLeaf / parseDuration(activity.time_withleaf)) * 60
        ),
      };
    });
  }, []);

  // 데이터 변경 감지 및 적용
  useEffect(() => {
    if (originalData.length > 0) {
      setLifeData(calculateData(originalData, userInput, crystalPrice));
    }
  }, [userInput, crystalPrice, originalData, calculateData]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchLifeEfficiencyData();
        // API 응답 구조 변경에 따른 처리 ({ data: [], server_crystal_price: 0 })
        const data = response.data || response;
        const serverCrystal = response.server_crystal_price || 0;

        setOriginalData(data);
        setCrystalPrice(serverCrystal); // 서버 가격으로 초기화
      } catch (error) {
        console.error('Error fetching life efficiency data:', error);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (activityName, itemName, value) => {
    const numericValue = value.replace(/\D/g, '');
    const key = `${activityName}-${itemName}`;
    const updatedUserInput = { ...userInput, [key]: numericValue };

    setUserInput(updatedUserInput);
    localStorage.setItem('userInput', JSON.stringify(updatedUserInput));
    // useEffect가 자동으로 재계산 수행
  };

  const handleCrystalChange = (value) => {
    const numericValue = parseInt(value.replace(/\D/g, ''), 10) || 0;
    setCrystalPrice(numericValue);
  };

  const resetInput = async () => {
    try {
      // ... (기존 로직 유지하되 crystalPrice도 초기화 필요하면 추가)
      setUserInput({});
      localStorage.removeItem('userInput');
      // 크리스탈 가격은 유지할지 리셋할지 선택 (여기선 유지)
    } catch (error) {
      console.error('Error resetting life efficiency data:', error);
    }
  };

  return {
    lifeData,
    setLifeData,
    userInput,
    crystalPrice,       // 내보내기
    handleCrystalChange, // 내보내기
    handleInputChange,
    resetInput,
  };
}