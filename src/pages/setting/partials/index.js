import React, {useState} from "react";
const TabCard = () => {
    const [tab, setTab] = useState("1");
    return <>
        <div className="card-title-group mb-1">
            <div className="card-title">
                <h6 className="title">Investment Overview</h6>
                <p>
                    The investment overview of your platform.{" "}
                    <a
                        href="#all"
                        onClick={(ev) => {
                            ev.preventDefault();
                        }}
                    >
                        All Investment
                    </a>
                </p>
            </div>
            <ul className="nav nav-tabs nav-tabs-card nav-tabs-xs">
                <li className="nav-item" onClick={() => setTab("1")}>
                    <a
                        href="#overview"
                        onClick={(ev) => {
                            ev.preventDefault();
                        }}
                        className={`nav-link${tab === "1" ? " active" : ""}`}
                    >
                        Overview
                    </a>
                </li>
                <li className="nav-item" onClick={() => setTab("2")}>
                    <a
                        onClick={(ev) => {
                            ev.preventDefault();
                        }}
                        className={`nav-link${tab === "2" ? " active" : ""}`}
                        href="#year"
                    >
                        This Year
                    </a>
                </li>
            </ul>
        </div>
    </>

}
export default TabCard;