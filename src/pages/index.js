import React from "react";
import withData from "../lib/withData";
import NodeList from "../components/NodeList";

export default withData(props => {
  return (
    <div>
      <h3>Nodes</h3>
      <NodeList />
    </div>
  );
});
