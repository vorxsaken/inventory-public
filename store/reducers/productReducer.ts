import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { categoryType, messageType, productType, supplierType } from '@/lib/types';

const productsAdapter = createEntityAdapter({
    sortComparer: (a: productType & messageType, b: productType & messageType) => b.productName.localeCompare(a.productName)
});

const initialState = productsAdapter.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchProduct = createAsyncThunk('product/fetchProduct', async () => {
    const res = await fetch('/api/product/read');
    const json = await res.json();
    return json
})

const productSlices = createSlice({
    name: 'products',
    initialState,
    reducers: {
        addProduct: productsAdapter.addOne,
        updateProduct: productsAdapter.updateOne,
        deleteProduct: productsAdapter.removeOne,
        resetProduct: productsAdapter.removeAll
    },
    extraReducers(builder) {
        builder
            .addCase(fetchProduct.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProduct.fulfilled, (state, actions) => {
                productsAdapter.upsertMany(state, actions.payload)
                state.loading = false;
            })
            .addCase(fetchProduct.rejected, (state, actions) => {
                state.error = actions.error as any;
                state.loading = false;
            })
    }
})


export default productSlices.reducer;

export const { 
    selectAll: selectAllProduct,
    selectById: selectProductById,
    selectIds: selectProductsId,
} = productsAdapter.getSelectors((state: any) => state.products);

export const { addProduct, updateProduct, deleteProduct, resetProduct } = productSlices.actions;