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
import { useDropzone } from 'react-dropzone';
import SubmitButton from '../SubmitButton';

const FileTable = ({ schema, files }) => {
  const sizeFormatter = (size) => {
    if (size < 1024) {
      return `${size}`;
    }
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)}K`;
    }
    return `${(size / 1024 / 1024).toFixed(1)}M`;
  }
  return (
    <div className="fileTable">
      <table>
        <thead>
          <tr>
            <th>Filename</th>
            <th>Description</th>
            <th>Size(B)</th>
          </tr>
        </thead>
        <tbody>
          {schema && schema.filter(item => item.required).map(file => (
            <tr key={file.filename}>
              <td>{file.filename}</td>
              <td>{file.description}</td>
              {files[file.filename]
                ? (<td>{sizeFormatter(files[file.filename].size)}</td>)
                : (<td>-</td>)
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FileDrop = ({ fileSchema, files, setFiles, setFileString, onClick}) => {
  const { getRootProps, getInputProps } = useDropzone({
    //accept: fileSchema.map(file => file.format),
    onDrop: acceptedFiles => {
      updateFiles(acceptedFiles);
    }
  });
  const updateFiles = (acceptedFiles) => {
    var existingFiles = files;
    acceptedFiles.forEach(file => {
      if (existingFiles.hasOwnProperty(file.name)) {
        existingFiles[file.name] = file;
      }
    });
    setFiles(existingFiles);
    const fileString = Object.keys(existingFiles).map(key => `${key}: ${existingFiles[key].path} bytes`);
    setFileString(fileString);
  }

  return (
    <div>
      <div {...getRootProps()}>
        <h3>Drop files/folder to the table</h3>
        <input {...getInputProps()} />
        <FileTable schema={fileSchema} files={files} />
      </div>
      <SubmitButton files={files} onClick={onClick} />
    </div>
  );
}

export default FileDrop;
