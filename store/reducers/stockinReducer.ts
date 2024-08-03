import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import type { stockInType } from '@/lib/types'

const stockInAdapter = createEntityAdapter<stockInType>()

const initialState = stockInAdapter.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchStockIn = createAsyncThunk('stockIn/fetchStockIn', async () => {
    const res = await fetch('/api/stock-in/read');
    const json = await res.json();
    return json;
})

const stockInSlices = createSlice({
    name: 'stockIns',
    initialState,
    reducers: {
        addStockIn: stockInAdapter.addOne,
        updateStockIn: stockInAdapter.updateOne,
        deleteStockIn: stockInAdapter.removeOne
    },
    extraReducers(builder) {
        builder
            .addCase(fetchStockIn.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchStockIn.fulfilled, (state, actions) => {
                stockInAdapter.upsertMany(state, actions.payload);
                state.loading = false
            })
            .addCase(fetchStockIn.rejected, (state, actions) => {
                state.error = actions.error as any;
                state.loading = false
            })
    }
})

export default stockInSlices.reducer;

export const {
    selectAll: selectAllStockIn,
    selectById: selectStockInById,
    selectIds: selectStockInId
} = stockInAdapter.getSelectors((state: any) => state.stockIns);

export const { addStockIn, updateStockIn, deleteStockIn } = stockInSlices.actions;