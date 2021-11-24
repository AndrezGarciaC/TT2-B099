import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import clienteAxios from '../../config/axios';
import { useHistory } from "react-router-dom";
import Mensaje from './Mensaje';
import Spinner from './Spinner';

export default function Restablecer() {
    const { token } = useParams();
    const history = useHistory();
    const [datos, setDatos] = useState({ passA: '', passB: '' });
    const [errorFront, setErrorFront] = useState({ estado: false, mensaje: '' });
    const [errorBack, setErrorBack] = useState({ estado: false, mensaje: '' });
    const [exitoEnvio, setExitoEnvio] = useState({ estado: false, mensaje: '' });
    const [sePuedeEnviar, setSePuedeEnviar] = useState(true);
    const [pensando, setPensando] = useState(false);
    const { passA, passB } = datos;

    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    }

    const enviar = async e => {
        e.preventDefault();
        setPensando(true);
        setSePuedeEnviar(false);
        setErrorFront({ estado: false, mensaje: '' });
        setErrorBack({ estado: false, mensaje: '' });
        if (passA.trim() === '' || passB.trim() === ' ' || passA.trim() !== passB.trim()) {
            setErrorFront({ estado: true, mensaje: 'Todos los campos son obligatorios y las contraseñas deben ser iguales.' });
            setPensando(false);
            setSePuedeEnviar(true);
            return;
        }
        try {
            const respuesta = await clienteAxios.put('/api/recuperar', { passA, token });
            if (respuesta.data.estado) {
                setExitoEnvio({ estado: true, mensaje: respuesta.data.mensaje });
            } else {
                setPensando(false);
                setSePuedeEnviar(true);
                setErrorBack({ estado: true, mensaje: respuesta.data.mensaje });
            }
        } catch (error) {
            setSePuedeEnviar(true);
        }
        setPensando(false);
    }

    const regresar = () => {
        history.push(`/`);
    }

    return (
        <div className="container-fluid bg-azul" >
            <div className="row">
                <div className="col-lg-4 col-md-8 mx-auto min-vh-100 d-flex flex-column justify-content-center">
                    <div className="card shadow bg-white rounded">
                        <div className="card-body">
                            <h1 className="titulo-1 text-center mb-3">Restablecer Contraseña</h1>
                            <form className="form" onSubmit={enviar}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="passA">Ingrese su nueva contraseña: </label>
                                    <input type="password" className="form-control"
                                        name="passA" value={passA} onChange={presetDatos} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="passB">Repita su nueva contraseña: </label>
                                    <input type="password" className="form-control"
                                        name="passB" value={passB} onChange={presetDatos} />
                                </div>
                                {errorFront.estado && <Mensaje tipo='error' mensaje={errorFront.mensaje} />}
                                {errorBack.estado && <Mensaje tipo='error' mensaje={errorBack.mensaje} />}
                                {(sePuedeEnviar && !pensando) &&
                                    <div>
                                        <button className="btn btn-primary btn-lg btn-block w-100 my-2" type="submit">Actualizar Contraseña</button>
                                        <button
                                            className="btn btn-secundary btn-lg border border-dark btn-block w-100 my-2"
                                            type="submit"
                                            onClick={() => regresar()}
                                        >
                                            Regresar
                                        </button>
                                    </div>
                                }
                                {pensando && <Spinner />}
                                {exitoEnvio.estado && <Mensaje tipo='exito' mensaje={exitoEnvio.mensaje} />}
                            </form>
                            <hr />
                            <div className="custom-control text-center">
                                <span className="custom-control-description small "> </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
