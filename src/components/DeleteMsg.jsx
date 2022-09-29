import { Button } from '@mui/material'
import React, { useContext } from 'react'
import { appContext } from '../context/AppContext'

const DeleteMsg = ({msg}) => {
  const {deleteMsg, onClickButton, setSelected} = useContext(appContext)
  
  
  return (
    <div style={{backgroundColor: 'whitesmoke', borderRadius: 5, margin: 10, padding: 20}}>
      <h4 style={{color: 'black', marginTop: 0}}>Estás seguro de eliminar este mensaje?</h4> 
      <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '10px'}}>
        <Button  onClick={() => {
          onClickButton('modalDeleteMsg')
          setSelected(false)
          }}>Cancelar</Button>
        <Button onClick={() => {
          deleteMsg(msg.path, msg.id, msg.collectionId)
          onClickButton('modalDeleteMsg')
          }}>Eliminar</Button>
      </div>
    </div>
  )
}

export {DeleteMsg}