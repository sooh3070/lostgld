import { fetchCraftData } from '../../services/LostArkApi';

/**
 * 제작 데이터를 가공하는 함수
 * @param {number} craftingFeeReduction - 제작 수수료 감소율 (정수형)
 * @param {number} craftingSuccessRate - 제작 대성공 확률 (정수형)
 * @param {object|null} userSelectedItem - 사용자 선택 데이터 ({ entryIndex, itemIndex })
 * @returns {Promise<Array>} 가공된 제작 데이터
 */
export const processCraftData = async (craftingFeeReduction, craftingSuccessRate, userSelectedItem = null) => {
  try {
    const data = await fetchCraftData();

    const processedData = data.map((entry, entryIndex) => {
      const craftingFee = Math.ceil(entry.제작_수수료 - (entry.제작_수수료 / 100) * craftingFeeReduction);

      const successMultiplier = 5 + 5 * (craftingSuccessRate / 100);

      const calculateMaterialCost = (item) => Math.floor((item.count * item.price) / item.bundle_count * 100) / 100;

      const [mainItem, item2, item3, item4, item5] = entry.items;

      // Additional derived items
      const derivedItem6 = {
        ...item2,
        count: item4.count * 12.5,
        total: Math.floor(calculateMaterialCost({ ...item2, count: item4.count * 12.5 }) * 100) / 100,
      };

      const derivedItem7 = {
        ...item3,
        count: item4.count * 6.25,
        total: Math.floor(calculateMaterialCost({ ...item3, count: item4.count * 6.25 }) * 100) / 100,
      };

      const materialAlternatives = [
        Math.floor(calculateMaterialCost(item4) * 100) / 100,
        derivedItem6.total,
        derivedItem7.total,
        item5 ? Math.floor(calculateMaterialCost(item5) * 100) / 100 : Infinity,
      ];

      const alternativeCost = Math.min(...materialAlternatives);

      // Determine the selected material based on user selection or default
      const defaultSelectedMaterialIndex = materialAlternatives.indexOf(alternativeCost);
      const defaultSelectedMaterial = [item4, derivedItem6, derivedItem7, item5][defaultSelectedMaterialIndex];

      const selectedMaterial =
        userSelectedItem && userSelectedItem.entryIndex === entryIndex
          ? entry.items[userSelectedItem.itemIndex]
          : defaultSelectedMaterial;

      const materialSum =
        Math.floor((calculateMaterialCost(item2) +
          calculateMaterialCost(item3) +
          alternativeCost) * 100) / 100;
      const charge = Math.round(mainItem.price*0.05) * mainItem.count;
      const price = Math.floor((mainItem.price * mainItem.count) * 100) / 100;
      const craftingCost = Math.floor((craftingFee + materialSum) * 100) / 100;
      const profit = Math.floor((price + ((price- charge) * successMultiplier / 100) - craftingCost - charge) * 100) / 100;

      const tableHeader = {
        icon: mainItem.icon,
        name: entry.name,
        price,
        price1: mainItem.price,
        craftingCost,
        profit,
        charge,
      };

      const tableItems = [
        {
          icon: item2.icon,
          name: item2.name,
          count: item2.count,
          bundleCount: item2.bundle_count,
          price: item2.price,
          total: Math.floor(calculateMaterialCost(item2) * 100) / 100,
        },
        {
          icon: item3.icon,
          name: item3.name,
          count: item3.count,
          bundleCount: item3.bundle_count,
          price: item3.price,
          total: Math.floor(calculateMaterialCost(item3) * 100) / 100,
        },
        {
          icon: item4.icon,
          name: item4.name,
          count: item4.count,
          bundleCount: item4.bundle_count,
          price: item4.price,
          total: Math.floor(calculateMaterialCost(item4) * 100) / 100,
          isSelected: selectedMaterial === item4,
        },
        {
          icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_40.png",
          name: "가루: " + derivedItem6.name,
          count: derivedItem6.count,
          bundleCount: derivedItem6.bundle_count,
          price: derivedItem6.price,
          total: derivedItem6.total,
          isSelected: selectedMaterial === derivedItem6,
        },
        {
          icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_40.png",
          name: "가루: " + derivedItem7.name,
          count: derivedItem7.count,
          bundleCount: derivedItem7.bundle_count,
          price: derivedItem7.price,
          total: derivedItem7.total,
          isSelected: selectedMaterial === derivedItem7,
        },
      ];

      if (item5) {
        tableItems.push({
          icon: item5.icon,
          name: item5.name,
          count: item5.count,
          bundleCount: item5.bundle_count,
          price: item5.price,
          total: Math.floor(calculateMaterialCost(item5) * 100) / 100,
          isSelected: selectedMaterial === item5,
        });
      }

      const footer = {
        craftingFee: `${craftingFee}G`,
        materialSum: `${materialSum}G`,
        craftingCost: `${craftingCost}G`,
      };

      return {
        header: tableHeader,
        items: tableItems,
        footer,
      };
    });

    return processedData;
  } catch (error) {
    console.error('Error processing craft data:', error);
    return [];
  }
};
