// src/store/craftSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { processCraftData } from '../components/craft/CraftHook';

export const fetchCraftData = createAsyncThunk(
  'craft/fetchCraftData',
  async ({ craftingFeeReduction, craftingSuccessRate, keepSort = false }, { getState }) => {
    const data = await processCraftData(craftingFeeReduction, craftingSuccessRate);
    const state = getState().craft;
    
    if (keepSort && state.sortByProfit) {
      return [...data].sort((a, b) => b.header.profit - a.header.profit);
    }
    return data;
  }
);

const craftSlice = createSlice({
  name: 'craft',
  initialState: {
    craftingFeeReduction: parseInt(localStorage.getItem('craftingFeeReduction')) || 13,
    craftingSuccessRate: parseInt(localStorage.getItem('craftingSuccessRate')) || 0,
    craftData: [],
    isLoading: false,
    sortByProfit: false, // 초기값을 false로 설정
    expandedIndex: null,
    originalCraftData: [],
  },
  reducers: {
    setCraftingFeeReduction: (state, action) => {
      state.craftingFeeReduction = action.payload;
      localStorage.setItem('craftingFeeReduction', action.payload);
    },
    setCraftingSuccessRate: (state, action) => {
      state.craftingSuccessRate = action.payload;
      localStorage.setItem('craftingSuccessRate', action.payload);
    },
    toggleSortByProfit: (state) => {
        // 정렬 시 현재 열린 항목의 식별자(header.name)를 저장 (필요하면)
        let expandedId = null;
        if (state.expandedIndex !== null && state.craftData[state.expandedIndex]) {
          expandedId = state.craftData[state.expandedIndex].header.name;
        }
      
        // 판매차익 기준 정렬로 상태를 업데이트
        state.sortByProfit = true;
        state.craftData = [...state.craftData].sort((a, b) => b.header.profit - a.header.profit);
      
        // 열린 항목이 있다면, 정렬 후 해당 항목의 인덱스를 다시 찾음
        if (expandedId !== null) {
          const newIndex = state.craftData.findIndex(entry => entry.header.name === expandedId);
          state.expandedIndex = newIndex === -1 ? null : newIndex;
        }
      },
    setExpandedIndex: (state, action) => {
      state.expandedIndex = action.payload;
    },
    toggleItemSelected: (state, action) => {
      const { entryIndex, itemIndex } = action.payload;
      // 선택 불가능한 항목(예: 인덱스 0, 1)을 클릭하면 아무 작업도 하지 않음.
      if (itemIndex < 2) return;
      
      const entry = state.craftData[entryIndex];
      if (!entry) return;

      const selectedItems = entry.items.map((item, idx) => ({
        ...item,
        isSelected: idx >= 2 && idx === itemIndex,
      }));

      const fixedItems = [selectedItems[0], selectedItems[1]];
      const selectedItem = selectedItems.find((item, idx) => idx >= 2 && item.isSelected);
      const selectedTotal = selectedItem ? selectedItem.total : 0;
      const materialSum = Math.floor((fixedItems[0].total + fixedItems[1].total + selectedTotal) * 100) / 100;
      const craftingCostCalc = Math.floor((parseFloat(entry.footer.craftingFee.replace('G', '')) + materialSum) * 100) / 100;
      const doublecraft = 5 + 5 * (state.craftingSuccessRate / 100);
      const profit = entry.header.price + ((entry.header.price - entry.header.charge) * doublecraft / 100) - craftingCostCalc - entry.header.charge;

      const updatedEntry = {
        ...entry,
        items: selectedItems,
        footer: {
          ...entry.footer,
          materialSum: `${materialSum}G`,
          craftingCost: `${craftingCostCalc}G`,
        },
        header: {
          ...entry.header,
          profit,
          craftingCost: craftingCostCalc,
        },
      };

      state.craftData[entryIndex] = updatedEntry;
      state.originalCraftData[entryIndex] = updatedEntry;
    },
    updateItemPrice: (state, action) => {
      const { entryIndex, itemIndex, newPrice, target } = action.payload;
      const entry = state.craftData[entryIndex];
      if (!entry) return;

      const getAdjustedOutputCount = () => {
        const name = entry.header.name;
        if (name.includes('최상급 오레하')) return 15;
        if (name.includes('상급 오레하')) return 20;
        if (name.includes('오레하')) return 30;
        return entry.header.price1 > 0 ? entry.header.price / entry.header.price1 : 10;
      };

      const outputCount = getAdjustedOutputCount();

      // ✅ 헤더 가격 입력 처리
      if (target === 'headerPrice1') {
        entry.header.price1 = newPrice;
        entry.header.price = newPrice * outputCount;

        const doublecraft = 5 + 5 * (state.craftingSuccessRate / 100);
        const price = entry.header.price;
        const charge = Math.round(newPrice * 0.05) * outputCount;
        const craftingCost = entry.header.craftingCost;

        const profit = price + ((price - charge) * doublecraft / 100) - craftingCost - charge;

        entry.header.profit = profit;
        entry.header.charge = charge;

        state.craftData[entryIndex] = entry;
        state.originalCraftData[entryIndex] = entry;
        return;
      }

      // ✅ 아이템 가격 수정 (단 isDerived 제외)
      const updatedItems = entry.items.map((item, idx) => {
        if (item.isDerived) return item;
        if (idx === itemIndex) {
          return {
            ...item,
            price: newPrice,
            total: Math.floor((item.count * newPrice / item.bundleCount) * 100) / 100,
          };
        }
        return item;
      });

      // ✅ item4 기준 수량 확보
      const item4Count = updatedItems[2]?.count || entry.items[2].count;

      // ✅ 파생 항목 재계산 (항상 item4.count 기준 + isSelected 유지)
      const derivedPairs = [
        { baseIndex: 0, multiplier: 12.5 },
        { baseIndex: 1, multiplier: 6.25 },
      ];

      for (const { baseIndex, multiplier } of derivedPairs) {
        const base = updatedItems[baseIndex];
        const originalName = entry.items[baseIndex].name;
        const derivedName = `가루: ${originalName}`;

        const derivedIndex = updatedItems.findIndex(
          (item) => item.isDerived && item.name === derivedName
        );
        if (derivedIndex === -1) continue;

        const derivedCount = item4Count * multiplier;
        const derivedTotal = Math.floor((derivedCount * base.price / base.bundleCount) * 100) / 100;
        const previousSelected = entry.items[derivedIndex]?.isSelected || false;

        updatedItems[derivedIndex] = {
          ...base,
          name: derivedName,
          icon: "https://cdn-lostark.game.onstove.com/efui_iconatlas/use/use_10_40.png",
          count: derivedCount,
          total: derivedTotal,
          bundleCount: base.bundleCount,
          isDerived: true,
          isSelected: previousSelected,
        };
      }

      // ✅ 선택된 항목 기준으로 제작비 계산 (isDerived 허용)
      const fixedItems = [updatedItems[0], updatedItems[1]];
      const selectedItem = updatedItems.find((item, idx) => idx >= 2 && item.isSelected);
      const selectedTotal = selectedItem ? selectedItem.total : 0;

      const materialSum = Math.floor(
        (fixedItems[0]?.total || 0) +
        (fixedItems[1]?.total || 0) +
        selectedTotal
      ) * 100 / 100;

      const craftingFee = parseFloat(entry.footer.craftingFee.replace('G', '')) || 0;
      const craftingCostCalc = Math.floor((craftingFee + materialSum) * 100) / 100;

      const doublecraft = 5 + 5 * (state.craftingSuccessRate / 100);
      const price = entry.header.price;
      const charge = Math.round(entry.header.price1 * 0.05) * outputCount;

      const profit = price + ((price - charge) * doublecraft / 100) - craftingCostCalc - charge;

      // ✅ 최종 반영
      const updatedEntry = {
        ...entry,
        items: updatedItems,
        footer: {
          ...entry.footer,
          materialSum: `${materialSum}G`,
          craftingCost: `${craftingCostCalc}G`,
        },
        header: {
          ...entry.header,
          profit,
          craftingCost: craftingCostCalc,
          charge,
        },
      };

      state.craftData[entryIndex] = updatedEntry;
      state.originalCraftData[entryIndex] = updatedEntry;
    }


  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCraftData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCraftData.fulfilled, (state, action) => {
        // 열린 항목의 이름을 저장
        let expandedId = null;
        if (state.expandedIndex !== null && state.craftData[state.expandedIndex]) {
          expandedId = state.craftData[state.expandedIndex].header.name;
        }
  
        state.craftData = action.payload;
        state.originalCraftData = action.payload;
        state.isLoading = false;
        
        // 정렬 상태가 true라면 정렬 수행
        if (state.sortByProfit) {
          state.craftData = [...state.craftData].sort((a, b) => b.header.profit - a.header.profit);
        }
  
        // 열린 항목이 있었다면, 정렬 후 해당 항목의 인덱스를 다시 찾음
        if (expandedId !== null) {
          const newIndex = state.craftData.findIndex(entry => entry.header.name === expandedId);
          state.expandedIndex = newIndex === -1 ? null : newIndex;
        }
      })
      .addCase(fetchCraftData.rejected, (state) => {
        state.isLoading = false;
        state.craftData = [];
        state.originalCraftData = [];
        state.expandedIndex = null;
      });
  },
});

export const {
  setCraftingFeeReduction,
  setCraftingSuccessRate,
  toggleSortByProfit,
  setExpandedIndex,
  toggleItemSelected,
  updateItemPrice,
} = craftSlice.actions;

export default craftSlice.reducer;
