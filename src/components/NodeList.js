import { gql, graphql } from "react-apollo";
import React from "react";

const allNodes = gql`
  {
    nodes {
      id
      name
    }
  }
`;

function NodeList(props) {
  return props.data.nodes && props.data.nodes.length > 0 ? (
    <div>{props.data.nodes.map(node => <p key={node.id}>{node.name}</p>)}</div>
  ) : (
    <div>Loading</div>
  );
}

export default graphql(allNodes)(NodeList);
