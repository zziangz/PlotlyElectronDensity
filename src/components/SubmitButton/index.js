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

import React from 'react';
import './index.css';

const SubmitButton = ({ files, onClick }) => {
  const numMissingFiles = Object.values(files).filter(file => file === null).length;
  const fileFulfilled = numMissingFiles === 0 && Object.keys(files).length > 0;
  const text = fileFulfilled ? "Submit" : `Missing ${numMissingFiles} files`;
  return (
    <button className="submit-button" onClick={onClick} disabled={!fileFulfilled}>{text}</button>
  );
}

export default SubmitButton;
