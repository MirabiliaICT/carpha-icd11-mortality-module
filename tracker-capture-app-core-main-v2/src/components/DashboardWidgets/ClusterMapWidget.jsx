import React from "react";
import Paper from "@material-ui/core/Paper";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Popup,
  Tooltip,
  TileLayer,
  GeoJSON
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

export default class ClusterMapWidget extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      let map = this.refs[`map-${this.props.id}`].leafletElement;
      let geoJSON = L.geoJson(this.props.data.features);
      map.fitBounds(geoJSON.getBounds());
    }, 50);
  }

  render() {
    let props = this.props;
    const markerIcon = L.divIcon({
      className: "custom-div-icon",
      html: `<div style="
        background-color: ${props.data.color ? props.data.color : "#303030"}; 
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
    return (
      <MapContainer
        ref={`map-${props.id}`}
        maxZoom={11}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <MarkerClusterGroup
          maxClusterRadius={props.radius ? props.radius : 80}
          // iconCreateFunction={(cluster) => {
          //   return L.divIcon({
          //     html: `<div style="
          //       display: flex;
          //       background-color: ${
          //         props.data.color ? props.data.color : "#303030"
          //       };
          //       align-items: center;
          //       justify-content: center;
          //       width: 30px;
          //       height: 30px;
          //       border-radius: 15px;
          //       color: #ffffff;
          //       font-weight:bold;
          //       -webkit-box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
          //       -moz-box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
          //       box-shadow: 3px 3px 4px 0px rgba(0,0,0,0.3);
          //       "
          //       >
          //       ${cluster.getChildCount()}
          //       </div>`,
          //     className: "marker-cluster-custom",
          //     iconSize: L.point(30, 30, true)
          //   });
          // }}
        >
          {this.props.data.events.map((event) => {
            return (
              <Marker
                position={[event.latitude, event.longitude]}
                icon={markerIcon}
              >
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
          })}
        </MarkerClusterGroup>
        <GeoJSON
          ref="geojson"
          key="my-geojson"
          data={this.props.data.features}
          style={(feature) => {
            return {
              fillColor: "black",
              weight: 0.5,
              opacity: 1,
              color: "#000000",
              fillOpacity: 0.05
            };
          }}
        />
      </MapContainer>
    );
  }
}
