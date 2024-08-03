import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import type { messageType, supplierType } from '@/lib/types'

const supplierAdapter = createEntityAdapter({
    sortComparer: (a: supplierType & messageType, b: supplierType & messageType) => b.supplierName.localeCompare(a.supplierName)
})

const initialState = supplierAdapter.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchSupplier = createAsyncThunk('supplier/fetchSuppliers', async () => {
    const res = await fetch('/api/supplier/read');
    const json = await res.json();
    return json;
})

const supplierSlices = createSlice({
    name: 'suppliers',
    initialState,
    reducers: {
        addSupplier: supplierAdapter.addOne,
        updateSupplier: supplierAdapter.updateOne,
        deleteSupplier: supplierAdapter.removeOne
    },
    extraReducers(builder) {
        builder
            .addCase(fetchSupplier.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchSupplier.fulfilled, (state, actions) => {
                supplierAdapter.upsertMany(state, actions.payload);
                state.loading = false;
            })
            .addCase(fetchSupplier.rejected, (state, actions) => {
                state.error = actions.error as any;
                state.loading = false;
            })
    }
})


export default supplierSlices.reducer;
export const {
    selectAll: selectAllSupplier,
    selectById: selectSupplierById,
    selectIds: selectSuppliersId
} = supplierAdapter.getSelectors((state: any) => state.suppliers)
export const { addSupplier, updateSupplier, deleteSupplier } = supplierSlices.actions;