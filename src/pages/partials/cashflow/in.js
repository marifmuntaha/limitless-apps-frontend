import React, {useEffect, useState} from "react";
import {Icon, ReactDataTable, toastSuccess} from "../../../components";
import axios from "axios";
import HandleError from "../../auth/handleError";
import {Button, ButtonGroup, Spinner} from "reactstrap";
import {Currency, setDateForPicker} from "../../../utils/Utils";
import modal from "bootstrap/js/src/modal";
import moment from "moment";
const In = ({reload, setReload, setModal, setCashflow, startDate, endDate}) => {
    const [loading, setLoading] = useState({
        show: '',
        delete: ''
    });
    const [cashflows, setCashflows] = useState([]);
    const Columns = [
        {
            name: "Tanggal",
            selector: (row) => moment(row.created_at, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            sortable: false,
            hide: "sm",
        },
        {
            name: "Diskripsi",
            selector: (row) => row.desc,
            sortable: false,
            grow: 2
        },

        {
            name: "Jumlah",
            selector: (row) => Currency(row.amount),
            sortable: false,
            hide: 370,
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            hide: 370,
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-info"
                        onClick={() => handleCashflowShow(row.id)}
                        disabled={row.id === loading.show}

                    >
                        {row.id === loading.show ? <Spinner size="sm" color="info"/> : <Icon name="edit"/>}
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleCashflowDelete(row.id)}
                        disabled={row.id === loading.delete}
                    >
                        {row.id === loading.delete ? <Spinner size="sm" color="danger"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleCashflowData = async () => {
        await axios.get(`/cashflow`, {
            params: {
                type: '1',
                start: setDateForPicker(startDate),
                end: setDateForPicker(endDate),
            },
        }).then(resp => {
            setCashflows(resp.data.result);
        }).catch(error => HandleError(error));
    }
    const handleCashflowShow = async (id) => {
        setLoading({
            ...loading, show: id
        });
        await axios.get(`/cashflow/${id}`).then(resp => {
            setCashflow(resp.data.result);
            setModal({
                ...modal, edit: true
            });
            setLoading({
                ...loading, show: ''
            });
        }).catch(error => {
            HandleError(error);
            setLoading({
                ...loading, show: ''
            });
        });
    }
    const handleCashflowDelete = async (id) => {
        setLoading({
            ...loading, delete: id
        });
        await axios.delete(`/cashflow/${id}`).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
            setLoading({
                ...loading, delete: ''
            });
        }).catch(error => {
            HandleError(error);
            setLoading({
                ...loading, delete: ''
            });
        });
    }
    useEffect(() => {
        reload && handleCashflowData().then(() => setReload(false));
        // eslint-disable-next-line
    }, [reload, startDate, endDate]);
    return <>
        <ReactDataTable data={cashflows} columns={Columns} className="nk-tb-list" onLoad={reload}/>
    </>
}
export default In;