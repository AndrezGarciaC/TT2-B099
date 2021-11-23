import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../config/axios'
import Swal from 'sweetalert2';
import MathJax from 'react-mathjax'
import MaterialTable from "@material-table/core";
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import es from 'date-fns/locale/es';
import 'react-datepicker/dist/react-datepicker.css'
registerLocale('es', es)
import Mensaje from '../../common/Mensaje';

export default function EditarExamen({ token, idP }) {
    const history = useHistory();
    const { id } = useParams();
    var div = id.split(',');
    const idExamen = div[0];
    const idCurso = div[1];
    const [datos, setDatos] = useState({
        materia: '',
        tema: '',
        reactivo: [],
        preguntasAleatorias: false,
        duracion: 0,
        nombre: '',
        fechaInicio: new Date(),
        fechaTerminacion: new Date(),
    });

    const [error, setError] = useState(false);
    const [reactivos, setReactivos] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [temas, setTemas] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    const { materia, tema, reactivo, nombre, preguntasAleatorias, duracion, fechaInicio, fechaTerminacion } = datos;

    useEffect(() => {
        try {
            async function obtenerExamen() {
                let filtrar = [];
                let aux = [];
                const respuesta = await axios.get(`/api/examenes/${idExamen}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta) {
                    const respuestaReactivos = await axios.get(`/api/reactivos/profesor/${idP}`,
                        {
                            headers: { 'x-access-token': token }
                        });
                    if (respuestaReactivos) {
                        respuesta.data.reactivo.map(react => {
                            aux = respuestaReactivos.data.filter(reactivo => reactivo._id === react);
                            filtrar.push(aux[0]);
                        })
                        setSeleccionados(filtrar)

                    }
                }
                setDatos({
                    materia: respuesta.data.materia,
                    tema: respuesta.data.tema,
                    reactivo: respuesta.data.reactivo,
                    preguntasAleatorias: respuesta.data.preguntasAleatorias,
                    duracion: respuesta.data.duracion,
                    nombre: respuesta.data.nombre,
                    fechaInicio: new Date(respuesta.data.fechaInicio),
                    fechaTerminacion: new Date(respuesta.data.fechaTerminacion),
                })
                obtenerReactivos();
                async function obtenerReactivos() {
                    const respuestaR = await axios.get(`/api/reactivos/${respuesta.data.tema + ',' + respuesta.data.materia + ',' + idP}`,
                        {
                            headers: { 'x-access-token': token }
                        });
                    setReactivos(respuestaR.data)
                }

            }
            async function obtenerTema() {
                const respuesta = await axios.get(`/api/temas/activos/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setTemas(respuesta.data)
            }
            async function obtenerMateria() {
                const respuesta = await axios.get(`/api/materias/activas/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setMaterias(respuesta.data)
            }
            obtenerTema();
            obtenerMateria();
            obtenerExamen();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el examen.',
                footer: error
            });
        }
    }, [token, idP, idCurso, idExamen]);

    const presetDatos = async e => {
        let name = e.target.name;
        let value = e.target.value;
        if (e.target.name === 'materia') {
            Swal.fire({
                title: '¿Estas seguro?',
                text: 'Si cambia de opcion los reactivos seran eliminados',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Si',
                cancelButtonText: 'Cancelar'
            }).then(async resultado => {
                if (resultado.isConfirmed) {
                    setSeleccionados([])
                    setDatos({
                        tema,
                        materia: value,
                        reactivo: [],
                        preguntasAleatorias,
                        duracion,
                        nombre,
                        fechaInicio,
                        fechaTerminacion,
                    })
                    const respuesta = await axios.get(`/api/reactivos/${tema + ',' + value + ',' + idP}`,
                        {
                            headers: { 'x-access-token': token }
                        });
                    setReactivos(respuesta.data)
                }

            });
        } else if (name === 'tema') {
            setDatos({
                tema: value,
                materia,
                reactivo,
                preguntasAleatorias,
                duracion,
                nombre,
                fechaInicio,
                fechaTerminacion,
            })
            const respuesta = await axios.get(`/api/reactivos/${value + ',' + materia + ',' + idP}`,
                {
                    headers: { 'x-access-token': token }
                });
            setReactivos(respuesta.data)
        } else {
            setDatos({ ...datos, [e.target.name]: e.target.value });
        }
    };

    const presetDatosInicio = e => {
        setDatos({ ...datos, fechaInicio: e });
    };

    const presetDatosTerminacion = e => {
        setDatos({ ...datos, fechaTerminacion: e });
    };


    const enviar = async e => {
        e.preventDefault();
        if (tema === '' || materia === '' || reactivo.length === 0 || preguntasAleatorias === ''
            || duracion === '' || nombre === '' || fechaInicio === null || fechaTerminacion === null) {
            setError(true)
        } else {
            setError(false)
            try {
                const respuesta = await axios.put(`api/examenes/${idExamen}`, datos,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta.data.mensaje === 'Editado') {
                    Swal.fire(
                        'Éxito',
                        'El examen se edito correctamente',
                        'success'
                    );
                    history.push(`/curso/${idCurso}`);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al editar el examen.',
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
        }
    };

    const clic = (e) => {
        let visibility = e.currentTarget.firstChild.style.visibility
        if (visibility === 'hidden') {
            e.currentTarget.firstChild.style.visibility = "";
            if (!datos.reactivo.includes(e.currentTarget.id)) {
                let filtredData = reactivos.filter(reactivo => reactivo._id === e.currentTarget.id);
                setSeleccionados([...seleccionados, filtredData[0]])
                setDatos({
                    tema,
                    materia,
                    reactivo: [...datos.reactivo, e.currentTarget.id],
                    preguntasAleatorias,
                    duracion,
                    nombre,
                    fechaInicio,
                    fechaTerminacion,
                })
            }
        } else {
            e.currentTarget.firstChild.style.visibility = "hidden";
            let filtredData = datos.reactivo.filter(item => item !== e.currentTarget.id);
            let seleccionadosFiltrados = seleccionados.filter(reactivo => reactivo._id !== e.currentTarget.id);
            setSeleccionados(seleccionadosFiltrados)
            setDatos({
                tema,
                materia,
                reactivo: filtredData,
                preguntasAleatorias,
                duracion,
                nombre,
                fechaInicio,
                fechaTerminacion,
            })
        }
    };

    const regresar = () => {
        history.push(`/curso/${idCurso}`);
    };
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Editar Examen</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form onSubmit={enviar}>
                        <div className="form-group my-3">
                            <label htmlFor="usuario">Nombre</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="nombre"
                                name="nombre"
                                value={nombre || ''}
                                onChange={presetDatos}
                                required
                            />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="usuario">Materia</label>
                            <select name="materia" value={materia} onChange={presetDatos} className={`form-control mt-2`}>
                                <option key={'defaultMateria'} defaultValue value=''>
                                    {' --- Seleccione una opcion --- '}
                                </option>
                                {materias.map((mat) => {
                                    return <option key={mat._id} value={mat.materia}>
                                        {mat.materia}
                                    </option>
                                })}
                            </select>
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="usuario">Tema</label>
                            <select name="tema" value={tema} onChange={presetDatos} className={`form-control mt-2`}>
                                <option key={'defaultTema'} defaultValue value=''>
                                    {' --- Seleccione una opcion --- '}
                                </option>
                                {
                                    temas &&
                                    temas.map((tem) => {
                                        return <option key={tem._id} value={tem.tema}>
                                            {tem.tema}
                                        </option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="">Orden aleatorio</label>
                            <select name="preguntasAleatorias" value={preguntasAleatorias} onChange={presetDatos} className={`form-control mt-2`}>
                                <option defaultValue value=''>
                                    {' --- Seleccione una opcion --- '}
                                </option>
                                <option value={false}>
                                    No
                                </option>
                                <option value={true}>
                                    Si
                                </option>
                            </select>
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="usuario">Duración</label>
                            <input
                                type="number"
                                className="form-control mt-2"
                                placeholder="duración"
                                name="duracion"
                                value={duracion || ''}
                                onChange={presetDatos}
                                required
                            />
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="fechaInicio">Fecha de inicio: </label>
                            <DatePicker
                                locale="es"
                                name="fechaInicio"
                                selected={fechaInicio}
                                className="form-control mt-2"
                                onChange={presetDatosInicio}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                                required
                            />
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="fechaTerminacion">Fecha de Terminación: </label>
                            <DatePicker
                                locale="es"
                                selected={fechaTerminacion}
                                className="form-control mt-2 mb-4"
                                onChange={presetDatosTerminacion}
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                dateFormat="dd/MM/yyyy HH:mm"
                            />
                        </div>
                        <hr></hr>
                        <h2 className="my-4">Reactivos Seleccionados</h2>
                        <MaterialTable
                            columns={[
                                {
                                    title: 'Pregunta', render: rowData =>
                                        rowData.pregunta.length > 20 ?
                                            <p>{rowData.pregunta.substr(0, 20) + '...'}</p>
                                            :
                                            <p>{rowData.pregunta}</p>

                                },
                                { title: 'Ponderación', field: 'ponderacion' },
                                { title: 'Tema', field: 'tema' },
                                {
                                    title: 'Estado', render: rowData =>
                                        <>
                                            {rowData.estadoCalibrado &&
                                                <span>Calibrado</span> ||
                                                !rowData.estadoCalibrado &&
                                                <span>No calibrado</span> ||
                                                rowData.estadoCalibrado === null &&
                                                <span>Sin comprobar</span>
                                            }
                                        </>
                                },
                            ]}
                            data={seleccionados}
                            title=""
                            options={{
                                actionsColumnIndex: -1,
                                pageSize: 5,
                                emptyRowsWhenPaging: true,
                                pageSizeOptions: [5],
                                rowStyle: { height: '10px' }
                            }}
                            localization={{
                                pagination: {
                                    labelRowsSelect: 'filas',
                                    labelDisplayedRows: `{from}-{to} de {count}`,
                                    firstTooltip: '',
                                    previousTooltip: '',
                                    nextTooltip: '',
                                    lastTooltip: ''
                                },
                                toolbar: {
                                    searchPlaceholder: 'Buscar',
                                    searchTooltip: ''
                                },
                                header: {
                                    actions: 'Eliminar',
                                },
                                body: {
                                    emptyDataSourceMessage: 'Sin reactivos seleccionados'
                                }
                            }}
                        />
                        {
                            reactivos &&
                            <div>
                                <h2 className="col-md-12 my-4">Reactivos Disponibles</h2>
                                <div className="row col-md-12 my-4 ">
                                    {reactivos.map((tem) => {
                                        return <div className="col-md-4 p-2" key={tem._id}>
                                            <div
                                                className="card text-white mb-3"
                                                style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}
                                                onClick={clic}
                                                id={tem._id}
                                            >
                                                {datos.reactivo.includes(tem._id) ?

                                                    <div id="ico" className="d-flex justify-content-end" style={{ 'backgroundColor': '#ffffff ', visibility: '' }} >
                                                        <FontAwesomeIcon className="m-2" style={{ 'color': 'black' }} icon={faCheck} />
                                                    </div>
                                                    :
                                                    <div id="ico" style={{ 'backgroundColor': '#ffffff ', visibility: 'hidden' }} >
                                                        <FontAwesomeIcon className="me-4" style={{ 'color': 'black' }} icon={faCheck} />
                                                    </div>
                                                }
                                                <div id='ico2' className="card-header" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                    <h1>{tem.pregunta}</h1>
                                                    <MathJax.Provider>
                                                        <div>
                                                            <MathJax.Node formula={tem.formula.formula} />
                                                        </div>
                                                    </MathJax.Provider>
                                                </div>
                                                <div className="card-body" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                    <p className="card-text"> <strong>Ponderación:</strong> {tem.ponderacion}</p>
                                                    <p className="card-text"> <strong>Estado:</strong> {tem.estadoCalibrado === true && 'Calibrado' ||
                                                        tem.estadoCalibrado === false && 'No Calibrado' || tem.estadoCalibrado === null && 'Sin calibrar'}</p>
                                                    <h4 className="card-title text-black my-4">Respuestas</h4>
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
                            </div>
                        }
                        <hr></hr>
                        {error &&
                            <Mensaje tipo='error' mensaje={'Faltan datos'} />
                        }
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
