import npyjs from "npyjs";

const readFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    }
    reader.readAsArrayBuffer(file);
  });
}

const vectorMatrixMultiply = (v, m) => {
  const [x, y, z] = v;
  const [a, b, c, d, e, f, g, h, i] = m.flat();
  return [a * x + b * y + c * z, d * x + e * y + f * z, g * x + h * y + i * z];
}
const maxArray = (arr) => arr.reduce((a, b) => Math.max(a, b), -Infinity);

const rhorXYZ = (rho, gridSizes, box) => {
  const [nx, ny, nz] = gridSizes;
  const xArray = [];
  const yArray = [];
  const zArray = [];
  for (let i = 0; i < nx; i++) {
    for (let j = 0; j < ny; j++) {
      for (let k = 0; k < nz; k++) {
        const [x, y, z] = vectorMatrixMultiply([i / nx, j / ny, k / nz], box);
        xArray.push(x);
        yArray.push(y);
        zArray.push(z);
      }
    }
  }
  const rhor = rho.data;
  return [xArray, yArray, zArray, rhor];
};


const parseQM9 = async ({ files } ) => {
  let n = new npyjs();
  const rhobuffer = await readFile(files["rho_22.npy"]);
  const rho = n.parse(rhobuffer);
  const gridSizes = await readFile(files["grid_sizes_22.dat"]).then(buffer => {
    const text = new TextDecoder().decode(buffer);
    return text.split("\n").map(Number);
  });
  const box = await readFile(files["box.dat"]).then(buffer => {
    const text = new TextDecoder().decode(buffer);
    return text.split("\n", 3).map(line => line.split(" ").map(Number));
  });
  const centered = await readFile(files["centered.xyz"]).then(buffer => {
    const text = new TextDecoder().decode(buffer);
    const numAtoms = Number(text.split("\n")[0]);
    return text.split("\n").slice(2, 2 + numAtoms).map(line => {
      const [atom, x, y, z] = line.split(" ");
      return [atom, Number(x), Number(y), Number(z)];
    });
  });
  const [x, y, z, rhor] = rhorXYZ(rho, gridSizes, box);
  const rhorMax = maxArray(rhor);
  return {
    x,
    y,
    z,
    rhor,
    rhorMax,
    gridSizes,
    box,
    centered,
  };
}

const supportedFormat = [
  {
    "dataset": "QM9",
    "description": "DFT electron density computed on geometries of QM9 molecules",
    "website": "https://data.caltech.edu/records/7vr2f-0r732",
    "citation": "Li, C., Sharir, O., Yuan, S., & Chan, G. K. (2024). QM9 DFT Electron Density [Data set]. CaltechDATA. https://doi.org/10.22002/7vr2f-0r732",
    "files": [
      {
        filename: "rho_22.npy",
        description: "DFT density in a.u.",
        format: "npy",
        required: true,
      },
      {
        filename: "grid_sizes_22.dat",
        description: "shape of the density",
        format: "dat",
        required: true,
      },
      {
        filename: "energy_22.dat",
        description: "DFT ground state energy in a.u.",
        format: "dat",
        required: false,
      },
      {
        filename: "box.dat",
        description: "box size in angstrom",
        format: "dat",
        required: true,
      },
      {
        filename: "centered.xyz",
        description: "geometry placed at the center of the box",
        format: "xyz",
        required: true,
      },
    ],
    parser: parseQM9,
  },
  {
    dataset: "TODO",
    description: "To be added",
    disabled: true,
    parser: null,
  }
];

export default supportedFormat;