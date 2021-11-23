import React from 'react';
import AdminApplication from '../admin/AdminApplication'
import AlumnoApplication from '../alumno/AlumnoApplication'
import ProfesorApplication from '../profesor/ProfesorApplication'


export default function Application({nombre, tipo, token, id, Foto, setFoto, setToken}) {
    return (
       
        <>
            {tipo === 'admin' && <AdminApplication nombre={nombre} Foto={Foto} setFoto={setFoto} tipo={tipo} token={token} setToken={setToken}/>}
            {tipo === 'alumno' && <AlumnoApplication nombre={nombre} Foto={Foto} setFoto={setFoto} tipo={tipo} id={id} token={token} setToken={setToken}/>}
            {tipo === 'profesor' && <ProfesorApplication nombre={nombre} Foto={Foto} setFoto={setFoto} tipo={tipo} id={id} token={token} setToken={setToken}/>}
        </>
    );
}
