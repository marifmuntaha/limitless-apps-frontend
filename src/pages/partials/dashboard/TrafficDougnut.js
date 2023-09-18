import React, {useEffect, useState} from "react";
import {DropdownToggle, DropdownMenu, UncontrolledDropdown, DropdownItem} from "reactstrap";
import {TCDoughnut} from "../../../components/index";
import moment from "moment";
import {Currency, monthNames} from "../../../utils/Utils";
import axios from "axios";
import HandleError from "../../auth/handleError";

const TrafficDougnut = () => {
    const [monthSelected, setMonthSelected] = useState(moment().month());
    const [paidData, setPaidData] = useState(0);
    const [unpaidData, setUnpaidData] = useState(0);
    const [cancelData, setCancelData] = useState(0);
    const [overdueData, setOverdueData] = useState(0);

    const [invoiceDoughnut, setInvoiceDoughnut] = useState({
        labels: ["Lunas", "Belum Lunas", 'Batal', 'Jatuh Tempo'],
        dataUnit: "People",
        legend: false,
        datasets: [
            {
                borderColor: "#fff",
                backgroundColor: ["#0d8305", "#f6d13e", "#818078", "#d50505"],
                data: [0, 0, 0, 0],
            },
        ],
    });
    const handleInvoiceDoughnut = async () => {
        await axios.get("/invoice", {
            params: {
                month: monthSelected + 1,
                year: moment().year(),
            }
        }).then(resp => {
            let totalPaid = 0;
            let totalUnpaid = 0;
            let totalCancel = 0;
            let totalOverdue = 0;
            let paid = resp.data.result.filter((item) => {
                return item.status === '1'
            })
            let unpaid = resp.data.result.filter((item) => {
                return item.status === '2'
            });
            let cancel = resp.data.result.filter((item) => {
                return item.status === '3'
            })
            let overdue = resp.data.result.filter((item) => {
                return item.status === '4'
            });

            paid.map((item) => {
                totalPaid += item.amount
            });
            unpaid.map((item) => {
                totalUnpaid += item.amount
            });
            cancel.map((item) => {
                totalCancel += item.amount
            });
            overdue.map((item) => {
                totalOverdue += item.amount
            })
            setPaidData(totalPaid);
            setUnpaidData(totalUnpaid);
            setCancelData(totalCancel);
            setOverdueData(totalOverdue);
            setInvoiceDoughnut({
                labels: ["Lunas", "Belum Lunas", 'Batal', 'Jatuh Tempo'],
                dataUnit: "People",
                legend: false,
                datasets: [
                    {
                        borderColor: "#fff",
                        backgroundColor: ["#0d8305", "#f6d13e", "#818078", "#d50505"],
                        data: [paid.length, unpaid.length, cancel.length, overdue.length],
                    },
                ],
            });
        }).catch(error => HandleError(error));
    }
    useEffect(() => {
        handleInvoiceDoughnut().then();
        // console.log({unpaidData});
    }, [monthSelected]);
    return (
        <>
            <div className="card-title-group">
                <div className="card-title card-title-sm">
                    <h6 className="title">Tagihan {moment().year()}</h6>
                </div>
                <UncontrolledDropdown>
                    <DropdownToggle
                        className="dropdown-toggle dropdown-indicator btn btn-sm btn-outline-light btn-white">
                        {monthNames[monthSelected]}
                    </DropdownToggle>
                    <DropdownMenu end className="dropdown-menu-xs">
                        <ul className="link-list-opt no-bdr">
                            {monthNames.map((item, idx) => (
                                <li className={monthSelected === idx ? "active" : ""} key={idx}>
                                    <DropdownItem
                                        href="#dropdownitem"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setMonthSelected(idx);
                                        }}
                                    >
                                        <span>{item}</span>
                                    </DropdownItem>
                                </li>
                            ))}
                        </ul>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </div>
            <div className="traffic-channel">
                <div className="traffic-channel-doughnut-ck">
                    <TCDoughnut state={invoiceDoughnut} className="analytics-doughnut"></TCDoughnut>
                </div>
                <div className="traffic-channel-group g-2">
                    <div className="traffic-channel-data">
                        <div className="title">
                            <span className="dot dot-lg sq" style={{background: "#0d8305"}}></span>
                            <span>Lunas</span>
                        </div>
                        <div className="amount">
                             <small>{Currency(paidData)}</small>
                        </div>
                    </div>
                    <div className="traffic-channel-data">
                        <div className="title">
                            <span className="dot dot-lg sq" style={{background: "#f6d13e"}}></span>
                            <span>Belum Lunas</span>
                        </div>
                        <div className="amount">
                            <small>{Currency(unpaidData)}</small>
                        </div>
                    </div>
                    <div className="traffic-channel-data">
                        <div className="title">
                            <span className="dot dot-lg sq" style={{background: "#818078"}}></span>
                            <span>Batal</span>
                        </div>
                        <div className="amount">
                            <small>{Currency(cancelData)}</small>
                        </div>
                    </div>
                    <div className="traffic-channel-data">
                        <div className="title">
                            <span className="dot dot-lg sq" style={{background: "#d50505"}}></span>
                            <span>Jatuh Tempo</span>
                        </div>
                        <div className="amount">
                            <small>{Currency(overdueData)}</small>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
        ;
};
export default TrafficDougnut;
