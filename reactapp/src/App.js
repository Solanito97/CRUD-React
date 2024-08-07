import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './misc/Menu';
import ShowProducts from './components/ShowProducts';
import ShowUsers from './components/ShowUsers';
import Footer from './misc/Footer';
import './App.css';
import ShowProviders from './components/ShowProviders';
import ShowInventory from './components/ShowInventory';


function App() {
  const [activeComponent, setActiveComponent] = useState('index');
  const renderComponent = () => {
    switch (activeComponent) { 
      case 'usuarios':
        return <ShowUsers />;
      case 'ShowProducts':
        return <ShowProducts />; 
        case 'ShowInventory':
          return <ShowInventory/>;
      case 'ShowProviders':
        return <ShowProviders/>;
      default:
        return <ShowUsers />;
    }
  };

  return (
    <div >
      <div className="container-fluid">
        <Menu activeComponent={activeComponent} SetActiveComponent={setActiveComponent} />
      </div>
      <div className="container-fluid">
        {renderComponent()}
      </div>
      <div className="container-fluid">
        <Footer />
      </div>
    </div>
  );
}

export default App;