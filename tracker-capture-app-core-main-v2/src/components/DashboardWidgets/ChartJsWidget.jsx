import React, { useEffect, useState } from "react";
import { Bar, HorizontalBar, Pie, Scatter } from "react-chartjs-2";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";

// import ChartDataLabels from "chartjs-plugin-datalabels";

const ChartJsWidget = (props) => {
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.id === nextProps.id) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  const [widgetData, setWidgetData] = useState(null);

  useEffect(() => {
    setWidgetData(null);
    props.data().then((wd) => {
      setWidgetData(wd);
    });
  }, [props.id]);

  const renderChart = () => {
    if (!widgetData) {
      return <LoadingMask />;
    }
    let horizontal = false;
    let pie = false;
    let stacked = false;
    let scatter = false;
    let multiYAxes = false;
    let multiXAxes = false;
    const options = widgetData.options ? widgetData.options : {};
    widgetData.datasets.forEach((ds) => {
      if (ds.type === "horizontalBar") horizontal = true;
      if (ds.type === "pie") pie = true;
      if (ds.type === "scatter") scatter = true;
      if (ds.type === "bar" && widgetData.stacked === true) stacked = true;
      if (
        (ds.type === "bar" || ds.type === "horizontalBar") &&
        widgetData.multiYAxed === true
      )
        multiYAxes = true;
      if (
        (ds.type === "bar" || ds.type === "horizontalBar") &&
        widgetData.multiXAxed === true
      )
        multiXAxes = true;
    });
    if (horizontal) {
      return (
        <HorizontalBar
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              xAxes:
                multiXAxes === true ? widgetData.xAxes : [{ stacked: stacked }],
              yAxes:
                multiYAxes === true ? widgetData.yAxes : [{ stacked: stacked }]
            },
            ...options
          }}
          data={widgetData}
        />
      );
    } else {
      if (pie) {
        return (
          <Pie
            options={{
              maintainAspectRatio: false,
              responsive: true,
              ...options
            }}
            data={widgetData}
          />
        );
      } else if (scatter) {
        console.log(widgetData);
        return (
          <Scatter
            options={{
              maintainAspectRatio: false,
              responsive: true,
              ...options
            }}
            data={widgetData}
          />
        );
      } else {
        return (
          <Bar
            options={{
              maintainAspectRatio: false,
              responsive: true,
              scales: {
                xAxes:
                  multiXAxes === true
                    ? widgetData.xAxes
                    : [{ stacked: stacked }],
                yAxes:
                  multiYAxes === true
                    ? widgetData.yAxes
                    : [{ stacked: stacked }]
              },
              ...options
            }}
            data={widgetData}
          />
        );
      }
    }
  };
  return renderChart();
};

export default ChartJsWidget;
