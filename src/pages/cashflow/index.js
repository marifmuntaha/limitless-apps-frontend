import React, {useState} from "react";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {
    BackTo,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle, Icon,
    PreviewCard, Row
} from "../../components";
import {Button, Col} from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment";
import CashflowIn from "../partials/cashflow/in"
import CashflowOut from "../partials/cashflow/out"
import AddIn from "./AddIn";
import {ToastContainer} from "react-toastify";
import EditIn from "./EditIn";
import AddOut from "./AddOut";
import EditOut from "./EditOut";
const Cashflow = () => {
    const [modalIn, setModalIn] = useState({
        add: false,
        edit: false
    });
    const [modalOut, setModalOut] = useState({
        add: false,
        edit: false
    });
    const [startDate, setStartDate] = useState(moment().startOf('month').toDate());
    const [endDate, setEndDate] = useState(moment().endOf('month').toDate());
    const [reloadIn, setReloadIn] = useState(true);
    const [reloadOut, setReloadOut] = useState(true);
    const [cashflow, setCashflow] = useState([]);
    return <>
        <Head title="Kas Keuangan"/>
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
                        <BlockTitle tag="h4">Data Kas Keuangan</BlockTitle>
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
                                        setReloadIn(true);
                                        setReloadOut(true);
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
                                        setReloadIn(true);
                                        setReloadOut(true);
                                    }}
                                    className="form-control date-picker"
                                />{" "}
                            </div>
                        </Col>
                    </Row>
                </div>
                <Row className="gy-4">
                    <Col sm="6">
                        <BlockHead>
                            <BlockBetween>
                                <BlockHeadContent>
                                    <BlockTitle tag="h5">Data Kas Masuk</BlockTitle>
                                </BlockHeadContent>
                                <BlockHeadContent>
                                    <div className="toggle-wrap nk-block-tools-toggle">
                                        <Button
                                            color="secondary"
                                            onClick={() => setModalIn({
                                                ...modalIn, add: true,
                                            })}
                                        >
                                            <Icon name="plus" />
                                            <span>Tambah</span>
                                        </Button>
                                    </div>
                                </BlockHeadContent>
                            </BlockBetween>
                        </BlockHead>
                        <CashflowIn
                            reload={reloadIn}
                            setReload={setReloadIn}
                            setModal={setModalIn}
                            setCashflow={setCashflow}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </Col>
                    <Col sm="6">
                        <BlockHead>
                            <BlockBetween>
                                <BlockHeadContent>
                                    <BlockTitle tag="h5">Data Kas Keluar</BlockTitle>
                                </BlockHeadContent>
                                <BlockHeadContent>
                                    <div className="toggle-wrap nk-block-tools-toggle">
                                        <Button
                                            color="secondary"
                                            onClick={() => setModalOut({
                                                add: true,
                                                edit: false
                                            })}
                                        >
                                            <Icon name="plus" />
                                            <span>Tambah</span>
                                        </Button>
                                    </div>
                                </BlockHeadContent>
                            </BlockBetween>
                        </BlockHead>
                        <CashflowOut
                            reload={reloadOut}
                            setReload={setReloadOut}
                            setModal={setModalOut}
                            setCashflow={setCashflow}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </Col>
                </Row>
            </PreviewCard>
            <AddIn open={modalIn.add} setOpen={setModalIn} datatable={setReloadIn}/>
            <EditIn open={modalIn.edit} setOpen={setModalIn} datatable={setReloadIn} cashflow={cashflow}/>
            <AddOut open={modalOut.add} setOpen={setModalOut} datatable={setReloadOut}/>
            <EditOut open={modalOut.edit} setOpen={setModalOut} datatable={setReloadOut} cashflow={cashflow} />
        </Content>
        <ToastContainer />
    </>
}
export default Cashflow;