import React from 'react';//importamos react
import { Route, Switch } from 'react-router-dom';//importamos react-router-dom para enrutar
import { makeStyles } from '@material-ui/core/styles';

import DashboardAlumno from './DashboardAlumno'
import Examenes from './Examenes'
import MenuAlumno from './MenuAlumno'
import Responder from './ResponderExamen'
import EditarPerfil from '../common/EditarPerfil'
import NuevoExamen from './nuevoExamen'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
}));
//En esta sección se realizo el enrutamiento de todos los links  correspondientes al actor alumnno


export default function AlumnoApplication({ tipo, nombre, token, id, setFoto, Foto }) {
    const classes = useStyles();
    return (
        <>
            <div className={classes.toolbar}></div>
            <div className={classes.container}>
                <MenuAlumno tipo={tipo} nombre={nombre} Foto={Foto}/>
                <Switch>
                    <Route exact path="/">
                    {/ *En esta sección se realizo el enrutamiento para el dashboard de examenes* /}
                        <DashboardAlumno token={token} idA={id}/>
                    </Route>
                    /**/
                    {/ *En esta sección se realizo el enrutamiento para la sección de examenes* /}
                    <Route exact path="/examenes"> 
                        <Examenes token={token} idA={id}/>
                    </Route>
                    {/ *En esta sección se realizo el enrutamiento para dar click en el icono de responder examen* /}
                    <Route exact path="/responder/:id">
                        <Responder token={token} idA={id}/>
                    </Route>
                    {/ *En esta sección se realizo el enrutamiento para dar click en el icono de subir foto examen* /}
                    <Route exact path="/editarPerfil">
                        <EditarPerfil token={token} setFoto={setFoto} />
                    </Route>
                    {/ *En esta sección se realizo el enrutamiento para dar click en el icono de mas y enlazar un nuevo examen* /}
                    <Route exact path="/nuevoExamen">
                        <NuevoExamen token={token} setFoto={setFoto}  idA = {id}/>
                    </Route>
                </Switch>
            </div>
        </>
    );
}
