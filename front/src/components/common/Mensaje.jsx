import React from 'react'

export default function Mensaje({ mensaje, tipo }) {
    let clase = '';
    switch(tipo){
        case 'error':
            clase = 'alert alert-danger'
            break;
        case 'exito':
            clase = 'alert alert-success'
            break;
        case 'alerta':
            clase = 'alert alert-warning'
            break;
        default:
            clase=''
            break;
    }
    return (
        <div className={`${clase} my-2`} role="alert" >
            {mensaje}
        </div>
    )
}
