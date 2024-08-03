import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import type { NextApiRequest, NextApiResponse } from "next";
import authOption from './auth/[...nextauth]';

type sessionType = {
    expires: string,
    user: {
        name: string,
        email: string,
        image: string
    }
}

type roleType = {
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
const months = {
    0: 'Jan',
    1: 'Feb',
    2: 'Mar',
    3: 'Apr',
    4: 'Mei',
    5: 'Jun',
    6: 'Jul',
    7: 'Aug',
    8: 'Sep',
    9: 'Okt',
    10: 'Nov',
    11: 'Des'
}

const translateMonth = (month: number) => months[month as keyof typeof months]
const generateMonths = (start: Date, end: Date) => {
    const monthsArray = [];

    // get start and end month as number between 0 and 11
    const startMonth = start.getMonth();
    const endMonth = end.getMonth();

    // generate month range
    for (let i = startMonth; i <= endMonth; i++) {
        let monthIndex = i as keyof typeof months;
        monthsArray.push(months[monthIndex]);
    }

    return monthsArray;

}

const database = new PrismaClient();
const subtractDateByOneMonth = (initDate: Date) => {
    const date = new Date(initDate);
    const currentMonth = date.getMonth();
    const currentFullYear = date.getFullYear();

    date.setMonth(currentMonth - 1);

    if(currentMonth === 0) date.setFullYear(currentFullYear - 1);

    return date;
}
const percentageDifference = (initial: number, latter: number) => {
    const calculate = ((latter - initial) / initial) * 100;
    return Math.round(calculate);
}
const handlerWithAuth = (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOption) as sessionType;

    
    if (session) {
        return handler(req, res, session)
    }

    return res.status(401).send({ message: 'unauthenticated' })

}

export { database, handlerWithAuth, generateMonths, translateMonth, subtractDateByOneMonth, percentageDifference };
export type { sessionType, roleType }