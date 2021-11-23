import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';


export default function ExamenesAlumnos({ token, idA }) {
    const history = useHistory();
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        try {
            let ids = [];
            let au = [];
            async function obtenerAlumnos() {
                const respuesta = await axios.get(`api/usuarios/alumno/${idA}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                respuesta.data.Examenes.map(registro => {
                    if (registro.registros.length > 0) {
                        registro.registros.map(examen => {
                            ids.push(examen)
                        })
                    }
                })
                obtenerDatosExamenes();
            }
            async function obtenerDatosExamenes() {
                const respuesta = await axios.get(`api/respuestas`,
                    {
                        headers: { 'x-access-token': token }
                    });
                au.push(respuesta.data)
                if (au) {
                    let dato = au[0].filter(u => ids.includes(u._id))
                    setDatos(dato)
                }
            }

            obtenerAlumnos();



        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los examenes.',
                footer: error
            });
        }
    }, []);

    const ver = (idExamen, idRegistro) => {
        history.push(`/responder/${idExamen + ';' + idRegistro}`);
    }

    return (
        <div className="container mt-5">
            <MaterialTable
                columns={[
                    {
                        title: 'Id', render: rowData =>
                            <>
                                <span className="p-2">{rowData._id}</span>
                            </>
                    },
                    { title: 'Materia', field: 'materia' },
                    { title: 'Tema', field: 'tema' },
                    { title: 'Calificación', field: 'calificación' },
                    { title: 'Estatus', field: 'estatus' },
                    {
                        title: 'Opciones', render: rowData =>
                            <div className="btn-group">
                                <button className="btn btn-outline-primary" onClick={() => ver(rowData.idExamen, rowData._id)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </div>
                    }
                ]}
                data={datos}
                title="Mis examenes"
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: '',
                        position: 'toolbar',
                        onClick: () => { history.push(`/nuevoExamen`) }
                    }
                ]}
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
                        emptyDataSourceMessage: 'Sin examenes'
                    }
                }}
            />
        </div>
    )
}
