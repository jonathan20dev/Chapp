import React, { useState, useEffect, useContext } from "react";
import {Camera} from "../components/svg/Camera";
import Img from "../profile.png";
import { storage, db, auth } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import {Delete} from "../components/svg/Delete";
import { useNavigate } from "react-router-dom";
import { appContext } from "../context/AppContext";

const Profile = () => {
  const {Me, setMe} = useContext(appContext)
  const [img, setImg] = useState("");
  const [user, setUser] = useState();
  const navigate = useNavigate("");
  Me.ArrayFriends.sort((a,b)=> b.cant - a.cant)

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if (docSnap.exists) {
        setUser(docSnap.data());
      }
    });

    if (img) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()} - ${img.name}`
        );
        try {
          if (user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath));
          }
          const snap = await uploadBytes(imgRef, img);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));

          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });

          setImg("");
        } catch (err) {
          console.log(err.message);
        }
      };
      uploadImg();
    }
  }, [img]);

  const deleteImage = async () => {
    try {
      const confirm = window.confirm("Delete avatar?");
      if (confirm) {
        await deleteObject(ref(storage, user.avatarPath));

        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          avatar: "",
          avatarPath: "",
        });
        navigate("/");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return user ? (
    <>
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || Img} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImage={deleteImage} /> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => setImg(e.target.files[0])}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>Joined on: {user.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
      <br/>
    </section>
    <section style={{marginTop: "10px", marginBottom: '15px'}}>
      <div className="profile_container">
        <div className="img_container">
        </div>
        <div className="text_container">
          <h3>{"My Stats"}</h3>
          
          {
          (Me.ArrayFriends.length > 0) &&
          <div>
            <h3>Contactos más frecuentes</h3>
            {Me.ArrayFriends.map((el,index) => 
              <React.Fragment key={index}>
              <p >{el.name}</p>
              <li>{"Mensajes enviados: "+el.cant}</li>
              </React.Fragment>
            )}
          </div>
          }
          <h3>{"Estadisticas general:"}</h3>
          <p>{"Cantidad de mensajes enviados: "+Me.cantMsg}</p>
          <p>{"Cantidad de imagenes enviados: "+Me.cantImg}</p>
          <p>{"Cantidad de videos enviados: "+Me.cantVid}</p>
          <p>{"Cantidad de audios enviados: "+Me.cantAud}</p>
          <p>{"Cantidad de palabras enviados: "+Me.words}</p>
        </div>
      </div>
      <br/>
    </section>
    </>
  ) : null;
};

export {Profile}