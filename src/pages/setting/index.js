import React, {useState} from "react";
import Head from "../../layout/head";
import Content from "../../layout/content";
import {
    BackTo,
    Block,
    BlockBetween,
    BlockHead,
    BlockHeadContent,
    BlockTitle,
    Icon
} from "../../components";
import {Card} from "reactstrap";
import Notification from "./partials/notification";
import {ToastContainer} from "react-toastify";
const Setting = () => {
    const [tab, setTab] = useState('1');
    return <>
        <Head title="Pelanggan"/>
        <Content>
            <BlockHead size="sm">
                <BlockHeadContent>
                    <BackTo link="/" icon="arrow-left">
                        DASHBOARD
                    </BackTo>
                </BlockHeadContent>
            </BlockHead>
            <BlockBetween>
                <BlockHeadContent>
                    <BlockTitle tag="h4">Pengaturan</BlockTitle>
                    <p>
                        Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for
                        react dashlite.
                    </p>
                </BlockHeadContent>
            </BlockBetween>
            <BlockHead />
            <Block>
                <Card>
                    <div className="card-aside-wrap" id="user-detail-block">
                        <div className="card-content">
                            <ul className="nav nav-tabs nav-tabs-mb-icon nav-tabs-card">
                                <li className="nav-item">
                                    <a
                                        className={tab === '1' ? "nav-link active" : 'nav-link'}
                                        href="#personal"
                                        onClick={() => {
                                            setTab('1')
                                        }}
                                    >
                                        <Icon name="user-circle"></Icon>
                                        <span>Personal</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className={tab === '2' ? "nav-link active" : 'nav-link'}
                                        href="#notifikasi"
                                        onClick={() => {
                                            setTab('2')
                                        }}
                                    >
                                        <Icon name="bell"></Icon>
                                        <span>Notifikasi</span>
                                    </a>
                                </li>
                            </ul>
                            <div className="card-inner">
                                {tab === '1' && (
                                    <Block>
                                        <BlockHead>
                                            <BlockTitle tag="h5">Personal Information</BlockTitle>
                                            <p>Basic info, like your name and address, that you use on Nio Platform.</p>
                                        </BlockHead>
                                    </Block>
                                )}
                                {tab === '2' && (
                                    <Notification />
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </Block>
        </Content>
        <ToastContainer />
    </>
}
export default Setting;