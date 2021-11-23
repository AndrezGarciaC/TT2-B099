import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import Usuarios from './Usuarios';
import Usuario from './Usuario';
import NuevoUsuario from './NuevoUsuario';
import EditarUsuario from './EditarUsuario';
import MenuAdmin from './MenuAdmin';
import EditarPerfil from '../common/EditarPerfil'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
}));

export default function AdminApplication({ tipo, nombre, token, setFoto, Foto }) {
    const classes = useStyles();
    return (
        <>
            <div className={classes.toolbar}></div>
            <div className={classes.container}>
                <MenuAdmin tipo={tipo} nombre={nombre} Foto={Foto}/>
                <Switch>
                    <Route exact path="/">
                        <Usuarios token={token} />
                    </Route>
                    <Route exact path="/usuarios">
                        <Usuarios token={token} />
                    </Route>
                    <Route exact path="/nuevoUsuario">
                        <NuevoUsuario token={token} />
                    </Route>
                    <Route path="/usuario/:id">
                        <Usuario token={token} />
                    </Route>
                    <Route path="/editarUsuario/:id">
                        <EditarUsuario token={token} />
                    </Route>
                    <Route exact path="/editarPerfil">
                        <EditarPerfil token={token} setFoto={setFoto} />
                    </Route>
                </Switch>
            </div>
        </>
    );
}
