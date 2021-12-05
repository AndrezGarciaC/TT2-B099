import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { faEye, faEdit, faTrash, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';   

export default function Reactivos({ token, idP }) {

    const history = useHistory();
    const [reactivos, setReactivos] = useState([]);

    useEffect(() => {
        try {
            async function obtenerReactivos() {
                const respuesta = await axios.get(`api/reactivos/profesor/${idP}`,
                    {
                        headers: { 'x-access-token': token }  
                    });
                setReactivos(respuesta.data)
            }
            obtenerReactivos();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los reactivos.',
                footer: error
            });
        }
    }, [token, idP]);

    const ver = id => {
        history.push(`/reactivo/${id}`);
    }
    const editar = id => {
        history.push(`/editarReactivo/${id}`);
    }
    const eliminar = async (id, activo) => {
        try {
            const respuesta = await axios.patch(`/api/reactivos/${id}`, { activo },
                {
                    headers: { 'x-access-token': token }
                })
            if (respuesta.data.mensaje === 'Eliminado') {
                setReactivos(reactivos.filter(item => {
                    if (item._id === id) {
                        item.activo = !item.activo
                    }
                    return item
                }));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al eliminar el reactivo.',
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al eliminar el reactivo.',
                footer: error
            });
        }
    }

    return (
        <div className="container mt-5">
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
                                <button className="btn btn-outline-primary" onClick={() => eliminar(rowData._id, rowData.activo)}>
                                    {rowData.activo ?
                                        <FontAwesomeIcon icon={faTrash} /> :
                                        <FontAwesomeIcon icon={faTrashRestore} />
                                    }
                                </button>
                            </div>
                    }
                ]}
                data={reactivos}
                title="Reactivos"
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: '',
                        position: 'toolbar',
                        onClick: () => { history.push("/nuevoReactivo") }
                    }
                ]}
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
    )
}
