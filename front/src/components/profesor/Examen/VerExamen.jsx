import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../config/axios'
import Swal from 'sweetalert2';
import MathJax from 'react-mathjax'
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export default function Examen({ token, idP }) {

    const history = useHistory();
    const { id } = useParams();
    var div = id.split(',');
    const idExamen = div[0];
    const idCurso = div[1];
    const [datos, setDatos] = useState({
        nombre: '',
        materia: '',
        tema: '',
        reactivo: []
    });

    const [result, setResult] = useState([]);
    const { nombre, materia, tema, duracion, preguntasAleatorias, fechaInicio, fechaTerminacion, codigo } = datos;

    useEffect(() => {
        try {
            async function obtenerExamen() {
                const respuesta = await axios.get(`/api/examenes/${idExamen}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos(respuesta.data)
            }
            async function obtenerReactivos() {
                const respuesta = await axios.get(`/api/reactivos/obtener/${materia + ',' + idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta) {
                    let dato = respuesta.data.filter(u => datos.reactivo.includes(u._id))
                    setResult(dato)
                }
            }
            obtenerExamen();
            if (datos.tema && datos.materia) { obtenerReactivos() }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el examen.',
                footer: error
            });
        }
    }, [token, idP, materia, tema, idCurso, idExamen, datos.materia]);

    const regresar = () => {
        history.push(`/curso/${idCurso}`);
    };
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Datos del Examen</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form>
                        <h5 className="text-primary">Datos generales</h5>
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text"> <strong>id:</strong> {id}</p>
                                <p className="card-text"> <strong>id:</strong> {nombre}</p>
                                <p className="card-text"> <strong>Materia:</strong> {materia}</p>
                                <p className="card-text"> <strong>Tema:</strong> {tema}</p>
                                {preguntasAleatorias ? <p className="card-text"> <strong>Orden aleatorio:</strong> Si</p>
                                    : <p className="card-text"> <strong>Orden aleatorio:</strong> No</p>}
                                <p className="card-text"> <strong>Duración:</strong> {duracion} minutos</p>
                                <p className="card-text"> <strong>Fecha Inicio:</strong> {fechaInicio}</p>
                                <p className="card-text"> <strong>Fecha Terminación:</strong> {fechaTerminacion}</p>
                                <p className="card-text"> <strong>Codigo:</strong> {codigo}</p>
                            </div>
                        </div>

                        <div className="row col-md-12 my-4 ">
                            <h5 className="text-primary">Reactivos</h5>
                            {
                                result &&
                                result.map((tem) => {

                                    return <div className="col-md-4 p-2" key={tem._id}>
                                        <div
                                            className="card text-white bg-primary mb-3"
                                            style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}
                                            id={tem._id}
                                        >
                                            <div id="ico" className="d-flex justify-content-end" style={{ 'backgroundColor': '#ffffff ', visibility: '' }} >
                                                <FontAwesomeIcon className="m-2" style={{ 'color': 'black' }} icon={faCheck} />
                                            </div>
                                            <div id='ico2' className="card-header" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                <h1>{tem.pregunta}</h1>
                                                <MathJax.Provider>
                                                    <div className="my-3">
                                                        <MathJax.Node formula={tem.formula.formula} />
                                                    </div>
                                                </MathJax.Provider>
                                            </div>
                                            <div className="card-body" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                <p className="card-text"> <strong>Ponderación:</strong> {tem.ponderacion}</p>
                                                <p className="card-text"> <strong>Estado:</strong> {tem.estadoCalibrado === true && 'Calibrado' ||
                                                    tem.estadoCalibrado === false && 'No Calibrado' || tem.estadoCalibrado === null && 'Sin calibrar'}</p>
                                                <p className="card-text"> <strong>Fecha de Creación:</strong> {tem.fechaCreacion}</p>
                                                <p className="card-text"> <strong>Fecha de Modificación:</strong> {tem.fechaModificacion}</p>
                                                <ul className="list-group">
                                                    <li className="list-group-item p-0">
                                                        <FontAwesomeIcon className="mx-1" key={tem.opcionCorrecta} icon={faCheck} />
                                                        <div className="ms-4">
                                                            <p>{tem.opcionCorrecta.texto}</p>
                                                            <InlineMath>{tem.opcionCorrecta.formula}</InlineMath>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item p-0" >
                                                        <FontAwesomeIcon className="mx-1" key={tem.opcionIncorrecta1} icon={faTimes} />
                                                        <div className="ms-4">
                                                            <p>{tem.opcionIncorrecta1.texto}</p>
                                                            <InlineMath>{tem.opcionIncorrecta1.formula}</InlineMath>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item p-0" >
                                                        <FontAwesomeIcon className="mx-1" key={tem.opcionIncorrecta2} icon={faTimes} />
                                                        <div className="ms-4">
                                                            <p>{tem.opcionIncorrecta1.texto}</p>
                                                            <InlineMath>{tem.opcionIncorrecta2.formula}</InlineMath>
                                                        </div>
                                                    </li>
                                                    <li className="list-group-item p-0" >
                                                        <FontAwesomeIcon className="mx-1" key={tem.opcionIncorrecta3} icon={faTimes} />
                                                        <div className="ms-4">
                                                            <p>{tem.opcionIncorrecta1.texto}</p>
                                                            <InlineMath>{tem.opcionIncorrecta3.formula}</InlineMath>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                })
                            }
                        </div>
                        <div className="float-right mt-4">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={regresar}
                            >
                                Regresar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
