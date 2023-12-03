import React, {useContext, useEffect, useState} from "react";
import {
    BlockBetween,
    BlockHead,
    BlockHeadContent, BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable
} from "../../../components";
import {Badge, Button, ButtonGroup, Spinner} from "reactstrap";
import {Currency} from "../../../utils/Utils";
import AddInvoice from "../../invoice/Add";
import EditInvoice from "../../invoice/Edit";
import AddPayment from "../../partials/payment/Add"
import moment from "moment";
import {useNavigate} from "react-router-dom";
import {MemberContext} from "../../member/MemberContext";
import {actionType, Dispatch} from "../../../reducer";

const Invoice = ({reload, setReload}) => {
    const {member} = useContext(MemberContext);
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        pay: false,
    });
    const [invoices, setInvoices] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const [loadingDelete, setLoadingDelete] = useState(0);
    const [loadingNotify, setLoadingNotify] = useState(0);
    const Columns = [
        {
            name: "Nomor",
            selector: (row) => "#" + row.number,
            sortable: true,
            hide: "sm"
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
            hide: "sm",
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: false,
            hide: "sm",
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
            hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    {(row.status === '2' || row.status === '4') && (
                        <Button
                            color="outline-info"
                            onClick={() => {
                                setInvoice(row);
                                setModal({
                                    add: false,
                                    edit: false,
                                    pay: true
                                });
                            }}
                        >
                            <Icon name="cc-alt"/>
                        </Button>
                    )}
                    <Button
                        color="outline-success"
                        onClick={() => Dispatch(actionType.INVOICE_SEND_NOTIFY, {
                            id: row.id,
                            setLoading: setLoadingNotify
                        })}
                        disabled={row.id === loadingNotify}
                    >
                        {row.id === loadingNotify ? <Spinner size="sm" color="success"/> : <Icon name="whatsapp"/>}
                    </Button>
                </ButtonGroup>
            )
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            compact: false,
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
                        onClick={() => {
                            setInvoice(row);
                            setModal({
                                add: false,
                                edit: true,
                                pay: false
                            });
                        }}
                    >
                        <Icon name="edit"/>
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => Dispatch(actionType.INVOICE_DELETE, {
                            id: row.id,
                            setLoading: setLoadingDelete,
                            setReload: setReload
                        })}
                        disabled={row.id === loadingDelete}
                    >
                        {row.id === loadingDelete ? <Spinner size="sm" color="danger"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const navigation = useNavigate();

    useEffect(() => {
        member.id && Dispatch(actionType.INVOICE_GET,
            {setData: setInvoices},
            {member: member.id}).then(() => setReload(false));
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
            <ReactDataTable data={invoices} columns={Columns} pagination onLoad={reload}/>
        </PreviewCard>
        <AddInvoice open={modal.add} setOpen={setModal} datatable={setReload}/>
        <EditInvoice open={modal.edit} setOpen={setModal} datatable={setReload} invoice={invoice}/>
        <AddPayment open={modal.pay} setOpen={setModal} datatable={setReload} invoice={invoice}/>
    </>
}

export default Invoice