import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import type { orderDetailsType, orderType } from '@/lib/types'

const orderAdapter = createEntityAdapter({
    sortComparer: (a: orderType<orderDetailsType[]>, b: orderType<orderDetailsType[]>) => a.customerName.localeCompare(b.customerName)
})

const initialState = orderAdapter.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchOrder = createAsyncThunk('order/fetchOrder', async () => {
    const res = await fetch('/api/order/read');
    const json = await res.json();
    return json;
})

const orderSlices = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addOrder: orderAdapter.addOne,
        updateOrder: orderAdapter.updateOne,
        deleteOrder: orderAdapter.removeOne
    },
    extraReducers(builder) {
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrder.fulfilled, (state, actions) => {
                orderAdapter.upsertMany(state, actions.payload);
                state.loading = false
            })
            .addCase(fetchOrder.rejected, (state, actions) => {
                state.error = actions.error as any;
                state.loading = false
            })
    }
})

export default orderSlices.reducer;

export const {
    selectAll: selectAllOrder,
    selectById: selectOrderById,
    selectIds: selectOrderId
} = orderAdapter.getSelectors((state: any) => state.orders);

export const { addOrder, updateOrder, deleteOrder } = orderSlices.actions;