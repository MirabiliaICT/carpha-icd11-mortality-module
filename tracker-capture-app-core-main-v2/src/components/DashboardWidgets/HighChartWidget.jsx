import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

export default class HighChartWidget extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.id === nextProps.id) {
      return false;
    } else {
      return true;
    }
  }

  afterChartCreated(chart) {
    setTimeout(() => {
      chart.reflow();
    }, 0);
  }

  renderChart = () => {
    return (
      <div style={{ height: "100%", width: "100%" }}>
        <HighchartsReact
          containerProps={{ style: { width: "100%", height: "100%" } }}
          highcharts={Highcharts}
          options={{
            yAxis: {
              title: {
                enabled: false
              }
            },
            title: {
              text: ""
            },
            credits: {
              enabled: false
            },
            ...this.props.data
          }}
          callback={chart => {
            this.afterChartCreated(chart);
          }}
        />
      </div>
    );
  };
  render() {
    return this.renderChart();
  }
}
