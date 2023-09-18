import React, {useEffect, useState} from "react";
import {Block, Col, Icon, Row} from "../../../components";
import {Card} from "reactstrap";
import {DefaultCustomerChart, DefaultOrderChart} from "./DefaultChart";
import axios from "axios";
import HandleError from "../../auth/handleError";
import moment from "moment";
import {Currency, monthNames} from "../../../utils/Utils";
import cashflow from "../../cashflow";

const WidgetDashboard = () => {
    const [member, setMember] = useState(0);
    const [newMember, setNewMember] = useState(0);
    const [incomes, setIncomes] = useState(0);
    const [outcomes, setOutcomes] = useState(0);
    const [newIncome, setNewIncome] = useState(0);
    const [newOutcome, setNewOutcome] = useState(0);
    const handleMemberData = async () => {
        await axios.get('/member', {})
            .then(resp => {
                let newMember = resp.data.result.filter((member) => {
                    return moment(member.installation, 'YYYY-MM-DD').month() === moment().month()
                });
                setNewMember(newMember.length);
                setMember(resp.data.result.length);
            })
            .catch(error => HandleError(error));
    }
    const handleIncomeData = async () => {
        await axios.get("/cashflow", {})
            .then(resp => {
                let income = 0;
                let outcome = 0;
                let newIncome = 0;
                let newOutcome = 0;
                resp.data.result.map((cashflow) => {
                    if (cashflow.type === '1'){
                        income += cashflow.amount
                        if (cashflow.created_at === moment().format('YYYY-MM-DD').toString()){
                            newIncome += cashflow.amount
                        }
                    }
                });
                resp.data.result.map((cashflow) => {
                    if (cashflow.type === '2'){
                        outcome += cashflow.amount
                        if (cashflow.created_at === moment().format('YYYY-MM-DD').toString()){
                            newOutcome += cashflow.amount
                        }
                    }
                });

                setIncomes(income);
                setOutcomes(outcome);
                setNewIncome(newIncome);
                setNewOutcome(newOutcome);
            })
            .catch(error => HandleError(error));
    }
    useEffect(() => {
        handleMemberData().then();
        handleIncomeData().then();
    }, []);
    return <>
        <Block>
            <Row className="g-gs">
                <Col xxl="3" sm="6">
                    <Card>
                        <div className="nk-ecwg nk-ecwg6">
                            <div className="card-inner">
                                <div className="card-title-group">
                                    <div className="card-title">
                                        <h6 className="title">Saldo</h6>
                                    </div>
                                </div>
                                <div className="data">
                                    <div className="data-group">
                                        <div className="amount">
                                            {Currency(incomes - outcomes)}
                                        </div>
                                        <div className="nk-ecwg6-ck">{<DefaultCustomerChart/>}</div>
                                    </div>
                                    <div className="info">
                                        <span> Bulan {monthNames[moment().month()] + ' ' + moment().year()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xxl="3" sm="6">
                    <Card>
                        <div className="nk-ecwg nk-ecwg6">
                            <div className="card-inner">
                                <div className="card-title-group">
                                    <div className="card-title">
                                        <h6 className="title">Pemasukan</h6>
                                    </div>
                                </div>
                                <div className="data">
                                    <div className="data-group">
                                        <div className="amount">
                                            {Currency(incomes)}
                                        </div>
                                        <div className="nk-ecwg6-ck">{<DefaultOrderChart/>}</div>
                                    </div>
                                    <div className="info">
                                        <span className="change up text-success">
                                            <Icon name="plus"></Icon> {Currency(newIncome)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xxl="3" sm="6">
                    <Card>
                        <div className="nk-ecwg nk-ecwg6">
                            <div className="card-inner">
                                <div className="card-title-group">
                                    <div className="card-title">
                                        <h6 className="title">Pengeluaran</h6>
                                    </div>
                                </div>
                                <div className="data">
                                    <div className="data-group">
                                        <div className="amount">
                                            {Currency(outcomes)}
                                        </div>
                                        <div className="nk-ecwg6-ck">{<DefaultOrderChart/>}</div>
                                    </div>
                                    <div className="info">
                                        <span className="change downr">
                                            <Icon name="minus"></Icon> {Currency(newOutcome)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xxl="3" sm="6">
                    <Card>
                        <div className="nk-ecwg nk-ecwg6">
                            <div className="card-inner">
                                <div className="card-title-group">
                                    <div className="card-title">
                                        <h6 className="title">Pelanggan</h6>
                                    </div>
                                </div>
                                <div className="data">
                                    <div className="data-group">
                                        <div className="amount">
                                            {member} <span className="text-muted"> Orang</span>
                                        </div>
                                        <div className="nk-ecwg6-ck">{<DefaultCustomerChart/>}</div>
                                    </div>
                                    <div className="info">
                                        <span className="text-success">
                                            <Icon name="plus"></Icon> {newMember} Pelanggan
                                        </span>
                                        <span> Bulan {monthNames[moment().month()]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Block>
    </>
}
export default WidgetDashboard