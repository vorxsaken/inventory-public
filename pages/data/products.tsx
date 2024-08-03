import DataLayout from "@/components/layouts/DataLayout"
import Layout from "@/components/layouts/Layout"
import { NextPageWithLayout, storeType } from "@/lib/types"
import { ReactElement} from "react"
import { DataTable } from "@/components/table/DataTable"
import { useSelector } from "react-redux"
import { selectAllProduct } from "@/store/reducers/productReducer"
import { productColumns } from "@/components/table/Column"
import { selectAllCategories } from "@/store/reducers/categoryReducer"
import DataLoader from "@/components/DataLoader"
import { getPermissions } from "@/store/reducers/authReducer"
import NoAuthority from "@/components/NoAuthority"

const Products: NextPageWithLayout = () => {
    const products = useSelector(state => selectAllProduct(state))
    const categories = useSelector(state => selectAllCategories(state));
    const productLoading = useSelector((state: storeType) => state.products.loading);
    const categoryFacetedOptions = categories.map(category => ({ value: category.categoryName, label: category.categoryName }));
    const { permissions } = getPermissions();

    if(!permissions?.readProduct) {
        return (
            <NoAuthority />
        )
    }

    return (
        <div className="w-full overflow-x-hidden lg:overflow-auto">
            <DataLoader loader={productLoading}>
                <DataTable
                    data={products}
                    columns={productColumns}
                    filterTarget="productName"
                    facetedFilterOption={categoryFacetedOptions}
                    facetedTarget='categoryName'
                    faceteColumn
                    enableHiddenColumn
                    enableSearchFilter
                />
            </DataLoader>
        </div>
    )
}

Products.getLayout = function getLayout(page: ReactElement) {

    return (
        <Layout title="Data">
            <DataLayout>
                {page}
            </DataLayout>
        </Layout>
    )
}
export default Products