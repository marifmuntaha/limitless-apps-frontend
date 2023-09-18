import React from "react";
import { Chart, registerables } from 'chart.js';
import {Line} from "react-chartjs-2";
Chart.register(...registerables);

export const DefaultOrderChart = () => {
    let todayOrders = {
        labels: [
            "12AM - 02AM",
            "02AM - 04AM",
            "04AM - 06AM",
            "06AM - 08AM",
            "08AM - 10AM",
            "10AM - 12PM",
            "12PM - 02PM",
            "02PM - 04PM",
            "04PM - 06PM",
            "06PM - 08PM",
            "08PM - 10PM",
            "10PM - 12PM",
        ],
        dataUnit: "Orders",
        lineTension: 0.3,
        datasets: [
            {
                label: "Orders",
                color: "#18b705",
                borderWidth: 2,
                borderColor: "#18b705",
                lineTension: 0.3,
                pointBorderColor: "transparent",
                pointBackgroundColor: "transparent",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#18b705",
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 2,
                pointRadius: 4,
                pointHitRadius: 4,
                backgroundColor: "transparent",
                data: [92, 105, 125, 85, 110, 106, 131, 105, 110, 131, 105, 110],
            },
        ],
    };
    return (
        <Line
            className="ecommerce-line-s3"
            data={todayOrders}
            options={{
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        displayColors: false,
                        backgroundColor: "#1c2b46",
                        titleFont: {
                            size: '8px',
                        },
                        titleColor: "#fff",
                        titleMarginBottom: 4,
                        bodyColor: "#fff",
                        bodyFont: {
                            size: '8px',
                        },
                        bodySpacing: 4,
                        padding: 6,
                        footerMarginTop: 0,
                        callbacks: {
                            title: function () {
                                return false;
                            },
                            label: function (context) {
                                return context.parsed.y;
                            },
                        },
                    },
                },
                maintainAspectRatio: false,
                scales: {
                    y:{
                        display: false,
                        ticks: {
                            beginAtZero: false,
                            color:"#9eaecf",
                            font: {
                                size: '12px',
                            },
                            padding: 0,
                        },
                        grid: {
                            color: "rgba(82, 100, 132, 0.2)",
                            tickMarkLength: 0,
                            zeroLineColor: "rgba(82, 100, 132, 0.2)",
                        },
                    },
                    x:{
                        display: false,
                        ticks: {
                            color:"#9eaecf",
                            font: {
                                size: '12px',
                            },
                            source: "auto",
                            padding: 0,
                        },
                        grid: {
                            color: "transparent",
                            tickMarkLength: 0,
                            zeroLineColor: "rgba(82, 100, 132, 0.2)",
                            offsetGridLines: true,
                        },
                    },
                },
            }}
        />
    );
};

export const DefaultCustomerChart = () => {
    var todayCustomers = {
        labels: [
            "12AM - 02AM",
            "02AM - 04AM",
            "04AM - 06AM",
            "06AM - 08AM",
            "08AM - 10AM",
            "10AM - 12PM",
            "12PM - 02PM",
            "02PM - 04PM",
            "04PM - 06PM",
            "06PM - 08PM",
            "08PM - 10PM",
            "10PM - 12PM",
        ],
        dataUnit: "Orders",
        lineTension: 0.3,
        datasets: [
            {
                label: "Customers",
                color: "#2ba6f3",
                borderWidth: 2,
                borderColor: "#2ba6f3",
                lineTension: 0.3,
                pointBorderColor: "transparent",
                pointBackgroundColor: "transparent",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#2ba6f3",
                pointBorderWidth: 2,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 2,
                pointRadius: 4,
                pointHitRadius: 4,
                backgroundColor: "transparent",
                data: [92, 105, 125, 85, 110, 106, 131, 105, 110, 131, 105, 110],
            },
        ],
    };
    return (
        <Line
            className="ecommerce-line-s3"
            data={todayCustomers}
            options={{
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        displayColors: false,
                        backgroundColor: "#1c2b46",
                        titleFont: {
                            size: '8px',
                        },
                        titleColor: "#fff",
                        titleMarginBottom: 4,
                        bodyColor: "#fff",
                        bodyFont: {
                            size: '8px',
                        },
                        bodySpacing: 4,
                        padding: 6,
                        footerMarginTop: 0,
                        callbacks: {
                            title: function () {
                                return false;
                            },
                            label: function (context) {
                                return context.parsed.y;
                            },
                        },
                    },
                },
                maintainAspectRatio: false,
                scales: {
                    y: {
                        display: false,
                        ticks: {
                            beginAtZero: false,
                            color:"#9eaecf",
                            font: {
                                size: '12px',
                            },
                            padding: 0,
                        },
                        grid: {
                            color: "rgba(82, 100, 132, 0.2)",
                            tickMarkLength: 0,
                            zeroLineColor: "rgba(82, 100, 132, 0.2)",
                        },
                    },
                    x:{
                        display: false,
                        ticks: {
                            color:"#9eaecf",
                            font: {
                                size: '12px',
                            },
                            source: "auto",
                            padding: 0,
                        },
                        grid: {
                            color: "transparent",
                            tickMarkLength: 0,
                            zeroLineColor: "rgba(82, 100, 132, 0.2)",
                            offsetGridLines: true,
                        },
                    },
                },
            }}
        />
    );
};