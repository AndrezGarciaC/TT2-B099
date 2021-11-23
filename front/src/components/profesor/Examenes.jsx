import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory, useParams } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { faEye, faEdit, faTrash, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';


export default function Examenes({ token }) {

    const {id} = useParams();
    const history = useHistory();
    const [examenes, setexamenes] = useState([]);

    useEffect(() => {
        try {
            async function obtenerExamenes() {
                const respuesta = await axios.get('api/examenes',
                    {
                        headers: { 'x-access-token': token }
                    });
                setexamenes(respuesta.data)
            }
            obtenerExamenes();
            
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los examenes.',
                footer: error
            });
        }
    }, [token]);

    const ver = id => {
        history.push(`/examen/${id}`);
    }
    const editar = id => {
        history.push(`/editarExamen/${id}`);
    }
    const eliminar = async (id, activo) => {
        try {
            const respuesta = await axios.patch(`/api/examenes/${id}`, { activo },
                {
                    headers: { 'x-access-token': token }
                })
            if (respuesta.data.mensaje === 'Eliminado') {
                setexamenes(examenes.filter(item => {
                    if (item._id === id) {
                        item.activo = !item.activo
                    }
                    return item
                }));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al activar/desactivar el usuario',
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los examenes.',
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
                    { title: 'titulo', field: 'examen.titulo' },
                    { title: 'descripcion', field: 'examen.descripcion' },
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
                               {/*  {rowData.activo ?
                                    <button className="btn btn-outline-primary" onClick={() => editar(rowData._id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button> :
                                    <button className="btn btn-outline-primary" onClick={() => editar(rowData._id)} disabled>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                } */}
                                <button className="btn btn-outline-primary" onClick={() => eliminar(rowData._id, rowData.activo)}>
                                    {rowData.activo ?
                                        <FontAwesomeIcon icon={faTrash} /> :
                                        <FontAwesomeIcon icon={faTrashRestore} />
                                    }
                                </button>
                            </div>
                    }
                ]}
                data={examenes}
                title="Mis Examenes"
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: '',
                        position: 'toolbar',
                        onClick: () => { history.push(`/nuevoExamen/${id}`) }
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
