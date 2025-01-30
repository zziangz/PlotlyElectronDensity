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
import Plot from 'react-plotly.js';
import './index.css';
import { type } from '@testing-library/user-event/dist/type';
import { hover } from '@testing-library/user-event/dist/hover';

const atomPlotSchema = {
  "H": { color: "blue", radius: 0.31 },
  "C": { color: "black", radius: 0.76 },
  "N": { color: "yellow", radius: 0.71 },
  "O": { color: "red", radius: 0.66 },
  "F": { color: "green", radius: 0.57 },
}

const AtomLegend = () => {
  return (
    <div className="atom-schema-legend">
      <table>
        <thead>
          <tr>
            <th>Atom</th>
            <th>Shape</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(atomPlotSchema).map(([atom, { color, radius }]) => (
            <tr key={atom}>
              <td>{atom}</td>
              <td>
                <div className="atom-schema-color" style={{
                  backgroundColor: color,
                  width: `${radius * 50}px`,
                  height: `${radius * 50}px`,
                  borderRadius: "50%",
                }}></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const LinearSlider = ({ key, value, onChange }) => {
  return (
    <div class="slidecontainer" key={key}>
      <input type="range" min="0" max="1" step="0.01" value={value} class="slider" id={key} onChange={onChange} />
    </div>
  );
}
const LogSlider = ({ key, value, max, onChange }) => {
  const [slideValue, setSlideValue] = useState(Math.log10(value) / 8 * max + max);
  const logValue = (vslide) => {
    return Math.pow(10, 8 * vslide / max - 8).toExponential(2);
  }
  const onClick = () => {
    onChange({ target: { value: slideValue } });
  }
  return (
    <div class="slidecontainer" key={key}>
      <input 
        type="range"
        min="0"
        max={max}
        step="0.005"
        value={slideValue}
        class="slider"
        id={key}
        onChange={(e) => setSlideValue(e.target.value)}
        onMouseUp={onClick}
      />
      <button onClick={onClick}>isosurface threshold {logValue(slideValue)}</button>
    </div>
  );
}
const volumeTrace = (data, config) => {
  const { x, y, z, rhor, rhorMax } = data;
  const { opacity, threshold } = config;
  return {
    type: 'volume',
    x,
    y,
    z,
    value: rhor,
    colorscale: 'Viridis',
    colorbar: {
      tickmode: 'array',
      tickvals: [threshold, 0.1, rhorMax],
      type: 'log',
    },
    showscale: false,
    opacityscale: [[0, 0], [threshold, 0], [0.1, 0.1], [rhorMax, 1]],
    opacity: opacity,
    isomax: rhorMax, 
    isomin: threshold,
    surface: {
      count: 17,
    },
    hovertemplate: 'rhor: %{value:.2f}<extra></extra>',
  };
}

const moleculeTrace = (data) => {
  const { centered } = data;
  const [x, y, z, atom, size, color] = centered.reduce((acc, line) => {
    const [atom, x, y, z] = line;
    const { color, radius } = atomPlotSchema[atom];
    acc[0].push(x);
    acc[1].push(y);
    acc[2].push(z);
    acc[3].push(atom);
    acc[4].push(radius * 100);
    acc[5].push(color);
    return acc;
  }, [[], [], [], [], [], []]);
  const trace = {
    type: 'scatter3d',
    mode: 'markers',
    x,
    y,
    z,
    marker: {
      size,
      color,
    },
    hovertemplate: 'Atom: %{text}<br>x: %{x:.2f}<br>y: %{y:.2f}<br>z: %{z:.2f}<extra></extra>',
    text: atom,
  };
  return trace;
};
   
const DensityVis = ({ data }) => {
  const [trace, setTrace] = useState({});
  const [traceConfig, setTraceConfig] = useState({
    opacity: 0.3,
    threshold: 1e-2,
  });
  const layout = {
    autosize: true,
    margin: { t: 0, r: 0, b: 0, l: 0 },
    scene: {
      xaxis: {showbackground: false, visible: true},
      yaxis: {showbackground: false, visible: true},
      zaxis: {showbackground: false, visible: true}
    },
  };
  // button to switch between different isosurfaces

  useEffect(() => {
    if (data) {
      setTrace([
        volumeTrace(data, traceConfig),
        moleculeTrace(data),
      ]);
    }
  }, [data, traceConfig]);
  return (
    <div className="density-vis">
      <>
        <Plot
          data={trace}
          layout={layout}
        />
      </>
      <>
        <LogSlider key="threshold" value={traceConfig.threshold} max={data.rhorMax} onChange={(e) => setTraceConfig({ ...traceConfig, threshold: parseFloat(e.target.value) })} />
        <AtomLegend />
      </>
    </div>
  );
}

export default DensityVis;
