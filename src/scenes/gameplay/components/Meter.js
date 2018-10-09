import React from "react";
import { BlockMeter } from "react-svg-meters";

var Meter = function(props) {
  var { value = 0 } = props;

  return (
    <div>
      <BlockMeter
        value={value}
        size={410}
        rounded={true}
        foregroundColor={"#CE1141"}
        backgroundColor={"#ffffff"}
        textColor={"#000000"}
        thickness={17}
        direction={"vertical"}
      />
    </div>
  );
};
export default Meter;
