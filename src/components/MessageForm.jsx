import React,{useContext} from "react";
import { Attachment } from "./svg/Attachment";
import { AudioRecord } from "./AudioRecord";
import { Send } from "./svg/Send";
import {appContext} from "../context/AppContext.js";

const MessageForm = ({ handleSubmit, text, setText, setFile, file }) => {

const {openDialog, setOpenDialog,TimeLocation, reminder,handleOpenWeather, setReminder} = useContext(appContext)

const verifyCommands = () => {
  const haveNumber = stringContainsNumber(text)
  const wordCount = WordCount(text)
  if(text.includes("/showWeather")){
    handleOpenWeather()
  }if(text.includes("/showHour")){
    setText("La hora actual es: "+TimeLocation())
  }if(text.includes("/createReminder")){
    (openDialog.showReminder) ? setOpenDialog({...openDialog, showReminder: false}) :  setOpenDialog({...openDialog, showReminder: true})
  }if(text.includes("/deleteReminder")){
    setText(reminder.map((item) => item.idReminder+"-"+item.nameReminder+"\n"))
    setTimeout(() => {
      setText("To delete use: /delete number")
    }, 1000);
  }if(text.includes("/showReminder")){
    (openDialog.showReminderTable) ? setOpenDialog({...openDialog, showReminderTable: false}) :  setOpenDialog({...openDialog, showReminderTable: true})
  }if(text.includes("/modifyReminder")){
    setText(reminder.map((item) => item.idReminder+"-"+item.nameReminder+"\n"))
    setTimeout(() => {
      setText("To update use: /update number")
    }, 1000);
  }if (text.includes("/delete") && haveNumber){
    const idDelete = text.slice(-1)
    const searchReminder = reminder.find(user => user.idReminder === parseInt(idDelete))
    if(searchReminder !== undefined){
        setReminder(reminder.filter(item=> item.idReminder !== searchReminder.idReminder))
        setText("Success Delete")
    }else{
      setText("No exist")
    } 
  }if (text.includes("/update") & haveNumber & wordCount !== 4){
    const idUpdate = text.slice(-1)
    const searchReminder = reminder.find(user => user.idReminder === parseInt(idUpdate))
    if(searchReminder !== undefined){
        setText("name: "+searchReminder.nameReminder+" to: "+searchReminder.to+" date: "+searchReminder.date.date+" hour: "+searchReminder.date.hour+" message: "+searchReminder.message)
        setTimeout(() => {
          setText("To update use: /update number SelectAttribute NewAttribute")
        }, 1000);
      }else{
      setText("No exist")
    } 
    //update 1 nameReminder Peda
  }if (text.includes("/update") & haveNumber & wordCount === 4){
    const arrayWords = text.split(" ")
    const idRemider = arrayWords[1]
    const selectRemider = arrayWords[2]
    const newRemider = arrayWords[3]
    const searchReminder = reminder.find(user => user.idReminder === parseInt(idRemider))
    if(searchReminder !== undefined){
      const propertyNames = Object.keys(searchReminder)
      console.log(propertyNames)
      if(propertyNames[1] === selectRemider){
        searchReminder.nameReminder = newRemider
      }if(propertyNames[2] === selectRemider){
        searchReminder.to = newRemider
      }if(propertyNames[3] === selectRemider){
        searchReminder.date.date = newRemider
      }if(propertyNames[5] === selectRemider){
        searchReminder.date.hour = newRemider
      }if(propertyNames[4] === selectRemider){
        searchReminder.message = newRemider
      }
        setText("Success Update")
    }else{
       setText("No exist Reminder")
    } 
  }
}

function stringContainsNumber(_string) {
  return /\d/.test(_string);
}

function WordCount(str) { 
  return str.split(" ").length;
}

  return (
    <div
      className='absoluteBackground'
    >
      <form className="message_form" onSubmit={handleSubmit}>
        <label htmlFor="file">
          <Attachment />
        </label>
        <input
          onChange={(e) => {
            setFile(e.target.files[0]);
          }}
          type="file"
          id="file"
          accept="image/*, video/*, audio/*"
          style={{ display: "none" }}
        />
        <div>
          <input
            type="text"
            placeholder="Enter message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ backgroundColor: "#f7f8fc" }}
          />
        </div>
        <button
          onClick={verifyCommands}
          style={{ outline: "none", backgroundColor: "#242526", border: 0 }}
        >
          <Send colorActive={!file ? "#4d94ff" : "green"} />
        </button>
        <AudioRecord setFile={setFile} />
      </form>
    </div>
  );
};

export { MessageForm };
