import logo from './ABB_logo.svg';
import {useEffect, useState, useRef} from 'react';
import './App.css';
import DisplaySlot from './DisplaySlot';




export default function App() {

  const serverUrl = import.meta.env.VITE_DATA_SERVER + ":" + import.meta.env.VITE_DATA_SERVER_PORT;
  console.log(serverUrl );
  const [partNumber, setPartNumber] = useState(1);
  const [data, setData] = useState('');
  const [slots, setSlots] = useState([]);
  const wsconn = useRef(null); //store the websocket connection in a reference

  //onMount
  useEffect(()=>{
    if(wsconn.ws !== undefined){  //only one connection per user allowed
      return;
    };
    wsconn.ws = new WebSocket(serverUrl);
    wsconn.ws.onmessage = function(event){
      const newData = JSON.parse(event.data);
      if (newData.features !== undefined ){
        const featureSlots = newData.features.map( (item,index) => {
          let slotClassMain = "grid-item ";
          let slotClassHeight = "grid-overflow ";
          if (index === 0){
            slotClassMain += "grid-slot-big";
            slotClassHeight += "double-height";
          } else if (index === 1){
            slotClassMain += "grid-slot-medium";
            slotClassHeight += "double-height";
          } else {
            slotClassMain += "grid-slot-standard";
            slotClassHeight += "single-height";
          }
          return <DisplaySlot key={index} classNameMain={slotClassMain} classNameSlot={slotClassHeight} featureData={item}  ></DisplaySlot>
        });
        //console.log(featureSlots);
        setData(event.data);
        setSlots(featureSlots);
      } else { //new part has been selected, clean the screen and show a message
        if (newData.part > 2){
          setSlots(<div className="loader">Only parts 1 and 2 are available in this Demo</div>);
        }else {
          const message = `Please wait for Part ${newData.part} data...`;
          setSlots(<div className="loader">{message}</div>);
        }
      }
  }
  },[]);

  /**
   * change the part number value on onchange
   * 
   */
  function changePartNumber(e){
    setPartNumber(e.target.value);
  }

  /**
   * Send a ws message with the part selected
   */
  function sendPartNumber(e){
   const res = wsconn.ws.send(partNumber);
  }

  return (
    <div className="app">
      <header className="appHeader">
        <img src={logo} className="App-logo" alt="logo" height="32px" />
        <div style={{"marginTop":"12px"}}>
          <label htmlFor="partNumber">Part Number</label>
          <input type="text" name="partNumber" id="partNumber" className="inputBox" value={partNumber} onChange={changePartNumber}/>
          <button type="button" name="btnPartNumber" className="btnDefault" onClick={sendPartNumber}>Get Data</button>
        </div>
      </header>
      <div className="grid-container">
        {slots}
      </div>
    </div>
  );
}


