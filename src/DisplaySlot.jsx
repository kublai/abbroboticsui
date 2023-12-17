
import './App.css';

export default function DisplaySlot({classNameMain, classNameSlot, featureData}) {
  // calculate the header status background and icon for the component
  const [ slotHeaderBg, slotHeaderIcon ] = getHeaderClasses(featureData.controls);

  //console.log(featureData);
  let controlsList1 = [];
  let controlsList2 = [];
  let bigSlotFlag = (classNameMain.indexOf("grid-slot-big") > -1);
  if (bigSlotFlag){ //for big-slots divide the data in two groups
    const totalElements = featureData.controls.length;
    const group1 = featureData.controls.slice(0,totalElements/2); //splice remove the elements
    const group2 = featureData.controls.slice(totalElements/2);
    controlsList1 = generateRows(group1);
    controlsList2 = generateRows(group2);
 } else {
    controlsList1 = generateRows(featureData.controls);
  };
  
  if (bigSlotFlag){
    return (
      <div className={classNameMain}>
        <div className="slot-header-container">
          <div className={`slot-header `+ slotHeaderBg }>
            <div><span className="material-symbols-outlined white">circle</span></div>
            <div className="white"> {featureData.name} </div>
            <div><span className="material-symbols-outlined white">{slotHeaderIcon}</span> </div>
          </div>
        </div>
        <div className={`display-flex `+ classNameSlot}>
          <table>
            <thead>
              <tr>
                <th style={{ "width": "65px"}}>Control</th>
                <th style={{ "width": "65px" }}>Dev</th>
                <th style={{ "width": "108px"}} colSpan={2}>Dev Out Tol</th>
              </tr>
            </thead>
            <tbody>
              {controlsList1}
            </tbody>
          </table>
          <table>
            <thead>
              <tr>
                <th style={{ "width": "65px" }}>Control</th>
                <th style={{ "width": "65px" }}>Dev</th>
                <th style={{ "width": "108px"}} colSpan={2}>Dev Out Tol</th>
              </tr>
            </thead>
            <tbody>
              {controlsList2}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span class="material-symbols-outlined grey">more_horiz</span></div>      
      </div>
    );
  }else{
    return (
      <div className={classNameMain}>
        <div className="slot-header-container">
          <div className={`slot-header `+ slotHeaderBg }>
            <div><span className="material-symbols-outlined white">circle</span></div>
            <div className="white"> {featureData.name} </div>
            <div><span className="material-symbols-outlined white">{slotHeaderIcon}</span> </div>
          </div>
        </div>
        <div className={classNameSlot}>
          <table>
            <thead>
              <tr>
                <th style={{ "width": "65px" }}>Control</th>
                <th style={{ "width": "65px" }}>Dev</th>
                <th style={{ "width": "108px" }} colSpan={2}>Dev Out Tol</th>
              </tr>
            </thead>
            <tbody>
              {controlsList1}
            </tbody>
          </table>
        </div>
        <div className="table-footer"><span class="material-symbols-outlined grey">more_horiz</span></div>      
      </div>
    );
  }

}

/**
 * Generates data rows for the tables including icon and color
 * @param {Array} group 
 * @returns 
 */
function generateRows(group){
  //console.log(group);
  return group.map( (item,index) => {
    const control = item.control;
    const measurement = item.measurement;
    const deviation = item.deviation;
    const tolerance = item.tolerance;
    let dev = measurement * (1 + deviation); //algebraic sum,  works for positive and negative deviations
    const measWithTol = measurement + tolerance;
    let dot = measWithTol - dev;
    dev = Math.round(dev*100)/100;
    dot = Math.round(dot*100)/100;
    let status = "cancel" //error icon
    let statusColor = "red";
    if ((Math.abs(dot)/dev) <= 0.10){
      status = "check_circle" //ok icon
      statusColor = "green";
    }else if((Math.abs(dot)/dev) <= 0.30){
      status = "error" //warning icon
      statusColor = "yellow";
    }
    return <tr key={index}>
      <td className="textLeft" style={{"width":"62px" }}>{control}</td>
      <td className="textRight" style={{"width":"62px" }}>{dev}</td>
      <td className="textRight" style={{"width":"62px" }}>{dot}</td>
      <td className="textCenter" style={{"width":"42px"}}><span className={"material-symbols-outlined " + statusColor}>{status}</span></td> 
    </tr>
  });
}

/**
 * calculates the general status background and icon for the component
 * @param {Array} group 
 */
function getHeaderClasses(group){
  let flagWarningLevel = false;
  let flagErrorLevel = false;
  group.forEach(item => {
    let dev = item.measurement * (1 + item.deviation);
    let dot = item.measurement + item.tolerance - dev;
    dev = Math.round(dev*100)/100;
    dot = Math.round(dot*100)/100;
    if (flagErrorLevel === false && flagWarningLevel === false && (Math.abs(dot)/dev) > 0.10 && (Math.abs(dot)/dev) <= 0.30){
      flagWarningLevel = true;
      return;
    }
    if(flagErrorLevel === false  && (Math.abs(dot)/dev) > 0.30){
      flagErrorLevel = true;
      return;
    }
  });
  if (flagErrorLevel === true) {
    return ["bg-red", "cancel"];
  }
  if (flagWarningLevel === true) {
    return ["bg-yellow", "error"]; //warning icon
  }
  return ["bg-green", "check_circle"];
}
