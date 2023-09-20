import React, {useEffect, useState} from "react";
import Head from "../../../layout/head";
import Content from "../../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle, PreviewCard, ReactDataTable,
    Row, RSelect
} from "../../../components";
import {Col} from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import axios from "axios";
import HandleError from "../../auth/handleError";
import {Currency, setDateForPicker} from "../../../utils/Utils";

const Payment = () => {
    const [reload, setReload] = useState(true);
    const [startDate, setStartDate] = useState(moment().startOf('month').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('month').toDate());
    const [methodOption, setMethodOption] = useState([]);
    const [methodSelected, setMethodSelected] = useState([]);
    const [payments, setPayments] = useState([]);
    const Columns = [
        {
            name: "Tanggal",
            selector: (row) => row.at,
            sortable: false,
            hide: "sm",
        },
        {
            name: "Jumlah",
            selector: (row) => Currency(row.amount),
            sortable: false,
        },
        {
            name: "Nama",
            selector: (row) => row.invoice.member.name,
            sortable: false,
            hide: 370,
        },
        {
            name: "Alamat",
            selector: (row) => row.invoice.member.address,
            sortable: false,
            hide: 370,
        },
        {
            name: "Layanan",
            selector: (row) => row.invoice.desc,
            sortable: false,
            hide: 600,
        },
        {
            name: "Metode",
            selector: (row) => row.method.bank,
            sortable: false,
            hide: 370,
        },
    ];
    const handleMethodOption = async () => {
        await axios.get(`/account`, {
            params: {
                type: 'select'
            }
        }).then(resp => {
            setMethodOption(resp.data.result);
        }).catch(error => HandleError(error));
    }
    const handlePaymentData = async () => {
        await axios.get(`/payment`, {
            params: {
                start: setDateForPicker(startDate),
                end: setDateForPicker(endDate),
                account: methodSelected.value
            }
        }).then(resp => {
            setPayments(resp.data.result);
        }).catch(error => {
            HandleError(error);
        });
    }
    useEffect(() => {
        handleMethodOption().then();
    }, []);
    useEffect(() => {
        reload && handlePaymentData().then(() => setReload(false));
        // eslint-disable-next-line
    }, [reload]);
    return <>
        <Head title="Laporan Pembayaran"/>
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
                        <BlockTitle tag="h4">Data Pembayaran</BlockTitle>
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
                                    options={methodOption}
                                    onChange={(e) => {
                                        setMethodSelected(e);
                                        setReload(true);
                                    }}
                                    value={methodSelected}
                                    placeholder="Pilih Metode Pembayaran"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>
                <ReactDataTable data={payments} columns={Columns} pagination actions className="nk-tb-list" onLoad={reload}/>
            </PreviewCard>
        </Content>
    </>
}
export default Payment;