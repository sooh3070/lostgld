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
      state.sortByProfit = !state.sortByProfit;
      if (state.sortByProfit) {
        state.craftData = [...state.craftData].sort((a, b) => b.header.profit - a.header.profit);
      } else {
        state.craftData = [...state.originalCraftData];
      }
    },
    setExpandedIndex: (state, action) => {
      state.expandedIndex = action.payload;
    },
    toggleItemSelected: (state, action) => {
      const { entryIndex, itemIndex } = action.payload;
      const entry = state.craftData[entryIndex];
      
      if (!entry) return;

      // 아이템 선택 로직
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

      // 데이터 업데이트
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

      // craftData와 originalCraftData 모두 업데이트
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
} = craftSlice.actions;

export default craftSlice.reducer;