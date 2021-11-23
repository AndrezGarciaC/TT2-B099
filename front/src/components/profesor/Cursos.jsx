import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { faTrash, faTrashRestore, faRedo, faEdit } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';

export default function Cursos({ token, idP }) {

    const history = useHistory();
    const [datos, setDatos] = useState([]);

    useEffect(() => {
        try {
            async function obtenerCursos() {
                const respuesta = await axios.get(`api/cursos/profesor/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos(respuesta.data)
            }
            obtenerCursos();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los cursos.',
                footer: error
            });
        }
    }, [token, idP]);

    const editar = id => {
        history.push(`/editarCurso/${id}`);
    }

    const ver = id => {
        history.push(`/curso/${id}`);
    }
    const eliminar = async (id, activo) => {
        try {
            const respuesta = await axios.patch(`/api/cursos/${id}`, { activo, op: 'Eliminar' },
                {
                    headers: { 'x-access-token': token }
                })
            if (respuesta.data.mensaje === 'Eliminado') {
                setDatos(datos.filter(item => {
                    if (item._id === id) {
                        item.activo = !item.activo
                    }
                    return item
                }));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al eliminar / recuperar el curso.',
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al eliminar / recuperar el curso.',
                footer: error
            });
        }
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
                    { title: 'Nombre', field: 'generales.nombre' },
                    { title: 'Grupo', field: 'generales.grupo' },
                    { title: 'N. Examenes', field: 'generales.totalExamenes' },
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
                                    <FontAwesomeIcon icon={faRedo} />
                                </button>
                                {rowData.activo ?
                                    <button className="btn btn-outline-primary" onClick={() => editar(rowData._id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button> :
                                    <button className="btn btn-outline-primary" onClick={() => editar(rowData._id)} disabled>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                }
                                <button className="btn btn-outline-primary" onClick={() => eliminar(rowData._id, rowData.activo)}>
                                    {rowData.activo ?
                                        <FontAwesomeIcon icon={faTrash} /> :
                                        <FontAwesomeIcon icon={faTrashRestore} />
                                    }
                                </button>
                            </div>
                    }
                ]}
                data={datos}
                title="Mis Cursos"
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: '',
                        position: 'toolbar',
                        onClick: () => { history.push("/nuevoCurso") }
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
                        emptyDataSourceMessage: 'Sin cursos'
                    }
                }}
            />
        </div>
    )
}
