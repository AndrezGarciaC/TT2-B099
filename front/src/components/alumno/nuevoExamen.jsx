import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from '../../config/axios'
import Swal from 'sweetalert2';
import MathJax from 'react-mathjax'
import { v4 as uuidv4 } from 'uuid';
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
registerLocale('es', es)
import es from 'date-fns/locale/es';
//Usaremos la función nuevo examen para dar de alta un examen 
export default function NuevoExamen({ token, idA }) {
    //se usara useParams para redirigir al examen
    const { idE } = useParams();
    //se recolecta el historial
    const history = useHistory();
    //declaramos el codigo para mas adelante evaluar si es valido o no
    const [codigos, setCodigo] = useState({
        codigo: ''
    });

const { codigo } = codigos;

    const presetDatos = e => {
        setCodigo({...codigos, [e.target.name]: e.target.value});
    };

    const enviar = async e => {
        e.preventDefault();
        //Realizamos una petición al servidor para verificar si el codigo es correcto
        console.log('se envio')
        // aplicamos un try/ catch
        try {
            //obtenemos respuesta del servidor
            const respuesta = await axios.post(`/api/respuestas`, codigos,
                {
                    //verificamos que tengamos acceso  por medio del token esto desde JsonwebToken
                    headers: { 'x-access-token': token }
                });
                //realizamos un if para ingrsar a la parte del examen
            if (respuesta.data.estado) {
                const respuestaids = await axios.patch(`/api/usuarios/editarEx/${idA}`, respuesta.data.idsRegistro,
                    {
                        headers: { 'x-access-token': token }
                    })
                    //si es correcto el estado es decir si se comprueba el mismo codigo entonces 
                if (respuestaids.data.estado) {
                    Swal.fire(
                        'Éxito',
                        'El examen ha sido cargado a tu perfil',
                        'success'
                    );
                    //se agrega el examen
                    history.push(`/examenes`);
                }
                //caso contrario colocamos un mensaje de error 
            }else{
                
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: respuesta.data.mensaje,
                    footer: respuesta.data.mensaje
                });
            }
            //en el caso del catch sucede lo mismo enviamos un mensaje de error al cargar el examen
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al cargar el examen.',
                footer: error
            });
        }
    };
    //si regresamos a la vista, regresaremos al componente de examenes
    const regresar = () => {
        history.push(`/examenes`);
    };

    return (
        <div className="container p-5 ">
            <h1 className="text-primary text-center">Enlazar Examen</h1>
            <div className="row justify-content-center my-5">
            <div className="row my-4 col-md-7 border-primary shadow p-5">
                <form onSubmit={enviar}>
                        <div className="col-md-9 ">
                            <h3 htmlFor="codigo" className="form-label my-3">Codigo del examen: </h3>
                            <p>Pídele el código del examen a tu profesor para poder enlazarte al examen.</p>
                        </div>
                        <div className="col-md-9">
                            <input
                                type="text"
                                className="form-control mb-5"
                                placeholder="Código del examen"
                                name="codigo"
                                value={codigo}
                                onChange={presetDatos}
                            />
                        </div>
                   
                    <hr></hr>
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
                            Enlazar
                        </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    )
}
