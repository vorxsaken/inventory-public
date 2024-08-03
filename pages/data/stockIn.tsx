import DataLoader from "@/components/DataLoader"
import DataLayout from "@/components/layouts/DataLayout"
import Layout from "@/components/layouts/Layout"
import NoAuthority from "@/components/NoAuthority"
import { stocksColumn } from "@/components/table/Column"
import { DataTable } from "@/components/table/DataTable"
import { NextPageWithLayout, storeType } from "@/lib/types"
import { dispatch } from "@/store"
import { getPermissions } from "@/store/reducers/authReducer"
import { fetchStockIn, selectAllStockIn } from "@/store/reducers/stockinReducer"
import { ReactElement, useEffect } from "react"
import { useSelector } from "react-redux"

const StockIn: NextPageWithLayout = () => {
    const stock = useSelector(state => selectAllStockIn(state));
    const stockLoader = useSelector((state: storeType) => state.stockIns.loading);
    const { permissions } = getPermissions();

    useEffect(() => {
        if(!stock.length) dispatch(fetchStockIn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    if(!permissions?.readStock) {
        return (
            <NoAuthority />
        )
    }

    return (
        <div className="w-full overflow-x-hidden lg:overflow-auto">
            <DataLoader loader={stockLoader}>
                <DataTable 
                    columns={stocksColumn}
                    data={stock}
                    filterTarget="productName"
                    enableHiddenColumn
                    enableSearchFilter
                />
            </DataLoader>

        </div>
    )
}

StockIn.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout title="Data">
            <DataLayout>
                {page}
            </DataLayout>
        </Layout>
    )
}
export default StockIn