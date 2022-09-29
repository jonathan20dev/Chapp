import React,{useContext} from "react";
import { Attachment } from "./svg/Attachment";
import { AudioRecord } from "./AudioRecord";
import { Send } from "./svg/Send";
import {appContext} from "../context/AppContext.js";
import axios from "axios";

const MessageForm = ({ handleSubmit, text, setText, setFile, file }) => {

const {openDialog,selectGIF,findMyLocation,handleOpenWeatherCommant, weather,setSelectedGIF,handleSearchGIFSelected, setOpenDialog,TimeLocation, reminder,handleOpenWeather, setReminder} = useContext(appContext)

const verifyCommands = () => {
  const haveNumber = stringContainsNumber(text)
  const wordCount = WordCount(text)
  if(text.includes("/searchGIF")){
    const arrayWords = text.split(" ")
    handleSearchGIFSelected(arrayWords[1])
  }if(text.includes("/wikipedia")){
    const arrayWords = text.split(" ")
    console.log(arrayWords[1])
    const endpoint = 'https://en.wikipedia.org/w/api.php?';
    const params = {
        origin: '*',
        format: 'json',
        action: 'query',
        prop: 'extracts',
        exchars: 250,
        exintro: true,
        explaintext: true,
        generator: 'search',
        gsrlimit: 20,
    };
    params.gsrsearch = arrayWords[1]
    axios.get(endpoint, { params }).then((response) => {
      let searchObject = response.data.query.pages
      console.log(response.data.query)
      let searchId = searchObject[Object.keys(searchObject)[0]]
      console.log(searchId)
      window.open(`https://en.wikipedia.org/?curid=${searchId.pageid}`)
    });

  }if(text.includes("/myLocation")){
    setText("La ubicacion actual es: "+findMyLocation())
  }if(text.includes("/showWeather")){
    handleOpenWeatherCommant()
    console.log(weather)
    setText("El clima actual es: "+weather.main)
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
