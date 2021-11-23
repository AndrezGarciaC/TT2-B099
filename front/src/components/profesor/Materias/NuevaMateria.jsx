import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import axios from '../../../config/axios'
import Swal from 'sweetalert2';

export default function NuevaMateria({ token }) {
    const history = useHistory();
    const [datos, setDatos] = useState({
        materia: ''
    });

    const { materia } = datos;
    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    const enviar = async e => {
        e.preventDefault();
        try {
            const respuesta = await axios.post('/api/materias', datos,
                {
                    headers: { 'x-access-token': token }
                });
            if (respuesta.data.estado) {
                Swal.fire(
                    'Éxito',
                    'La materia se creo correctamente',
                    'success'
                );
                history.push(`/materias`);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al crear la materia.',
                    footer: respuesta.data.mensaje
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al crear la materia.',
                footer: error
            });
        }
    };
    const regresar = () => {
        history.push(`/materias`);
    };
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Crear Materia</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form onSubmit={enviar}>
                        <div className="form-group">
                            <label htmlFor="titulo">Nombre de la Materia</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="materia"
                                name="materia"
                                value={materia}
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
