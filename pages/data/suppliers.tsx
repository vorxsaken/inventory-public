import DataLoader from "@/components/DataLoader"
import DataLayout from "@/components/layouts/DataLayout"
import Layout from "@/components/layouts/Layout"
import NoAuthority from "@/components/NoAuthority"
import { supplierColumn } from "@/components/table/Column"
import { DataTable } from "@/components/table/DataTable"
import { NextPageWithLayout, storeType } from "@/lib/types"
import { getPermissions } from "@/store/reducers/authReducer"
import { selectAllSupplier } from "@/store/reducers/supplierReducer"
import { ReactElement } from "react"
import { useSelector } from "react-redux"

const Suppliers: NextPageWithLayout = () => {
  const suppliers = useSelector(state => selectAllSupplier(state));
  const supplierLoader = useSelector((state: storeType) => state.suppliers.loading);
  const { permissions } = getPermissions();

  if (!permissions?.readSupplier) {
    return (
      <NoAuthority />
    )
  }

  return (
    <div className="w-full overflow-x-hidden lg:overflow-auto">
      <DataLoader loader={supplierLoader}>
        <DataTable
          columns={supplierColumn}
          data={suppliers}
          filterTarget="supplierName"
          enableHiddenColumn
          enableSearchFilter
        />
      </DataLoader>
    </div>
  )
}

Suppliers.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout title="Data">
      <DataLayout>
        {page}
      </DataLayout>
    </Layout>
  )
}
export default Suppliers