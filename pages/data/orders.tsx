import DataLoader from "@/components/DataLoader"
import DataLayout from "@/components/layouts/DataLayout"
import Layout from "@/components/layouts/Layout"
import NoAuthority from "@/components/NoAuthority"
import { orderColumn } from "@/components/table/Column"
import { DataTable } from "@/components/table/DataTable"
import { NextPageWithLayout, storeType } from "@/lib/types"
import { getPermissions } from "@/store/reducers/authReducer"
import { selectAllOrder } from "@/store/reducers/orderReducer"
import { ReactElement } from "react"
import { useSelector } from "react-redux"

const Orders: NextPageWithLayout = () => {
    const orders = useSelector(state => selectAllOrder(state));
    const orderLoader = useSelector((state: storeType) => state.orders.loading);
    const { permissions } = getPermissions();

    if(!permissions?.readOrder) {
        return (
            <NoAuthority />
        )
    }

    return (
        <div className="w-full overflow-x-hidden lg:overflow-auto">
            <DataLoader loader={orderLoader}>
                <DataTable
                    columns={orderColumn}
                    data={orders}
                    filterTarget="customerName"
                    enableHiddenColumn
                    enableSearchFilter
                />
            </DataLoader>
        </div>
    )
}

Orders.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout title="Data">
            <DataLayout>
                {page}
            </DataLayout>
        </Layout>
    )
}
export default Orders