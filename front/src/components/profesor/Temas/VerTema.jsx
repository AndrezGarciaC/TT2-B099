import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import axios from '../../../config/axios'
import Swal from 'sweetalert2';

export default function Tema({ token }) {
    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({
        id: '',
        tema: ''
    });
    const { tema } = datos;
    
    useEffect(() => {
        try {
            async function obtenerTema() {
                const respuesta = await axios.get(`/api/temas/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos({tema: respuesta.data.tema})
            }
            obtenerTema();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el tema',
                footer: error
            });
        }
    }, [token, id]);
    const regresar = () => {
        history.push(`/temas`);
    };
    return (
        <div className="container mt-5">
            <h1 className="text-primary text-center mb-5 my-5">Datos del Tema</h1>
            <div className="row pb-5">
                <div className="col-12 ">
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                <p className="card-text"> <strong>id:</strong> {id}</p>
                                    <p className="card-text"> <strong>Tema:</strong> {tema}</p>
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
