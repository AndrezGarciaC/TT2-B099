import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory} from "react-router-dom";
import MaterialTable from "@material-table/core";
import { faEye, faEdit, faTrash, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';


export default function Alumnos({ token, idP }) {
    const history = useHistory();
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        try {
            async function obtenerAlumnos() {
                const respuesta = await axios.get(`api/usuarios/alumnosExamen/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setAlumnos(respuesta.data)
            }
            obtenerAlumnos();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los alumnos.',
                footer: error
            });
        }
    }, [token, idP]);

    const ver = id2 => {
        history.push(`/verExamenAlumno/${id2}`);
    }
    const editar = id2 => {
        history.push(`/editarExAlumno/${id2}`);
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
                    { title: 'Nombre', field: 'nombre' },
                    { title: 'Usuario', field: 'usuario' },
                    { title: 'Correo', field: 'correo' },
                    {
                        title: 'Estado', render: rowData =>
                            <>
                                {rowData.activo ?
                                    <span className="badge bg-success p-2">Activo</span> :
                                    <span className="badge bg-danger p-2">Inactivo</span>
                                }
                            </>
                    },
                    {
                        title: 'Opciones', render: rowData =>
                            <div className="btn-group">
                                <button className="btn btn-outline-primary" onClick={() => ver(rowData._id)}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                {rowData.activo ?
                                    <button className="btn btn-outline-primary" onClick={() => editar(rowData._id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button> :
                                    <button className="btn btn-outline-primary" onClick={() => editar(rowData._id)} disabled>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                }
                            </div>
                    }
                ]}
                data={alumnos}
                title="Mis alumnos"
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: '',
                        position: 'toolbar',
                        onClick: () => { history.push(`/enlazar`) }
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
                        emptyDataSourceMessage: 'Sin alumnos con examenes'
                    }
                }}
            />
        </div>
    )
}
