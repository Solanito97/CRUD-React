import React from 'react';


class Menu extends React.Component {
  render() {

    const {SetActiveComponent } = this.props;

    return (
        <div className="container">               
        <nav className='navbar navbar-expand-lg navbar-light bg-light fixed-top'>
                <ul className='navbar-nav mr-auto'>
                    <li className='nav-item'>
                        <button className='nav-link btn btn-link'
                        onClick={()=> SetActiveComponent('ShowUsers')}>
                            Usuarios
                        </button>
                    </li>
                    <li className='nav-item'>
                        <button className='nav-link btn btn-link'
                        onClick={()=> SetActiveComponent('ShowProducts')}>
                            Productos
                        </button>
                    </li>
                    <li className='nav-item'>
                        <button className='nav-link btn btn-link'>
                            Inventario
                        </button>
                    </li>
                    <li className='nav-item'>
                        <button className='nav-link btn btn-link'>
                            Proveedores
                        </button>
                    </li>                                                         
                </ul>
            </nav>
    </div>
    );
  }
}

export default Menu;
