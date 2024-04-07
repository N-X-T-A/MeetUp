import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "../css/pages/test.css";
import { VideoPlayer } from "../components/VideoPlayer";
import { useContext } from "react";
import { RoomContext } from "../context/RoomContext";

interface AutoLayoutExampleProps {
  numberOfItems: number;
}

function AutoLayoutExample({ numberOfItems }: AutoLayoutExampleProps) {
  const { stream } = useContext(RoomContext);

  const maxRows = 3;
  const maxCol = numberOfItems > 12 ? 11 : numberOfItems;
  const numberOfRows = Math.min(Math.ceil(maxCol / 4), maxRows);

  const totalCells = numberOfRows * 4;

  const itemsToShow = numberOfItems > totalCells ? totalCells : numberOfItems;

  const rows: JSX.Element[] = [];
  for (let i = 0; i < numberOfRows; i++) {
    const cols: JSX.Element[] = [];
    for (let j = 0; j < 4; j++) {
      const index = i * 4 + j;
      if (index === 11 && numberOfItems > 12) {
        cols.push(
          <Col key={index} style={{ backgroundColor: "black", color: "white" }}>
            +{numberOfItems - 11}
          </Col>
        );
      } else if (index < itemsToShow) {
        cols.push(<Col key={index}>{<VideoPlayer stream={stream} />}</Col>);
      } else {
        cols.push(<Col key={index}></Col>);
      }
    }
    rows.push(<Row key={i}>{cols}</Row>);
  }

  return <Container>{rows}</Container>;
}

export function Test() {
  const [numberOfItems, setNumberOfItems] = useState(12);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value)) {
      setNumberOfItems(value);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={numberOfItems}
        onChange={handleChange}
        min="1"
      />
      <AutoLayoutExample numberOfItems={numberOfItems} />
    </div>
  );
}
