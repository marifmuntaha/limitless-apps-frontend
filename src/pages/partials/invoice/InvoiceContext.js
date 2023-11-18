import React, {useState, createContext, useEffect} from "react";
import { Outlet } from "react-router-dom";

export const InvoiceContext= createContext({});

export const InvoiceProvider = () => {
    const [invoices, setInvoices] = useState([]);
    const [unpaidSum, setUnpaidSum] = useState(0);
    const [reload, setReload] = useState(true);
    useEffect(() => {
        let unpaid = invoices.filter((invoice) => {
            return invoice.status === '2'
        });
        setUnpaidSum(unpaid.reduce((total, currentItem) => (total + currentItem.amount), 0));
    }, [invoices]);
    return <InvoiceContext.Provider value={{invoices, setInvoices, unpaidSum, setUnpaidSum, reload, setReload}}>
        <Outlet />
    </InvoiceContext.Provider>;
};
