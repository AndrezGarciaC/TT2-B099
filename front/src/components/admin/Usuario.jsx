import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import axios from '../../config/axios'
import Swal from 'sweetalert2';

export default function Usuario({ token }) {
    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({
        nombre: '',
        usuario: '',
        correo: '',
        contraseña: '',
        tipo: '',
    });
    const { nombre, usuario, correo, tipo } = datos;
    useEffect(() => {
        try {
            async function obtenerUsuario() {
                const respuesta = await axios.get(`/api/usuarios/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos(respuesta.data)
            }
            obtenerUsuario();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al activar/desactivar el usuario',
                footer: error
            });
        }
    }, [token, id]);
    const regresar = () => {
        history.push(`/usuarios`);
    };
    return (
        <div className="container mt-5">
            <h1 className="text-primary text-center mb-5 my-5">Datos del Usuario</h1>
            <div className="row pb-5">
                <div className="col-12 ">
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-text"> <strong>Nombre:</strong> {nombre}</p>
                                    <p className="card-text"><strong>Usuario:</strong> {usuario}</p>
                                    <p className="card-text"><strong>Correo:</strong> {correo}</p> 
                                    <p className="card-text"><strong>Tipo:</strong> {tipo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row justify-content-center mt-4">
                        <div className="col-md-4">
                            <button type="button" className="btn btn-primary" onClick={regresar}>
                                Regresar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
