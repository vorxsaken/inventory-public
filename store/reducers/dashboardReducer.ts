import { fetcher } from '@/lib/utils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
    dashboard: null,
    loading: true,
    error: null
}

export const fetchDashboards = createAsyncThunk('dashboard/fetchDashboard', async () => {
    const start = new Date(`${(new Date()).getFullYear()}-01-01`);
    const end = new Date();
    const product = await fetcher('/api/product/read/count');
    const category = await fetcher('/api/category/read/count');
    const order = await fetcher('/api/order/read/count');
    const stockIn = await fetcher('/api/stock-in/read/count');
    const report = await fetcher('/api/order/read/report/sales-trends', { start, end });
    const recentOrder = await fetcher('/api/order/read/report/recent-order', { start, end });

    return {
        product,
        category,
        order,
        stockIn,
        report,
        recentOrder
    }
})

const dashboardSlices = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchDashboards.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDashboards.fulfilled, (state, actions) => {
                const payload = actions.payload as any
                const countInventory = [
                    // [percent, value, title, isCurrency, icon, subtitle]
                    [null, payload.product, 'Total Product', false, null, 'Current Product Quantity'],
                    [null, payload.category, 'Total Category', false, null, 'Current Available Category'],
                    [null, payload.order, 'Total Sales', false, null, 'Current Total Sales Created'],
                    [null, payload.stockIn, 'Total Stock In', false, null, 'Current Stock In Created'],
                ]
                state.dashboard = {
                    countInventory,
                    report: payload.report,
                    recentOrder: payload.recentOrder
                } as any

                state.loading = false;
            })
            .addCase(fetchDashboards.rejected, (state, actions) => {
                state.loading = false;
                console.log(actions.error);
            })
    }
})


export default dashboardSlices.reducer;

export const { } = dashboardSlices.actions;