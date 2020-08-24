import React from 'react';
import './Modal.css'

class Modal extends React.Component {

  closeModal = () => {
    this.props.closeModal()
  }

  render() {
    return (
     this.props.showModal ?         
      <div className="modal-wrapper">
        <div className="modal-backdrop" onClick={ this.closeModal }/>
        <div className="modal-content">
          { this.props.children }
        </div>
      </div> : null
    )
  }
}

export default Modal