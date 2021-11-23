import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from '../../config/axios'
import Mensaje from './Mensaje';

export default function Registro() {
    const history = useHistory();
    const [exitoEnvio, setExitoEnvio] = useState({ estado: false, mensaje: '' });
    const [datos, setDatos] = useState({
        nombre: '',
        correo: '',
        telefono: '',
        extension: ''
    });
    const { nombre, correo, telefono, extension } = datos;

    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    }

    const registrar = async e => {
        e.preventDefault();
        try {
             const respuesta = await axios.post('/api/registros', { nombre, correo, telefono, extension });
            if (respuesta.data.estado) {
                setExitoEnvio({ estado: true, mensaje: respuesta.data.mensaje });
            } 
        } catch (error) {
            console.log(error);
        }
    };

    const regresar = () => {
        history.push(`/`);
    }

    return (
        <div className="container-fluid bg-azul" >
            <div className="row">
                <div className="col-lg-4 col-md-8 mx-auto min-vh-100 d-flex flex-column justify-content-center">
                    <div className="card shadow p-3 mb-5 bg-white rounded">
                        <div className="card-body">
                            <h1 className="titulo-1 mb-4 text-center">Registro</h1>
                            <form onSubmit={registrar}>
                                <div className="form-group">
                                    <label className="texto" htmlFor="contacto">Nombre: </label>
                                    <input
                                        className="form-control my-2 mb-3"
                                        type="text"
                                        placeholder="Nombre"
                                        required
                                        name="nombre"
                                        value={nombre}
                                        onChange={presetDatos}
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="texto" htmlFor="correo">Correo: </label>
                                    <input
                                        className="form-control mb-2"
                                        type="email"
                                        placeholder="Ej. correo@empresa.com"
                                        name="correo"
                                        value={correo}
                                        onChange={presetDatos}
                                        required
                                    />
                                    <div className="invalid-feedback">Ingrese un correo válido</div>
                                </div>
                                <div className="form-group">
                                    <label className="texto" htmlFor="telefono">Teléfono: </label>
                                    <input
                                        className="form-control mb-2"
                                        placeholder="Ej. 55 2525 8585"
                                        name="telefono" id="telefono"
                                        value={telefono}
                                        onChange={presetDatos}
                                        required
                                    />
                                    <div className="invalid-feedback">Ingrese su número de teléfono</div>
                                </div>
                                <div className="form-group">
                                    <label className="texto" htmlFor="extension">Extensión: </label>
                                    <input
                                        className="form-control rounded-5 mb-2 "
                                        type="number"
                                        placeholder="Ej. 123"
                                        name="extension"
                                        value={extension}
                                        onChange={presetDatos}
                                        required
                                    />
                                </div>
                                <button
                                    className="btn btn-primary btn-lg btn-block w-100 my-1"
                                    type="submit"
                                >Enviar solicitud
                                </button>
                                {exitoEnvio.estado && <Mensaje tipo='exito' mensaje={exitoEnvio.mensaje} />}
                            </form>
                            <button
                                className="btn btn-secundary btn-lg border border-dark btn-block w-100 my-2"
                                type="submit"
                                onClick={() => regresar()}
                            >
                                Regresar
                            </button>
                            <hr />
                            <p className="text-center small m-2"> Copyright WHITE LABEL 2021</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
