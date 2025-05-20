import React, { useEffect, useState, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  MapConsumer,
  Control,
  Polygon,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AddAlarmOutlined } from "@material-ui/icons";

const GeoJsonLayer = (props) => {
  const { widgetData, setWidgetData, id } = props;
  const map = useMap();
  let labelTransform = widgetData.labelTransform
    ? widgetData.labelTransform
    : "";
  const generateColor = (value) => {
    if (!value) {
      return "#ffffff";
    }
    let found = widgetData.legendSet.find((legend) => {
      if (legend.max && legend.min) {
        return value >= legend.min && value <= legend.max;
      } else if (legend.min) {
        return value >= legend.min;
      } else {
        return value <= legend.max;
      }
    });
    return found.color;
  };
  let features = L.geoJSON(widgetData.features, {
    onEachFeature: (feature, layer) => {
      layer.setStyle({
        fillColor: generateColor(widgetData.mapData[feature.id])
      });
      layer.on("mouseover", () => {
        layer.setStyle({
          weight: 2
        });
        document.getElementById("message-box-" + id).innerHTML = `${
          feature.properties.name
        }: ${
          widgetData.mapData[feature.id] ? widgetData.mapData[feature.id] : 0
        } ${labelTransform}`;
      });
      layer.on("mouseout", () => {
        layer.setStyle({
          weight: 0.5
        });
        document.getElementById("message-box-" + id).innerHTML = "";
      });
    },
    style: {
      color: "#000000",
      fillOpacity: 0.8,
      weight: 1
    }
  });
  features.addTo(map);
  map.fitBounds(features.getBounds());
  return null;
};

const LegendBoxControl = (props) => {
  const widgetData = props.widgetData;
  let labelTransform = widgetData.labelTransform
    ? widgetData.labelTransform
    : "";
  return (
    <div className="leaflet-bottom leaflet-right legend-box">
      {widgetData.legendSet.map((legend) => {
        return (
          <div className="legend-item">
            <div className="legend-color">
              <div style={{ backgroundColor: legend.color }}></div>
            </div>
            <div className="legend-name">
              {(() => {
                if (
                  legend.hasOwnProperty("max") &&
                  legend.hasOwnProperty("min")
                ) {
                  return (
                    legend.min +
                    labelTransform +
                    " - " +
                    legend.max +
                    labelTransform
                  );
                } else if (
                  legend.hasOwnProperty("max") &&
                  !legend.hasOwnProperty("min")
                ) {
                  return "<= " + legend.max + labelTransform;
                } else {
                  return ">= " + legend.min + labelTransform;
                }
              })()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MessageBoxControl = (props) => {
  const { widgetData } = props;
  return (
    <div
      className="leaflet-top leaflet-right message-box"
      id={"message-box-" + props.id}
    ></div>
  );
};

const ThematicMapWidget = (props) => {
  const [widgetData, setWidgetData] = useState(null);

  useEffect(() => {
    setWidgetData(null);
    props.data().then((wd) => {
      setWidgetData(wd);
    });
  }, [props.id]);

  useEffect(() => {
    // generateMap();
  });

  // componentWillUnmount() {
  //   clearInterval(this.interval);
  // }
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.id === nextProps.id && this.state.info === nextState.info) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  const generateMap = (map) => {
    if (!widgetData) return;
    if (widgetData.features) {
      map.removeLayer(widgetData.features);
    }
    // interval = setInterval(() => {
    //   try {
    //     map.invalidateSize();
    //   } catch (err) {
    //     console.log(err);
    //   }
    // }, 500);

    // if (widgetState.legendBox) {
    //   widgetState.legendBox.remove();
    //   setWidgetState({
    //     ...widgetState,
    //     legendBox: null,
    //   });
    // }

    // L.Control.oBox = L.Control.extend({
    //   onAdd: (map) => {
    //     let legendBox = L.DomUtil.create("div");
    //     legendBox.classList.add("legend-box");
    //     legendBox.innerHTML = (() => {
    //       let html = "";
    //       widgetData.legendSet.forEach((legend) => {
    //         html += `<div class="legend-item">
    //               <div class="legend-color">
    //                 <div style="background-color:${legend.color};">
    //                 </div>
    //               </div>
    //               <div class="legend-name">
    //                 ${(() => {
    //                   if (
    //                     legend.hasOwnProperty("max") &&
    //                     legend.hasOwnProperty("min")
    //                   ) {
    //                     return (
    //                       legend.min +
    //                       labelTransform +
    //                       " - " +
    //                       legend.max +
    //                       labelTransform
    //                     );
    //                   } else if (
    //                     legend.hasOwnProperty("max") &&
    //                     !legend.hasOwnProperty("min")
    //                   ) {
    //                     return "<= " + legend.max + labelTransform;
    //                   } else {
    //                     return ">= " + legend.min + labelTransform;
    //                   }
    //                 })()}
    //               </div>
    //             </div>`;
    //       });
    //       return html;
    //     })();
    //     return legendBox;
    //   }
    // });
    // L.control.legendBox = (opts) => {
    //   return new L.Control.LegendBox(opts);
    // };
    // let legendBox = L.control.legendBox({ position: "bottomright" });
    // legendBox.addTo(map);
    // map.fitBounds(features.getBounds());
  };

  // componentDidMount() {
  //   this.generateMap();
  // }
  // componentDidUpdate() {
  //   this.generateMap();
  // }
  return widgetData ? (
    <React.Fragment>
      <Paper
        className={`feature-info-container ${
          widgetData.info ? "" : "feature-info-container-hide"
        }`}
      >
        {widgetData.infoMessage}
      </Paper>
      <MapContainer scrollWheelZoom={false} center={[0, 0]} zoom={5}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <GeoJsonLayer
          widgetData={widgetData}
          setWidgetData={setWidgetData}
          id={props.id}
        />
        <LegendBoxControl widgetData={widgetData} />
        <MessageBoxControl widgetData={widgetData} id={props.id} />
        {/* <MapConsumer>
          {(map) => {
            generateMap(map);
            return null;
          }}
        </MapConsumer> */}
      </MapContainer>
    </React.Fragment>
  ) : (
    <LoadingMask />
  );
};

export default ThematicMapWidget;
