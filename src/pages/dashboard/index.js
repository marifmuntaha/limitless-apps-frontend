import React from "react";
import Content from "../../layout/content";
import Head from "../../layout/head";

const Dashboard = ({ ...props }) => {
  return (
    <React.Fragment>
      <Head title="Blank Page" />
      <Content>
        <p>Starter Page for general layout</p>
      </Content>
    </React.Fragment>
  );
};

export default Dashboard;
