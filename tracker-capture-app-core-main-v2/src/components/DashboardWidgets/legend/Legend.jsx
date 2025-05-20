import React, { useState } from "react";
import PropTypes from "prop-types";
import LegendLayer from "./LegendLayer";
import "./Legend.css";

// Renders a legend for all map layers
const Legend = (props) => {
  const [isOpen, toggleOpen] = useState(false);

  return (
    <div className="dhis2-map-legend">
      {isOpen ? (
        <div className="dhis2-map-legend-content" onMouseLeave={() => toggleOpen(false)}>
          <LegendLayer {...props} />
        </div>
      ) : (
        <div className="dhis2-map-legend-button" title={"Legend"} onMouseEnter={() => toggleOpen(true)} />
      )}
    </div>
  );
};

Legend.propTypes = {
  layers: PropTypes.array.isRequired,
};

export default Legend;
