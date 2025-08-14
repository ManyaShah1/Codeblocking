
import './App.css';
import BlocklyWorkspace from './BlocklyWorkspace';

function App() {
  return (
    <div className="App">
       <nav class="navbar">
        <div class="logo">CodeBlocking 🧩</div>
        <ul class="nav-links">
            <li><a href="#">Files</a></li>
            <li><a href="#">Save</a></li>
            <li><a href="#">Tutorials</a></li>
            <li><a href="#">Profile</a></li>
        </ul>
    </nav>
  
      <BlocklyWorkspace />
    </div>
  );
}

export default App;
