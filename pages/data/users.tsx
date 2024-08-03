import DataLoader from "@/components/DataLoader"
import DataLayout from "@/components/layouts/DataLayout"
import Layout from "@/components/layouts/Layout"
import NoAuthority from "@/components/NoAuthority"
import { userColumn } from "@/components/table/Column"
import { DataTable } from "@/components/table/DataTable"
import { NextPageWithLayout, storeType, userType } from "@/lib/types"
import { getPermissions } from "@/store/reducers/authReducer"
import { selectAllUsers } from "@/store/reducers/userReducer"
import { ReactElement } from "react"
import { useSelector } from "react-redux"

const Users: NextPageWithLayout = () => {
    const users = useSelector(state => selectAllUsers(state));
    const usersLoader = useSelector((state: storeType) => state.users.loading);
    const { permissions } = getPermissions();

    if(!permissions?.readUser) {
        return (
            <NoAuthority />
        )
    }

    return (
        <div className="w-full overflow-x-hidden lg:overflow-auto">
            <DataLoader loader={usersLoader}>
                <DataTable
                    columns={userColumn}
                    data={users as userType[]}
                    filterTarget="username"
                    enableHiddenColumn
                    enableSearchFilter
                />
            </DataLoader>
        </div>
    )
}

Users.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout title="Data">
            <DataLayout>
                {page}
            </DataLayout>
        </Layout>
    )
}
export default Users