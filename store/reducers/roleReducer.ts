import { rolePermissions } from '@/lib/types';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit'
import { roleType } from '@/lib/types';

const roleAdapter = createEntityAdapter({
    sortComparer: (a: roleType<rolePermissions>, b: roleType<rolePermissions>) => b.roleName.localeCompare(a.roleName)
});

const initialState = roleAdapter.getInitialState(
    {
        loading: false,
        error: null
    }
)

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async () => {
    const res = await fetch('/api/role/read');
    const json = await res.json();
    return json;
})

const roleSlices = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        addRole: roleAdapter.addOne,
        updateRole: roleAdapter.updateOne,
        deleteRole: roleAdapter.removeOne
    },
    extraReducers(builder) {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRoles.fulfilled, (state, actions) => {
                roleAdapter.upsertMany(state, actions.payload)
                state.loading = false;
            })
            .addCase(fetchRoles.rejected, (state, actions) => {
                state.error = actions.error as any;
                state.loading = false;
            })
    }
})


export default roleSlices.reducer;

export const { 
    selectAll: selectAllRole,
    selectById: selectRoleById,
    selectIds: selectRolesId,
} = roleAdapter.getSelectors((state: any) => state.roles);

export const { addRole, updateRole, deleteRole } = roleSlices.actions;