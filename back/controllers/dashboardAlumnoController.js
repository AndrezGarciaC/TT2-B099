const CursoModel = require('../models/cursos');
const AlumnoModel = require('../models/usuarios');
const RegistroModel = require('../models/respuestasAlumnos')

const dashboardAlumnoController = {}

dashboardAlumnoController.obtenerDatos = async (req, res) => {
    try {
        let data = {
            TEx: '',
            TexR: '',
            TexP: '',
            TexI: ''
        };
        const TEx = await RegistroModel.countDocuments({ activo: true, 'idUsuario': req.body.id });
        const TexR = await RegistroModel.countDocuments({ activo: true, estatus: 'terminado', 'idUsuario': req.body.id });
        const TexP = await RegistroModel.countDocuments({ activo: true, estatus: 'pendiente', 'idUsuario': req.body.id });
        const TexI = await RegistroModel.countDocuments({ activo: true, estatus: 'iniciado', 'idUsuario': req.body.id });
        data = {
            TEx: TEx,
            TexR: TexR,
            TexP: TexP,
            TexI: TexI
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json('Error al obtener los cursos.');
    }
};

module.exports = dashboardAlumnoController