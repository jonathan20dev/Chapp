import React, { useState } from "react";
import { StopRecord } from './svg/StopRecord'
import { Record } from './svg/Record'

const AudioRecord = ({setFile}) => {
    const [recording, setRecording] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState()

    // This is the main thing to recorde the audio 'MediaRecorder' API
    const handleRecord = async () => {
        setRecording(true)
        let stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
        let mediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(mediaRecorder)
        
        mediaRecorder.start()
    
        let chunks = [];
        mediaRecorder.ondataavailable = (e)=>{
              chunks.push(e.data);
        }
        //function to catch error
        mediaRecorder.onerror = (e)=>{
              alert(e.error);
        }
    
        mediaRecorder.onstop = (e)=>{
          let blob = new Blob(chunks);
          const file = new File([blob], "audio", { 
            'type': 'audio/mp3' 
          });
          //create url for audio let url = URL.createObjectURL(blob);
          setFile(file)
        }
      }
      
  return (
    <div style={{ margin: "0px 5px 0px 5px" }} >
      {recording ? (
        <label onClick={() => {
            mediaRecorder.stop()
            setRecording(false)
            //handleSubmit()
          }}>
            <StopRecord/>
        </label>
        
      ) : (
        <label onClick={handleRecord}>
            <Record/>
        </label>
      )}
    </div>
  );
};

export { AudioRecord };
