//Importando funciones de modulos externos //
import React, { useState, useEffect } from 'react'; //Creamos una variable interna para almacenar estado del componente//
import { useHistory, useParams } from "react-router-dom"; //hook que permite devolver informacion como ubicacion del usuario//
import axios from '../../config/axios'// Libreria que permite hacer operaciones como cliente HTTP
import Swal from 'sweetalert2';//Libreria para agregar estilos a nuestras botoneras//

//Se exporta funcion EditarUsuario para su uso externo//
export default function EditarUsuario({ token }) {
    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({
        nombre: ' ',
        tipo: ' '
    });

    const { nombre, tipo } = datos;

    //Funcion para obtener usuarios//

    useEffect(() => {
        try {
            async function obtenerUsuario() {
                const respuesta = await axios.get(`/api/usuarios/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos(respuesta.data)
            }
            obtenerUsuario();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el usuario.',
                footer: error
            });
        }
    }, [token, id]);

    //Funcion que permite editar datos del usuario//
    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    const enviar = async e => {
        e.preventDefault();
        if (nombre.trim() === '' || tipo.trim() === '') {

            return;
        }
        try {
            const respuesta = await axios.put(`api/usuarios/${id}`, datos,
                {
                    headers: { 'x-access-token': token }
                });
            if (respuesta.data.mensaje === 'Editado') {
                setDatos(respuesta.data);
                history.push(`/usuarios`);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al editar el usuario.',
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al editar el usuario.',
                footer: error
            });
        }
    };
    const regresar = () => {
        history.push(`/usuarios`);
    };
    //Estructura de "Editar usuario"
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Editar Usuario</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form onSubmit={enviar}>
                        <div className="form-group">
                            <label htmlFor="usuario">Nombre</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="nombre"
                                name="nombre"
                                value={nombre || ' '}
                                onChange={presetDatos}
                                required
                            />
                        </div>
                        <div className="form-group mt-4">
                            <label htmlFor="rol">Tipo</label>
                            <select
                                className="form-control mt-2"
                                name="tipo"
                                value={tipo}
                                onChange={presetDatos}
                                required
                            >
                                <option value=''>Seleccione una opción</option>
                                <option value='admin'>Administrador</option>
                                <option value='profesor'>Profesor</option>
                                <option value='Alumno'>Alumno</option>
                            </select>
                        </div>
                        <div className="float-right mt-4">
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
                                Editar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
