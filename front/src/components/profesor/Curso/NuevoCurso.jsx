import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from '../../../config/axios'
import Swal from 'sweetalert2';

export default function NuevoCruso({ token }) {
    const history = useHistory();
    const [datos, setDatos] = useState({
        nombre: '',
        grupo: ''
    });
    const { nombre, grupo } = datos;

    const presetDatos = e => {
     setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const enviar = async e => {
        e.preventDefault();
        const form = new FormData();
        form.append('generales', JSON.stringify(datos));
        try {
            const respuesta = await axios.post('/api/cursos', form,
                {
                    headers: { 'x-access-token': token }
                });
            if (respuesta.data.estado) {
                Swal.fire(
                    'Éxito',
                    'El curso se creo correctamente',
                    'success'
                );
                history.push(`/cursos`);
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
                text: 'Hubo un error al crear el curso.',
                footer: error
            });
        }
    };
    const regresar = () => {
        history.push(`/cursos`);
    };

    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Crear Curso</h1>
            <div className="row justify-content-center">
                <div className="col-8 p-4 m-y-4">
                    <form onSubmit={enviar}>
                        <div className="form-group">
                            <label htmlFor="titulo">Nombre</label>
                            <input
                                type="text"
                                className="form-control my-2"
                                placeholder="nombre"
                                name="nombre"
                                value={nombre}
                                onChange={presetDatos}
                                required
                            />
                        </div>
                        <div className="form-group my-3">
                            <label htmlFor="titulo">Grupo</label>
                            <input
                                type="text"
                                className="form-control my-2"
                                placeholder="grupo"
                                name="grupo"
                                value={grupo}
                                onChange={presetDatos}
                                required
                            />
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
