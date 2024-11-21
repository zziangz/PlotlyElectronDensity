import logo from './logo.svg';
import './App.css';
import ClassicLayout from './layouts/classic';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          <img src={logo} className="App-logo" alt="logo" />
          <span>Molecular Structure Visualize</span>
        </p>
      </header>
      <ClassicLayout />
    </div>
  );
}

export default App;
