import React from "react";
import Content from "../../layout/content";
import Head from "../../layout/head";
import {Block, BlockBetween, BlockHead, BlockHeadContent, BlockTitle, Col, PreviewAltCard, Row} from "../../components";
import TrafficDougnut from "../partials/dashboard/TrafficDougnut";
import UserTable from "../partials/dashboard/UserTable";
import WidgetDashboard from "../partials/dashboard/WidgetDashboard";

const Dashboard = () => {
    return (
        <>
            <Head title="Dashboard"/>
            <Content>
                <BlockHead size="sm">
                    <BlockBetween>
                        <BlockHeadContent>
                            <BlockTitle page tag="h3">
                                Dashboard
                            </BlockTitle>
                        </BlockHeadContent>
                    </BlockBetween>
                </BlockHead>
                <WidgetDashboard/>
                <Block>
                    <Row>
                        <Col md="4">
                            <PreviewAltCard>
                                <TrafficDougnut/>
                            </PreviewAltCard>
                        </Col>
                        <Col md="8">
                            <UserTable/>
                        </Col>
                    </Row>
                </Block>
            </Content>
        </>
    );
};

export default Dashboard;
