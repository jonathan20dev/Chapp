import React, { useContext } from 'react'
import { useState } from 'react'
import { appContext } from '../context/AppContext'

const EditMsg = ({msg}) => {
  const {onClickButton, updateMsg, setSelected, setSelectedMsg} = useContext(appContext)
  const [newMsg, setNewMsg] = useState(msg.text)
  
  const editar = () => {
    updateMsg(msg.path, msg.id, {
      ...msg,
      ['text']: newMsg
    }, msg.collectionId) 
    onClickButton('modalEditMsg')
    setSelectedMsg('')
  }

  const handleChange = ({ target }) => {
    setNewMsg(target.value)
  }

  return (
    <div style={{backgroundColor: 'whitesmoke', borderRadius: 5, margin: 10, padding: 20, width: '350px'}}>
      <h4 style={{color: 'black', marginTop: 0}}>Editar mensaje</h4> 
      <textarea style={{width: '310px', resize: "none"}} value={newMsg} onChange={handleChange}/>
      <div style={{display: 'flex', justifyContent: 'space-between', paddingBottom: '10px'}}>
        <button onClick={() => {
          onClickButton('modalEditMsg')
          setSelected(false)
          }}>Cancelar</button>
        <button onClick={editar}>Editar</button>
      </div>
    </div>
  )
}

export {EditMsg}