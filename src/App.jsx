import { useState, useEffect } from 'react'
import './App.css'

// GO TO https://cors-anywhere.herokuapp.com/corsdemo for access to Ubersmith API

function App() {
  const username = import.meta.env.username;
  const password = import.meta.env.password;
  const fetchClientURL = import.meta.env.fetchClientURL;
  const fetchClientMetadataURL = import.meta.env.fetchClientMetadataURL;
  const base64creds = btoa(`${username}:${password}`);
  const [data, setData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [id, setId] = useState(null);

  async function getClient() {
    // FETCH Client Company and Contact Information
    await fetch(fetchClientURL) ({
      method: "GET",
      headers: {
        'Authorization': `Basic ${base64creds}`,
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(json => setData(json))
    .catch(error => console.error(error));
    
    // FETCH Client Custom fields
    await fetch(fetchClientMetadataURL) ({
      method: "GET",
      headers: {
        'Authorization': `Basic ${base64creds}`,
        "Content-Type": "application/json",
      }
    })
    .then(response => response.json())
    .then(json => setMetaData(json))
    .then(console.log(metaData))
    .catch(error => console.error(error))
    .finally(setIsLoaded(true))
  }

  return (
    <>
      <div className="jobEntryDiv">
        <label for="ubID">Ubersmith Client ID </label>
        <input
          required
          placeholder="Enter Client ID"
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="submit"
          value={"Search"}
          onClick={() => {
          getClient();
          setId[({id: id})];
          }
          }/>
        </div>
      {isLoaded ? 
      <div>
          <h1>{data.data.company}</h1>
          <hr/>
          <h2>Company Information</h2>
          <p>Address: {data.data.address}</p>
          <p>City: {data.data.city} {data.data.state}, {data.data.zip}</p>
          <p>Contact: {data.data.full_name}</p>
          <p>Email: {data.data.email}</p>
          <br/>
          <div>
          <h2>Client Infrastructure</h2>
          {/* <p>Client Account Status: {metaData.data[225].client_access == "0" ? <p>OK</p> : metaData.data[271].client_access == "0" ? <p>OK</p> : <p>Suspended</p>}</p> */}
          </div>
      </div>
      : <h2>Enter a Client ID</h2> }
    </>
  )
}

export default App
