import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";

const Register = () => {
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
        blockedUsers : []
    });

    const navegate = useNavigate();

    const { name, email, password, error, loading, blockedUsers } = data;

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
        setData({ ...data, error: "All fields are required" });
    }
    try {
        const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
        );
        await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
        blockedUsers,
        cantMsg: 0,
        cantImg: 0,
        cantVid: 0,
        cantAud: 0,
        words: 0,
        ArrayFriends: []
        });
        setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
        blockedUsers
        });
        navegate("/");
    } catch (err) {
        setData({ ...data, error: err.message, loading: false });
    }
    };

  return (
    <section>
      <h3>Create An Account</h3>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input_container">
          <label htmlFor="name">Name</label>
          <input type="text" name="name" value={name} onChange={handleChange} />
        </div>
        <div className="input_container">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>
        {error ? <p className="error">{error}</p> : null}
        <div className="btn_container">
          <button className="btn" disabled={loading}>
            {loading ? "Creating ..." : "Register"}
          </button>
        </div>
      </form>
    </section>
  )
}

export {Register}