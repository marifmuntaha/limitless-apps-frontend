import React, {useContext, useEffect, useState} from "react";
import {
    BlockBetween,
    BlockHead,
    BlockHeadContent, BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable, toastSuccess
} from "../../../components";
import {Badge, Button, ButtonGroup, Spinner} from "reactstrap";
import {Currency, monthNames, setDateForPicker} from "../../../utils/Utils";
import axios from "axios";
import HandleError from "../../auth/handleError";
import Add from "./Add";
import Edit from "./Edit";
import moment from "moment";
import {MemberContext} from "../../member/MemberContext";
import {actionType, Dispatch} from "../../../reducer";

const Order = ({setReloadInvoice}) => {
    const {member} = useContext(MemberContext);
    const [loading, setLoading] = useState({
        invoice: '',
        show: '',
        delete: ''
    });
    const [loadingSubmit, setLoadingSubmit] = useState(0);
    const [loadingDelete, setLoadingDelete] = useState(0);
    const [reload, setReload] = useState(true);
    const [modal, setModal] = useState({
        add: false,
        edit: false
    });
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState([]);
    const Columns = [
        {
            name: "Kode Produk",
            selector: (row) => row.product.code,
            sortable: true,
        },
        {
            name: "Nama Produk",
            selector: (row) => row.product.name,
            sortable: true,
        },
        {
            name: "Siklus Tagihan",
            selector: (row) => row.cycle,
            sortable: false,
            hide: 370,
            cell: (row) => (
                <Badge className="badge-dot" color={row.status === '1' ? 'success' : 'danger'}>
                    {row.cycle === '1' ? 'Bulanan' : row.cycle === '2' ? '3 Bulan' : row.cycle === '3' ? '6 Bulan' : 'Tahunan'}
                </Badge>
            )
        },
        {
            name: "Harga",
            selector: (row) => Currency(row.price),
            sortable: false,
            hide: "sm",
        },
        {
            name: "Aksi",
            selector: (row) => row.id,
            sortable: false,
            hide: "sm",
            cell: (row) => (
                <ButtonGroup size="sm">
                    {row.status === '1' && (
                        <Button
                            color="outline-info"
                            onClick={() => {
                                setLoadingSubmit(row.id)
                                Dispatch(actionType.INVOICE_GET, {}, {
                                    member: member.id, product: row.product.id
                                }).then(resp => {
                                    let invoice = resp.pop();
                                    let due = invoice
                                        ? moment(invoice.due, 'YYYY-MM-DD').add(1, 'months').toDate()
                                        : moment(order.due, 'YYYY-MM-DD').toDate();
                                    Dispatch(actionType.INVOICE_STORE, {
                                        formData: {
                                            member: member.id,
                                            product: row.product.id,
                                            desc: row.product.name + '-' + monthNames[due.getMonth()] + due.getFullYear(),
                                            price: row.price,
                                            amount: row.price,
                                            status: '1',
                                            due: setDateForPicker(due),
                                        },
                                        setLoading: setLoadingSubmit,
                                        setReload: setReloadInvoice
                                    }).then(() => setLoadingSubmit(0));
                                });
                            }}
                            disabled={row.id === loadingSubmit}
                        >
                            {row.id === loadingSubmit ? <Spinner size="sm" color="info"/> : <Icon name="ticket"/>}
                        </Button>
                    )}
                    <Button
                        color="outline-warning"
                        onClick={() => {
                            setOrder(row);
                            setModal({
                                add: false,
                                edit: true
                            });
                        }}
                    >
                        <Icon name="edit"/>
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => Dispatch(actionType.ORDER_DELETE, {
                            id: row.id,
                            setReload: setReload,
                            setLoading: setLoadingDelete
                        })}
                        disabled={row.id === loadingDelete}
                    >
                        {row.id === loadingDelete ? <Spinner size="sm" color="danger"/> : <Icon name="trash"/>}
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleOrderShow = async (id) => {
        setLoading({
            ...loading, show: id
        });
        await axios.get(`/order/${id}`).then(resp => {
            setOrder(resp.data.result);
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
    const handleOrderDelete = async (id) => {
        setLoading({
            ...loading, delete: id
        });
        await axios.delete(`/order/${id}`).then(resp => {
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
        member.id && Dispatch(actionType.ORDER_GET,
            {setData: setOrders},
            {member: member.id}).then(() => setReload(false));
    }, [reload, member]);
    return <>
        <BlockHead>
            <BlockBetween>
                <BlockHeadContent>
                    <BlockHead>
                        <BlockTitle tag="h5">Produk</BlockTitle>
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
                                edit: false
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
            {order && (
                <ReactDataTable data={orders} columns={Columns} expandableRows pagination onLoad={reload}/>
            )}
        </PreviewCard>
        <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
        <Edit open={modal.edit} setOpen={setModal} datatable={setReload} order={order}/>
    </>
}

export default Order