import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Login from './components/common/Login';
import Application from './components/common/Application';
import Olvido from './components/common/Olvido'
import Registrar from './components/common/Registrar'
import Restablecer from './components/common/Restablecer'

export default function App() {

  let sesion = JSON.parse(localStorage.getItem('sesion'));
  const [nombre, setNombre] = useState(sesion ? sesion.nombre : '');
  const [Foto, setFoto] = useState(sesion ? sesion.foto : '');
  const [tipo, setTipo] = useState(sesion ? sesion.tipo : '');
  const [token, setToken] = useState(sesion ? sesion.token : '');
  const [id, setId] = useState(sesion ? sesion.id : '');

  return (
    <Router>
      <Switch>
        <Route exact path="/restablecer/:token">
          <Restablecer />
        </Route>
        <Route exact path="/registrar">
          <Registrar />
        </Route>
        <Route exact path="/olvido">
          <Olvido />
        </Route>
        <Route path="">
          {token ?
            <Application nombre={nombre} Foto={Foto} setFoto={setFoto} id={id} tipo={tipo} token={token} setToken={setToken} />
            :
            <Login setNombre={setNombre} setFoto={setFoto} setTipo={setTipo} setId={setId} setToken={setToken} />
          }
        </Route>
      </Switch>
    </Router>
  );
}