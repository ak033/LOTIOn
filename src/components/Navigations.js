import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link, NavLink, Outlet, Route, useNavigate, useParams } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'
import NoteSide from './NoteSide';
import { v4 as uuidv4 } from "uuid";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios'


function Navigations() {
  //  let pic = profile.picture ?  profile.picture: profile.email;
  const [ user, setUser ] = useState([]);
  const [ profile, setProfile ] = useState([]);
  const[editMode, setEditMode] = useState(false);
  const login = useGoogleLogin({
      onSuccess: (codeResponse) => setUser(codeResponse),
      onError: (error) => console.log('Login Failed:', error)
  });

  useEffect(() => {
    const asyncEffect = async () => {
      if (profile && user) {
        const promise = await fetch(
          `https://wxxo7ilvrnxdnuzpwzfhgqacba0xtmpd.lambda-url.ca-central-1.on.aws/?email=${profile.email}`, {
          method: "GET",
          headers: {
            "authorization": user.access_token,
          }
        });
        if (promise.status == 200) {
          const notes = await promise.json();

          setNotes(notes);

        }
      }

    };
    asyncEffect();
  }, [profile]);




  useEffect(
      () => {
          if (user) {
              axios
                  .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                      headers: {
                          Authorization: `Bearer ${user.access_token}`,
                          Accept: 'application/json'
                      }
                  })
                  .then((res) => {
                      setProfile(res.data);
                  })
                  .catch((err) => console.log(err));
          }
      },
      [ user ]
  );

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
      googleLogout();
      setProfile(null);
  };

  const sidebarToggle = (toggle) => {
    setToggleSide(!toggle)
  }
  
    const [editing, setEditing] = useState(false);
    const [currentNote, setCurrentNote] = useState(-1);
    const nav = useNavigate();
    const currentDate = () => {
        const date = new Date();
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
          .toJSON()
          .substring(0, 19);
      };

  const [toggleSide, setToggleSide] = useState(false);
  const [notes, setNotes] = useState([])

//         const saveNote = () => {
//     currNote.body = body;
//     currentNote.title = title;
//     currentNote.date = date;
//     localStorage.setItem("lNotes", JSON.stringify(note));
//     nav(`/${currentNote.id}`, {replace:true});
// }


// renavigate to the required URLS
useEffect(() => {
    if (currentNote < 0) {
      return;
    }
    if (!editing) {
      nav(`/notes/${currentNote + 1}`);
      return;
    }
    nav(`/notes/${currentNote + 1}/edit`);
  }, [notes]);
  

  const saveNote = async (note, index) => {
    note.body = note.body.replaceAll("<p><br></p>", "");
    setNotes([
      ...notes.slice(0, index),
      { ...note },
      ...notes.slice(index + 1),
    ]);
    console.log(profile.email);


    const res = await fetch(`https://5uxxttravlkcjhmkpdlb2ss6my0ztwsa.lambda-url.ca-central-1.on.aws/?email=${profile.email}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "authentication": user.access_token
      },
      body: JSON.stringify({ ...note, "email": profile.email }),
    });

    try {

      const jsonRes = await res.json();

      console.log(jsonRes);
    }
    catch (error) {
      console.error(error)

    }

    setCurrentNote(index);
    setEditMode(false);
  };
 

  

  const deleteNote = async (index) => {
    const noteId = notes[index].id;
    console.log("delete")

    const res =await fetch(
      "https://le3eolvngwqoj4bk5q466earzy0yhitx.lambda-url.ca-central-1.on.aws/",


      {
        method:"DELETE",
        headers: {
          "Content-Type": "application/json",
          // "Authentication": accessToken

        },
        body: JSON.stringify(
          {email: profile.email, id:noteId }
        ),
      });
    setNotes([...notes.slice(0, index), ...notes.slice(index + 1)]);
    setCurrentNote(0);
    setEditMode(false);
  };

  const [showDetails, setShowDetails] = useState(false);
  const addNote = () => {
    setNotes([
      {
        id: uuidv4(),
        title: "Untitled",
        body: "",
        when: currentDate(),
      },
      ...notes,
    ]);
    setEditing(true);
    setCurrentNote(0);
  };
 

if(!profile || !profile.name){
  return (
    <div>
      <div className = "login-center">
        <div id = "logo-area">
          <h1>Lotion</h1>
          <h5>Like Notion but Better</h5>
        </div>
        <hr className="vertical-line"></hr>
        <div className = "login-buttons" id = "login-buttons">
            <div id = "sign-in">
              <div class = "sign-in-box">
              <h1>Sign In</h1>
              <hr></hr>
              <br></br>
              
              <button id = "login" onClick={() => login()}>
              <img width ="30"src = "https://companieslogo.com/img/orig/GOOG-0ed88f7c.png?t=1633218227"></img>
                Continue with Google 
              </button>
              </div>
              <br></br>
                <br></br>
                <br></br>
                <h5>By clicking “Continue with Google” above,</h5> 
                <h5>you acknowledge that you have read a book once in your life and that you</h5>
                <h5>will give me a 100% on this</h5>
            </div>
        </div>
      </div>
    </div>
  )
}



else{

  return (
    <div class = "page-container" id = "page-container">
        <div class = "top-header">
            <aside>
            <button id="menu-button" onClick={() => sidebarToggle(toggleSide)}>
                &#9776;
            </button>
            </aside>

            <div id="logo-header">
                <h1>
                    <Link to="/notes">Lotion</Link>
                </h1>
                <h5 id="logo-header2">Like Notion, but worse.</h5>
            </div>

            <aside class = "right-side">
            {profile ? (
                <div class = "google-container" id = "google-container">
                  <div class = "google-details">
          
                  <button className="profile-pic" onClick={() => setShowDetails(!showDetails)}>  {profile.name.charAt(0)}</button>
                  <div className={`drop-down-details ${showDetails ? 'show-drop' : 'hide-drop'}`}>
                        <div className = "drop-header">
                          <div id = "drop-pic">{profile.name.charAt(0)}</div>
                          <div id = "drop-header-detail">
                            <h3>{profile.name}</h3>
                            <p>{profile.email}</p>
                           </div>
                        </div>
                        <button onClick={logOut}>Log out</button>
                    </div>
                  </div>
                </div>
            ) : (
                <button onClick={() => login()}>Sign in with Google  </button>
            )}
            </aside>
        </div>

        <div class = "main-container">
            <aside id="side-navbar" className={toggleSide ? "hidden" : null}>
                <div class = "side-header-container">
                    <div class = "side-header">
                        <h2>Notes</h2>
                        <button id="add-button" onClick={addNote}>+</button>
                    </div>
                </div>

                <div id = "sideNote-container">
                    <NoteSide notes={notes} />
                </div>
            </aside>
            <div id="write-box">
                <Outlet context={[notes, saveNote, deleteNote]} />
            </div>
        </div>

    </div>
  )
            }
}

export default Navigations








