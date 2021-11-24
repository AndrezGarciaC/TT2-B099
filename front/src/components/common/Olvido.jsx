import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../../config/axios'
import Mensaje from './Mensaje';

export default function Olvido() {
    
    const history = useHistory();
    const [datos, setDatos] = useState({ correo: '' });
    const [errorBack, setErrorBack] = useState({estado:false,mensaje:''});
    const [exitoEnvio, setExitoEnvio] = useState({estado:false,mensaje:''});
    const { correo } = datos;

    const presetDatos = e => {
        setDatos({ correo: e.target.value });
    }

    const restablecer = async e => {
        e.preventDefault();
        setErrorBack({estado:false,mensaje:''});
        try{
            const respuesta = await axios.post('/api/recuperar',{correo});
            if (respuesta.data.estado) {
                setExitoEnvio({estado:true,mensaje:respuesta.data.mensaje});
            } else {
                setErrorBack({estado:true,mensaje:respuesta.data.mensaje});
            }
        } catch (error) {
            console.log(error);
        }
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
                            <form className="form" onSubmit={restablecer}>
                                <div className="form-group my-4">
                                    <label className="form-label" htmlFor="correo">Ingrese su correo: </label>
                                    <input type="text" className="form-control" placeholder="correo"
                                        name="correo" value={correo} onChange={presetDatos} />
                                </div>
                                <button className="btn btn-primary btn-lg btn-block w-100 my-2" type="submit">Restablecer</button>
                            </form>
                            <button
                                className="btn btn-secundary btn-lg border border-dark btn-block w-100 my-2"
                                type="submit"
                                onClick={() => regresar()}
                            >
                                Regresar
                            </button>
                            { errorBack.estado && <Mensaje tipo='error' mensaje={errorBack.mensaje}/> }
                            { exitoEnvio.estado && <Mensaje tipo='exito' mensaje={exitoEnvio.mensaje}/> }
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