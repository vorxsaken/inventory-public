import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import type { categoryType, messageType } from '@/lib/types'

const categoryAdapter = createEntityAdapter({
    sortComparer: (a: categoryType<messageType>, b: categoryType<messageType>) => b.categoryName.localeCompare(a.categoryName)
})

const initialState = categoryAdapter.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchCategory = createAsyncThunk('category/fetchCategory', async () => {
    const res = await fetch('/api/category/read');
    const json = await res.json();
    return json;
})

const categorySlices = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        addCategory: categoryAdapter.addOne,
        updateCategory: categoryAdapter.updateOne,
        deleteCategory: categoryAdapter.removeOne
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCategory.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategory.fulfilled, (state, actions) => {
                categoryAdapter.upsertMany(state, actions.payload);
                state.loading = false
            })
            .addCase(fetchCategory.rejected, (state, actions) => {
                state.error = actions.error as any;
                state.loading = false
            })
    }
})

export default categorySlices.reducer;

export const {
    selectAll: selectAllCategories,
    selectById: selectCategoryById,
    selectIds: selectCategoriesId
} = categoryAdapter.getSelectors((state: any) => state.categories);

export const { addCategory, updateCategory, deleteCategory } = categorySlices.actions;