
const convertToTimeStamp = (cTime) =>{
  if (cTime === '') return null;
  let d = new Date();
  let time = cTime.match(/(\d+)(:(\d\d))?\s*(p?)/);
  d.setHours( Number(time[1]) + ( ( Number(time[1]) < 12 && time[4] ) ? 12 : 0) );
  d.setMinutes( Number(time[3]) || 0 );
  d.setSeconds(0, 0);
  return d;
}


module.exports = {

  getTimeDifference : (startTime, endTime) =>{
    if(startTime !== "" && endTime !== "") {
      const tStart = convertToTimeStamp(startTime);
      const tStop = convertToTimeStamp(endTime);
      return (tStop - tStart)/(1000*60);
    }
    return 0;
  }
}