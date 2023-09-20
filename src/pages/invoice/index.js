import React, {useEffect, useState} from "react";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon,
    PreviewCard,
    ReactDataTable, RSelect, toastSuccess
} from "../../components";
import {Badge, Button, ButtonGroup, Col, Row, Spinner} from "reactstrap";
import axios from "axios";
import HandleError from "../auth/handleError";
import {Currency} from "../../utils/Utils";
import {useNavigate} from "react-router-dom";
import Pay from "../partials/payment/Add"
import Add from "./Add";
import {ToastContainer} from "react-toastify";
import Edit from "./Edit";

const Invoice = () => {
    const [sm, updateSm] = useState(false);
    const [reload, setReload] = useState(true);
    const [filter, setFilter] = useState({
        year: '0',
        month: '0',
        status: '0',
    });
    const [modal, setModal] = useState({
        add: false,
        edit: false,
        pay: false,
    });
    const [invoices, setInvoices] = useState([]);
    const [invoice, setInvoice] = useState([]);
    const yearOption = [
        {value: '', label: 'Semua'},
        {value: '2023', label: '2023'},
        {value: '2024', label: '2024'},
        {value: '2025', label: '2025'},
        {value: '2026', label: '2026'},
    ]
    const monthOption = [
        {value: '', label: 'Semua'},
        {value: '01', label: 'Januari'},
        {value: '02', label: 'Februari'},
        {value: '03', label: 'Maret'},
        {value: '04', label: 'April'},
        {value: '05', label: 'Mei'},
        {value: '06', label: 'Juni'},
        {value: '07', label: 'Juli'},
        {value: '08', label: 'Agustus'},
        {value: '09', label: 'September'},
        {value: '10', label: 'Oktober'},
        {value: '11', label: 'November'},
        {value: '12', label: 'Desember'},
    ]
    const statusOption = [
        {value: '', label: 'Semua'},
        {value: '1', label: 'Lunas'},
        {value: '2', label: 'Belum Lunas'},
        {value: '3', label: 'Batal'},
        {value: '4', label: 'Jatuh Tempo'},
    ]
    const [loading, setLoading] = useState({
        show: '',
        delete: '',
        pay: '',
        notify: ''
    });
    const navigate = useNavigate();
    const Columns = [
        {
            name: "No. Tagihan",
            selector: (row) => row.number,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Nama Pelanggan",
            selector: (row) => row.member.name,
            sortable: false,
        },
        {
            name: "Alamat",
            selector: (row) => row.member.address,
            sortable: false,
            hide: 370,
        },
        {
            name: "Produk",
            selector: (row) => row.desc,
            sortable: false,
            hide: 370,
        },
        {
            name: "Harga",
            selector: (row) => Currency(row.amount),
            sortable: false,
            hide: 370,
        },
        {
            name: "Jatuh Tempo",
            selector: (row) => row.due,
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
                    color={handleInvoiceStatusColor(row.status)}
                >
                    {handleInvoiceStatusText(row.status)}
                </Badge>
            )
        },
        {
            name: "Byr & Kirim",
            selector: (row) => row.id,
            sortable: false,
            hide: 370,
            cell: (row) => (
                <ButtonGroup size="sm">
                    {row.status === '2' && (
                        <Button
                            color="outline-info"
                            onClick={() => handlePaymentShow(row.id)}
                            disabled={row.id === loading.pay}
                        >
                            {row.id === loading.pay ? <Spinner size="sm" color="info"/> :  <Icon name="cc-alt"/>}
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
                        onClick={() => {
                            navigate(`${process.env.PUBLIC_URL}/tagihan/${row.id}`)
                        }}

                    >
                        <Icon name="eye"/></Button>
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
    const handleInvoiceStatusText = (status) => {
        let state = '';
        switch (status) {
            case '1':
                state = 'paid'
                break;
            case '2':
                state = 'unpaid'
                break;
            case '3':
                state = 'cancel'
                break;
            case '4':
                state = 'overdue'
                break;
            default :
                state = ''
        }
        return state;
    }
    const handleInvoiceStatusColor = (status) => {
        let state = '';
        switch (status) {
            case '1':
                state = 'success'
                break;
            case '2':
                state = 'warning'
                break;
            case '3':
                state = 'light'
                break;
            case '4':
                state = 'danger'
                break;
            default :
                state = ''
        }
        return state;
    }
    const handleInvoiceData = async () => {
        await axios.get(`/invoice`, {
            params: filter,
        }).then(resp => {
            setInvoices(resp.data.result);
            setReload(false);
        }).catch(error => HandleError(error));
    }
    const handleInvoiceShow = async (id) => {
        setLoading({
            ...loading, show: id
        });
        await axios.get(`/invoice/${id}`).then(resp => {
            setInvoice(resp.data.result);
            setModal({
                ...modal, edit: true,
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
        });
        await axios.delete(`/invoice/${id}`).then(resp => {
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
    const handlePaymentShow = async (id) => {
        setLoading({
            ...loading, pay: id
        });
        await axios.get(`/invoice/${id}`).then(resp => {
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

    useEffect(() => {
        reload &&
        handleInvoiceData();
        // eslint-disable-next-line
    }, [reload]);

    return <>
        <Head title="Tagihan"/>
        <Content>
            <BlockHead size="lg" wide="sm">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">
                        DASHBOARD
                    </BackTo>
                </BlockHeadContent>
            </BlockHead>
            <BlockHead>
                <BlockBetween>
                    <BlockHeadContent>
                        <BlockTitle tag="h4">Data Tagihan</BlockTitle>
                        <p>
                            Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for
                            react dashlite.
                        </p>
                    </BlockHeadContent>
                    <BlockHeadContent>
                        <div className="toggle-wrap nk-block-tools-toggle">
                            <Button
                                className={`btn-icon btn-trigger toggle-expand me-n1 ${sm ? "active" : ""}`}
                                onClick={() => updateSm(!sm)}
                            >
                                <Icon name="menu-alt-r"></Icon>
                            </Button>
                            <div className="toggle-expand-content" style={{display: sm ? "block" : "none"}}>
                                <ul className="nk-block-tools g-3">
                                    <li
                                        className="nk-block-tools-opt"
                                        onClick={() => setModal({
                                            ...modal, add: true,
                                        })}
                                    >
                                        <Button color="secondary">
                                            <Icon name="plus"></Icon>
                                            <span>Tambah</span>
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </BlockHeadContent>
                </BlockBetween>
            </BlockHead>
            <PreviewCard>
                <div className="form-group">
                    <Row className="gy-4">
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <RSelect
                                    options={yearOption}
                                    onChange={(e) => {
                                        setFilter({...filter, year: e.value});
                                        setReload(true);
                                    }}
                                    placeholder="Tahun"
                                />
                            </div>
                        </Col>
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <RSelect
                                    options={monthOption}
                                    onChange={(e) => {
                                        setFilter({...filter, month: e.value});
                                        setReload(true);
                                    }} s
                                    placeholder="Bulan"
                                />
                            </div>
                        </Col>
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <RSelect
                                    options={statusOption}
                                    onChange={(e) => {
                                        setFilter({...filter, status: e.value});
                                        setReload(true);
                                    }}
                                    placeholder="Status"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <ReactDataTable data={invoices} columns={Columns} pagination className="nk-tb-list" selectableRows onLoad={reload}/>
            </PreviewCard>
            <Add open={modal.add} setOpen={setModal} datatable={setReload}/>
            <Edit open={modal.edit} setOpen={setModal} datatable={setReload} invoice={invoice}/>
            <Pay open={modal.pay} setOpen={setModal} datatable={setReload} invoice={invoice}/>

        </Content>
        <ToastContainer/>
    </>
}

export default Invoice