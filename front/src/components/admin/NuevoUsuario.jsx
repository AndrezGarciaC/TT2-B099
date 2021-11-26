//Importando funciones de modulos externos //
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from '../../config/axios'
import Swal from 'sweetalert2';

//Exportando funcion para exponer activos//
export default function NuevoUsuario({ token }) {
    const history = useHistory();
    const [datos, setDatos] = useState({
        nombre: '',
        usuario: '',
        correo: '',
        contraseña: '',
        tipo: '',
        activo: true
    });

    //Se realiza funcion para la captura de datos del usuario//
    const { nombre, usuario, correo, contraseña, tipo } = datos;
    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    const enviar = async e => {
        e.preventDefault();
        if (nombre.trim() === '' || contraseña.trim() === '' || tipo.trim() === '') {

            return;
        }
        try {
            const respuesta = await axios.post('/api/usuarios', datos,
                {
                    headers: { 'x-access-token': token }
                });
            if (respuesta.data.estado) {
                Swal.fire(                                   //Se da estilo a la respuesta predeterminada para creacion de usuario
                    'Éxito',                                 
                    'El usuario se creo correctamente',
                    'success'
                );
                history.push(`/usuarios`);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: respuesta.data.mensaje,
                    footer: respuesta.data.mensaje
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el usuario.',
                footer: error
            });
        }
    };
    const regresar = () => {
        history.push(`/usuarios`);
    };
    //Se da estilo a la vista de creacion de nuevo usuario //
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Crear Usuario</h1>
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
                                value={nombre}
                                onChange={presetDatos}
                                required
                            />
                        </div>
                        <div className="form-group mt-4">
                            <label htmlFor="usuario">Usuario</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="usuario"
                                name="usuario"
                                value={usuario}
                                onChange={presetDatos}
                                required
                            />
                        </div>
                        <div className="form-group mt-4">
                            <label htmlFor="correo">Correo</label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="correo@correo.com"
                                name="correo"
                                value={correo}
                                onChange={presetDatos}
                                required
                            />
                        </div>
                        <div className="form-group mt-4">
                            <label htmlFor="contraseña">Contraseña</label>
                            <input
                                type="password"
                                className="form-control mt-2"
                                placeholder="contraseña"
                                name="contraseña"
                                value={contraseña}
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
                                <option value='alumno'>Alumno</option>
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
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
