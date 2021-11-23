import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';

export default function VerExamenAlumno({ token, idP }) {

    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({
        usuario: '',
        nombre: '',
        correo: []
    });
    let aux = []
    const [result, setResult] = useState([]);
    const { nombre, usuario, correo } = datos;

    useEffect(() => {
        let datitos = [];
        try {
            async function obtenerExamen() {
                const respuesta = await axios.get(`/api/usuarios/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                    setDatos(respuesta.data)
                respuesta.data.Examenes.map(data => {
                    if (data.registros) {
                        data.registros.map(dat => {
                            aux.map(dat2 => {
                                if (dat === dat2._id) {
                                    datitos.push(dat2.idExamen)
                                }
                            })
                            return dat
                        })
                        return
                    }
                })
                obtenerExameness() 
            }
            async function obtenerExameness() {
                const respuesta = await axios.get(`/api/examenes/obtener/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta) {
                    let dato = respuesta.data.filter(u => datitos.includes(u._id))
                    setResult(dato)
                }
            }
            async function obtenerRegistros() {
                const respuesta = await axios.get(`/api/respuestas/prof/recuperar`,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta) {
                    respuesta.data.map(registro => {
                        aux.push(registro);
                    })
                    obtenerExamen();
                }
            }
            obtenerRegistros();
           
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el examen.',
                footer: error
            });
        }
    }, [token, idP, id, nombre, usuario, correo]);

    const regresar = () => {
        history.push(`/alumnos`);
    };
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Datos del Examen</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form>
                        <h5 className="text-primary">Datos generales del usuario</h5>
                        <div className="card">
                            <div className="card-body">
                                <p className="card-text"> <strong>id:</strong> {id}</p>
                                <p className="card-text"> <strong>Nombre:</strong> {nombre}</p>
                                <p className="card-text"> <strong>Usuario:</strong> {usuario}</p>
                                <p className="card-text"> <strong>Correo:</strong> {correo}</p>
                            </div>
                        </div>
                        <div className="row col-md-12 my-4 ">
                            <h5 className="text-primary">Examenes</h5>
                            {
                                result &&
                                result.map((tem) => {

                                    return <div className="col-md-4 p-2" key={tem.id}>
                                        <div
                                            className="card text-white bg-primary mb-3"
                                            style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}
                                            id={tem._id}
                                        >
                                            <div id="ico" className="d-flex justify-content-end" style={{ 'backgroundColor': '#ffffff ', visibility: '' }} >
                                                <FontAwesomeIcon className="m-2" style={{ 'color': 'black' }} icon={faCheck} />
                                            </div>
                                            <div className="card-body" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                <p className="card-text"> <strong>Tema:</strong> {tem.tema}</p>
                                                <p className="card-text"> <strong>Materia:</strong> {tem.materia}</p>
                                                <p className="card-text"> <strong>Fecha de Creación:</strong> {tem.fechaCreacion}</p>
                                                <p className="card-text"> <strong>Fecha de Modificación:</strong> {tem.fechaModificacion}</p>
                                                <p className="card-text"> <strong>N. Reactivos:</strong> {tem.reactivo.length}</p>

                                            </div>
                                        </div>
                                    </div>

                                })
                            }
                        </div>
                        <hr />
                        <div className="float-right mt-4">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={regresar}
                            >
                                Regresar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary ms-3"
                            >
                                Editar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
