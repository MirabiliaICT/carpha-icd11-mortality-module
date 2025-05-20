import React from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Tooltip,
  TileLayer,
  GeoJSON,
  Polyline
} from "react-leaflet";
// import Control from "react-leaflet-control";
import MarkerClusterGroup from "react-leaflet-markercluster";
import Legend from "./legend/Legend.jsx";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MiniMap from "leaflet-minimap";
import {} from "@fortawesome/free-solid-svg-icons";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";

export default class CombinedMapWidget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableClustering: true,
      layersToggle: [],
      isLegendOpen: false
    };
  }
  componentDidMount() {
    let layersToggle = [];
    this.props.data.layers.forEach((layer, index) => {
      layersToggle[index] = true;
    });
    this.setState({ layersToggle: layersToggle });
    setTimeout(() => {
      let map = this.refs[`map-${this.props.id}`].leafletElement;
      let features = [];
      this.props.data.layers
        .filter((layer) => layer.type === "boundary")
        .forEach((layer) => {
          features = [...features, ...layer.data];
        });
      let geoJSON = L.geoJson(
        {
          features: features
        },
        {
          style: {
            color: "black",
            weight: 1,
            opacity: 1,
            fillOpacity: 0
          }
        }
      );
      if (this.props.data.defaultZoomLayer === "relationship") {
        let bounds = [];
        this.props.data.layers
          .filter((layer) => layer.type === "relationship")
          .forEach((layer) => {
            layer.data.forEach((rel) => {
              rel.forEach((line) => {
                bounds.push(line);
              });
            });
          });
        if (bounds.length === 0) {
          map.fitBounds(geoJSON.getBounds());
        } else {
          map.fitBounds(bounds);
        }
      } else {
        map.fitBounds(geoJSON.getBounds());
      }
      map.eachLayer((layer) => {
        if (layer.options.name === "polyline") {
          layer.bringToFront();
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
        geoJSON
      ]);
      var miniMap = new L.Control.MiniMap(minimapLayers, {
        position: "topright"
      }).addTo(map);
    }, 50);
  }
  generateFillColor = (value, legendSet) => {
    if (value === 0) return "#ffffff";
    let color = "";
    legendSet.forEach((legend) => {
      if (value >= legend.min && value <= legend.max) {
        color = legend.color;
      }
    });
    return color;
  };
  generateBoundaryLayer = (layer) => {
    return (
      <GeoJSON
        ref="geojson"
        key="my-geojson"
        data={layer.data}
        style={{ weight: 0.5, color: "black", fill: false }}
        onEachFeature={(feature, layer) => {
          layer.bindTooltip(feature.properties.name, {
            permanent: true,
            direction: "center",
            className: "map-leaflet-tooltip"
          });
        }}
      />
    );
  };
  generateThematicLayer = (layer) => {
    return (
      <GeoJSON
        ref="geojson"
        key="my-geojson"
        data={layer.data}
        onEachFeature={(feature, l) => {
          let foundData = null;
          foundData = layer.data.data[feature.properties[layer.field]];
          const fillColor = this.generateFillColor(foundData, layer.legendSet);
          l.setStyle({
            fillColor: fillColor,
            weight: 0.5,
            opacity: 1,
            color: "black",
            fillOpacity: 0.7
          });
          l.on("mouseover", () => {
            let messageBoxContent = `${feature.properties.name}: ${
              foundData ? foundData : 0
            } ${layer.labelTransform}`;
            l.setStyle({
              weight: 2
            });
            document.getElementById(
              `message-box-map-${this.props.id}`
            ).innerHTML = messageBoxContent;
            document.getElementById(
              `message-box-map-${this.props.id}`
            ).style.display = "block";
          });
          l.on("mouseout", () => {
            l.setStyle({
              weight: 0.5
            });
            document.getElementById(
              `message-box-map-${this.props.id}`
            ).innerHTML = "";
            document.getElementById(
              `message-box-map-${this.props.id}`
            ).style.display = "none";
          });
        }}
      />
    );
  };
  generateClusterLayer = (layer) => {
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
    const markers = layer.data.map((event) => {
      return (
        <Marker position={[event.latitude, event.longitude]} icon={markerIcon}>
          <Tooltip>
            <div>
              <strong>Latitude</strong>: {event.latitude}
            </div>
            <div>
              <strong>Longitude</strong>: {event.longitude}
            </div>
            {Object.entries(event).map((entry) => {
              let key = entry[0];
              let value = entry[1];
              if (key === "latitude" || key === "longitude") return "";
              return (
                <div>
                  <strong>{key}</strong>: {value}
                </div>
              );
            })}
          </Tooltip>
        </Marker>
      );
    });
    return layer.enableClustering === false ? (
      markers
    ) : (
      <MarkerClusterGroup
        maxClusterRadius={layer.radius ? layer.radius : 80}
        iconCreateFunction={(cluster) => {
          return L.divIcon({
            html: `<div style="
            display: flex;
            background-color: ${layer.color ? layer.color : "#303030"};
            align-items: center;
            justify-content: center;
            width: 30px;
            height: 30px;
            border-radius: 15px;
            color: #ffffff;
            font-weight:bold;
            -webkit-box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
            -moz-box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
            box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
            "
            >
            ${cluster.getChildCount()}
            </div>`,
            className: "marker-cluster-custom",
            iconSize: L.point(30, 30, true)
          });
        }}
      >
        {markers}
      </MarkerClusterGroup>
    );
  };
  generateRelationshipLayer = (layer) => {
    return (
      <Polyline
        name="polyline"
        color={layer.color}
        weight={1.5}
        positions={layer.data}
      />
    );
  };
  generateLegendItems = () => {
    return (
      <>
        {/* <div className="legend-item-container">
          <div>
            <Checkbox
              checked={!this.state.disableClustering}
              onChange={() => {
                let disableClustering = !this.state.disableClustering;
                this.setState({ disableClustering: disableClustering });
              }}
              color="primary"
            />
          </div>
          <div>Enable clustering</div>
        </div> */}
        {this.props.data.layers.map((layer, index) => {
          return (
            <>
              <div className="legend-item-container">
                {(() => {
                  let layerIcon;
                  switch (layer.type) {
                    case "relationship":
                      layerIcon = (
                        <svg
                          viewBox="0 0 24 24"
                          style={{ width: 24, height: 24 }}
                        >
                          <path
                            stroke={layer.color}
                            stroke-width="1"
                            d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"
                          ></path>
                        </svg>
                      );
                      break;
                    case "thematic":
                      layerIcon = (
                        <div style={{ display: "flex" }}>
                          {layer.legendSet.map((l) => {
                            return (
                              <div
                                style={{
                                  width: 20,
                                  height: 20,
                                  backgroundColor: l.color,
                                  border: "1px solid #e6e6e6"
                                }}
                              />
                            );
                          })}
                        </div>
                      );
                      break;
                    case "cluster":
                      layerIcon = (
                        <div
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            backgroundColor: layer.color
                          }}
                        />
                      );
                      break;
                    case "boundary":
                      layerIcon = (
                        <div
                          style={{
                            width: 30,
                            height: 20,
                            border: "1px solid #919191"
                          }}
                        />
                      );
                      break;
                    default:
                      break;
                  }
                  return (
                    <>
                      <div>
                        <Checkbox
                          checked={this.state.layersToggle[index]}
                          onChange={() => {
                            let layersToggle = this.state.layersToggle;
                            layersToggle[index] = !layersToggle[index];
                            this.setState({ layersToggle: layersToggle });
                          }}
                          color="primary"
                        />
                      </div>
                      {layerIcon}
                      <div>&nbsp;&nbsp;&nbsp;{layer.name}</div>
                    </>
                  );
                })()}
              </div>
            </>
          );
        })}
      </>
    );
  };

  render() {
    let props = this.props;
    return (
      <MapContainer
        ref={`map-${props.id}`}
        maxZoom={15}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {this.props.data.layers
          .filter(
            (layer, index) =>
              layer.type === "relationship" && this.state.layersToggle[index]
          )
          .map((layer) => {
            return this.generateRelationshipLayer(layer);
          })}
        {this.props.data.layers
          .filter(
            (layer, index) =>
              layer.type === "cluster" && this.state.layersToggle[index]
          )
          .map((layer) => {
            return this.generateClusterLayer(layer);
          })}
        {this.props.data.layers
          .filter(
            (layer, index) =>
              layer.type === "boundary" && this.state.layersToggle[index]
          )
          .map((layer) => {
            return this.generateBoundaryLayer(layer);
          })}
        {this.props.data.layers
          .filter(
            (layer, index) =>
              layer.type === "thematic" && this.state.layersToggle[index]
          )
          .map((layer) => {
            return this.generateThematicLayer(layer);
          })}
        {/* <Control position="topright">
          <div
            style={{ display: "none" }}
            className="message-box"
            id={`message-box-map-${props.id}`}
          ></div>
        </Control>
        <Control position="bottomleft">
          <div
            style={{
              WebkitBoxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
              MozBoxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
              boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
              cursor: "pointer",
              backgroundColor: "#ffffff",
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => {
              let map = this.refs[`map-${this.props.id}`].leafletElement;
              let features = [];
              this.props.data.layers
                .filter((layer) => layer.type === "boundary")
                .forEach((layer) => {
                  features = [...features, ...layer.data];
                });
              let geoJSON = L.geoJson({ features: features });
              map.fitBounds(geoJSON.getBounds());
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path d="M4.5 11H3v4h4v-1.5H4.5V11zM3 7h1.5V4.5H7V3H3v4zm10.5 6.5H11V15h4v-4h-1.5v2.5zM11 3v1.5h2.5V7H15V3h-4z" />
            </svg>
          </div>
        </Control>
        {this.state.isLegendOpen ? (
          <Control position="bottomleft">
            <div
              onMouseLeave={() => {
                this.setState({ isLegendOpen: false });
              }}
              style={{
                WebkitBoxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
                MozBoxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
                boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
                backgroundColor: "#ffffff",
                padding: 10,
              }}
            >
              {this.generateLegendItems()}
            </div>
          </Control>
        ) : (
          <Control position="bottomleft">
            <div
              onMouseEnter={() => {
                this.setState({ isLegendOpen: true });
              }}
              style={{
                WebkitBoxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
                MozBoxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
                boxShadow: "1px 1px 5px 0px rgba(0,0,0,0.75)",
                cursor: "pointer",
                backgroundColor: "#ffffff",
                width: 30,
                height: 30,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                width={22}
                height={22}
                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAy5pVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIEVsZW1lbnRzIDE0LjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0VDMTEyQzZDRTU4MTFFNTk1Q0ZGQzk2MTlGNkY2NjYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0VDMTEyQzdDRTU4MTFFNTk1Q0ZGQzk2MTlGNkY2NjYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5QkJDODIwOUNFNTYxMUU1OTVDRkZDOTYxOUY2RjY2NiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5QkJDODIwQUNFNTYxMUU1OTVDRkZDOTYxOUY2RjY2NiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjzimhsAAACgSURBVHjaYqxXZ/nPgAN8+A2WYgQRE+7+YaAFYGIYYMBCqgZGRsb/wyoEhl4U2FhbDawDjhw9xkhVB0Cz2sCFgAArI14fkepAmofAgCfCw0eODrNsmKX2D2ccPP/JBK8LRgui0bpgtC6gWV0AzWoDFwKS7P/w+ohUB9I8BEbrAqqHgK2PJc6S7ePnr6N1wWhdMFoX0L4ugGa1AQsBgAADAHQ1NZdoV4oTAAAAAElFTkSuQmCC"
                alt=""
              />
            </div>
          </Control> */}
        )}
      </MapContainer>
    );
  }
}
