/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table"
import {
    productType,
    categoryType,
    supplierType,
    userType,
    roleType,
    rolePermissions,
    orderType,
    orderDetailsType,
    stockInType,
} from "@/lib/types"
import { DataTableHeader } from "./DataTableHeader"
import RowActions from "./RowActions"
import { useSelector } from "react-redux"
import { deleteProduct, selectProductById } from "@/store/reducers/productReducer"
import ViewProduct from "./viewRows/ViewProduct"
import Product from "../menu/Product"
import { useEffect, useState } from "react"
import { dispatch } from "@/store"
import RemoveRow from "./RemoveRow"
import { deleteCategory, selectCategoryById } from "@/store/reducers/categoryReducer"
import Category from "../menu/Category"
import { deleteSupplier, selectSupplierById } from "@/store/reducers/supplierReducer"
import Supplier from "../menu/Supplier"
import ViewSupplier from "./viewRows/ViewSupplier"
import { deleteUser, fetchUsers, resetUser, selectUserById } from "@/store/reducers/userReducer"
import User from "../menu/User"
import ViewUser from "./viewRows/ViewUser"
import { cutLongString, extractWord, parseCurrency, standartDate } from "@/lib/utils"
import { deleteRole, selectRoleById } from "@/store/reducers/roleReducer"
import Role from "../menu/Role"
import { deleteOrder, selectOrderById } from "@/store/reducers/orderReducer"
import ViewOrder from "./viewRows/viewOrder"
import Order from "../menu/Order"
import { getPermissions, selectAuth } from "@/store/reducers/authReducer"
import { signOut, useSession } from "next-auth/react"
import { deleteStockIn, selectStockInById } from "@/store/reducers/stockinReducer"
import { fetchDashboards } from "@/store/reducers/dashboardReducer"
const getPermission = (entity: string, row: rolePermissions) => {

    if (row) {
        const arrays = Object.entries(row);
        const permissionsArray = arrays
            .filter(array => array[0].includes(entity) && array[1] == true)
            .map(array => extractWord(array[0], false))
            .map(array => array.substring(0, 1));

        const permissionsString = permissionsArray.join(', ')
        return permissionsString
    }

    return ''
}


export const productColumns: ColumnDef<productType>[] = [
    {
        accessorKey: "productName",
        header: ({ column }) => <DataTableHeader column={column} title="Product Name" />,
        cell: ({ row }) => {
            const cb = row.getValue('productName') as string;
            return <div className="text-xs capitalize w-[200px] lg:w-auto">{cb}</div>
        }
    },
    {
        accessorKey: "description",
        header: () => <div className="text-xs">Description</div>,
        cell: ({ row }) => {
            const rawDescription = row.getValue('description') as string;
            const Description = rawDescription.length > 40 ? rawDescription.substring(0, 40) + ' ...' : rawDescription;
            return <div className="text-xs w-[300px] lg:w-auto" title={rawDescription}>{Description}</div>
        }
    },
    // this below product field is category with interfece of {...product, category: categoryName, ...restCategory}
    // below is what you will do if you wanna do faceted filtering on specific column
    // the accessor key should be a function and string id that point to literal object key
    {
        accessorFn: (row) => {
            const categoryObject = row.category as unknown
            const category = categoryObject as categoryType;
            return category?.categoryName || ''
        },
        id: 'categoryName',
        header: ({ column }) => <DataTableHeader column={column} title="Category" />,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        }
    },
    {
        accessorKey: "unitPrice",
        header: ({ column }) => {
            return (
                <DataTableHeader column={column} title="Per Unit Price" />
            )
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue('unitPrice'));
            const formatPrice = new Intl.NumberFormat("de-DE").format(price);

            return <div className="text-xs w-[120px] lg:w-auto">Rp. {formatPrice}</div>
        }
    },
    {
        accessorKey: "reorderLevel",
        header: ({ column }) => <DataTableHeader column={column} title="Reorder Level" />,
        cell: ({ row }) => {
            const rl = row.getValue('reorderLevel') as string;
            return <div className="w-[120px] lg:w-auto">{rl}</div>
        }
    },
    {
        accessorKey: "quantityInStock",
        header: ({ column }) => <DataTableHeader column={column} title="Stock" />,
    },
    {
        accessorKey: "createdBy",
        header: () => <div className="text-xs capitalize">created by</div>,
        cell: ({ row }) => {
            const cb = row.getValue('createdBy') as string;
            return <div className="text-xs capitalize w-[100px] lg:w-auto">{cb}</div>
        }
    },
    {
        accessorKey: "updatedBy",
        header: () => <div className="text-xs capitalize">updated by</div>,
        cell: ({ row }) => {
            const cb = row.getValue('updatedBy') as string;
            return <div className="text-xs capitalize w-[100px] lg:w-auto">{cb}</div>
        }
    },
    {
        id: "actions",
        header: () => <div className="text-xs">Actions</div>,
        cell: ({ row }) => {
            const rowData = row.original;
            const products = useSelector(state => selectProductById(state, rowData.id)) as productType<categoryType, supplierType>;
            const { permissions } = getPermissions();

            const formattedProduct = {
                ...products,
                unitPrice: new Intl.NumberFormat('en-DE').format(parseInt(products.unitPrice)),
                quantityInStock: products.quantityInStock.toString(),
                reorderLevel: products.reorderLevel.toString()
            };

            const deleteRow = () => {
                dispatch(deleteProduct(products.id))
                dispatch(fetchDashboards())
            }
            const [key, setKey] = useState(0);
            useEffect(() => { setKey(prevKey => prevKey + 1) }, [products]);
            const removeMenu = permissions.deleteProduct ? (
                <RemoveRow
                    onDelete={deleteRow}
                    rowName={products.productName}
                    rowId={products.id}
                    entity="product"
                />
            ) : undefined

            return (
                <RowActions
                    key={key}
                    view={<ViewProduct {...products} />}
                    edit={<Product defaultValue={formattedProduct} edit />}
                    remove={removeMenu}
                />
            );
        }
    },
]

export const categoryColumn: ColumnDef<categoryType>[] = [
    {
        accessorKey: "categoryName",
        header: ({ column }) => <DataTableHeader column={column} title="Category Name" />,
        cell: ({row}) => {
            return <div className="w-[150px] lg:w-auto">{row.original.categoryName}</div>
        }
    },
    {
        accessorKey: "createdBy",
        header: 'Created By',
        cell: ({row}) => {
            return <div className="w-[150px] lg:w-auto">{row.original.createdBy}</div>
        }
    },
    {
        accessorKey: "updatedBy",
        header: "Updated By",
        cell: ({row}) => {
            return <div className="w-[150px] lg:w-auto">{row.original.updatedBy}</div>
        }
    },
    {
        id: 'actions',
        header: "Actions",
        cell: ({ row }) => {
            const rowData = row.original;
            const category = useSelector(state => selectCategoryById(state, rowData.id)) as categoryType;
            const { permissions } = getPermissions();

            const deleteRow = () => {
                dispatch(deleteCategory(category.id))
                dispatch(fetchDashboards())
            }
            const [key, setKey] = useState(0);
            useEffect(() => { setKey(prevKey => prevKey + 1) }, [category]);
            const removeMenu = permissions.deleteCategory ? (
                <RemoveRow
                    onDelete={deleteRow}
                    rowName={category.categoryName}
                    rowId={category.id}
                    entity="category"
                />
            ) : undefined

            return (
                <RowActions
                    key={key}
                    edit={<Category defaultValue={category} edit />}
                    remove={removeMenu}
                />
            );
        }
    }
]

export const supplierColumn: ColumnDef<supplierType>[] = [
    {
        accessorKey: 'supplierName',
        header: ({ column }) => <DataTableHeader column={column} title="Supplier Name" />,
        cell: ({row}) => {
            return <div className="w-[200px] lg:w-auto">{row.original.supplierName}</div>
        }
    },
    {
        accessorKey: 'contactEmail',
        header: ({ column }) => <DataTableHeader column={column} title="Contact Email" />,
        cell: ({ row }) => {
            const ce = row.getValue('contactEmail') as string
            return <div className="lowercase">{ce}</div>
        }
    },
    {
        accessorKey: 'address',
        header: ({ column }) => <DataTableHeader column={column} title="Address" />,
        cell: ({ row }) => {
            const rawAddress = row.getValue('address') as string;
            const address = cutLongString(rawAddress, 40);
            return <div className="text-xs lowercase w-[200px] lg:w-auto" title={rawAddress}>{address}</div>
        }
    },
    {
        accessorKey: 'contactPhone',
        header: () => <div className="text-xs capitalize">phone</div>,
        cell: ({row}) => {
            return <div className="w-[200px] lg:w-auto">{row.original.contactPhone}</div>
        }
    },
    {
        accessorKey: 'contactName',
        header: ({ column }) => <DataTableHeader column={column} title="Contact Name" />,
        cell: ({row}) => {
            return <div className="w-[150px] lg:w-auto">{row.original.contactName}</div>
        }
    },
    {
        accessorKey: 'createdBy',
        header: ({ column }) => <DataTableHeader column={column} title="Created By" />,
        cell: ({row}) => {
            return <div className="w-[100px] lg:w-auto">{row.original.createdBy}</div>
        }
    },
    {
        accessorKey: 'updatedBy',
        header: ({ column }) => <DataTableHeader column={column} title="Update By" />,
        cell: ({row}) => {
            return <div className="w-[100px] lg:w-auto">{row.original.updatedBy}</div>
        }
    },
    {
        id: 'Actions',
        header: () => <div className="text-xs capitalize">Actions</div>,
        cell: ({ row }) => {
            const rowData = row.original;
            const supplier = useSelector(state => selectSupplierById(state, rowData.id)) as supplierType;
            const { permissions } = getPermissions();

            const deleteRow = () => dispatch(deleteSupplier(supplier.id))
            const [key, setKey] = useState(0);
            useEffect(() => { setKey(prevKey => prevKey + 1) }, [supplier]);
            const removeMenu = permissions.deleteSupplier ? (
                <RemoveRow
                    onDelete={deleteRow}
                    rowName={supplier.supplierName}
                    rowId={supplier.id}
                    entity="supplier"
                />
            ) : undefined

            return (
                <RowActions
                    key={key}
                    view={<ViewSupplier {...supplier} />}
                    edit={<Supplier defaultValue={supplier} edit />}
                    remove={removeMenu}
                />
            );
        }
    }
]

export const roleColumn: ColumnDef<roleType<rolePermissions>>[] = [
    {
        accessorKey: 'roleName',
        header: ({ column }) => <DataTableHeader column={column} title='Role Name' className="text-xs" />,
        cell: ({ row }) => {
            const ce = row.getValue('roleName') as string
            return <div className="capitalize w-[150px] lg:w-auto">{ce}</div>
        }
    },
    {
        accessorKey: 'rolePermissions',
        header: () => <div className="text-xs capitalize">Category</div>,
        cell: ({ row }) => {
            const ce = row.getValue('rolePermissions') as rolePermissions;
            const permissionsString = getPermission('Category', ce);
            return <div className="capitalize text-xs w-[200px] lg:w-auto">{permissionsString}</div>
        }
    },
    {
        accessorKey: 'rolePermissions',
        header: () => <div className="text-xs capitalize">Product</div>,
        cell: ({ row }) => {
            const ce = row.getValue('rolePermissions') as rolePermissions;
            const permissionsString = getPermission('Product', ce)
            return <div className="capitalize text-xs w-[200px] lg:w-auto">{permissionsString}</div>
        }
    },
    {
        accessorKey: 'rolePermissions',
        header: () => <div className="text-xs capitalize">User</div>,
        cell: ({ row }) => {
            const ce = row.getValue('rolePermissions') as rolePermissions;
            const permissionsString = getPermission('User', ce);
            return <div className="capitalize text-xs w-[200px] lg:w-auto">{permissionsString}</div>
        }
    },
    {
        accessorKey: 'rolePermissions',
        header: () => <div className="text-xs capitalize">Supplier</div>,
        cell: ({ row }) => {
            const ce = row.getValue('rolePermissions') as rolePermissions;
            const permissionsString = getPermission('Supplier', ce)
            return <div className="capitalize text-xs w-[200px] lg:w-auto">{permissionsString}</div>
        }
    },
    {
        accessorKey: 'rolePermissions',
        header: () => <div className="text-xs capitalize">Stock</div>,
        cell: ({ row }) => {
            const ce = row.getValue('rolePermissions') as rolePermissions;
            const permissionsString = getPermission('Stock', ce)
            return <div className="capitalize text-xs w-[200px] lg:w-auto">{permissionsString}</div>
        }
    },
    {
        accessorKey: 'rolePermissions',
        header: () => <div className="text-xs capitalize">Order</div>,
        cell: ({ row }) => {
            const ce = row.getValue('rolePermissions') as rolePermissions;
            let permissionsString = '';

            if (ce) {
                const arrays = Object.entries(ce);

                const permissionsArray = arrays.filter(array => /order(?!Detail)/gi.test(array[0]) && array[1] == true)
                    .map(array => extractWord(array[0], false))
                    .map(array => array.substring(0, 1));

                permissionsString = permissionsArray.join(', ')
            }

            return <div className="capitalize text-xs w-[200px] lg:w-auto">{permissionsString}</div>
        }
    },
    {
        accessorKey: 'rolePermissions',
        header: () => <div className="text-xs capitalize">Order Detail</div>,
        cell: ({ row }) => {
            const ce = row.getValue('rolePermissions') as rolePermissions;
            const permissionsString = getPermission('OrderDetail', ce);
            return <div className="capitalize text-xs w-[200px] lg:w-auto">{permissionsString}</div>
        }
    },
    {
        id: 'Actions',
        header: () => <div className="text-xs capitalize">Actions</div>,
        cell: ({ row }) => {
            const rowData = row.original;
            const roles = useSelector(state => selectRoleById(state, rowData.id || '')) as roleType<rolePermissions>;
            const { isAdmin } = getPermissions();

            const deleteRow = () => {
                const selAuth = useSelector(state => selectAuth(state));
                if (selAuth[0].role.id === roles.id) {
                    return signOut({ callbackUrl: '/' })
                } else {
                    const { data: session } = useSession();
                    dispatch(deleteRole(roles.id || ''));
                    dispatch(resetUser());
                    dispatch(fetchUsers((session?.user as any).id as string));
                }
            }
            const [key, setKey] = useState(0);
            useEffect(() => { setKey(prevKey => prevKey + 1) }, [roles]);
            const removeMenu = isAdmin ? (
                <RemoveRow
                    onDelete={deleteRow}
                    rowName={roles.roleName}
                    rowId={roles.id || ''}
                    entity="role"
                    warningMessage="all related field will be deleted"
                />
            ) : undefined

            return (
                <RowActions
                    key={key}
                    edit={<Role defaultValue={roles} edit />}
                    remove={removeMenu}
                />
            );
        }
    }
]

export const userColumn: ColumnDef<userType>[] = [
    {
        accessorKey: 'username',
        header: ({ column }) => <DataTableHeader column={column} title='Username' className="text-xs" />,
        cell: ({ row }) => {
            const ce = row.getValue('username') as string
            return <div className="capitalize w-[200px] lg:w-auto">{ce}</div>
        }
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <DataTableHeader column={column} title='Email' className="text-xs" />,
        cell: ({ row }) => {
            const ce = row.getValue('email') as string
            return <div className="lowercase w-[200px] lg:w-auto">{ce}</div>
        }
    },
    {
        accessorKey: 'role',
        header: ({ column }) => <DataTableHeader column={column} title='Role' className="text-xs" />,
        cell: ({ row }) => {
            const role = row.getValue('role') as roleType;
            const roleName = role?.roleName;
            return <div className="lowercase w-[100px] lg:w-auto">{roleName}</div>
        }
    },
    {
        id: 'Actions',
        header: () => <div className="text-xs capitalize">Actions</div>,
        cell: ({ row }) => {
            const rowData = row.original;
            const users = useSelector(state => selectUserById(state, rowData.id || '')) as userType;
            const { permissions } = getPermissions();

            const formattedUser = {
                ...users,
                password: ''
            }
            const deleteRow = () => dispatch(deleteUser(users.id || ''))
            const [key, setKey] = useState(0);
            useEffect(() => { setKey(prevKey => prevKey + 1) }, [users]);
            const removeMenu = permissions.deleteUser ? (
                <RemoveRow
                    onDelete={deleteRow}
                    rowName={users.username}
                    rowId={users.id || ''}
                    entity="user"
                />
            ) : undefined

            return (
                <RowActions
                    key={key}
                    view={<ViewUser {...users as userType<roleType>} />}
                    edit={<User defaultValue={formattedUser} edit />}
                    remove={removeMenu}
                />
            );
        }
    }
]

export const orderColumn: ColumnDef<orderType<orderDetailsType[]>>[] = [
    {
        accessorKey: "customerName",
        header: ({ column }) => <DataTableHeader column={column} title="Customer Name" />,
        cell: ({ row }) => {
            const cb = row.getValue('customerName') as string;
            return <div className="text-xs capitalize w-[200px] lg:w-auto">{cb}</div>
        }
    },
    {
        accessorKey: "customerAddress",
        header: ({ column }) => <DataTableHeader column={column} title="Customer Address" />,
        cell: ({ row }) => {
            const cb = row.getValue('customerAddress') as string;
            return <div className="text-xs capitalize w-[300px] lg:w-auto" title={cb}>{cutLongString(cb, 40)}</div>
        }
    },
    {
        accessorKey: "orderDate",
        header: ({ column }) => <DataTableHeader column={column} title="Order Date" />,
        cell: ({ row }) => {
            const cb = row.getValue('orderDate') as string;
            return <div className="text-xs capitalize w-[140px] lg:w-auto">{standartDate(cb)}</div>
        }
    },
    {
        accessorKey: "totalAmount",
        header: ({ column }) => <DataTableHeader column={column} title="Total Amount" />,
        cell: ({ row }) => {
            const cb = row.getValue('totalAmount') as string;
            return <div className="text-xs capitalize w-[150px] lg:w-auto">Rp. {parseCurrency(parseInt(cb))}</div>
        }
    },
    {
        id: "actions",
        header: () => <div className="text-xs">Actions</div>,
        cell: ({ row }) => {
            const rowData = row.original;
            const order = useSelector(state => selectOrderById(state, rowData.id)) as orderType<orderDetailsType[]>;
            const { permissions } = getPermissions();

            const formatOrderDetails = (order.orderDetails || []).map(orderDetail => {
                return {
                    ...orderDetail,
                    unitPrice: parseCurrency(orderDetail.unitPrice as number),
                    subTotal: parseCurrency(orderDetail.subTotal as number)
                }
            })

            const formatOrder = {
                ...order,
                totalAmount: parseCurrency(order.totalAmount as number),
                orderDate: new Date(order.orderDate),
                orderDetails: formatOrderDetails
            }

            const deleteRow = () => {
                dispatch(deleteOrder(order.id))
                dispatch(fetchDashboards())
            }
            const [key, setKey] = useState(0);
            useEffect(() => { setKey(prevKey => prevKey + 1) }, [order]);
            const removeMenu = permissions.deleteOrder ? (
                <RemoveRow
                    onDelete={deleteRow}
                    rowName={order.customerName}
                    rowId={order.id}
                    entity="order"
                />
            ) : undefined

            return (
                <RowActions
                    key={key}
                    view={<ViewOrder {...order} />}
                    edit={<Order defaultValue={formatOrder} edit />}
                    remove={
                        removeMenu
                    }
                />
            );
        }
    },
]

export const stocksColumn: ColumnDef<stockInType>[] = [
    {
        accessorFn: (row) => {
            const productObject = row.product;
            return productObject.productName;
        },
        id: 'productName',
        header: ({ column }) => <DataTableHeader column={column} title="Product" />,
        cell: ({row}) => {
            const rowd = row.getValue('productName') as any
            return <div className="w-[200px] lg:w-auto">{rowd}</div>
        }
    },
    {
        accessorKey: "quantity",
        header: ({ column }) => <DataTableHeader column={column} title="Quantity" />,
        cell: ({ row }) => {
            const cb = row.getValue('quantity') as string;
            return <div className="text-xs capitalize">{cb}</div>
        }
    },
    {
        accessorKey: "totalPrice",
        header: ({ column }) => <DataTableHeader column={column} title="Total Price" />,
        cell: ({ row }) => {
            const cb = row.getValue('totalPrice') as number;
            return <div className="text-xs capitalize w-[150px] lg:w-auto">Rp. {parseCurrency(cb)}</div>
        }
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => <DataTableHeader column={column} title="Created At" />,
        cell: ({ row }) => {
            const cb = row.getValue('createdAt') as string;
            return <div className="text-xs capitalize w-[200px] lg:w-auto">{standartDate(cb)}</div>
        }
    },
    {
        id: 'actions',
        header: "Actions",
        cell: ({ row }) => {
            const rowData = row.original;
            const stockIn = useSelector(state => selectStockInById(state, rowData.id)) as stockInType;
            const { permissions } = getPermissions();

            const deleteRow = () => {
                dispatch(deleteStockIn(stockIn.id))
                dispatch(fetchDashboards())
            }
            const [key, setKey] = useState(0);
            useEffect(() => { setKey(prevKey => prevKey + 1) }, [stockIn]);
            const removeMenu = permissions.deleteStock ? (
                <RemoveRow
                    onDelete={deleteRow}
                    rowName={stockIn.product.productName}
                    rowId={stockIn.id}
                    entity="stock-in"
                />
            ) : undefined

            return (
                <RowActions
                    key={key}
                    remove={
                        removeMenu
                    }
                />
            );
        }
    }

]
