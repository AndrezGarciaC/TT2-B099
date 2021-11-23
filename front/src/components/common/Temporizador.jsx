import React from 'react'
import { useState, useEffect } from 'react';
const diff = require('diff');
import moment from 'moment'
import { format } from 'date-fns'

/* 10/28/2021 5:53 PM */

const Timer = (props) => {

    var ahora = format(new Date(), "MM/dd/yyyy h:mm:s a");
    var fecha2 = moment(props.fechaFin);
    let dat = fecha2.diff(ahora, 'seconds');
    let tiempoSegundos = dat
    var hora = Math.floor(tiempoSegundos / 3600);
    hora = (hora < 10) ? + hora : hora;
    var minuto = Math.floor((tiempoSegundos / 60) % 60);
    minuto = (minuto < 10) ? + minuto : minuto;
    var segundo = tiempoSegundos % 60;
    segundo = (segundo < 10) ? + segundo : segundo;

    const [horas, setHoras] = useState(hora);
    const [minutos, setMinutos] = useState(minuto);
    const [segundos, setSegundos] = useState(segundo);
    useEffect(() => {
        let myInterval = setInterval(() => {
            if (segundos > 0) {
                setSegundos(segundos - 1);
            }
            if (segundos === 0) {
                if (minutos === 0) {
                    clearInterval(myInterval)
                } else {
                    setMinutos(minutos - 1);
                    setSegundos(59);
                }
                if (horas === 0) {
                    clearInterval(myInterval)
                } else {
                    setHoras(horas - 1)
                    setMinutos(59)
                }
            }
            if (horas === 0 && minutos === 0 && segundos === 0 || 
                horas < 0 || minutos <0 || segundos <0) {
                props.onComplete()
            }


        }, 1000)
        return () => {
            clearInterval(myInterval);
        };
    });

    return (
        <div>
            {minutos === 0 && segundos === 0
                ? null
                : <h5> {horas} hora {minutos} minutos {segundos} segundos</h5>
            }
        </div>
    )
}

export default Timer;