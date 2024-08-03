import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { messageType, userType } from '@/lib/types';

const usersAdapter = createEntityAdapter({
    sortComparer: (a: userType & messageType, b: userType & messageType) => b.username.localeCompare(a.username)
});

const initialState = usersAdapter.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (userId: string) => {
    const res = await fetch('/api/user/read');
    const json = await res.json();
    const users = json.filter((user: any) => user.id !== userId);
    return users;
})

const userSlices = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUser: usersAdapter.addOne,
        updateUser: usersAdapter.updateOne,
        deleteUser: usersAdapter.removeOne,
        resetUser: usersAdapter.removeAll
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, actions) => {
                usersAdapter.upsertMany(state, actions.payload)
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, actions) => {
                state.error = actions.error as any;
                state.loading = false;
            })
    }
})


export default userSlices.reducer;

export const { 
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUsersId,
} = usersAdapter.getSelectors((state: any) => state.users);

export const { addUser, updateUser, deleteUser, resetUser } = userSlices.actions;