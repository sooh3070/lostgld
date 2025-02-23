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
      const { entryIndex, itemIndex, newPrice } = action.payload;
      const entry = state.craftData[entryIndex];
      if (!entry) return;
    
      // 업데이트 시 기존의 selection 플래그를 그대로 유지
      const updatedItems = entry.items.map((item, idx) => {
        // 파생 항목은 수정 불가
        if (item.isDerived) return item;
        if (idx === itemIndex) {
          return {
            ...item,
            price: newPrice,
            total: Math.floor((item.count * newPrice) / item.bundleCount * 100) / 100,
          };
        }
        return item;
      });
    
      // 첫번째 항목(인덱스 0)이 수정되면 파생 항목 derivedItem6 (인덱스 3) 재계산 시 기존 선택값 유지
      if (itemIndex === 0) {
        const updatedItem2 = updatedItems[0];
        const item4 = updatedItems[2]; // item4는 변하지 않음
        if (item4) {
          const newCount = item4.count * 12.5;
          const newTotal = Math.floor((newCount * updatedItem2.price / updatedItem2.bundleCount) * 100) / 100;
          const previousSelected = entry.items[3]?.isSelected || false;
          updatedItems[3] = {
            ...updatedItem2,
            count: newCount,
            total: newTotal,
            name: "가루: " + updatedItem2.name,
            isDerived: true,
            isSelected: previousSelected,
          };
        }
      }
    
      // 두번째 항목(인덱스 1)이 수정되면 파생 항목 derivedItem7 (인덱스 4) 재계산 시 기존 선택값 유지
      if (itemIndex === 1) {
        const updatedItem3 = updatedItems[1];
        const item4 = updatedItems[2];
        if (item4) {
          const newCount = item4.count * 6.25;
          const newTotal = Math.floor((newCount * updatedItem3.price / updatedItem3.bundleCount) * 100) / 100;
          const previousSelected = entry.items[4]?.isSelected || false;
          updatedItems[4] = {
            ...updatedItem3,
            count: newCount,
            total: newTotal,
            name: "가루: " + updatedItem3.name,
            isDerived: true,
            isSelected: previousSelected,
          };
        }
      }
    
      // 나머지 계산은 기존 선택 상태(인덱스 2 이상의 항목) 보존하여 재계산
      const fixedItems = [updatedItems[0], updatedItems[1]];
      const selectedItem = updatedItems.find((item, idx) => idx >= 2 && item.isSelected);
      const selectedTotal = selectedItem ? selectedItem.total : 0;
      const materialSum = Math.floor((fixedItems[0].total + fixedItems[1].total + selectedTotal) * 100) / 100;
      const craftingCostCalc = Math.floor((parseFloat(entry.footer.craftingFee.replace('G', '')) + materialSum) * 100) / 100;
      const doublecraft = 5 + 5 * (state.craftingSuccessRate / 100);
      const profit = entry.header.price + ((entry.header.price - entry.header.charge) * doublecraft / 100) - craftingCostCalc - entry.header.charge;
      
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
        },
      };
    
      state.craftData[entryIndex] = updatedEntry;
      state.originalCraftData[entryIndex] = updatedEntry;
    },
    
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
