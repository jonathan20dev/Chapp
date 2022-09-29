import { Button, TextField } from '@mui/material'
import moment from 'moment'
import React, { useContext } from 'react'
import { useState } from 'react'
import { appContext } from '../context/AppContext'

const EditMsg = ({msg}) => {
  const {onClickButton, updateMsg, setSelected, setSelectedMsg, cifrar, descifrar} = useContext(appContext)
  const [newMsg, setNewMsg] = useState(descifrar(msg.text, msg.id))
  const [newDestrucTime, setNewDestrucTime] = useState(msg.Autodestruccion ? msg.Autodestruccion : '')
  const [editOption, setEditOption] = useState('')

  const handleDateTimeChange = ({target}) => {
    setNewDestrucTime(target.value)
  }

  const editarAutodestruccion = () => {
    updateMsg(msg.path, msg.id, {
      ...msg,
      ['Autodestruccion']: newDestrucTime
    }, msg.collectionId) 
    onClickButton('modalEditMsg')
    setSelectedMsg('')
  }

  const editarTexto = () => {
    updateMsg(msg.path, msg.id, {
      ...msg,
      ['text']: cifrar(newMsg, msg.id)
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

      {editOption === '' && (<div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button onClick={() => {setEditOption('texto')}}>
          texto
        </Button>
        <Button onClick={() => {
          setEditOption('autodestruccion')
          !newDestrucTime && setNewDestrucTime(moment().format("YYYY-MM-DDTHH:mm").toString())
          }}>
          Autodestruccion
        </Button>
      </div>)}

      {editOption === 'texto' && (<div>
        <textarea style={{width: '310px', resize: "none", height: '100px'}} value={newMsg} onChange={handleChange}/>
      </div>)}

      {editOption === 'autodestruccion' && (<div>
        <input type="datetime-local" style={{width: '100%'}} value={newDestrucTime} min={moment().format("YYYY-MM-DDTHH:mm").toString()} onChange={handleDateTimeChange}/>
      </div>)}

      {editOption !== '' && (<div>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0px 10px 0px'}}>
          <Button onClick={() => {
            onClickButton('modalEditMsg')
            setSelected(false)
            }}>Cancelar</Button>
          <Button onClick={editOption === 'texto' ? editarTexto : editarAutodestruccion}>Editar</Button>
        </div>
      </div>)}
    </div>
  )
}

export {EditMsg}