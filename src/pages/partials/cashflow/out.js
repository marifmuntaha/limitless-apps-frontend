import React, {useEffect, useState} from "react";
import {Icon, ReactDataTable, toastSuccess} from "../../../components";
import {Currency, setDateForPicker} from "../../../utils/Utils";
import {Button, ButtonGroup} from "reactstrap";
import axios from "axios";
import HandleError from "../../auth/handleError";

const Out = ({reload, setReload, setModal, setCashflow, startDate, endDate}) => {
    const [cashflows, setCashflows] = useState([]);
    const Columns = [
        {
            name: "Tanggal",
            selector: (row) => row.created,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Diskripsi",
            selector: (row) => row.desc,
            sortable: false,
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

                    >
                        <Icon name="edit"/></Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleCashflowDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleCashflowData = async () => {
        await axios.get(`/cashflow`, {
            params: {
                type: '2',
                start: setDateForPicker(startDate),
                end: setDateForPicker(endDate),
            },
        })
            .then(resp => setCashflows(resp.data.result))
            .catch(error => HandleError(error));
    }
    const handleCashflowShow = async (id) => {
        await axios.get(`/cashflow/${id}`, {})
            .then(resp => {
                setCashflow(resp.data.result);
                setModal({
                    add: false,
                    edit: true
                })
            }).catch(error => HandleError(error));
    }
    const handleCashflowDelete = async (id) => {
        await axios.delete(`/cashflow/${id}`, {}).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        reload && handleCashflowData().then(() => setReload(false));
        // eslint-disable-next-line
    }, [reload, startDate, endDate]);
    return <>
        <ReactDataTable data={cashflows} columns={Columns} pagination className="nk-tb-list"/>
    </>
}
export default Out;