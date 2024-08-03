import { ReactNode } from "react"
import ChildLayout from "./ChildLayout"
import AddMenu from "@/components/menu"
import { getPermissions } from "@/store/reducers/authReducer";

function DataLayout({ children }: { children: ReactNode }) {
    const title = 'Data';
    const description = 'Manage your product, category, brands, and more.';
    const { permissions, isAdmin } = getPermissions();
    const subNav = [
        permissions?.readProduct && 'products',
        permissions?.readCategory && 'categories',
        permissions?.readSupplier && 'suppliers',
        isAdmin && 'roles',
        permissions?.readUser && 'users',
        permissions?.readOrder && 'orders',
        permissions?.readStock && 'stockIn'
    ].filter(nav => nav !== false) as string[];

    return (
        <ChildLayout
            title={title}
            description={description}
            sideButton={<AddMenu />}
            subNav={subNav}
        >
            {children}
        </ChildLayout>
    )
}

export default DataLayout