import {actionType} from "./actionType";
import {AuthInfo, AuthLogin, getData, storeData, updateData, deleteData, notifyData} from "./action";

let url = '';
async function Dispatch(method, state, params) {
    switch (method) {
        case actionType.AUTH_LOGIN :
            url = '/auth/login';
            return AuthLogin(url, state).then(resp => {
                return resp
            });
        case actionType.AUTH_INFO :
            url = '/auth/info';
            await AuthInfo(url, state);
            break;
        case actionType.ACCOUNT_GET :
            url = '/account';
            await getData(url, state, params);
            break;
        case actionType.ACCOUNT_STORE :
            url = '/account';
            await storeData(url, state);
            break;
        case actionType.ACCOUNT_UPDATE :
            url = `/account/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.ACCOUNT_DELETE :
            url = `/account/${state.id}`;
            await deleteData(url, state);
            break;
        case actionType.CATEGORY_GET :
            url = '/category';
            await getData(url, state, params);
            break;
        case actionType.CATEGORY_STORE :
            url = '/category';
            await storeData(url, state);
            break;
        case actionType.CATEGORY_UPDATE :
            url = `/category/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.CATEGORY_DELETE :
            url = `/category/${state.id}`;
            await deleteData(url, state);
            break;
        case actionType.PRODUCT_GET :
            url = '/product';
            return await getData(url, state, params).then(resp => {
                return resp
            });
        case actionType.PRODUCT_STORE :
            url = '/product';
            await storeData(url, state);
            break;
        case actionType.PRODUCT_UPDATE :
            url = `/product/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.PRODUCT_DELETE :
            url = `/product/${state.id}`;
            await deleteData(url, state);
            break;
        case actionType.ORDER_GET :
            url = '/order';
            await getData(url, state, params);
            break;
        case actionType.ORDER_STORE :
            url = '/order';
            await storeData(url, state);
            break;
        case actionType.ORDER_UPDATE :
            url = `/order/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.ORDER_DELETE :
            url = `/order/${state.id}`;
            await deleteData(url, state);
            break;
        case actionType.MEMBER_GET :
            url = '/member';
            return await getData(url, state, params).then(resp => {
                return resp
            });
        case actionType.MEMBER_STORE :
            url = '/member';
            await storeData(url, state);
            break;
        case actionType.MEMBER_UPDATE :
            url = `/member/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.MEMBER_DELETE :
            url = `/member/${state.id}`;
            await deleteData(url, state);
            break;
        case actionType.INVOICE_GET :
            url = '/invoice';
            return await getData(url, state, params).then(resp => {
                return resp
            });
        case actionType.INVOICE_STORE :
            url = '/invoice';
            await storeData(url, state);
            break;
        case actionType.INVOICE_UPDATE :
            url = `/invoice/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.INVOICE_DELETE :
            url = `/invoice/${state.id}`;
            await deleteData(url, state);
            break;
        case actionType.INVOICE_SEND_NOTIFY :
            url = `/invoice/send-notification/${state.id}`;
            await notifyData(url, state);
            break;
        case actionType.PAYMENT_GET :
            url = '/payment';
            return await getData(url, state, params).then(resp => {
                return resp
            });
        case actionType.PAYMENT_STORE :
            url = '/payment';
            return await storeData(url, state).then(resp => {
                return resp
            });
        case actionType.PAYMENT_UPDATE :
            url = `/payment/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.PAYMENT_DELETE :
            url = `/payment/${state.id}`;
            await deleteData(url, state);
            break;
        case actionType.CASHFLOW_GET :
            url = '/cashflow';
            return await getData(url, state, params).then(resp => {
                return resp
            });
        case actionType.CASHFLOW_STORE :
            url = '/cashflow';
            return await storeData(url, state).then(resp => {
                return resp
            });
        case actionType.CASHFLOW_UPDATE :
            url = `/cashflow/${state.formData.id}`;
            await updateData(url, state);
            break;
        case actionType.CASHFLOW_DELETE :
            url = `/cashflow/${state.id}`;
            await deleteData(url, state);
            break;
        default:
    }
}
export {Dispatch, actionType}