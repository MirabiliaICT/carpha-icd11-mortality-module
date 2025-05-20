/*
 * Copyright (c) 2016-2018 Morten Olav Hansen <mortenoh@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import CardMedia from "@material-ui/core/CardMedia";
import deepEqual from "deep-equal";
import "./DataGridLegendWidget.css";

export default class DataGridWidget extends Component {
  static defaultProps = {
    data: {}
  };

  static propTypes = {
    data: PropTypes.object.isRequired
  };

  shouldComponentUpdate(props, state) {
    return !deepEqual(this.props.data, props.data);
  }

  render() {
    let headers;
    let rows;
    let footers;

    if (this.props.data.headers) {
      headers = (
        <thead>
          <tr>
            {this.props.data.headers.map((header, idx) => (
              <th key={idx}>{header}</th>
            ))}
          </tr>
        </thead>
      );
    }

    this.props.data.dataIndex = Array.isArray(this.props.data.dataIndex)
      ? this.props.data.dataIndex
      : [this.props.data.dataIndex];

    if (this.props.data.rows) {
      rows = (
        <tbody>
          {this.props.data.rows.map((row, rowIdx) => {
            const styleTemplate = {
              backgroundColor: "white",
              color: "black"
            };

            return (
              <tr key={rowIdx}>
                {row.map((d, idx) => {
                  const style = Object.assign({}, styleTemplate);

                  if (this.props.data.legend && this.props.data.dataIndex.indexOf(idx) != -1) {
                    const legend = this.props.data.legend(row[idx]);

                    style.backgroundColor = legend.color;
                    style.color = legend.textColor;
                  }

                  return (
                    <td style={style} key={idx}>
                      {d}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      );
    }

    if (this.props.data.footers) {
      footers = (
        <tfoot>
          <tr>
            {this.props.data.footers.map((footer, idx) => (
              <td key={idx}>{footer}</td>
            ))}
          </tr>
        </tfoot>
      );
    }

    return (
      <CardMedia className="WidgetBody">
        <div className="WidgetBodyContainer">
          <div className="DataGridContainer">
            <table className="DataGridLegend">
              {headers}
              {rows}
              {footers}
            </table>
          </div>
        </div>
      </CardMedia>
    );
  }
}
