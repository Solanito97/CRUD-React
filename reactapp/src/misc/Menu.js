import React from 'react';

class Menu extends React.Component {
  render() {
    const { SetActiveComponent } = this.props;

    return (
      <div className="container-fluid">               
        <nav className='navbar navbar-expand-lg navbar-light bg-light fixed-top'>
          <div className='container-fluid'>
            <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
              <span className='navbar-toggler-icon'></span>
            </button>
            <div className='collapse navbar-collapse' id='navbarNav'>
              <ul className='navbar-nav mr-auto'>
                <li className='nav-item'>
                  <button className='nav-link btn btn-link'
                    onClick={() => SetActiveComponent('ShowUsers')}>
                    Usuarios
                  </button>
                </li>
                <li className='nav-item'>
                  <button className='nav-link btn btn-link'
                    onClick={() => SetActiveComponent('ShowProducts')}>
                    Productos
                  </button>
                </li>
                <li className='nav-item'>
                  <button className='nav-link btn btn-link'
                    onClick={() => SetActiveComponent('ShowInventory')}>
                    Inventario
                  </button>
                </li>
                <li className='nav-item'>
                  <button className='nav-link btn btn-link'
                    onClick={() => SetActiveComponent('ShowProviders')}>
                    Proveedores
                  </button>
                </li>                                                         
              </ul>
              <ul className='navbar-nav ms-auto'>
                <li className='nav-item'>
                  <button className='nav-link btn btn-link'
                    onClick={() => SetActiveComponent('Login')}>
                    <i className='fa-solid fa-user'/> Login
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Menu;

