import React from 'react'
import './AlertTemplate.css'
import { BsCheckBox } from 'react-icons/bs'
import { MdErrorOutline } from 'react-icons/md'

const alertStyle = {
  backgroundColor: '#1f2120',
  fontSize: '14px',
  color: '#e1e1e1',
  padding:' 10px',
  borderRadius: '3px',
  display: 'flex',
  textAlign: 'center',
  justifyContent: 'space-between',
  alignItems: 'center',
  boxShadow: '3px 3px 8px black',
  boxSizing: 'border-box'
}

const buttonStyle = {
  marginLeft: '10px',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  color: '#FFFFFF'
}

const successIcon = {
  fontSize: '30px',
  color: '#5bd0de'
}

const errorIcon = {
  fontSize: '30px',
  color: 'red'
}

const AlertTemplate = ({ style, options, message, close }) => (
  <div style={{...alertStyle, ...style }} className="alert-template">
    {options.type === 'info' && '!'}
    {options.type === 'success' && <BsCheckBox style={ successIcon }/> }
    {options.type === 'error' && <MdErrorOutline style={ errorIcon }/> }
    <span style={{ marginLeft: '10px' }}> {message} </span>
    <button onClick={close} style={buttonStyle}>x</button>
  </div>
)



export default AlertTemplate