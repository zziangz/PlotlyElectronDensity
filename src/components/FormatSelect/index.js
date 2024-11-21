/*
 * Created on Wed Nov 20 2024
 *
 * Copyright (c) 2024 St. Jude Children's Research Hospital
 *
 * High Performance Computing Center
 *
 * Ziang Zhang
 *
 *                             :---:                          
 *                          =#######=                        
 *                         *##########-                      
 *                        :############.                     
 *                        =###########=                      
 *                         +########+                        
 *                        :*#######*:                        
 *                        #######+.                          
 *                       =########+                          
 *                       +##*--=+##:  :===                   
 *                       +##**#####*+###*-                   
 *                       +############=          :.          
 *                 .:-==++++++=====++++++==-:.   ..          
 *           .::---:.                      ..:--::.          
 *          .                                      .         
 */
import React, { useState, useEffect } from 'react';

const FormatSelect = ({ supportedFormat, setSelectedFormat}) => {
  const [formatIndex, setFormatIndex] = useState(0);

  useEffect(() => {
    // default to the first supported format
    if (supportedFormat.length > formatIndex) {
      setSelectedFormat(supportedFormat[formatIndex]);
    } else {
      setFormatIndex(0);
      setSelectedFormat(supportedFormat[0]);
    }
  }, [supportedFormat]);

  useEffect(() => {
    // update the selected format
    setSelectedFormat(supportedFormat[formatIndex]);
  }, [formatIndex]);

  const handleChange = (event) => {
    setFormatIndex(event.target.selectedIndex);
  }

  return (
    <div>
      <h3>Input Schema</h3>
      <select onChange={handleChange} value={supportedFormat[formatIndex].dataset || 0}>
        {supportedFormat.map((format, index) => (
          <option
            key={index}
            value={format.dataset}
            data-description={format.description}
            disabled={format.disabled || false}
          >
            {format.dataset}
          </option>
        ))}
      </select>
      <p>{supportedFormat[formatIndex].description}</p>
    </div>
  );
}

export default FormatSelect;
