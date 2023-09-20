import React, {useEffect, useState} from "react";
import {
    BlockBetween,
    BlockHead,
    BlockHeadContent, BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable, toastSuccess
} from "../../../components";
import {Badge, Button, ButtonGroup, Spinner} from "reactstrap";
import {Currency} from "../../../utils/Utils";
import axios from "axios";
import HandleError from "../../auth/handleError";
import AddInvoice from "../../invoice/Add";
import EditInvoice from "../../invoice/Edit";
import AddPayment from "../../partials/payment/Add"
import moment from "moment";
import {useNavigate} from "react-router-dom";

const Invoice = ({member, reload, setReload}) => {
    const [loading, setLoading] = useState({
        show: '',
        delete: '',
        pay: '',
        notify: ''
    });
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
                            disabled={loading.pay === row.id}
                        >
                            {loading.pay === row.id ? <Spinner size="sm" color="info"/> : <Icon name="cc-alt"/>}
                        </Button>
                    )}
                    <Button
                        color="outline-success"
                        onClick={() => handleNotificationSend(row.id)}
                        disabled={row.id === loading.notify}
                    >
                        {row.id === loading.notify ? <Spinner size="sm" color="success"/> : <Icon name="whatsapp"/>}
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
                        disabled={row.id === loading.show}
                    >
                        {row.id === loading.show ? <Spinner size="sm" color="warning"/> : <Icon name="edit"/>}
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleInvoiceDelete(row.id)}
                        disabled={row.id === loading.delete}
                    >
                        {row.id === loading.delete ? <Spinner size="sm" color="danger"/> : <Icon name="trash"/>}
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
        }).then(resp => {
            setInvoices(resp.data.result);
        }).catch(error => HandleError(error));
    }
    const handleInvoiceShow = async (id) => {
        setLoading({
            ...loading, show: id
        })
        await axios.get(`/invoice/${id}`).then(resp => {
            setInvoice(resp.data.result);
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
    const handleInvoiceDelete = async (id) => {
        setLoading({
            ...loading, delete: id
        })
        await axios.delete(`/invoice/${id}`).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
            setLoading({
                ...loading, delete: ''
            })
        }).catch(error => {
            HandleError(error);
            setLoading({
                ...loading, delete: ''
            })
        });
    }
    const handlePaymentShow = async (id) => {
        setLoading({
            ...loading, pay: id
        });
        await axios.get(`/invoice/${id}`, {}).then(resp => {
            setInvoice(resp.data.result);
            setModal({
                ...modal, pay: true
            });
            setLoading({
                ...loading, pay: ''
            });
        }).catch(error => {
            HandleError(error);
            setLoading({
                ...loading, pay: ''
            });
        });
    }
    const handleNotificationSend = async (id) => {
        setLoading({
            ...loading, notify: id
        });
        await axios.post(`/invoice/send-notification/${id}`).then(resp => {
            toastSuccess(resp.data.message);
            setLoading({
                ...loading, notify: ''
            });
        }).catch(error => {
            HandleError(error);
            setLoading({
                ...loading, notify: ''
            });
        });
    }
    const navigation = useNavigate();

    useEffect(() => {
        member.id && handleInvoiceData().then(() => setReload(false));
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
                                ...modal, add: true
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
            <ReactDataTable data={invoices} columns={Columns} expandableRows pagination onLoad={reload}/>
        </PreviewCard>
        <AddInvoice open={modal.add} setOpen={setModal} datatable={setReload} member={member}/>
        <EditInvoice open={modal.edit} setOpen={setModal} datatable={setReload} invoice={invoice}/>
        <AddPayment open={modal.pay} setOpen={setModal} datatable={setReload} invoice={invoice}/>
    </>
}

export default Invoice