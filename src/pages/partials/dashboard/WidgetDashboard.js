import React, {useEffect, useState} from "react";
import {Block, Col, Icon, Row} from "../../../components";
import {Card} from "reactstrap";
import {DefaultCustomerChart, DefaultOrderChart} from "./DefaultChart";
import moment from "moment";
import {Currency, monthNames} from "../../../utils/Utils";
import {Dispatch, actionType} from "../../../reducer";

const WidgetDashboard = () => {
    const [members, setMembers] = useState([]);
    const [countMember, setCountMember] = useState(0);
    const [newMembers, setNewMembers] = useState([]);
    const [countNewMember, setCountNewMember] = useState(0)
    const [cashflows, setCashflows] = useState([]);
    const [incomes, setIncomes] = useState(0);
    const [outcomes, setOutcomes] = useState(0);
    const [newIncome, setNewIncome] = useState(0);
    const [newOutcome, setNewOutcome] = useState(0);

    useEffect(() => {
        Dispatch(actionType.MEMBER_GET, {
            setData: setMembers
        }).then();
        Dispatch(actionType.CASHFLOW_GET,
            {setData: setCashflows},
            {
                start: moment().startOf('month').format('YYYY-MM-DD'),
                end: moment().endOf('month').format('YYYY-MM-DD'),
            }).then();
    }, []);
    useEffect(() => {
        let income = 0;
        let outcome = 0;
        let newIncome = 0;
        let newOutcome = 0;
        cashflows.map((cashflow) => {
            if (cashflow.type === '1') {
                income += cashflow.amount
                if (cashflow.created_at === moment().format('YYYY-MM-DD').toString()) {
                    newIncome += cashflow.amount
                }
            }
        });
        cashflows.map((cashflow) => {
            if (cashflow.type === '2') {
                outcome += cashflow.amount
                if (cashflow.created_at === moment().format('YYYY-MM-DD').toString()) {
                    newOutcome += cashflow.amount
                }
            }
        });
        setIncomes(income);
        setOutcomes(outcome);
        setNewIncome(newIncome);
        setNewOutcome(newOutcome);
    }, [cashflows]);
    useEffect(() => {
        let newMembers = members.filter((member) => {
            return moment(member.installation, 'YYYY-MM-DD').month() === moment().month()
        });
        setNewMembers(newMembers);
        setCountNewMember(newMembers.length);
        setCountMember(members.length);
    }, [members]);
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
                                            {countMember} <span className="text-muted"> Orang</span>
                                        </div>
                                        <div className="nk-ecwg6-ck">{<DefaultCustomerChart/>}</div>
                                    </div>
                                    <div className="info">
                                        <span className="text-success">
                                            <Icon name="plus"></Icon> {countNewMember} Pelanggan
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