import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faClipboard, faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios';

export default function DashboardAlumno({ token, idP }) {


    const [datos, setDatos] = useState([]);

    const { TEx, TexI, TexP, TexR } = datos;

    useEffect(() => {
        try {
            async function obtenerDatos() {
                const respuesta = await axios.get('/api/dashboard/alumno', { headers: { 'x-access-token': token } });
                setDatos(respuesta.data)
            }

            obtenerDatos();
        } catch (error) {
            console.log(`Error al obtener las métricas: ${error}`);
        }
    }, [token]);


    return (
        <div className="container mt-5">
            <h1 className="titulo-1 text-center pb-3">Dashboard Alumno</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4 my-4">
                <div className="col-md-6">
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <h1 className="text-center">
                                        <FontAwesomeIcon icon={faFileAlt} size="2x" />
                                    </h1>
                                </div>
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Examenes</p>
                                    <h3 className="text-right">{TEx}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <h1 className="text-center">
                                        <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
                                    </h1>
                                </div>
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Examenes Terminados</p>
                                    <h3 className="text-right">{TexR}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <h1 className="text-center">
                                        <FontAwesomeIcon icon={faClipboard} size="2x" />
                                    </h1>
                                </div>
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Examenes Pendientes</p>
                                    <h3 className="text-right">{TexP}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <h1 className="text-center">
                                        <FontAwesomeIcon icon={faClipboardList} size="2x" />
                                    </h1>
                                </div>
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Examenes Iniciados</p>
                                    <h3 className="text-right">{TexI}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}