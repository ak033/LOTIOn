import { getByTitle } from '@testing-library/react';
import React,{useEffect, useState} from 'react';
import Navigations from './components/Navigations';
import NoteEmpty from './components/NoteEmpty'
import NotesText from './components/NotesText';

import { 
  BrowserRouter, 
  Route,
  Routes, 
  Link,Navigate, useOutletContext} from 'react-router-dom';

function App() {
  
  return(
    <div>

<div>
          
         
        </div>
 
    
<BrowserRouter>
          <Routes>
            <Route element={<Navigations />}>
        
            <Route path="/" element={<NoteEmpty />} />
              <Route path="/notes" element={<NoteEmpty />} />
              <Route
            path="/notes/:noteId/edit"
            element={<NotesText edit={true} />}
          />
              <Route path="/notes/:noteId" element={<NotesText edit={false} />} />

              <Route path="*" element={<NoteEmpty />} />
          
            </Route>
          </Routes>
        </BrowserRouter>
  
    </div>
  );
}

export default App;

