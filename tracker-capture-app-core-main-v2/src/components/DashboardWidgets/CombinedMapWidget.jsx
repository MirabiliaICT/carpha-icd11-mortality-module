import React, { useEffect, useState, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";
import MiniMap from "leaflet-minimap";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";

import "react-leaflet-markercluster/dist/styles.min.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  GeoJSON,
  MapConsumer,
  Control,
  Polygon,
  Polyline,
  useMap
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { AddAlarmOutlined } from "@material-ui/icons";

const ThematicLayer = (props) => {
  const { layer, id } = props;
  let { labelTransform, legendSet, features, data, field } = layer;
  const map = useMap();
  labelTransform = labelTransform || "";
  const generateColor = (value) => {
    if (!value) {
      return "#ffffff";
    }
    let found = legendSet.find((legend) => {
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
  let mapFeatures = L.geoJSON(features, {
    onEachFeature: (feature, layer) => {
      layer.setStyle({
        fillColor: generateColor(
          data[field ? feature.properties[field] : feature.id]
        )
      });
      layer.on("mouseover", () => {
        layer.setStyle({
          weight: 2
        });
        document.getElementById("message-box-" + id).innerHTML = `${feature.properties.name
          }: ${data[field ? feature.properties[field] : feature.id]
            ? data[field ? feature.properties[field] : feature.id]
            : 0
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
  mapFeatures.addTo(map);
  // map.fitBounds(mapFeatures.getBounds());
  return null;
};

const BoundaryLayer = (props) => {
  const { layer, id } = props;
  const map = useMap();
  let features = L.geoJSON(layer.data, {
    onEachFeature: (feature, layer) => {
      layer.bindTooltip(feature.properties.name, {
        permanent: true,
        direction: "center",
        className: "map-leaflet-tooltip"
      });
      layer.on("mouseover", () => {
        layer.setStyle({
          weight: 2
        });
        document.getElementById("message-box-" + id).innerHTML =
          feature.properties.name;
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
      fillOpacity: 0,
      weight: 1
    }
  });
  features.addTo(map);
  try {
    map.fitBounds(features.getBounds());
  } catch (err) { }

  return null;
};

const ClusterLayer = (props) => {
  const { layer } = props;
  const { enableClustering } = layer;
  const markerIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div style="
      background-color: ${layer.color ? layer.color : "#303030"}; 
      width: 10px; 
      height: 10px;
      border-radius: 5px;
      -webkit-box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
      -moz-box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
      box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
      "
      >
      </div>`,
    iconSize: [10, 10]
  });
  return enableClustering ? (
    <MarkerClusterGroup>
      {layer.data.map((point) => {
        return (
          <Marker
            position={[point.latitude, point.longitude]}
            icon={markerIcon}
          >
            <Popup>
              <div className="marker-popup-container">
                {Object.keys(point)
                  .filter((prop) => !["longitude", "latitude"].includes(prop))
                  .map((prop) => {
                    return (
                      <div>
                        <b>{prop}:</b> {point[prop]}
                      </div>
                    );
                  })}
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MarkerClusterGroup>
  ) : (
    layer.data.map((point) => {
      return (
        <Marker position={[point.latitude, point.longitude]} icon={markerIcon}>
          <Popup>
            <div className="marker-popup-container">
              {Object.keys(point)
                .filter((prop) => !["longitude", "latitude"].includes(prop))
                .map((prop) => {
                  return (
                    <div>
                      <b>{prop}:</b> {point[prop]}
                    </div>
                  );
                })}
            </div>
          </Popup>
        </Marker>
      );
    })
  );
};

const RelationshipLayer = (props) => {
  const { layer } = props;
  const map = useMap();
  let bounds = [];
  layer.data.forEach((rel) => {
    rel.forEach((line) => {
      bounds.push(line);
    });
  });
  if (bounds.length !== 0) {
    map.fitBounds(bounds);
  }
  return (
    <Polyline
      name="polyline"
      color={layer.color}
      weight={1.5}
      positions={layer.data}
    />
  );
};

const MinimapControl = (props) => {
  const { layer } = props;
  const map = useMap();
  let features = L.geoJSON(layer.data, {
    style: {
      color: "#000000",
      fillOpacity: 0,
      weight: 1
    }
  });
  let minimapLayers = L.layerGroup([
    new L.TileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      {
        minZoom: 4,
        maxZoom: 4,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
      }
    ),
    features
  ]);
  var miniMap = new L.Control.MiniMap(minimapLayers, {
    position: "topright"
  }).addTo(map);
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
  return (
    <div
      className="leaflet-top leaflet-left message-box"
      id={"message-box-" + props.id}
    ></div>
  );
};

const CombinedMapWidget = (props) => {
  const [widgetData, setWidgetData] = useState(null);

  useEffect(() => {
    setWidgetData(null);
    props.data().then((wd) => {
      setWidgetData(wd);
    });
  }, [props.id]);

  return widgetData ? (
    <React.Fragment>
      <Paper
        className={`feature-info-container ${widgetData.info ? "" : "feature-info-container-hide"
          }`}
      >
        {widgetData.infoMessage}
      </Paper>
      <MapContainer
        scrollWheelZoom={false}
        center={[0, 0]}
        zoom={5}
        key={Math.random()}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MessageBoxControl widgetData={widgetData} id={props.id} />
        <MinimapControl
          key={Math.random()}
          layer={widgetData.layers.find((layer) => layer.type === "boundary")}
        />
        {widgetData.layers
          .filter((layer) => layer.type === "boundary")
          .map((layer) => {
            return <BoundaryLayer layer={layer} id={props.id} />;
          })}
        {widgetData.layers
          .filter((layer) => layer.type === "thematic")
          .map((layer) => {
            return <ThematicLayer layer={layer} id={props.id} />;
          })}
        {widgetData.layers
          .filter((layer) => layer.type === "cluster")
          .map((layer) => {
            return <ClusterLayer layer={layer} />;
          })}
        {widgetData.layers
          .filter((layer) => layer.type === "relationship")
          .map((layer) => {
            return <RelationshipLayer layer={layer} id={props.id} />;
          })}
      </MapContainer>
    </React.Fragment>
  ) : (
    <LoadingMask />
  );
};

export default CombinedMapWidget;
