import React, {useEffect, useState} from "react";
import {
    BlockBetween,
    BlockHead,
    BlockHeadContent, BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable, toastSuccess
} from "../../../components";
import {Badge, Button, ButtonGroup} from "reactstrap";
import {Currency} from "../../../utils/Utils";
import axios from "axios";
import HandleError from "../../auth/handleError";
import AddInvoice from "../../invoice/Add";
import EditInvoice from "../../invoice/Edit";
import AddPayment from "../../partials/payment/Add"
import moment from "moment";
import {useNavigate} from "react-router-dom";

const Invoice = ({member, reload, setReload}) => {
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        pay: false,
    });
    const [invoices, setInvoices] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const Columns = [
        {
            name: "Nomor",
            selector: (row) => "#" + row.number,
            sortable: true,
        },
        {
            name: "Layanan",
            selector: (row) => row.desc,
            sortable: true,
        },
        {
            name: "Jumlah",
            selector: (row) => Currency(row.amount),
            sortable: false,
            hide: "sm",
        },
        {
            name: "Jatuh Tempo",
            selector: (row) => moment(row.due, 'YYYY-MM-DD').format('DD-MM-YYYY'),
            sortable: false,
            hide: 370,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            hide: 370,
            cell: (row) => (
                <Badge
                    className="badge-dot"
                    color={row.status === '1' ? 'success' : row.status === '2' ? 'warning' : row.status === '3' ? 'gray' : 'danger'}
                >
                    {row.status === '1' ? 'paid' : row.status === '2' ? 'unpaid' : row.status === '3' ? 'cancel' : 'danger'}
                </Badge>
            )
        },
        {
            name: "Bayar & Kirim",
            selector: (row) => row.id,
            sortable: false,
            hide: 370,
            cell: (row) => (
                <ButtonGroup size="sm">
                    {(row.status === '2' || row.status === '4') && (
                        <Button
                            color="outline-info"
                            onClick={() => handlePaymentShow(row.id)}
                        >
                            <Icon name="cc-alt"/>
                        </Button>
                    )}
                    <Button
                        color="outline-success"
                        onClick={() => handleNotificationSend(row.id)}
                    >
                        <Icon name="whatsapp"/>
                    </Button>
                </ButtonGroup>
            )
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    <Button
                        color="outline-info"
                        onClick={() => navigation(`${process.env.PUBLIC_URL}/tagihan/${row.id}`)}
                    >
                        <Icon name="eye"/>
                    </Button>
                    <Button
                        color="outline-warning"
                        onClick={() => handleInvoiceShow(row.id)}
                    >
                        <Icon name="edit"/>
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleInvoiceDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleInvoiceData = async () => {
        await axios.get(`/invoice`, {
            params: {
                member: member.id
            },
        })
            .then(resp => setInvoices(resp.data.result))
            .catch(error => HandleError(error));
    }
    const handleInvoiceShow = async (id) => {
        await axios.get(`/invoice/${id}`, {}).then(resp => {
            setInvoice(resp.data.result);
            setModal({
                add: false,
                edit: true,
                pay: false
            });
        }).catch(error => HandleError(error));
    }
    const handleInvoiceDelete = async (id) => {
        await axios.delete(`/invoice/${id}`, {}).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
        }).catch(error => HandleError(error));
    }
    const handlePaymentShow = async (id) => {
        await axios.get(`/invoice/${id}`, {}).then(resp => {
            setInvoice(resp.data.result);
            setModal({
                add: false,
                edit: false,
                pay: true
            });
        }).catch(error => HandleError(error));
    }
    const handleNotificationSend = async (id) => {
        await axios.post(`/invoice/send-notification/${id}`, null, {}).then(resp => {
            toastSuccess(resp.data.message);
        }).catch(error => HandleError(error));
    }
    const navigation = useNavigate();

    useEffect(() => {
        handleInvoiceData().then(() => setReload(false));
        // eslint-disable-next-line
    }, [reload, member]);
    return <>
        <BlockHead>
            <BlockBetween>
                <BlockHeadContent>
                    <BlockHead>
                        <BlockTitle tag="h5">Tagihan</BlockTitle>
                        <p>Basic info, like your name and address, that you use on Nio
                            Platform.</p>
                    </BlockHead>
                </BlockHeadContent>
                <BlockHeadContent>
                    <div className="toggle-wrap nk-block-tools-toggle">
                        <Button
                            color="secondary"
                            onClick={() => setModal({
                                add: true,
                                edit: false,
                                pay: false
                            })}
                        >
                            <Icon name="plus"/>
                            <span>Tambah</span>
                        </Button>
                    </div>
                </BlockHeadContent>
            </BlockBetween>
        </BlockHead>
        <PreviewCard>
            <ReactDataTable data={invoices} columns={Columns} expandableRows pagination/>
        </PreviewCard>
        <AddInvoice open={modal.add} setOpen={setModal} datatable={setReload} member={member}/>
        <EditInvoice open={modal.edit} setOpen={setModal} datatable={setReload} invoice={invoice}/>
        <AddPayment open={modal.pay} setOpen={setModal} datatable={setReload} invoice={invoice}/>
    </>
}

export default Invoice