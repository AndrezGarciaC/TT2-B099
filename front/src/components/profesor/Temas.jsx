import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";
import MaterialTable from "@material-table/core";
import { faEye, faEdit, faTrash, faTrashRestore } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';

export default function Temas({ token, idP }) {

    const history = useHistory();
    const [temas, setTemas] = useState([]);

    useEffect(() => {
        try {
            async function obtenerTemas() {
                const respuesta = await axios.get(`api/temas/profesor/${idP}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setTemas(respuesta.data)
            }
            obtenerTemas();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los temas.',
                footer: error
            });
        }
    }, [token, idP]);

    const ver = id => {
        history.push(`/tema/${id}`);
    }
    const editar = id => {
        history.push(`/editarTema/${id}`);
    }
    const eliminar = async (id, activo) => {
        try {
            const respuesta = await axios.patch(`/api/temas/${id}`, { activo },
                {
                    headers: { 'x-access-token': token }
                })
            if (respuesta.data.mensaje === 'Eliminado') {
                setTemas(temas.filter(item => {
                    if (item._id === id) {
                        item.activo = !item.activo
                    }
                    return item
                }));
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al eliminar el tema',
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al eliminar el tema.',
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
                data={temas}
                title="Temas"
                actions={[
                    {
                        icon: 'add_box',
                        tooltip: '',
                        position: 'toolbar',
                        onClick: () => { history.push("/nuevoTema") }
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
                        emptyDataSourceMessage: 'Sin temas'
                    }
                }}
            />
        </div>
    )
}
