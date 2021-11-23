import React from 'react';
import { Route, Switch } from 'react-router-dom';
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

export default function AlumnoApplication({ tipo, nombre, token, id, setFoto, Foto }) {
    const classes = useStyles();
    return (
        <>
            <div className={classes.toolbar}></div>
            <div className={classes.container}>
                <MenuAlumno tipo={tipo} nombre={nombre} Foto={Foto}/>
                <Switch>
                    <Route exact path="/">
                        <DashboardAlumno token={token} idA={id}/>
                    </Route>
                    <Route exact path="/examenes">
                        <Examenes token={token} idA={id}/>
                    </Route>
                    <Route exact path="/responder/:id">
                        <Responder token={token} idA={id}/>
                    </Route>
                    <Route exact path="/editarPerfil">
                        <EditarPerfil token={token} setFoto={setFoto} />
                    </Route>
                    <Route exact path="/nuevoExamen">
                        <NuevoExamen token={token} setFoto={setFoto}  idA = {id}/>
                    </Route>
                </Switch>
            </div>
        </>
    );
}
