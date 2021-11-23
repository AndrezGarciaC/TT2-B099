import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from '../../config/axios'
import Mensaje from './Mensaje';
import Spinner from './Spinner';

export default function Login({ setNombre, setFoto, setTipo, setToken, setId }) {

    const [datos, setDatos] = useState({ usuario: '', contraseña: '' });
    const [errorFront, setErrorFront] = useState({ estado: false, mensaje: '' });
    const [errorBack, setErrorBack] = useState({ estado: false, mensaje: '' });
    const [sePuedeEnviar, setSePuedeEnviar] = useState(true);
    const [pensando, setPensando] = useState(false);
    const { usuario, contraseña } = datos;
    const history = useHistory();

    useEffect(() => {
        history.push('/');
    }, [history])

    const preSetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value })
    }

    const autenticar = async e => {
        e.preventDefault();
        setPensando(true);
        setSePuedeEnviar(false);
        setErrorFront({ estado: false, mensaje: '' });
        setErrorBack({ estado: false, mensaje: '' });
        if (usuario.trim() === '' || contraseña.trim() === '') {
            setErrorFront({ estado: true, mensaje: 'Todos los campos son obligatorios.' });
            setPensando(false);
            setSePuedeEnviar(true);
            return;
        }
        try {
           const respuesta = await axios.post('/api/auth', { usuario, contraseña });
           
           if (respuesta.data.estado) {
                const sesion = {
                    nombre: respuesta.data.nombre,
                    foto: respuesta.data.foto,
                    tipo: respuesta.data.tipo,
                    token: respuesta.data.token,
                    id: respuesta.data.id
                };
                localStorage.setItem('sesion', JSON.stringify(sesion));
                setNombre(respuesta.data.nombre);
                setTipo(respuesta.data.tipo);
                setToken(respuesta.data.token);
                setFoto(respuesta.data.foto);
                setId(respuesta.data.id);
            } else {
                setPensando(false);
                setSePuedeEnviar(true);
                setErrorBack({ estado: true, mensaje: respuesta.data.mensaje });
            }
        } catch (error) {
            setPensando(false);
            setSePuedeEnviar(true);
        }
    }

    return (
        <div className="container-fluid bg-azul">
            <div className="col-md-4 mx-auto min-vh-100 d-flex flex-column justify-content-center">
                <div className="card shadow p-3 mb-5 bg-white rounded">
                    <div className="card-body">
                        <h1 className="titulo-1 mb-4 text-center">Sistema de Aplicación de Examenes</h1>
                        <form className="form" onSubmit={autenticar}>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="usuario">usuario: </label>
                                <input className="form-control" type="text" placeholder="Su usuario" required
                                    name="usuario" value={usuario} onChange={preSetDatos} />
                            </div>
                            <div className="form-group mb-2">
                                <label className="form-label" htmlFor="contraseña">Contraseña:</label>
                                <input className="form-control" type="password" placeholder="Su contraseña" required
                                    name="contraseña" value={contraseña} onChange={preSetDatos} />
                            </div>
                            {pensando && <Spinner />}
                            {sePuedeEnviar && !pensando &&
                                <div className="form-group mb-2">
                                    <button type="submit" className="btn btn-primary btn-block w-100 my-2">Ingresar</button>
                                </div>
                            }
                            {errorFront.estado && <Mensaje tipo='error' mensaje={errorFront.mensaje} />}
                            {errorBack.estado && <Mensaje tipo='error' mensaje={errorBack.mensaje} />}
                        </form>
                        <u>
                            <Link className="custom-control-description small text-dark mx-1 text-decoration-none" to="/olvido">
                                ¿Olvidó su contraseña?
                            </Link>
                        </u>
                        <hr />
                        <span className="custom-control-description small text-dark mx-1">¿No eres usuario?</span>
                        <u>
                            <Link className="custom-control-description small text-dark mx-1 text-decoration-none" to="/registrar">
                                Registrate
                            </Link>
                        </u>
                        <hr />
                        <p className="text-center small mt-2 mb-0"> Copyright WHITE LABEL 2021</p>
                    </div>
                </div>
            </div>
        </div>
    );
};