import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';

export default function EditarExamen({ token, idP }) {
    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({
        alumno: id,
        profesor: idP,
        examenes: []
    });
    let aux = []
    const [result, setResult] = useState([]);
    const { nombre, usuario, correo } = datos;
    const [icono, setIcono] = useState({
        alumno: id,
        profesor: idP,
        examenes: []
    });
    const [enviar, setEnviar] = useState({
        alumno: id,
        profesor: idP,
        examenes: []
    });
    const { profesor, alumno } = icono;

    useEffect(() => {
        let op = [];
        try {
            async function obtenerExamen() {
                let datitos = []
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
                setIcono({
                    alumno,
                    profesor,
                    examenes: datitos
                })

            }
            async function obtenerExameness() {
                const respuesta = await axios.get(`/api/examenes/obtener/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta) {
                    setResult(respuesta.data)
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
            if (datos.usuario && datos.correo) { obtenerExameness() }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el examen.',
                footer: error
            });
        }
    }, [token, idP, id, nombre, usuario, correo]);

    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    const enviar2 = async e => {
        e.preventDefault();
        try {
            const respuesta = await axios.post(`/api/respuestas`, enviar,
                {
                    headers: { 'x-access-token': token }
                });

            if (respuesta.data.estado) {
                let data = {
                    profesor: idP,
                    registros: respuesta.data.idsRegistro
                }
                const respuestaids = await axios.patch(`/api/usuarios/editarEx/${alumno}`, data,
                    {
                        headers: { 'x-access-token': token }
                    })
                if (respuestaids.data.estado) {
                    Swal.fire(
                        'Éxito',
                        'El examen se edito correctamente',
                        'success'
                    );
                    history.push(`/alumnos`);
                }
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: respuesta.data.mensaje,
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al editar el examen.',
                footer: error
            });
        }
    };

    const clic = (e) => {
        let visibility = e.currentTarget.firstChild.style.visibility
        let compo = e.currentTarget;
        let generales = [];
        generales = e.currentTarget.title.split(';')
        if (visibility === 'hidden') {
            e.currentTarget.firstChild.style.visibility = "";
            if (!enviar.examenes.includes(e.currentTarget.id)) {
                setEnviar({
                    ...enviar,
                    alumno,
                    examenes: [...enviar.examenes, {
                        id: e.currentTarget.id,
                        materia: generales[1],
                        tema: generales[0]
                    }]
                })
            }
        } else {
            Swal.fire({
                title: '¿Estas seguro?',
                text: 'Si el alumno ya realizo el examen se perdera la información',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: '¡Si, eliminar examen!',
                cancelButtonText: 'Cancelar'
            }).then(async resultado => {
                if (resultado.isConfirmed) {
                    compo.firstChild.style.visibility = "hidden";
                    let filtredData = enviar.examenes.filter(item => item.id !== compo.id);
                    setEnviar({
                        ...enviar,
                        alumno,
                        examenes: filtredData
                    })
                }
            });
        }
    };

    const regresar = () => {
        history.push(`/alumnos`);
    };
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Editar Examenes</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form onSubmit={enviar2}>
                        <div className="form-group mt-2">
                            <label htmlFor="usuario">Alumno</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="alumno"
                                name="usuario"
                                value={usuario || ' '}
                                onChange={presetDatos}
                                disabled
                                required
                            />
                        </div>
                        <div className="row col-md-12 my-4 ">
                            {
                                result &&
                                result.map((tem) => {
                                    return <div className="col-md-4 p-2" key={tem.id}>
                                        <div
                                            className="card text-white mb-3"
                                            style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}
                                            onClick={clic}
                                            id={tem._id}
                                            title={tem.tema + ';' + tem.materia}
                                        >
                                            {icono.examenes.includes(tem._id) ?
                                                <div id="ico" className="d-flex justify-content-end" style={{ 'backgroundColor': '#ffffff ', visibility: '' }} >
                                                    <FontAwesomeIcon className="m-2" style={{ 'color': 'black' }} icon={faCheck} />
                                                </div>
                                                :
                                                <div id="ico" className="d-flex justify-content-end" style={{ 'backgroundColor': '#ffffff ', visibility: 'hidden' }} >
                                                    <FontAwesomeIcon className="me-4" style={{ 'color': 'black' }} icon={faCheck} />
                                                </div>
                                            }
                                            <div className="card-body" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                <p className="card-text"> <strong>Tema: </strong> {tem.tema}</p>
                                                <p className="card-text"> <strong>Materia: </strong> {tem.materia}</p>
                                                <p className="card-text"> <strong>Fecha de Creación: </strong> {tem.fechaCreacion}</p>
                                                <p className="card-text"> <strong>Fecha de Modificación: </strong> {tem.fechaModificacion}</p>
                                                <p className="card-text"> <strong>N.Reactivos: </strong> {tem.reactivo.length}</p>

                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <hr></hr>
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
            </div >
        </div >
    )
}
