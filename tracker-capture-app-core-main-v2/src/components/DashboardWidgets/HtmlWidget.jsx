import React, { useEffect, useState } from "react";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";

const HtmlWidget = (props) => {
  const [widgetData, setWidgetData] = useState(null);
  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.id === nextProps.id) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }
  useEffect(() => {
    setWidgetData(null);
    props.data().then((wd) => {
      setWidgetData(wd);
    });
  }, [props.id]);

  return <React.Fragment>{widgetData || <LoadingMask />}</React.Fragment>;
};
export default HtmlWidget;
