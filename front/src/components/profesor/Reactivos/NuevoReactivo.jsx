import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import axios from '../../../config/axios'
import Swal from 'sweetalert2';
import Mensaje from '../../common/Mensaje'
import MathField from "../Prueba2";

export default function NuevoReactivo({ token, id }) {

    let ponderaciones = [];
    const history = useHistory();
    const [datos, setDatos] = useState({
        pregunta: '',
        tema: '',
        materia: '',
        ponderacion: '',
        formula: {
            formula: ''
        },
        opcionCorrecta: {
            texto: '',
            formula: ''
        },
        opcionIncorrecta1: {
            texto: '',
            formula: '',
            id: ''
        },
        opcionIncorrecta2: {
            texto: '',
            formula: '',
            id: ''
        },
        opcionIncorrecta3: {
            texto: '',
            formula: '',
            id: ''
        }
    });
    const [errorDatos, setErrorDatos] = useState(false);

    const [temas, setTemas] = useState();
    const [materias, setMaterias] = useState([]);
    const [formulas, setFormulas] = useState('');


    const { pregunta, tema,
        materia, opcionCorrecta, opcionIncorrecta1, opcionIncorrecta2, opcionIncorrecta3,
        ponderacion } = datos;

    for (let i = 0; i < 10; i = i + 0.2) {
        ponderaciones.push(i.toFixed(1));
    }
    useEffect(() => {

        try {
            setDatos({ ...datos, creadoPor: id })
            async function obtenerTema() {
                const respuesta = await axios.get(`/api/temas/activos/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setTemas(respuesta.data)
            }
            async function obtenerMateria() {
                const respuesta = await axios.get(`/api/materias/activas/${id}`,
                    {
                        headers: { 'x-access-token': token }
                    });
                setMaterias(respuesta.data)
            }
            obtenerTema();
            obtenerMateria();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener el Tema.',
                footer: error
            });
        }
    }, [token, id]);

    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };

    const enviar = async e => {

        e.preventDefault();
        setErrorDatos(false);
        setDatos({ ...datos, formula: formulas })
        if (pregunta === "" || tema === "" || materia === "" ||
            ponderacion === "") {
            setErrorDatos(true);
        } else {
            try {
                const respuestar = await axios.post('/api/reactivos', datos,
                    {
                        headers: { 'x-access-token': token }
                    });
                if (respuestar.data.estado) {
                    Swal.fire(
                        'Éxito',
                        'El reactivo se creo correctamente',
                        'success'
                    );
                    history.push(`/reactivos`);
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Hubo un error al crear el reactivo.',
                        footer: respuestar.data.mensaje
                    });
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al crear el reactivo.',
                    footer: error
                });
            }
        }
    };
    const regresar = () => {
        history.push(`/reactivos`);
    };

    return (
        <div className="container p-5">

            <h1 className="text-primary text-center">Crear Reactivo</h1>
            <div className="row justify-content-center">
                <div className="row col-md-8 p-4">
                    <form className="px-3" onSubmit={enviar}>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="pregunta" className="form-label text-end my-3">Pregunta</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    type="text"
                                    className="form-control mt-2 "
                                    placeholder="pregunta"
                                    name="pregunta"
                                    value={pregunta}
                                    onChange={presetDatos}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="formula" className="form-label text-end my-3">Formula</label>
                            </div>
                            <div className="col-md-9">
                                <MathField
                                    name="formula"
                                    setDatos={setDatos}
                                    datos={datos}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8">
                            <div className="col-md-2">
                                <label htmlFor="materia" className="form-label text-end my-3">Materia: </label>
                            </div>
                            <div className="col-md-9">
                                <select name="materia" value={materia} onChange={presetDatos} className={`form-control mt-2`}>
                                    <option defaultValue value=''>
                                        {' --- Seleccione una opcion --- '}
                                    </option>
                                    {materias.map((mat) => {
                                        return <option key={mat._id} value={mat.materia}>
                                            {mat.materia}
                                        </option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="temas" className="form-label text-end my-3">Tema: </label>
                            </div>
                            <div className="col-md-9">
                                <select name="tema" value={tema} onChange={presetDatos} className={`form-control mt-2`}>
                                    <option defaultValue value=''>
                                        {' --- Seleccione una opcion --- '}
                                    </option>
                                    {
                                        temas &&
                                        temas.map((tem) => {
                                            return <option key={tem._id} value={tem.tema}>
                                                {tem.tema}
                                            </option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionCorrecta" className="form-label my-2">Texto Op.Correcta</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    type="text"
                                    className="form-control "
                                    placeholder="Texto de opción correcta"
                                    name="opcionCorrecta[texto]"
                                    value={opcionCorrecta.texto}
                                    onChange={ev => setDatos({
                                        ...datos, opcionCorrecta: {
                                            ...opcionCorrecta,
                                            'texto': ev.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionCorrecta" className="form-label my-2">Opción Correcta</label>
                            </div>
                            <div className="col-md-9">
                                <MathField
                                    name="opcionCorrecta"
                                    setDatos={setDatos}
                                    datos={datos}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionIncorrecta1" className="form-label my-2">In. 1 Texto</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    type="text"
                                    className="form-control "
                                    placeholder="Texto de opción Incorrecta 1"
                                    name="opcionIncorrecta1[texto]"
                                    value={opcionIncorrecta1.texto}
                                    onChange={ev => setDatos({
                                        ...datos, opcionIncorrecta1: {
                                            ...opcionIncorrecta1,
                                            'texto': ev.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionIncorrecta1" className="form-label my-2">Op. Incorrecta 1</label>
                            </div>
                            <div className="col-md-9">
                                <MathField
                                    name="opcionIncorrecta1"
                                    setDatos={setDatos}
                                    datos={datos}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionIncorrecta3" className="form-label my-3">In. 2 Texto</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    type="text"
                                    className="form-control mt-2 "
                                    placeholder="Texto de opción Incorrecta 2"
                                    name="opcionIncorrecta2.texto"
                                    value={opcionIncorrecta2.texto}
                                    onChange={ev => setDatos({
                                        ...datos, opcionIncorrecta2: {
                                            ...opcionIncorrecta2,
                                            'texto': ev.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionIncorrecta2" className="form-label my-3">Op. Incorrecta 2</label>
                            </div>
                            <div className="col-md-9">
                                <MathField
                                    name="opcionIncorrecta2"
                                    setDatos={setDatos}
                                    datos={datos}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionIncorrecta3" className="form-label my-3">In. 3 Texto</label>
                            </div>
                            <div className="col-md-9">
                                <input
                                    type="text"
                                    className="form-control "
                                    placeholder="Texto de opción Incorrecta 3"
                                    name="opcionIncorrecta3.texto"
                                    value={opcionIncorrecta3.texto}
                                    onChange={ev => setDatos({
                                        ...datos, opcionIncorrecta3: {
                                            ...opcionIncorrecta3,
                                            'texto': ev.target.value
                                        }
                                    })}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-2">
                                <label htmlFor="opcionIncorrecta3" className="form-label my-3">Op. In 3</label>
                            </div>
                            <div className="col-md-9">
                                <MathField
                                    name="opcionIncorrecta3"
                                    setDatos={setDatos}
                                    datos={datos}
                                />
                            </div>
                        </div>
                        <div className="form-group row col-xs-8 my-4">
                            <div className="col-md-1">
                                <label htmlFor="ponderacion" className="form-label my-2">Ponderación: </label>
                            </div>
                            <div className="col-md-9 ms-5">
                                <select name="ponderacion" value={ponderacion} onChange={presetDatos} className={`form-control`}>
                                    <option defaultValue value=''>
                                        {' --- Seleccione una opcion --- '}
                                    </option>
                                    {
                                        ponderaciones.map(data => {
                                            return <option key={data} value={data}>
                                                {data}
                                            </option>
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <hr></hr>
                        {errorDatos && <Mensaje tipo='error' mensaje='Faltan datos obligatorios' />}
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
                                Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
