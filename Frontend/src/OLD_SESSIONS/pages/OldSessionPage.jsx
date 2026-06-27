import React from 'react'
import { useOldSessionStore } from '../store/oldSessionStore';
import { useEffect } from 'react';
import { useState } from 'react';

const OldSessionPage = () => {
    const [addSessionModel, setAddSessionModel] =useState(false);
    const [name, setName] = useState(null);
    const [year, setYear] = useState(null);
    const {
      oldSessions,
      loading,
      error,
      fetchOldSessions,
      updateOldSession,
      deleteOldSession,
      createOldSession
    } = useOldSessionStore();
    useEffect(() => {
      fetchOldSessions();
    },[]);
    console.log(oldSessions);

    async function handleCreate() {
        try {
           createOldSession({name, year}) 
        } catch (error) {
            alert(error.message)
        }
    }
    
  return (
    <div>
       <h1>OLD SESSION</h1>
        <button onClick={()=> setAddSessionModel(prev => !prev)}>ADD OLD SESSION</button>
       {oldSessions.map((o) => (
          <div key={o.old_session_id}>
            <p>{o.name}</p>
            <p>{o.year}</p>
          </div> 
       ))} 

       {addSessionModel && (
        <div className='border'>
          <input type="text" placeholder="Name"  onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Year"  onChange={e => setYear(e.target.value)} />
          <button onClick={handleCreate}>ADD</button>
        </div>
       )}
    </div>
  )
}

export default OldSessionPage