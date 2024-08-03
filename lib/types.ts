import Layout from '@/components/layouts/Layout'
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app'

type userType<T = void> = {
    id?: string,
    username: string,
    password?: string,
    email: string,
    isAdmin?: boolean
    roleId?: string,
    image?: string
    role?: T
}
type authType = {
    id: string,
    email: string,
    image: string,
    isAdmin: boolean,
    role: {
        id: string,
        roleName: string,
        rolePermissions: rolePermissions
    },
    username: string
}

type messageType = {
    message: string
}

type productType<T = void, S = void> = {
    id: string,
    description: string,
    productName: string,
    quantityInStock: string,
    reorderLevel: string,
    unitPrice: string,
    categoryId: string,
    supplierId: string,
    productImage: string,
    category?: T,
    supplier?: S,
    createdBy: string,
    updatedBy: string
}

type categoryType<T = void> = {
    id: string,
    categoryName: string,
    createdBy: string,
    updatedBy: string,
    message?: T
}

type supplierType = {
    id: string,
    supplierName: string,
    contactName: string,
    contactEmail: string,
    contactPhone: string,
    address: string,
    createdBy: string,
    updatedBy: string
}

type roleType<T = void> = {
    id: string,
    roleName: string,
    rolePermissions: T
}

type rolePermissions = {
    createUser: boolean,
    readUser: boolean,
    editUser: boolean,
    deleteUser: boolean,
    // product permissions
    createProduct: boolean,
    readProduct: boolean,
    editProduct: boolean,
    deleteProduct: boolean,
    // category permissions
    createCategory: boolean,
    readCategory: boolean,
    editCategory: boolean,
    deleteCategory: boolean,
    // stock in permissions
    createStock: boolean,
    readStock: boolean,
    editStock: boolean,
    deleteStock: boolean,
    // supplier permissions
    createSupplier: boolean,
    readSupplier: boolean,
    editSupplier: boolean,
    deleteSupplier: boolean,
    // order permissions
    createOrder: boolean,
    readOrder: boolean,
    editOrder: boolean,
    deleteOrder: boolean,
    // order detail permissions
    createOrderDetail: boolean,
    readOrderDetail: boolean,
    editOrderDetail: boolean,
    deleteOrderDetail: boolean,
}

type orderType<T = void> = {
    id: string,
    customerName: string,
    customerAddress: string,
    orderDate: string | Date,
    totalAmount: number | string,
    orderDetails?: T
}

type orderDetailsType = {
    id: string,
    productId: string,
    product: productType,
    quantity: number | string,
    unitPrice: number | string,
    subTotal: number | string
}

type fetchType = {
    loading: boolean,
    error: any
}

type dashboardType = {
    dashboard: {
        countInventory: any[][],
        report: any,
        recentOrder: orderType[]
    }
}

type storeType<T = fetchType> = {
    products: T,
    categories: T,
    suppliers: T,
    auth: T,
    users: T,
    roles: T,
    orders: T,
    stockIns: T,
    dashboard: dashboardType & T
}

type DivType = React.ComponentProps<'div'>;
type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

type InputEventValueType = React.FormEvent<HTMLInputElement>
type stockInType = {
    id: string,
    productId: string,
    product: productType,
    quantity: number,
    totalPrice: number,
    createdAt: string | Date
}
type salesTrendsType = {
    months: Date[],
    monthData: number[][],
    highestSales: number[],
    lowestSales: number[],
    revenueSales: number[]
}

type stockBuyType = {
    datesGroup: Date[],
    stockBuyDate: number[]
}
type salesType = {
    datesGroup: Date[],
    salesCountDate: number[]
}
type highestSalesType = {
    product: string,
    totalSales: number
}[]
type salesTrendReportType = {
    sales: salesType,
    salesTrends: salesTrendsType
}

type reportType = {
    highestSaleProduct: highestSalesType[],
    lowStockProducts: productType[],
    salesRevenue: {
        one_month_before_percent_diff: number,
        order: {
            _sum: {
                totalAmount: number
            }
        },
        orderBefore: {
            _sum: {
                totalAmount: number
            }
        }
    },
    salesTrends: salesTrendReportType,
    salesCount: {
        one_month_before_percent_diff: number,
        order: number,
        orderBefore: number
    },
    stockBuy: stockBuyType,
    stockCount: {
        one_month_before_percent_diff: number,
        sales: number,
        salesBefore: number
    },
    stockExpenses: {
        one_month_before_percent_diff: number,
        sales: {
            _sum: {
                totalPrice: number
            }
        },
        salesBefore: {
            _sum: {
                totalAmount: number
            }
        }
    }
}

export type {
    userType,
    productType,
    categoryType,
    supplierType,
    roleType,
    AppPropsWithLayout,
    NextPageWithLayout,
    InputEventValueType,
    DivType,
    messageType,
    rolePermissions,
    orderType,
    orderDetailsType,
    storeType,
    authType,
    stockInType,
    salesTrendsType,
    stockBuyType,
    salesType,
    reportType,
    highestSalesType,
    salesTrendReportType
}