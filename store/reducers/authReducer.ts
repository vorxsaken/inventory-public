import { authType } from '@/lib/types';
import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

const authAdaptor = createEntityAdapter<authType>()
const initialState = authAdaptor.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchAuth = createAsyncThunk('auth/fetchAuth', async (userId: string) => {
    const res = await fetch(`/api/user/read/${userId}`);
    const json = await res.json();
    return json;
})

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateAuth: authAdaptor.updateOne
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAuth.fulfilled, (state, actions) => {
                authAdaptor.addOne(state, actions.payload)
                state.loading = false
            })
            .addCase(fetchAuth.rejected, (state, actions) => {
                state.error = actions.error as any
                state.loading = false;
            })
    }
})

export default authSlice.reducer;
export const { selectAll: selectAuth }= authAdaptor.getSelectors((state: any) => state.auth);
export const getPermissions = () => {
    const userAuth = useSelector(state => selectAuth(state));
    const permissions = userAuth[0]?.role?.rolePermissions;
    return { permissions, isAdmin: userAuth[0]?.isAdmin };
  }
export const { updateAuth } = authSlice.actions