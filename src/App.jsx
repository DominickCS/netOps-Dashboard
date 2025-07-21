import { useState, useEffect } from 'react'
import './App.css'

// GO TO https://cors-anywhere.herokuapp.com/corsdemo for access to Ubersmith API

function App() {
  const [data, setData] = useState(null);
  const [metaData, setMetaData] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [id, setId] = useState(null);
  const [ppduReading, setPPDUReading] = useState(null);
  const [spduReading, setSPDUReading] = useState(null);
  const username = import.meta.env.VITE_username;
  const password = import.meta.env.VITE_password;
  const fetchClientURL = `https://cors-anywhere.herokuapp.com/https://cp.gipnetworks.com/api/2.0/?method=client.get&client_id=${id}`;
  const fetchClientMetadataURL = `https://cors-anywhere.herokuapp.com/https://cp.gipnetworks.com/api/2.0/?method=client.metadata_get&client_id=${id}`;
  const base64creds = btoa(`${username}:${password}`);
  

  async function getClient() {
    // FETCH Client Company and Contact Information
    await fetch(fetchClientURL, {
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
    await fetch(fetchClientMetadataURL, {
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
    .finally(() => setIsLoaded(true))
  }

 // async function updatePPDUReading(pduReading) {
 //    await fetch(`https://cors-anywhere.herokuapp.com/https://cp.gipnetworks.com/api/2.0/?method=uber.metadata_field_update&client_id=${id}&metaconf_id=326`, {
 //     method: "POST",
 //      headers: {
 //        'Authorization': `Basic ${base64creds}`,
 //        "Content-Type": "application/json",
 //      },
 //      "body": JSON.stringify({key : pduReading}),
 //    })
 //    .then(response => response.json())
 //    .then(json => console.log(json))
 //  }

  function supplyClient(isLoaded) {
    if (isLoaded) {
      return (
      <div>
          <h1>{data.data.company}</h1>
          <hr/>
          <h2>Company Information</h2>
          <p>Address: {data.data.address}</p>
          <p>City: {data.data.city} {data.data.state}, {data.data.zip}</p>
          <p>Contact: {data.data.full_name}</p>
          <p>Email: {data.data.email}</p>
          <br/>
          <h2>Client Infrastructure</h2>
          <p>Client Account Status: {metaData.data[225].value}</p>
          {/* <p>Client Account Status: {metaData.data[225].client_access == "0" ? <span>OK</span> : metaData.data[271].client_access == "0" ? <span>OK</span> : <span>Suspended</span>}</p> */}
          <div className="pduReadingContainer">
          <p>Primary PDU Amp Reading:</p>
          <input type="number" min="0" max="25" placeholder={metaData.data[326].value} onChange={(reading) => setPPDUReading(reading.target.value)}/>
          {/* <button onClick={() => {updatePPDUReading(ppduReading)}}>Submit PDU Reading</button> */}
          </div>
          <div className="pduReadingContainer">
          <p>Secondary PDU Amp Reading:</p>
           <input type="number" min="0" max="25" placeholder={metaData.data[327].value} onChange={(reading) => setSPDUReading(reading.target.value)}/>
          <button>Submit PDU Reading</button>
          </div>
      </div>
      )
    }
  }
// TODO : Try catch for returning api call if  metadata.data [x] exists otherwise default to error

  return (
    <>
      <div className="jobEntryDiv">
        <label htmlFor="ubID">Ubersmith Client ID </label>
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
          }
          }/>
        </div>
        <div>
        {supplyClient(isLoaded)}
        </div>
    </>
  )}
export default App
