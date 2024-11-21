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
import FormatSelect from '../../components/FormatSelect';
import FileDrop from '../../components/FileDrop';
import supportedFormat from '../../components/FormatSelect/inputFormat';
import DensityVis from '../../components/DensityVis';
import './index.css';


const ClassicLayout = () => {
  const [selectedFormat, setSelectedFormat] = useState({});
  const [files, setFiles] = useState({});
  const [data, setData] = useState(null);
  const [fileString, setFileString] = useState(''); //triggers update
  // declare required files
  useEffect(() => {
    const requiredFiles = {};
    if (!selectedFormat.files) {
      return;
    }
    selectedFormat.files.forEach(file => {
      if (file.required) {
        requiredFiles[file.filename] = null;
      }
    });
    setFiles(requiredFiles);
  }, [selectedFormat]);

  useEffect(() => {
    const fileHandler = selectedFormat.parser;
    const numFileMissing = Object.values(files).filter(file => file === null).length;
    const decodeFile = async () => {
      const data = await fileHandler({ files });
      setData(data);
    }
    if (numFileMissing === 0 && Object.keys(files).length > 0 && fileHandler) {
      decodeFile();
    }
  }, [fileString, selectedFormat, files]);

  return (
    <div className="classic-layout grid-container">
      <div>
        <FormatSelect
          supportedFormat={supportedFormat}
          setSelectedFormat={setSelectedFormat}
        />
        <FileDrop
          fileSchema={selectedFormat.files || []}
          files={files}
          setFiles={setFiles}
          setFileString={setFileString} 
          onClick={() => console.log(files)}
        />
      </div>
      <div>
        {data 
        ? ( <DensityVis data={data} /> )
        : <h2 style={{"margin-top": "40px"}}>Upload files to visualize</h2>
        }
      </div>
    </div>
  );
}

export default ClassicLayout;
