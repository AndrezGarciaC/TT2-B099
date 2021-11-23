import React, { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import ImgUsrdfct from '../../img/usedef.png';
import { useHistory } from "react-router-dom";
import Mensaje from '../common/Mensaje';
import Spinner from '../common/Spinner';
import Swal from 'sweetalert2';
import IconButton from '@material-ui/core/IconButton';
import CreateIcon from '@material-ui/icons/Create';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    input: {
        display: 'none',
        background: 'black',
    },
    med: {
        top: 6,
        left: 5,
        width: 30,
        height: 30,
        color: 'white',
    }
}));

export default function EditarPerfil({ token, setFoto }) {
    const classes = useStyles();
    const history = useHistory();
    const [datos, setDatos] = useState({
        nombre: '',
        correo: '',
        contraseña: '',
        foto: ''
    });
    const [errorFront, setErrorFront] = useState({ estado: false, mensaje: '' });
    const [errorBack, setErrorBack] = useState({ estado: false, mensaje: '' });
    const [sePuedeEnviar, setSePuedeEnviar] = useState(true);
    const [pensando, setPensando] = useState(false);
    const { nombre, contraseña, foto, correo } = datos;
    useEffect(() => {
        try {
            async function obtenerUsuario() {
                const respuesta = await clienteAxios.get('/api/miPerfil', { headers: { 'x-access-token': token } });
                if (respuesta.data.estado) {
                    setDatos({
                        ...datos, nombre: respuesta.data.usuario.nombre,
                        correo: respuesta.data.usuario.correo, contraseña: '',
                        foto: respuesta.data.usuario.foto
                    });
                } else {
                    setErrorBack({ estado: true, mensaje: respuesta.data.mensaje });
                }
            }
            obtenerUsuario();
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al traer el detalle del usuario.',
                footer: error
            });
        }
    }, [token, setFoto]);
    const conv64 = e => {
        var file = (e.target.files);
        var sizeByte = e.target.files[0].size;
        var siezekiloByte = parseInt(sizeByte / 1024);
        if (siezekiloByte > 70) {
            setErrorFront({ estado: true, mensaje: 'El tamaño de la imagen supera el limite permitido (70kb limite maximo).' });
            return;
        }
        Array.from(file).forEach(file => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                setDatos({ ...datos, [e.target.name]: reader.result });
            }
        })
    }
    const presetDatos = e => {
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    const enviar = async e => {
        e.preventDefault();
        setPensando(true);
        setSePuedeEnviar(false);
        setErrorFront({ estado: false, mensaje: '' });
        setErrorBack({ estado: false, mensaje: '' });
        try {

            const respuesta = await clienteAxios.put('/api/miPerfil', datos, { headers: { 'x-access-token': token } });
            if (respuesta.data.estado) {
                Swal.fire(
                    'Éxito',
                    'Los datos se modificaron correctamente',
                    'success'
                );
                setFoto(datos.foto);
                setPensando(false);
                history.push(`/`);
            } else {
                setPensando(false);
                setSePuedeEnviar(true);
                setErrorBack({ estado: true, mensaje: respuesta.data.mensaje });
            }
        } catch (error) {
            console.log(error);
        }
    };
    const regresar = () => {
        history.push(`/`);
    };
    return (
        <div className="container my-5 pb-5">
            <h1 className="text-primary text-center">Editar Perfil</h1>
            <div className="row pb-5">
                <div className="col-12">
                    <form className="px-3" onSubmit={enviar}>
                        <fieldset>
                            <div className="form-group bg-primary px-3 m-3">
                                <div className="row justify-content-center ">
                                    <div className="circle  justify-content-center">
                                        <img id="fotof" src={!foto ? ImgUsrdfct : foto} className="imagenx m-2" alt="some value" />
                                        <input type="file" name="foto" onChange={conv64} className={classes.input} id="icon-button-file" />
                                        <label htmlFor="icon-button-file" className="cont bg-azul">
                                            <IconButton color="primary" aria-label="upload picture" component="span" className={classes.med}>
                                                <CreateIcon />
                                            </IconButton>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mt-4 px-3">
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control mt-2"
                                    placeholder="Ej. Christian Ledesma"
                                    name="nombre"
                                    value={nombre}
                                    onChange={presetDatos}
                                    required
                                />
                            </div>
                            <div className="form-group mt-4 px-3">
                                <label htmlFor="correo">Correo</label>
                                <input type="email" className="form-control" placeholder="Ej. christian@email.com" disabled
                                    name="correo" value={correo} onChange={presetDatos} />
                                <small className="form-text text-muted">El correo debe ser único.</small>
                            </div>
                            <div className="form-group mt-4 px-3">
                                <label htmlFor="contrasena">Nueva contraseña</label>
                                <input
                                    type="password"
                                    className="form-control mt-2"
                                    placeholder="Ej. admin1234"
                                    name="contraseña"
                                    value={contraseña}
                                    onChange={presetDatos}
                                />
                                <small className="form-text text-muted">Debe contener por lo menos 8 caracteres.</small>
                            </div>
                        </fieldset>
                        <hr />
                        {errorFront.estado && <Mensaje tipo='error' mensaje={errorFront.mensaje} />}
                        {errorBack.estado && <Mensaje tipo='error' mensaje={errorBack.mensaje} />}
                        {(sePuedeEnviar && !pensando) &&
                            <div className="float-right mt-4">
                                <button type="button" className="btn btn-secondary mr-2" onClick={regresar}>
                                    Regresar
                                </button>
                                <button type="submit" className="btn btn-primary ms-3">
                                    Actualizar
                                </button>
                            </div>
                        }
                        {pensando && <Spinner />}
                    </form>
                </div>
            </div>
        </div>
    )
}