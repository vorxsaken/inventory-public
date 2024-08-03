import { configureStore } from "@reduxjs/toolkit";
import productReducer from './reducers/productReducer';
import categoryReducer from "./reducers/categoryReducer";
import supplierReducer from "./reducers/supplierReducer";
import authReducer from "./reducers/authReducer";
import userReducer from "./reducers/userReducer";
import roleReducer from "./reducers/roleReducer";
import orderReducer from "./reducers/orderReducer";
import stockinReducer from "./reducers/stockinReducer";
import dashboardReducer from "./reducers/dashboardReducer";

const store = configureStore({
    reducer: {
        products: productReducer,
        categories: categoryReducer,
        suppliers: supplierReducer,
        auth: authReducer,
        users: userReducer,
        roles: roleReducer,
        orders: orderReducer,
        stockIns: stockinReducer,
        dashboard: dashboardReducer
    }
})

export default store;
export const {dispatch, getState}  = store;
export type AppDispatch = typeof dispatch