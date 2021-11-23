const CursoModel = require('../models/cursos');
const AlumnoModel = require('../models/usuarios');
const ReactivoModel = require('../models/reactivos');
const RegistroModel = require('../models/respuestasAlumnos')

const dashboardAlumnoController = {}

dashboardAlumnoController.obtenerDatos = async (req, res) => {
    try {
        let data = {
            Alumnos: '',
            Cursos: '',
            Registros: [],
            RC: 0,
            RNC: 0,
            RSC: 0
        };
        const Alumnos = await AlumnoModel.countDocuments({ activo: true, 'Examenes.id': req.body.id });
        const Cursos = await CursoModel.countDocuments({ activo: true, 'creadoPor': req.body.id });
        const RC = await ReactivoModel.countDocuments({ activo: true, 'estadoCalibrado': true, creadoPor: req.body.id });
        const RNC = await ReactivoModel.countDocuments({ activo: true, 'estadoCalibrado': false, creadoPor: req.body.id});
        const RSC = await ReactivoModel.countDocuments({ activo: true, 'estadoCalibrado': null, creadoPor: req.body.id});

        const Registros = await RegistroModel.aggregate([
            {
                $match: {
                    "estatus": "terminado",
                    "idProfesor": req.body.id
                }
            },
            {
                $group: {
                    _id: {
                        "idProfesor": "$idProfesor",
                        "idUsuario": "$idUsuario",
                    },
                    promedio:
                        { $avg: "$calificación" }

                },

            },
            {
                $addFields: {
                    avg: { $round: ['$promedio', 1] },
                },
            },
            {
                $sort: {
                    promedio: 1
                }
            }
        ])
        data = {
            Alumnos: Alumnos,
            Cursos: Cursos,
            Registros: Registros,
            reactivos: {
                RC: RC,
                RNC: RNC,
                RSC: RSC
            }
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json('Error al obtener los datos.');
    }
};

dashboardAlumnoController.obtenerDatosMateria = async (req, res) => {
    try {
        const Registros = await RegistroModel.aggregate([
            {
                $match: {
                    "estatus": "terminado",
                    "idProfesor": req.body.id,
                    "materia": req.params.id
                }
            },
            {
                $group: {
                    _id: {
                        "idProfesor": "$idProfesor",
                        "idUsuario": "$idUsuario",
                    },
                    promedio:
                        { $avg: "$calificación" }

                },

            },
            {
                $addFields: {
                    avg: { $round: ['$promedio', 1] },
                },
            },
            {
                $sort: {
                    promedio: 1
                }
            }
        ])
        res.status(200).json(Registros);
    } catch (err) {
        res.status(500).json('Error al obtener los datos.');
    }
};


module.exports = dashboardAlumnoController