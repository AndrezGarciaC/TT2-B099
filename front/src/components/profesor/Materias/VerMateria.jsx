import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import axios from '../../../config/axios'
import Swal from 'sweetalert2';

export default function Materia({ token }) {
    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({
        materia: '',
        fechaCreacion: ''
    });
    const { materia } = datos;
    useEffect(() => {
        try {
            async function obtenerMateria() {
                const respuesta = await axios.get(`/api/materias/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos(respuesta.data)
            }
            obtenerMateria();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener la materia',
                footer: error
            });
        }
    }, [token, id]);
    const regresar = () => {
        history.push(`/materias`);
    };
    return (
        <div className="container mt-5">
            <h1 className="text-primary text-center mb-5 my-5">Datos de la materia</h1>
            <div className="row pb-5">
                <div className="col-12 ">
                    <div className="row justify-content-center">
                        <div className="col-md-4">
                            <div className="card">
                                <div className="card-body">
                                <p className="card-text"> <strong>id:</strong> {id}</p>
                                    <p className="card-text"> <strong>Materia:</strong> {materia}</p>
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
