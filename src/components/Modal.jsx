import React from 'react'
import ReactDOM from 'react-dom'
const styles = {
  ModalBackground : {
    background: 'rgba(32,35,41,.1)',
    position: 'fixed',
    top: '-10px',
    left: '-10px',
    right: '-10px',
    bottom: '-10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    zIndex: '3',
  }
}

const Modal = ({ children }) => {
  return ReactDOM.createPortal (
    <div style={styles.ModalBackground}>
      {children}
    </div>,
    document.getElementById('modal')
  )
}

export {Modal}