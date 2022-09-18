import { TextField } from '@mui/material'
import moment from 'moment'
import React, { useContext } from 'react'
import { useState } from 'react'
import { appContext } from '../context/AppContext'

const EditMsg = ({msg}) => {
  const {onClickButton, updateMsg, setSelected, setSelectedMsg} = useContext(appContext)
  const [newMsg, setNewMsg] = useState(msg.text)
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

      {editOption === '' && (<div style={{display: 'flex', justifyContent: 'space-between'}}>
        <button onClick={() => {setEditOption('texto')}}>
          texto
        </button>
        <button onClick={() => {
          setEditOption('autodestruccion')
          !newDestrucTime && setNewDestrucTime(moment().format("YYYY-MM-DDTHH:mm").toString())
          }}>
          Autodestruccion
        </button>
      </div>)}

      {editOption === 'texto' && (<div>
        <textarea style={{width: '310px', resize: "none"}} value={newMsg} onChange={handleChange}/>
      </div>)}

      {editOption === 'autodestruccion' && (<div>
        <input type="datetime-local" style={{width: '100%'}} value={newDestrucTime} min={moment().format("YYYY-MM-DDTHH:mm").toString()} onChange={handleDateTimeChange}/>
      </div>)}

      {editOption !== '' && (<div>
        <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0px 10px 0px'}}>
          <button onClick={() => {
            onClickButton('modalEditMsg')
            setSelected(false)
            }}>Cancelar</button>
          <button onClick={editOption === 'texto' ? editarTexto : editarAutodestruccion}>Editar</button>
        </div>
      </div>)}
    </div>
  )
}

export {EditMsg}