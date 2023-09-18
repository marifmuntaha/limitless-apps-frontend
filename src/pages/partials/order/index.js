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
import {Currency, monthNames, setDateForPicker} from "../../../utils/Utils";
import axios from "axios";
import HandleError from "../../auth/handleError";
import Add from "./Add";
import Edit from "./Edit";
import moment from "moment";

const Order = ({member, setReloadInvoice}) => {
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
                            onClick={() => handleInvoiceSubmit(row)}
                        >
                            <Icon name="ticket"/>
                        </Button>
                    )}
                    <Button
                        color="outline-warning"
                        onClick={() => handleOrderShow(row.id)}
                    >
                        <Icon name="edit"/>
                    </Button>
                    <Button
                        color="outline-danger"
                        onClick={() => handleOrderDelete(row.id)}
                    >
                        <Icon name="trash"/>
                    </Button>
                </ButtonGroup>
            )
        },
    ];
    const handleOrdersData = async () => {
        await axios.get(`/order`, {
            params: {
                member: member.id
            },
        }).then(resp => setOrders(resp.data.result))
            .catch(error => HandleError(error));
    }
    const handleOrderShow = async (id) => {
        await axios.get(`/order/${id}`, {}).then(resp => {
            setOrder(resp.data.result);
            setModal({
                add: false,
                edit: true
            });
        }).catch(error => {
            HandleError(error);
        });
    }
    const handleOrderDelete = async (id) => {
        await axios.delete(`/order/${id}`, {}).then(resp => {
            toastSuccess(resp.data.message);
            setReload(true);
        }).catch(error => HandleError(error));
    }
    const handleInvoiceSubmit = async (order) => {
        await axios.get(`/invoice`, {
            params: {
                member: member.id,
                product: order.product.id
            },
        }).then(resp => {
            let invoice = resp.data.result.pop();
            let due = invoice ?
                moment(invoice.due, 'YYYY-MM-DD').add(1, 'months').toDate() :
                moment(order.due, 'YYYY-MM-DD').toDate();
            axios.post(`/invoice`, {
                member: member.id,
                product: order.product.id,
                desc: order.product.name + '-' + monthNames[due.getMonth()] + due.getFullYear(),
                price: order.price,
                amount: order.price,
                status: '1',
                due: setDateForPicker(due),
            }, {}).then(resp => {
                toastSuccess(resp.data.message);
                setReloadInvoice(true);
            }).catch(error => HandleError(error));
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        handleOrdersData().then(() => setReload(false));
        // eslint-disable-next-line
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
            <ReactDataTable data={orders} columns={Columns} expandableRows pagination onLoad={reload}/>
        </PreviewCard>
        <Add open={modal.add} setOpen={setModal} datatable={setReload} member={member}/>
        <Edit open={modal.edit} setOpen={setModal} datatable={setReload} order={order}/>
    </>
}

export default Order