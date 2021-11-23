import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import EditarPerfil from '../common/EditarPerfil'
import Alumnos from './Alumnos'
import Examenes from './Examenes'
import Reactivos from './Reactivos'
import DashboardProfesor from './DashboardProfesor'
import MenuProfesor from './MenuProfesor'
import NuevoExamen from './Examen/NuevoExamen'
import EditarExamen from './Examen/EditarExamen'
import VerExamen from './Examen/VerExamen'
import Materias from './Materias'
import NuevaMateria from './Materias/NuevaMateria'
import VerMateria from './Materias/VerMateria'
import EditarMateria from './Materias/EditarMateria'
import Temas from './Temas'
import NuevoTema from './Temas/NuevoTema'
import VerTema from './Temas/VerTema'
import EditarTema from './Temas/EditarTema'
import Cursos from './Cursos'
import NuevoCurso from './Curso/NuevoCurso'
import VerCurso from './Curso/VerCurso'
import EditarReactivo from './Reactivos/EditarReactivo'
import EditarCurso from './Curso/EditarCurso'
import NuevoReactivo from './Reactivos/NuevoReactivo'
import VerReactivo from './Reactivos/VerReactivo'

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
    },
    toolbar: theme.mixins.toolbar,
}));

export default function ProfesorApplication({ tipo, nombre, token, id, setFoto, Foto }) {
    const classes = useStyles();
    return (
        <>
            <div className={classes.toolbar}></div>
            <div className={classes.container}>
                <MenuProfesor tipo={tipo} nombre={nombre} Foto={Foto} />
                <Switch>
                    <Route exact path="/">
                        <DashboardProfesor token={token} idP = {id}/>
                    </Route>
                    <Route exact path="/editarPerfil">
                        <EditarPerfil token={token} setFoto={setFoto} />
                    </Route>

                    {/*  ------Cursos------ */}
                    <Route exact path="/cursos">
                        <Cursos token={token} idP={id} />
                    </Route>
                    <Route path="/nuevoCurso">
                        <NuevoCurso token={token} />
                    </Route>
                    <Route path="/curso/:id">
                        <VerCurso token={token} idP={id} />
                    </Route>
                    <Route path="/editarCurso/:id">
                        <EditarCurso token={token} idP={id} />
                    </Route>

                    {/*  ------EXAMENES------ */}
                    <Route exact path="/examenes">
                        <Examenes token={token} />
                    </Route>
                    <Route path="/nuevoExamen/:idE">
                        <NuevoExamen token={token} id={id} />
                    </Route>
        {/*             <Route path="/editarExamen/:id">
                        <EditarExamen token={token} idP={id} />
                    </Route> */}
                    <Route path="/examen/:id">
                        <VerExamen token={token} idP={id} />
                    </Route>

                    {/* ------REACTIVOS------ */}
                    <Route path="/reactivos">
                        <Reactivos token={token} idP={id}/>
                    </Route>
                    <Route path="/nuevoReactivo">
                        <NuevoReactivo token={token} id={id} />
                    </Route>
                    <Route path="/editarReactivo/:id">
                        <EditarReactivo token={token} idP={id}/>
                    </Route>
                    <Route path="/reactivo/:id">
                        <VerReactivo token={token} />
                    </Route>

                    {/* ------MATERIAS------ */}
                    <Route path="/materias">
                        <Materias token={token} idP={id}/>
                    </Route>
                    <Route path="/materia/:id">
                        <VerMateria token={token} />
                    </Route>
                    <Route path="/editarMateria/:id">
                        <EditarMateria token={token} />
                    </Route>
                    <Route path="/nuevaMateria">
                        <NuevaMateria token={token} />
                    </Route>

                    {/* ------TEMAS------ */}
                    <Route path="/temas">
                        <Temas token={token} idP={id}/>
                    </Route>
                    <Route path="/tema/:id">
                        <VerTema token={token} />
                    </Route>
                    <Route path="/editarTema/:id">
                        <EditarTema token={token} />
                    </Route>
                    <Route path="/nuevoTema">
                        <NuevoTema token={token} />
                    </Route>
                </Switch>
            </div>
        </>
    );
}
