import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MaterialTable from "@material-table/core";
import { faUsers, faObjectGroup } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios';
import { Pie } from 'react-chartjs-2';


export default function ProfesorApplication({ token, idP }) {

    const [grafica, setGrafica] = useState(
        {
            labels: ['Calibrado', 'No Calibrado', 'Sin Comprobar'],
            datasets: [
                {
                    label: 'Rainfall',
                    backgroundColor: [
                        '#82FCEF',
                        '#FEC0EA',
                        '#F7FAAD'
                    ],
                    hoverBackgroundColor: [
                        '#59EEDE',
                        '#F59CD8',
                        '#F7FC76'
                    ],
                    data: []
                }]
        }
    )
    const [graficaDinamica, setGraficaDinamica] = useState(
        {
            labels: ['Reprobados', 'No Reprobados'],
            datasets: [
                {
                    label: 'Rainfall',
                    backgroundColor: [
                        '#82FCEF',
                        '#FEC0EA'
                    ],
                    hoverBackgroundColor: [
                        '#59EEDE',
                        '#F59CD8'
                    ],
                    data: []
                }]
        }
    )
    const [materias, setMaterias] = useState([]);
    const [datos, setDatos] = useState([]);
    const [reactivos2, setReactivos2] = useState([]);
    const [loading, setLoading] = useState(false);
    const [materia, setMateria] = useState('')

    const { datasets, data } = grafica
    const { Alumnos, Cursos, Peores, Mejores } = datos;

    useEffect(() => {
        try {
            let datosVarios = [];
            async function obtenerDatos() {
                const respuesta = await axios.get('/api/dashboard/profesor', { headers: { 'x-access-token': token } });
                if (respuesta) {
                    datosVarios.push(respuesta.data);
                    var arr = Object.keys(respuesta.data.reactivos).map(function (k) { return respuesta.data.reactivos[k] });
                    if (arr[0] === 0 && arr[1] === 0 && arr[2] === 0) {
                        setGrafica({
                            ...grafica,
                            datasets: [{
                                label: datasets[0].label,
                                backgroundColor: datasets[0].backgroundColor,
                                hoverBackgroundColor: datasets[0].hoverBackgroundColor,
                                data: []
                            }]
                        })
                    } else {
                        setGrafica({
                            ...grafica,
                            datasets: [{
                                label: datasets[0].label,
                                backgroundColor: datasets[0].backgroundColor,
                                hoverBackgroundColor: datasets[0].hoverBackgroundColor,
                                data: arr
                            }]
                        })
                    }
                }
                obtenerAlumnos();
            }
            async function obtenerMateria() {
                const respuesta = await axios.get(`/api/materias/activas/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setMaterias(respuesta.data)
            }
            async function obtenerReactivos2() {
                const respuesta = await axios.get(`api/reactivos/profesor/calib/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setReactivos2(respuesta.data)
            }
            async function obtenerAlumnos() {
                let peores = [];
                let mejores = [];
                const respuesta = await axios.get(`api/usuarios/alumnos`,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuesta) {
                    respuesta.data.map(alumno => {
                        datosVarios[0].Registros.map(dato => {
                            if (dato._id.idUsuario === alumno._id) {
                                mejores.push({
                                    promedio: dato.avg,
                                    _id: dato._id,
                                    nombre: alumno.nombre
                                })
                                if (dato.avg <= 6) {
                                    peores.push({
                                        promedio: dato.avg,
                                        _id: dato._id,
                                        nombre: alumno.nombre
                                    })
                                }
                            }
                        })
                    })
                    mejores = mejores.sort(((a, b) => b.promedio - a.promedio))
                    if (mejores.length > 10) {
                        mejores = mejores.splice(0, 10)
                    }
                    setDatos({ ...datos, Alumnos: datosVarios[0].Alumnos, Cursos: datosVarios[0].Cursos, Peores: peores.sort(((a, b) => a.promedio - b.promedio)), Mejores: mejores.sort(((a, b) => b.promedio - a.promedio)) })
                    setLoading(true);
                }

            }
            obtenerMateria();
            obtenerReactivos2();
            obtenerDatos();
        } catch (error) {
            console.log(`Error al obtener las métricas: ${error}`);
        }
    }, [token, loading]);

    const presetDatos = async e => {
        let reprobados = [];
        let NoReprobados = [];
        let data = [];
        setMateria(e.target.value)
        if (e.target.value !== '') {
            const respuesta = await axios.get(`/api/dashboard/profesor/obtenerMaterias/${e.target.value}`, { headers: { 'x-access-token': token } });
            respuesta.data.map(alumno => {
                if (alumno.promedio <= 6) {
                    reprobados.push(alumno.promedio);
                } else {
                    NoReprobados.push(alumno.promedio);
                }
            })
            data.push(reprobados.length);
            data.push(NoReprobados.length);
            if (data[0] === 0 && data[1] === 0) {
                setGraficaDinamica({
                    ...graficaDinamica,
                    datasets: [{
                        label: datasets[0].label,
                        backgroundColor: datasets[0].backgroundColor,
                        hoverBackgroundColor: datasets[0].hoverBackgroundColor,
                        data: []
                    }]
                })
            } else {

                setGraficaDinamica({
                    ...graficaDinamica,
                    datasets: [{
                        label: datasets[0].label,
                        backgroundColor: datasets[0].backgroundColor,
                        hoverBackgroundColor: datasets[0].hoverBackgroundColor,
                        data: data
                    }]
                })
            }
        }

    };

    return (
        <div className="container mt-5">
            <h1 className="titulo-1 text-center pb-3">Dashboard Profesor</h1>
            <div className="row row-cols-1 row-cols-md-3 g-4 my-4">
                <div className="col-md-6">
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <h1 className="text-center">
                                        <FontAwesomeIcon icon={faUsers} size="2x" />
                                    </h1>
                                </div>
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Alumnos</p>
                                    <h3 className="text-right">{Alumnos}</h3>
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
                                        <FontAwesomeIcon icon={faObjectGroup} size="2x" />
                                    </h1>
                                </div>
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Cursos</p>
                                    <h3 className="text-right">{Cursos}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="my-5 border-primary shadow">
                <MaterialTable
                    columns={[
                        { title: 'Id', field: '_id.idUsuario' },
                        { title: 'Nombre', field: 'nombre' },
                        { title: 'Promedio', field: 'promedio' }
                    ]}
                    data={Mejores}
                    title="Alumnos con mejores calificaciones"
                    options={{
                        actionsColumnIndex: -1,
                        pageSize: 5,
                        emptyRowsWhenPaging: true,
                        pageSizeOptions: [5],
                        rowStyle: { height: '10px' },
                        sorting: true
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
                            emptyDataSourceMessage: 'Sin Alumnos'
                        }
                    }}
                />
            </div>
            <div className="my-5 border-primary shadow">
                <MaterialTable
                    columns={[
                        { title: 'Id', field: '_id.idUsuario' },
                        { title: 'Nombre', field: 'nombre' },
                        { title: 'Promedio', field: 'promedio' }
                    ]}
                    data={Peores}
                    title="Alumnos con bajas calificaciones"
                    options={{
                        actionsColumnIndex: -1,
                        pageSize: 5,
                        emptyRowsWhenPaging: true,
                        pageSizeOptions: [5],
                        rowStyle: { height: '10px' },
                        sorting: true
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
                            emptyDataSourceMessage: 'Sin Alumnos'
                        }
                    }}
                />
            </div>
            <div className="my-5 border-primary shadow">
                <MaterialTable
                    columns={[
                        {
                            title: 'Pregunta', render: rowData =>
                                rowData.pregunta.length > 20 ?
                                    <p>{rowData.pregunta.substr(0, 20) + '...'}</p>
                                    :
                                    <p>{rowData.pregunta}</p>

                        },
                        { title: 'Materia', field: 'materia' },
                        { title: 'Tema', field: 'tema' },
                    ]}
                    data={reactivos2}
                    title="Reactivos No Calibrados"
                    options={{
                        actionsColumnIndex: -1,
                        pageSize: 5,
                        emptyRowsWhenPaging: true,
                        pageSizeOptions: [5],
                        rowStyle: { height: '10px' },
                        sorting: true
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
                            emptyDataSourceMessage: 'Sin reactivos'
                        }
                    }}
                />
            </div>
            <div className="row my-4 justify-content-center border-primary shadow">
                <h3 className="titulo-1 p-5">Clasificación de Reactivos</h3>
                <div className="col-md-5 my-5">
                    {grafica.datasets[0].data.length > 0 ?
                        <Pie
                            data={grafica}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Clasificación de reactivos',
                                    fontSize: 20
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                }
                            }}
                        />
                        :
                        <h2>Sin Datos</h2>
                    }
                </div>
            </div>
            <div className="row my-4 justify-content-center border-primary shadow">
                <h3 className="titulo-1 p-5">Clasificación Por Materia</h3>
                <div className="col-md-10 ms-4">
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
                <div className="col-md-5 my-5 row justify-content-center ">
                    {graficaDinamica.datasets[0].data.length > 0 ?
                        <Pie
                            data={graficaDinamica}
                            options={{
                                title: {
                                    display: true,
                                    text: 'Clasificación de reactivos',
                                    fontSize: 20
                                },
                                legend: {
                                    display: true,
                                    position: 'right'
                                }
                            }}
                        />
                        :
                        <div className="row my-4 col-md-6">
                            <h2>No hay datos</h2>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}
