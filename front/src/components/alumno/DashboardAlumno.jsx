import React, { useState, useEffect } from 'react';//importamos react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';//importamos la libreria FontAwesomeIcon para poder usar los iconos en nuestra vista
import { faClipboardCheck, faClipboard, faClipboardList, faFileAlt } from '@fortawesome/free-solid-svg-icons';//Cargamos los iconos que se van a usar
import axios from '../../config/axios';//importamos axios para poder hacer peticiones al servidor donde nos estara escuchando 

export default function DashboardAlumno({ token, idP }) {

    //se declara variables que se usaran
    const [datos, setDatos] = useState([]);

    const { TEx, TexI, TexP, TexR } = datos;
    //Usamos useEffect para poder tener un ciclo de nuestro componente 
    useEffect(() => {
    //en este caso los estados de nuestro componente son dos try / catch     
    //si se obtienen bien los datos entonces 
        try {
    // async es una función asincrona  la cual al final a devolver un objeto en este caso obtenerDatos        
            async function obtenerDatos() {
    //buscamos obtener los datos de el alumno, axios nos sirve para poder tomar esos datos y pasarlos por el puerto
                const respuesta = await axios.get('/api/dashboard/alumno', { headers: { 'x-access-token': token } });
    //Cambiamos el estado del componente con set            
                setDatos(respuesta.data)
            }
           
            obtenerDatos();
     //en caso de que no se pueda acceder a los datos por medio de obtenerdatos, entonces marcara un error        
        } catch (error) {
            console.log(`Error al obtener las métricas: ${error}`);
        }
    }, [token]);


    return (
        //Maquetado de el menu principal del actor alumno
        <div className="container mt-5">
            <h1 className="titulo-1 text-center pb-3">Dashboard Alumno</h1>
            {/ *Esta sección Se divide todo* /}
            <div className="row row-cols-1 row-cols-md-3 g-4 my-4">
                <div className="col-md-6">
                {/ *Esta sección vamos a utilizar card de Bootstrap para poder colocar contenedores flexibles, en este caso los datos de los examenes* /}
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-6">
                                    <h1 className="text-center">
                                    {/ *Esta sección muestramos el icono correspondiente al total de examenes realizatos* /}
                                        <FontAwesomeIcon icon={faFileAlt} size="2x" />
                                    </h1>
                                </div>
                                {/ *Esta sección muestra el total de examenes mediante [TEx]* /}
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Examenes</p>
                                    <h3 className="text-right">{TEx}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                            {/ *Esta sección se muestra el icono correspondiente al total de examenes realizatos* /}
                                <div className="col-6">
                                    <h1 className="text-center">
                                        <FontAwesomeIcon icon={faClipboardCheck} size="2x" />
                                    </h1>
                                </div>
                                {/ *Esta sección muestra el total de examenes terminados mediante [TEx]* /}
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Examenes Terminados</p>
                                    <h3 className="text-right">{TexR}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-primary shadow mb-3 h-100">
                        <div className="card-body">
                            <div className="row">
                            {/ *Esta sección se muestra el icono correspondiente al total de examenes pendientes* /}
                                <div className="col-6">
                                    <h1 className="text-center">
                                        <FontAwesomeIcon icon={faClipboard} size="2x" />
                                    </h1>
                                </div>
                                {/ *Esta sección muestra el total de examenes pendientes [TexP]* /}
                                <div className="col-6">
                                    <p className="text-muted text-right">Total de Examenes Pendientes</p>
                                    <h3 className="text-right">{TexP}</h3>
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
                                    {/ *Esta sección se muestra el icono correspondiente al total de examenes iniciados* /}
                                        <FontAwesomeIcon icon={faClipboardList} size="2x" />
                                    </h1>
                                </div>
                                <div className="col-6">
                                {/ *Esta sección muestra el total de examenes iniciados [TexI]* /}
                                    <p className="text-muted text-right">Total de Examenes Iniciados</p>
                                    <h3 className="text-right">{TexI}</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}