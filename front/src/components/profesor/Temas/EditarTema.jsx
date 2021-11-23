import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from "react-router-dom";
import axios from '../../../config/axios'
import Swal from 'sweetalert2';

export default function EditarTema({ token }) {
    const history = useHistory();
    const { id } = useParams();
    const [datos, setDatos] = useState({
        tema: ' '
    });

    const { tema } = datos;

    useEffect(() => {
        try {
            async function obtenerTema() {
                const respuesta = await axios.get(`/api/temas/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setDatos({tema:respuesta.data.tema})
            }
            obtenerTema();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el tema.',
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
            const respuesta = await axios.put(`api/temas/${id}`, datos,
                {
                    headers: { 'x-access-token': token }
                });
            if (respuesta.data.mensaje === 'Editado') {
                setDatos(respuesta.data);
                history.push(`/temas`);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al editar el tema.',
                    footer: respuesta.data.mensaje
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al editar el tema.',
                footer: error
            });
        }
    };
    const regresar = () => {
        history.push(`/temas`);
    };
    return (
        <div className="container p-5">
            <h1 className="text-primary text-center">Editar Tema</h1>
            <div className="row justify-content-center">
                <div className="col-10 p-4">
                    <form onSubmit={enviar}>
                        <div className="form-group">
                            <label htmlFor="usuario">Tema</label>
                            <input
                                type="text"
                                className="form-control mt-2"
                                placeholder="tema"
                                name="tema"
                                value={tema || ' '}
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
