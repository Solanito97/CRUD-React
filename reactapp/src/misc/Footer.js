import React from "react";

class Footer extends React.Component {

    render() { 
        return ( 
            <div> 
            <footer className="text-center p-3 bg-body-tertiary">
                <div className="container text-center">
                <span className="text-muted">© 2024 Tu Empresa. Todos los derechos reservados.</span>
                </div>
            </footer>
            </div>
         );
    }
}
 
export default Footer;