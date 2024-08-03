import Layout from "@/components/layouts/Layout"
import { categoryType, NextPageWithLayout, storeType } from "@/lib/types"
import { ReactElement } from "react"
import DataLayout from "@/components/layouts/DataLayout"
import { useSelector } from "react-redux"
import { selectAllCategories } from "@/store/reducers/categoryReducer"
import { DataTable } from "@/components/table/DataTable"
import { categoryColumn } from "@/components/table/Column"
import DataLoader from "@/components/DataLoader"
import { getPermissions } from "@/store/reducers/authReducer"
import NoAuthority from "@/components/NoAuthority"

const Categories: NextPageWithLayout = () => {
    const categories = useSelector(state => selectAllCategories(state))
    const categoryLoader = useSelector((state: storeType) => state.categories.loading);
    const { permissions } = getPermissions();

    if(!permissions?.readCategory) {
        return (
            <NoAuthority />
        )
    }

    return (
        <div className="w-full overflow-x-hidden lg:overflow-auto">
            <DataLoader loader={categoryLoader}>
                <DataTable
                    columns={categoryColumn}
                    data={categories as categoryType[]}
                    filterTarget="categoryName"
                    enableHiddenColumn
                    enableSearchFilter
                />
            </DataLoader>
        </div>
    )
}

Categories.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout title="Data">
            <DataLayout>
                {page}
            </DataLayout>
        </Layout>
    )
}
export default Categories