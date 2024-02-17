import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Details from "./components/Details";
import Cart from "./components/Cart/Cart";
import Default from "./components/Default";
import Modal from './components/Modal';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<ProductList />} />
          <Route path="/details" element={<Details />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/*" element={<Default />} />
        </Routes>
        <Modal />
      </Router>
    </div>
  );
}

export default App;
