import React from 'react';
import { Link } from 'react-router-dom';

export default function Unauthorized() {

    const limpiarSesion = _ => {
        localStorage.removeItem('sesion');
        window.location.reload();
    }
    
    return (
        <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', color: 'white', backgroundColor: '#06172a' }}>
            <div className="container my-auto">
                <div className="row">
                    <div className="col-md-12 text-center">
                        <span className="display-1 d-block">401</span>
                        <div className="mb-4 lead">No autorizado</div>
                        <Link to="/"><button className="btn btn-primary" onClick={limpiarSesion}>Regresar al Login</button></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
