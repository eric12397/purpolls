import React from 'react';
import './Tooltip.css';

class Tooltip extends React.Component {
  render() {
    const { text } = this.props;
    return (
      <div tooltip-text={ `${text}` }>
        { this.props.children }
      </div>
    )
  }
}

export default Tooltip