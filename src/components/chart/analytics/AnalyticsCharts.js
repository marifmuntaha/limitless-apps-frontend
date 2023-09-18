import React, { useEffect, useState } from "react";
import {Doughnut} from "react-chartjs-2";
import { Chart,ArcElement} from "chart.js";
Chart.register(ArcElement);
export const TCDoughnut = ({ state, className }) => {

    const [data, setData] = useState(state);
    useEffect(() => {
        setData(state)
    },[state]);
    return (
        <Doughnut
            className={className}
            data={data}
            options={{
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        displayColors: false,
                        backgroundColor: "#eff6ff",
                        titleFont: {
                            size: '13px',
                        },
                        titleColor: "#6783b8",
                        titleMarginBottom: 6,
                        bodyColor: "#9eaecf",
                        bodyFont: {
                            size: '12px',
                        },
                        bodySpacing: 4,
                        padding: 10,
                        footerMarginTop: 0,
                    },
                },
                rotation: -1.5,
                cutoutPercentage: 70,
                maintainAspectRatio: false,
            }}
        ></Doughnut>
    );
};