import React,{useContext} from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { appContext } from "../context/AppContext";
import CardMedia from '@mui/material/CardMedia';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { setDoc, doc  } from 'firebase/firestore';
import { db } from '../firebase';
import { v4 as uuid } from "uuid";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

let groupName = ""
let groupParticipants = []
let gid = uuid() 

function CreateGroupModal({users, user1}) {
    const {onClickButton, openModal} = useContext(appContext)
  
  const handleChange = (event,arr) => {
    groupParticipants = arr.map(p => p.uid)
  }

  const handleChange1 = ({ target: {value} }) => {
    groupName = value
  }

  const handleCreate = async() => {
    if(groupName && groupParticipants){
      if(groupParticipants.length >= 2){
        onClickButton("modalCreateGroup")
        const grupo = {name: groupName, participants: [...groupParticipants, user1], gid: gid}
        return setDoc(doc(db, 'groups', gid), grupo);
      }
      else{
        alert("Necesitas agregar al menos 2 amigos")
      }
    }
    else{
      alert("Completa todos los campos")
    }
  }

  

  return (
    <div style={{width: '100%', marginTop: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center'}}>
      <Button style={{width: '90%'}} variant="outlined" color="success" onClick={()=>onClickButton("modalCreateGroup")}>
        <strong>Create Group</strong> 
      </Button>
      <Dialog open={openModal.modalCreateGroup} onClose={()=>onClickButton("modalCreateGroup")}>
        <DialogTitle>Create group</DialogTitle>
        <CardMedia
          component="img"
          height="140"
          image="https://th.bing.com/th/id/R.ae73c2655f61932499935132eb6297c1?rik=opCk67NLUXMl6g&pid=ImgRaw&r=0"
          alt="green iguana"
        />
        <DialogContent>
          <DialogContentText><i> To create a group you must first complete the following fields</i></DialogContentText>
          <TextField 
          autoFocus margin="dense" label="Group Name" type="text" name="groupName" id="groupName" fullWidth variant="standard"
          onChange={handleChange1}
          />
        <br/>
        <br/>
        
        <Autocomplete
          multiple
          options= {users}
          disableCloseOnSelect
          getOptionLabel={(option) => option.name}
          renderOption={(props, option, { selected }) => (
            <li {...props}>
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
              {option.name}
            </li>
          )}
          style={{ width: '100%' }}
          onChange={(event,values)=>(handleChange(event,values))}
          renderInput={(params) =>{
            return(
          <TextField 
            {...params} 
            label="Friends" 
            placeholder="Search.." />)}}
        />

        </DialogContent>
        <DialogActions>
          <Button onClick={()=>onClickButton("modalCreateGroup")}>Cancel</Button>
          <Button onClick={handleCreate}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export {CreateGroupModal}