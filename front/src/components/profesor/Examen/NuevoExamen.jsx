import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../../../config/axios'
import Swal from 'sweetalert2';
import MathJax from 'react-mathjax'
import { v4 as uuidv4 } from 'uuid';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
registerLocale('es', es)
import es from 'date-fns/locale/es';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import MaterialTable from "@material-table/core";
import Mensaje from '../../common/Mensaje';

export default function NuevoExamen({ token, id }) {
    const { idE } = useParams();
    const history = useHistory();

    const [error, setError] = useState(false);
    const [datos, setDatos] = useState({
        tema: '',
        materia: '',
        reactivo: [],
        aleatorio: '',
        duracion: 60,
        nombre: '',
        fechaInicio: new Date(),
        fechaTerminacion: new Date(),
        codigo: uuidv4()
    });

    const [temas, setTemas] = useState([]);
    const [materias, setMaterias] = useState([]);
    const [reactivos, setReactivos] = useState([]);
    const [seleccionados, setSeleccionados] = useState([]);

    const { tema = '', materia = '', aleatorio, duracion, nombre, fechaInicio, fechaTerminacion, codigo, reactivo } = datos;

    useEffect(() => {

        try {
            async function obtenerTema() {
                const respuesta = await axios.get(`/api/temas/activos/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setTemas(respuesta.data)
            }
            async function obtenerMateria() {
                const respuesta = await axios.get(`/api/materias/activas/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setMaterias(respuesta.data)
            }
            async function obtenerReactivos() {
                const respuesta = await axios.get(`/api/reactivos/${tema + ',' + materia + ',' + id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setReactivos(respuesta.data)
            }
            if (datos.tema && datos.materia) {
                obtenerReactivos();
            }
            obtenerTema();
            obtenerMateria();

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el Tema.',
                footer: error
            });
        }
    }, [token, id, materia, tema]);

    const presetDatos = e => {
        if (e.target.name === 'materia') {
            setSeleccionados([])
            setDatos({ ...datos, [e.target.name]: e.target.value, reactivo: [] });
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
        if (tema === '' || materia === '' || reactivo.length === 0 || aleatorio === ''
            || duracion === '' || nombre === '' || fechaInicio === null || fechaTerminacion === null) {
            setError(true)
        } else {
            setError(false)
            try {
                const respuesta = await axios.post(`/api/examenes`, datos,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta.data.estado) {
                    const respuesta2 = await axios.patch(`/api/cursos/nuevoExamen/${idE}`, respuesta.data,
                        {
                            headers: { 'x-access-token': token }
                        });
                    if (respuesta2.data.estado) {
                        Swal.fire(
                            'Éxito',
                            'El examen se creo correctamente',
                            'success'
                        );
                        history.push(`/curso/${idE}`);
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: respuesta.data.mensaje,
                            footer: respuesta.data.mensaje
                        });
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
        history.push(`/curso/${idE}`);
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
                    aleatorio,
                    duracion,
                    nombre,
                    fechaInicio,
                    fechaTerminacion,
                    codigo
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
                aleatorio,
                duracion,
                nombre,
                fechaInicio,
                fechaTerminacion,
                codigo
            })
        }
    };

    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Crear Examen</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4 ">
                    <form onSubmit={enviar} noValidate>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="nombre" className="form-label text-end my-3">Nombre: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <input
                                    type="text"
                                    className="form-control "
                                    placeholder="nombre"
                                    name="nombre"
                                    value={nombre}
                                    onChange={presetDatos}
                                    required="required"
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">

                            <div className="col-md-1">
                                <label htmlFor="materia" className="form-label text-end my-3">Materia: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <select name="materia" value={materia} onChange={presetDatos} className={`form-control mt-2`} required>
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
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="tema" className="form-label text-end my-3">Tema: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <select name="tema" value={tema} onChange={presetDatos} className={`form-control mt-2`} required>
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
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="temas" className="form-label text-end my-3">Orden aleatorio: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <select name="aleatorio" value={aleatorio} onChange={presetDatos} className={`form-control mt-2`} required>
                                    <option key={'defaultAleatorio'} defaultValue value=''>
                                        {' --- Seleccione una opcion --- '}
                                    </option>
                                    <option key={'No'} value={false}>
                                        No
                                    </option>
                                    <option key={'Si'} value={true}>
                                        Si
                                    </option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="duracion" className="form-label text-end my-3">Duración: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <input
                                    type="number"
                                    className="form-control "
                                    placeholder="duracion"
                                    name="duracion"
                                    value={duracion}
                                    onChange={presetDatos}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="fechaInicio" className="form-label text-end my-3">Fecha de inicio: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <DatePicker
                                    locale="es"
                                    name="fechaInicio"
                                    selected={fechaInicio}
                                    className="form-control"
                                    onChange={presetDatosInicio}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="fechaTerminacion" className="form-label text-end my-3">Fecha de Terminación: </label>
                            </div>
                            <div className="col-md-10 ms-4">
                                <DatePicker
                                    locale="es"
                                    selected={fechaTerminacion}
                                    className="form-control"
                                    onChange={presetDatosTerminacion}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="dd/MM/yyyy HH:mm"
                                />
                            </div>
                        </div>
                        <hr></hr>
                        <div className="d-flex justify-content-center p-2">
                            <button onClick={() => history.push("/nuevoReactivo")} className="btn btn-secondary">
                                <FontAwesomeIcon className="fa-4x" icon={faPlus} />
                            </button>
                        </div>
                        <div className="d-flex justify-content-center p-2 mb-4">
                            <small>Crear Reactivo.</small>
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
                                body: {
                                    emptyDataSourceMessage: 'Sin reactivos seleccionados'
                                }
                            }}
                        />
                        {
                            reactivos &&
                            <div>
                                <h2 className="my-4">Reactivos Disponibles</h2>
                                <div className="row col-md-12 my-4 ">
                                    {reactivos.map((tem) => {
                                        return <div className="col-md-4 p-2" key={tem._id}>
                                            <div
                                                className="card text-white mb-3"
                                                onClick={clic}
                                                style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}
                                                id={tem._id}
                                                key={tem.id}
                                            >
                                                {reactivo.includes(tem._id) ?

                                                    <div id="ico" className="d-flex justify-content-end" style={{ 'backgroundColor': '#ffffff ', visibility: '' }} >
                                                        <FontAwesomeIcon className="m-2" style={{ 'color': 'black' }} icon={faCheck} />
                                                    </div>
                                                    :
                                                    <div id="ico" style={{ 'backgroundColor': '#ffffff ', visibility: 'hidden' }} >
                                                        <FontAwesomeIcon className="me-4" style={{ 'color': 'black' }} icon={faCheck} />
                                                    </div>
                                                }
                                                {/* <div id="ico" className="d-flex justify-content-end" style={{ visibility: 'hidden' }} >
                                                <FontAwesomeIcon className="m-2" style={{ 'color': 'black' }} icon={faCheck} />
                                            </div> */}
                                                <div id='ico2' className="card-header" style={{ 'backgroundColor': '#ffffff ', 'borderColor': '#0275d8', 'color': 'black' }}>
                                                    <h3>{tem.pregunta}</h3>
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
                                                    <h4 className="card-title text-black my-4">Respuestas</h4>
                                                    <ul className="list-group">
                                                        <li className="list-group-item p-0" key={tem.opcionCorrecta._id}>
                                                            <FontAwesomeIcon className="mx-1" key={tem.opcionCorrecta} icon={faCheck} />
                                                            <div className="ms-4">
                                                                <p>{tem.opcionCorrecta.texto}</p>
                                                                <InlineMath>{tem.opcionCorrecta.formula}</InlineMath>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item p-0" key={tem.opcionIncorrecta1._id}>
                                                            <FontAwesomeIcon className="mx-1" key={tem.opcionIncorrecta1} icon={faTimes} />
                                                            <div className="ms-4">
                                                                <p>{tem.opcionIncorrecta1.texto}</p>
                                                                <InlineMath>{tem.opcionIncorrecta1.formula}</InlineMath>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item p-0" key={tem.opcionIncorrecta2._id}>
                                                            <FontAwesomeIcon className="mx-1" key={tem.opcionIncorrecta2} icon={faTimes} />
                                                            <div className="ms-4">
                                                                <p>{tem.opcionIncorrecta1.texto}</p>
                                                                <InlineMath>{tem.opcionIncorrecta2.formula}</InlineMath>
                                                            </div>
                                                        </li>
                                                        <li className="list-group-item p-0" key={tem.opcionIncorrecta3._id}>
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
