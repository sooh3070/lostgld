import { useState, useEffect, useCallback } from 'react';
import { fetchLifeEfficiencyData } from '../services/LostArkApi';

export default function useLifeEfficiencyData() {
  const [lifeData, setLifeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [userInput, setUserInput] = useState(() => {
    const storedInput = localStorage.getItem('userInput');
    return storedInput ? JSON.parse(storedInput) : {};
  });

  const parseDuration = (duration) => {
    const [minutes, seconds] = duration.split(/[분초]/).filter(Boolean).map(Number);
    return minutes + (seconds || 0) / 60;
  };

  const applyUserInputToData = useCallback(
    (data) => {
      return data.map((activity) => {
        const updatedItems = activity.items.map((item) => {
          const key = `${activity.name}-${item.name}`;
          const userValue = userInput[key];
          const count = userValue !== undefined ? parseInt(userValue, 10) || 0 : item.count;
          const price = item.price || 0;

          return {
            ...item,
            count,
            total_price: Math.floor((count * price) / 100),
            isHighlighted: userValue !== undefined, // 사용자 입력 여부로 하이라이트 결정
          };
        });

        const totalGold = updatedItems.reduce(
          (sum, currentItem) => sum + currentItem.total_price,
          0
        );

        const originalActivity = originalData.find((a) => a.name === activity.name) || activity;
        const leapEffectDifference =
          originalActivity.total_gold_withleaf - originalActivity.total_gold;

        return {
          ...activity,
          items: updatedItems,
          total_gold: totalGold,
          total_gold_withleaf: totalGold + leapEffectDifference,
          gold_per_hour: Math.floor(
            ((totalGold + leapEffectDifference) / parseDuration(activity.time_withleaf)) * 60
          ),
        };
      });
    },
    [userInput, originalData]
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchLifeEfficiencyData();
        setOriginalData(data);

        if (Object.keys(userInput).length > 0) {
          setLifeData(applyUserInputToData(data));
        } else {
          setLifeData(data);
        }
      } catch (error) {
        console.error('Error fetching life efficiency data:', error);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 최초 로드 시 1회 실행

  const handleInputChange = (activityName, itemName, value) => {
    const numericValue = value.replace(/\D/g, ''); // 숫자만 허용
    const key = `${activityName}-${itemName}`;
    const updatedUserInput = { ...userInput, [key]: numericValue };

    const updatedLifeData = lifeData.map((activity) => {
      if (activity.name !== activityName) return activity;

      const updatedItems = activity.items.map((item) => {
        if (item.name !== itemName) return item;

        const count = parseInt(numericValue, 10) || 0;
        const total_price = Math.floor((count * item.price) / 100);

        return { ...item, count, total_price, isHighlighted: true };
      });

      const totalGold = updatedItems.reduce(
        (sum, currentItem) => sum + currentItem.total_price,
        0
      );

      const originalActivity = originalData.find((a) => a.name === activity.name) || activity;
      const leapEffectDifference =
        originalActivity.total_gold_withleaf - originalActivity.total_gold;

      return {
        ...activity,
        items: updatedItems,
        total_gold: totalGold,
        total_gold_withleaf: totalGold + leapEffectDifference,
        gold_per_hour: Math.floor(
          ((totalGold + leapEffectDifference) / parseDuration(activity.time_withleaf)) * 60
        ),
      };
    });

    setUserInput(updatedUserInput);
    setLifeData(updatedLifeData);
    localStorage.setItem('userInput', JSON.stringify(updatedUserInput));
  };

  const resetInput = async () => {
    try {
      const data = await fetchLifeEfficiencyData();
      setOriginalData(data);
      setLifeData(data);
      setUserInput({});
      localStorage.removeItem('userInput');
    } catch (error) {
      console.error('Error resetting life efficiency data:', error);
    }
  };

  return {
    lifeData,
    setLifeData,
    userInput,
    handleInputChange,
    resetInput,
  };
}
