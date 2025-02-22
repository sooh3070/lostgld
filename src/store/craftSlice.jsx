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
    sortByProfit: false,
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
        // 정렬 전, 현재 열려있는 항목의 고유 식별자 저장 (여기서는 header.name 사용)
        let expandedId = null;
        if (state.expandedIndex !== null && state.craftData[state.expandedIndex]) {
          expandedId = state.craftData[state.expandedIndex].header.name;
        }
        
        state.sortByProfit = !state.sortByProfit;
        if (state.sortByProfit) {
          state.craftData = [...state.craftData].sort((a, b) => b.header.profit - a.header.profit);
        } else {
          state.craftData = [...state.originalCraftData];
        }
        
        // 정렬 후, 저장된 expandedId를 기반으로 새 인덱스를 찾아 업데이트
        if (expandedId !== null) {
          const newIndex = state.craftData.findIndex((entry) => entry.header.name === expandedId);
          state.expandedIndex = newIndex === -1 ? null : newIndex;
        }
      },
    setExpandedIndex: (state, action) => {
      state.expandedIndex = action.payload;
    },
    toggleItemSelected: (state, action) => {
      const { entryIndex, itemIndex } = action.payload;
      const entry = state.craftData[entryIndex];
      
      if (!entry) return;

      // 아이템 선택 로직 (원본 데이터는 변경하지 않음)
      const selectedItems = entry.items.map((item, iIndex) => ({
        ...item,
        isSelected: iIndex >= 2 && iIndex === itemIndex,
      }));

      const fixedItems = [selectedItems[0], selectedItems[1]];
      const selectedItem = selectedItems.find((item, iIndex) => iIndex >= 2 && item.isSelected);
      const selectedTotal = selectedItem ? selectedItem.total : 0;
      const materialSum = Math.floor((fixedItems[0].total + fixedItems[1].total + selectedTotal) * 100) / 100;
      const craftingCost = Math.floor((parseFloat(entry.footer.craftingFee.replace('G', '')) + materialSum) * 100) / 100;
      const doublecraft = 5 + 5 * (state.craftingSuccessRate / 100);
      const profit = entry.header.price + ((entry.header.price - entry.header.charge) * doublecraft / 100) - craftingCost - entry.header.charge;

      const updatedEntry = {
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

      state.craftData[entryIndex] = updatedEntry;
      state.originalCraftData[entryIndex] = updatedEntry;
    },
    // 새로운 액션: 사용자가 시세를 수정할 때 호출됨
    updateItemPrice: (state, action) => {
      const { entryIndex, itemIndex, newPrice } = action.payload;
      const entry = state.craftData[entryIndex];
      if (!entry) return;
      
      // 해당 항목의 시세를 업데이트하고, 총합(total)을 재계산 (여기서는 total = price × count 로 가정)
      const updatedItems = entry.items.map((item, idx) => {
        if (idx === itemIndex) {
          return {
            ...item,
            price: newPrice,
            total: newPrice * item.count /100, // 계산식 필요에 따라 조정
          };
        }
        return item;
      });

      // 재료 비용 및 판매 차익 재계산 (선택된 항목이 있을 경우에만 반영)
      const fixedItems = [updatedItems[0], updatedItems[1]];
      const selectedItem = updatedItems.find((item, idx) => idx >= 2 && item.isSelected);
      const selectedTotal = selectedItem ? selectedItem.total : 0;
      const materialSum = Math.floor((fixedItems[0].total + fixedItems[1].total + selectedTotal) * 100) / 100;
      const craftingCost = Math.floor((parseFloat(entry.footer.craftingFee.replace('G', '')) + materialSum) * 100) / 100;
      const doublecraft = 5 + 5 * (state.craftingSuccessRate / 100);
      const profit = entry.header.price + ((entry.header.price - entry.header.charge) * doublecraft / 100) - craftingCost - entry.header.charge;
      
      const updatedEntry = {
        ...entry,
        items: updatedItems,
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
        state.craftData = action.payload;
        state.originalCraftData = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchCraftData.rejected, (state) => {
        state.isLoading = false;
        state.craftData = [];
        state.originalCraftData = [];
      });
  },
});

export const {
  setCraftingFeeReduction,
  setCraftingSuccessRate,
  toggleSortByProfit,
  setExpandedIndex,
  toggleItemSelected,
  updateItemPrice, // 새 액션 내보내기
} = craftSlice.actions;

export default craftSlice.reducer;
