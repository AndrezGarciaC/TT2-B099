import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import axios from '../../../config/axios'
import Swal from 'sweetalert2';

export default function EditarMateria({ token }) {
    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({ materia: ''});

    const { materia } = datos;

    useEffect(() => {
        try {
            async function obtenerMateria() {
                const respuesta = await axios.get(`/api/materias/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos({materia: respuesta.data.materia})
            }
            obtenerMateria();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener la materia.',
                footer: error
            });
        }
    }, [token, id]);

    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    const enviar = async e => {
        e.preventDefault();
        try {
            const respuesta = await axios.put(`api/materias/${id}`, datos,
                {
                    headers: { 'x-access-token': token }
                });
            if (respuesta.data.mensaje === 'Editado') {
                setDatos(respuesta.data);
                history.push(`/materias`);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al editar la materia.',
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al editar la materia.',
                footer: error
            });
        }
    };
    const regresar = () => {
        history.push(`/materias`);
    };
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Editar Materia</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form onSubmit={enviar}>
                        <div className="form-group">
                            <label htmlFor="usuario">Nombre de la materia</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="materia"
                                name="materia"
                                value={materia || ' '}
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
                                Editar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
