import DataLoader from "@/components/DataLoader"
import DataLayout from "@/components/layouts/DataLayout"
import Layout from "@/components/layouts/Layout"
import { roleColumn } from "@/components/table/Column"
import { DataTable } from "@/components/table/DataTable"
import { NextPageWithLayout, rolePermissions, roleType, storeType } from "@/lib/types"
import { getPermissions } from "@/store/reducers/authReducer"
import { selectAllRole } from "@/store/reducers/roleReducer"
import { ReactElement } from "react"
import { useSelector } from "react-redux"
import NoAuthority from "@/components/NoAuthority"

const Roles: NextPageWithLayout = () => {
    const roles = useSelector(state => selectAllRole(state)) as roleType<rolePermissions>[];
    const rolesLoader = useSelector((state: storeType) => state.roles.loading);
    const { isAdmin } = getPermissions();

    if(!isAdmin) {
        return (
            <NoAuthority />
        )
    }

    return (
        <div className="w-full overflow-x-hidden lg:overflow-auto">
            <DataLoader loader={rolesLoader}>
                <div className="flex flex-col gap-2">
                    <span className="text-[0.6rem] dark:text-white">* C = create, R = read, E = edit, D = delete</span>
                    <DataTable
                        data={roles}
                        columns={roleColumn}
                        filterTarget="roleName"
                        enableHiddenColumn
                        enableSearchFilter
                    />
                </div>
            </DataLoader>
        </div>
    )
}

Roles.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout title="Data">
            <DataLayout>
                {page}
            </DataLayout>
        </Layout>
    )
}
export default Roles