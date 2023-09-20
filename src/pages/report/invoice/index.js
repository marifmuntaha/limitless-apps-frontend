import React, {useEffect, useState} from "react";
import Head from "../../../layout/head";
import Content from "../../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    PreviewCard, ReactDataTable,
    Row,
    RSelect
} from "../../../components";
import {Badge, Col} from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment/moment";
import {Currency, setDateForPicker} from "../../../utils/Utils";
import axios from "axios";
import HandleError from "../../auth/handleError";

const Invoice = () => {
    const [reload, setReload] = useState(true);
    const [startDate, setStartDate] = useState(moment().startOf('month').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('month').toDate());
    const [invoices, setInvoices] = useState([]);
    const [statusSelected, setStatusSelected] = useState([]);
    const statusOption = [
        {value: '1', label: 'Lunas'},
        {value: '2', label: 'Belum Lunas'},
        {value: '3', label: 'Batal'},
        {value: '4', label: 'Jatuh Tempo'},
    ];
    const Columns = [
        {
            name: "Jatuh Tempo",
            selector: (row) => row.due,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Nama",
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
            name: "Layanan",
            selector: (row) => row.desc,
            sortable: false,
            hide: 370,
        },
        {
            name: "Harga",
            selector: (row) => Currency(row.price),
            sortable: false,
            hide: 370,
        },
        {
            name: "Diskon",
            selector: (row) => Currency(row.discount),
            sortable: false,
            hide: 370,
        },
        {
            name: "Biaya Admin",
            selector: (row) => Currency(row.fees),
            sortable: false,
            hide: 370,
        },
        {
            name: "Total",
            selector: (row) => Currency(row.amount),
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
                state = 'grey'
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
            params: {
                status: statusSelected.value,
                start: setDateForPicker(startDate),
                end: setDateForPicker(endDate)
            }
        }).then(resp => {
            setInvoices(resp.data.result);
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        reload && handleInvoiceData().then(() => setReload(false));
        // eslint-disable-next-line
    }, [reload]);
    return <>
        <Head title="Laporan Tagihan"/>
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
                </BlockBetween>
            </BlockHead>
            <PreviewCard>
                <div className="form-group">
                    <Row className="gy-4">
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={startDate}
                                    onChange={(e) => {
                                        setStartDate(e);
                                        setReload(true);
                                    }}
                                    className="form-control date-picker"
                                />{" "}
                            </div>
                        </Col>
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <DatePicker
                                    dateFormat="dd/MM/yyyy"
                                    selected={endDate}
                                    onChange={(e) => {
                                        setEndDate(e);
                                        setReload(true);
                                    }}
                                    className="form-control date-picker"
                                />{" "}
                            </div>
                        </Col>
                        <Col sm="2">
                            <div className="form-control-wrap">
                                <RSelect
                                    options={statusOption}
                                    onChange={(e) => {
                                        setStatusSelected(e);
                                        setReload(true);
                                    }}
                                    value={statusSelected}
                                    placeholder="Pilih Status"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <ReactDataTable data={invoices} columns={Columns} pagination actions className="nk-tb-list" onLoad={reload}/>
            </PreviewCard>
        </Content>
    </>
}
export default Invoice;