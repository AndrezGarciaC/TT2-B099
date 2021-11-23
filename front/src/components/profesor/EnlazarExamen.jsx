
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";
import axios from '../../config/axios'
import Swal from 'sweetalert2';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


export default function Alumnos({ token, idP }) {
    const history = useHistory();
    const [Alumnos, setAlumnos] = useState([]);
    const [Examenes, setExamenes] = useState([]);
    const [ayuda, setAyuda] = useState([]);
    const [datos, setDatos] = useState({
        alumno: '',
        profesor: idP,
        examenes: []
    });

    const { alumno } = datos


    useEffect(() => {
        try {
            async function obtenerAlumnos() {
                const respuesta = await axios.get('api/usuarios/alumnos',
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta) {
                    setAyuda(respuesta.data)
                    let test = [];
                    let data = false;
                    respuesta.data.map(user => {
                        if (user.Examenes.length === 0) {
                            test.push(user)
                        } else {
                            user.Examenes.map(exam => {
                                if (exam.profesor === idP) {
                                    data = true
                                } else {
                                    data = false
                                }
                            })
                            if (!data) { test.push(user) }
                        } 
                    })
                    setAlumnos(test)
                }

            }
            async function obtenerExamenes() {
                const respuesta = await axios.get(`api/examenes/obtener/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setExamenes(respuesta.data)
            }
            obtenerAlumnos();
            obtenerExamenes();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los alumnos.',
                footer: error
            });
        }
    }, [token, idP]);

    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const enviar = async e => {
        e.preventDefault();
        if (alumno === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Faltan datos.',
                footer: 'Faltan datos'
            });
        } else {
            try {
                const respuesta = await axios.post(`/api/respuestas`, datos,
                    {
                        headers: { 'x-access-token': token }
                    });

                if (respuesta.data.estado) {
                    let data = {
                        profesor: idP,
                        registros: respuesta.data.idsRegistro
                    }
                    const respuestaids = await axios.put(`/api/usuarios/nuevoExamen/${alumno}`, data,
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
                    text: 'Hubo un error al crear el examen.',
                    footer: error
                });
            }
        }
    };
    const regresar = () => {
        history.push(`/alumnos`);
    };

    const clic = (e) => {
        let generales = [];
        generales = e.currentTarget.title.split(';');
        let visibility = e.currentTarget.firstChild.style.visibility
        if (visibility === 'hidden') {
            e.currentTarget.firstChild.style.visibility = "";
            if (!datos.examenes.includes(e.currentTarget.id)) {
                setDatos({
                    alumno,
                    examenes: [...datos.examenes, {
                        id: e.currentTarget.id,
                        materia: generales[1],
                        tema: generales[0]
                    }]
                })
            }
        } else {
            e.currentTarget.firstChild.style.visibility = "hidden";
            let filtredData = datos.examenes.filter(item => item.id !== e.currentTarget.id);
            setDatos({
                alumno,
                examenes: filtredData
            })
        }
    };

    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Asignar Examenes</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4 ">
                    <form onSubmit={enviar}>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="alumno" className="form-label text-end my-3">Alumnos: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <select name="alumno" value={alumno} onChange={presetDatos} className={`form-control mt-2`}>
                                    <option defaultValue value=''>
                                        {' --- Seleccione una opción --- '}
                                    </option>
                                    {Alumnos.map((alumno) => {
                                        return <option key={alumno._id} value={alumno._id}>
                                            {alumno.usuario}
                                        </option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="row col-md-12 my-4 ">
                            {
                                Examenes &&
                                Examenes.map((examen) => {
                                    return <div className="col-md-4 p-2" key={examen.id}>
                                        <div
                                            className="card text-white mb-3"
                                            onClick={clic}
                                            style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}
                                            id={examen._id}
                                            key={examen.id}
                                            title={examen.tema + ';' + examen.materia}
                                        >
                                            <div id="ico" className="d-flex justify-content-end" style={{ visibility: 'hidden' }} >
                                                <FontAwesomeIcon className="m-2" style={{ 'color': 'black' }} icon={faCheck} />
                                            </div>
                                            <div className="card-body" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                <p className="card-text"> <strong>Materia:</strong> {examen.materia}</p>
                                                <p className="card-text"> <strong>Tema:</strong> {examen.tema}</p>
                                                <p className="card-text"> <strong>Fecha de creación:</strong> {examen.fechaCreacion}</p>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                        <hr></hr>
                        <div className="float-right col-md-6 my-4">
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
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
