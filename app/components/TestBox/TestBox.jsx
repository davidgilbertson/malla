import React from 'react';
const {Component, PropTypes} = React;
import {DragSource} from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {
      boxId: props.boxId,
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDropSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

class TestBox extends Component {
  render() {
    const {connectDropSource, isDragging, boxId} = this.props;
    console.log('  --  >  TestBox.jsx:23 > render > boxId:', boxId);

    const styles = {
      boxWrapper: {
        position: 'absolute',
        left: 100,
        top: 100,
        height: 200,
        width: 200,
        background: isDragging ? 'beige' : 'deeppink',
        border: '2px solid black',
        cursor: 'hand',
      },
    };

    if (isDragging) {
      console.log('  --  >  TestBox.jsx:35 > render IS DRAGGING!');
    }

    return connectDropSource(
      <div style={styles.boxWrapper}>
        I am a test box
      </div>
    );
  }
}

export default DragSource('BOX', cardSource, collect)(TestBox);
