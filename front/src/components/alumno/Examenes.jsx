import React, { useState, useEffect } from 'react';//importamos react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';//importamos la libreria FontAwesomeIcon para poder usar los iconos en nuestra vista
import { useHistory } from "react-router-dom";//importamos react-router-dom para enrutar
import MaterialTable from "@material-table/core";// etiqueta que se usara para la realización de la tabla de examenes (basada en la tabla Material-UI)
import { faEdit } from '@fortawesome/free-solid-svg-icons';//Cargamos los iconos que se van a usar
import axios from '../../config/axios'//importamos axios para poder hacer peticiones al servidor donde nos estara escuchando 
import Swal from 'sweetalert2';//se usara sweetalert2 para dar las alertar de forma dinamica e intuitiva

//declaramos la funcion examenes alumnos 
export default function ExamenesAlumnos({ token, idA }) {
    //Usamos useHistory para poder acceder al estado del enrutador y realizar la navegación a nivel componentes
    const history = useHistory();
    const [datos, setDatos] = useState([]);
    //useEffect permite llevar a cabo efectos secundarios en componentes en este caso Actualizamos el estado
    useEffect(() => {
        //si se obtienen bien los datos entonces 
        try {
            let ids = [];
            let au = [];
             // async es una función asincrona  la cual al final a devolver un objeto en este caso obtenerDatos      
            async function obtenerAlumnos() {
                //buscamos obtener los datos de el alumno, axios nos sirve para poder tomar esos datos y pasarlos por el puerto
                const respuesta = await axios.get(`api/usuarios/alumno/${idA}`,
                    {
                        //establecemos el token generado en el encabezado
                        headers: { 'x-access-token': token }
                    });
                //se busca obtener el registro de los examenes    
                respuesta.data.Examenes.map(registro => {
                    if (registro.registros.length > 0) {
                        registro.registros.map(examen => {
                            ids.push(examen)
                        })
                    }
                })                
                obtenerDatosExamenes();
            }
            //Obtenemos datos de examenes 
            async function obtenerDatosExamenes() {
            //se realiza la solicitud al servidor y lo guardamos en respuesta
                const respuesta = await axios.get(`api/respuestas`,
                    {
                         //establecemos el token generado en el encabezado
                        headers: { 'x-access-token': token }
                    });
                //Realizamos un push  para agregar los examenes
                au.push(respuesta.data)
                if (au) {
                    //usamos filter para poder filtrar los datos de examenes en este caso son todos los que tengan la id correspondiente
                    let dato = au[0].filter(u => ids.includes(u._id))
                    //Cambiamos el estado del componente con set  
                    setDatos(dato)
                }
            }

            obtenerAlumnos();


            //en caso de que no se obtienen bien los datos entonces
        } catch (error) {
            //lanzamos la notificación con Swal  de que hubo un error
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los examenes.',
                footer: error
            });
        }
    }, []);
    //Enviamos el examen  que se debe contestar que usaremos mas adelante en las vistas
    const ver = (idExamen, idRegistro) => {
        history.push(`/responder/${idExamen + ';' + idRegistro}`);
    }

    return (
        <div className="container mt-5">
             {/ *usaremos la etiqueta Materialtable basada en Material-UI * /}
             {/ *En la seccion de titulo colocaremos el Id correspondiente del examen * /}
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
                                     {/ *Usamos el boton y accion onClick para mostrar el examen seleccionado * /}
                                <button className="btn btn-outline-primary" onClick={() => ver(rowData.idExamen, rowData._id)}>
                                {/ *Esta sección se muestra el icono correspondiente a ver examen* /}
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                            </div>
                    }
                ]}
            
                data={datos}
                  //Titulo de la tabla datos  
                title="Mis examenes"
                actions={[
                    {
                        //icono de mas  colocado en la parte derecha de la tabla, cuando se acciona nos lleva al componente nuevo examen
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
                //Para poder visualizar los examenes se realizo una paginación en donde se mostraran 5 examenes y se podra navegar para verlos todos
                localization={{
                    pagination: {
                        labelRowsSelect: 'filas',
                        labelDisplayedRows: `{from}-{to} de {count}`,
                        firstTooltip: '',
                        previousTooltip: '',
                        nextTooltip: '',
                        lastTooltip: ''
                    },
                    //Usaremos un buscador de examenes para facilitar al alumno 
                    toolbar: {
                        searchPlaceholder: 'Buscar',
                        searchTooltip: ''
                    },
                    header: {
                        actions: 'Eliminar',
                    },
                    //En el caso de que no exista ningun dato (empty) aparecera la leyenda sin examenes
                    body: {
                        emptyDataSourceMessage: 'Sin examenes'
                    }
                }}
            />
        </div>
    )
}
