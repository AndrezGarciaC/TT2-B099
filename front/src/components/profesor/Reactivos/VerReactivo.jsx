import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../config/axios'
import Swal from 'sweetalert2';
import MathJax from 'react-mathjax'
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Reactivo({ token }) {

    const { id } = useParams();
    const history = useHistory();

    const [datos, setDatos] = useState({});
    const { pregunta, formula, tema, materia, opcionCorrecta, estadoCalibrado,
        opcionIncorrecta1, opcionIncorrecta2, opcionIncorrecta3, ponderacion, fechaCreacion,
        fechaModificacion } = datos;

    useEffect(() => {
        try {
            async function obtenerobtenerReactivo() {
                const respuesta = await axios.get(`/api/reactivos/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos(respuesta.data)
            }
            obtenerobtenerReactivo();
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
        history.push(`/reactivos`);
    };

    return (
        <div className="container mt-5">
            <h1 className="text-primary text-center mb-5 my-5">Datos del Reactivo</h1>
            <div className="row pb-5">
                <div className="col-12 ">
                    <div className="row justify-content-center">
                        <div className="col-md-5 my-3">
                            <h5 className="text-primary">Datos generales</h5>
                            <div className="card">
                                <div className="card-body">
                                    <p className="card-text"> <strong>id:</strong> {id}</p>
                                    <p className="card-text"> <strong>Reactivo:</strong> {pregunta}</p>
                                    {formula &&
                                        <MathJax.Provider>
                                            <div>
                                                <MathJax.Node formula={formula.formula} />
                                            </div>
                                        </MathJax.Provider>
                                    }
                                    <p className="card-text"> <strong>Tema:</strong> {tema}</p>
                                    <p className="card-text"> <strong>Materia:</strong> {materia}</p>
                                    <p className="card-text"> <strong>Ponderación:</strong> {ponderacion}</p>
                                    <p className="card-text"> <strong>Estado:</strong> {estadoCalibrado === true && 'Calibrado' ||
                                        estadoCalibrado === false && 'No Calibrado' || estadoCalibrado === null && 'Sin calibrar'}</p>
                                    <p className="card-text"> <strong>Fecha de Creación:</strong> {fechaCreacion}</p>
                                    <p className="card-text"> <strong>Fecha de Modificación:</strong> {fechaModificacion}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 ">
                    <div className="row justify-content-center">
                        <div className="col-md-5 my-3">
                            <h5 className="text-primary">Respuestas</h5>
                            <div className="card">
                                <div className="card-body">
                                    <ul className="list-group">
                                        {opcionCorrecta &&
                                            <div>
                                                <li className="list-group-item ">
                                                    <FontAwesomeIcon className="me-4" icon={faCheck} />
                                                    <div className="ms-4">
                                                        <p>{opcionCorrecta.texto}</p>
                                                        <InlineMath>{opcionCorrecta.formula}</InlineMath>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <FontAwesomeIcon className="me-4" icon={faTimes} />
                                                    <div className="ms-4">
                                                        <p>{opcionIncorrecta1.texto}</p>
                                                        <InlineMath>{opcionIncorrecta1.formula}</InlineMath>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <FontAwesomeIcon className="me-4" icon={faTimes} />
                                                    <div className="ms-4">
                                                        <p>{opcionIncorrecta1.texto}</p>
                                                        <InlineMath>{opcionIncorrecta2.formula}</InlineMath>
                                                    </div>
                                                </li>
                                                <li className="list-group-item">
                                                    <FontAwesomeIcon className="me-4" icon={faTimes} />
                                                    <div className="ms-4">
                                                        <p>{opcionIncorrecta1.texto}</p>
                                                        <InlineMath>{opcionIncorrecta3.formula}</InlineMath>
                                                    </div>
                                                </li>
                                            </div>
                                        }
                                    </ul>
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
