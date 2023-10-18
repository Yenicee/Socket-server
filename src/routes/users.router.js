//RUTA PARA TRABAJAR CON SERVICIO DE SESSIONS
import {Router} from 'express';
import userModel from '../dao/models/users.model';

const router = Router();

//PRIMER SERVICIO PARA REGISTRAR EL USUARIO
router.post('/register', async (req, res) => {
  try{
   const {first_name, last_name, email, password } = req.body;
   const exists = await userModel.findOne({email});

   if(exists) {
    return res.status(400).send({status:'error', message: 'ya existe este usuario'});
   }
   await userModel.create({
    first_name,
    last_name,
    email,
    password
   });

   res.status(201).send({status: 'success', message: 'usuario registrado'});

  } catch(error){
     res.status(500).send({status:'error', message: error.message})
  }
})

//segundo servicio para logear el usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email, password });

        if (!user) {
            return res.status(400).send({ status: 'error', message: 'credenciales incorrectas' });
        }

        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
        }
        res.send({ status: 'success', message: 'login success' });

    } catch (error) {
        res.status(500).send({ status: 'error', message: error.message })
    }
});

//TERCER SERVICIO REALIZAR UN LOGOUT
router.get('/logout', (req, res) => {
    // Elimina la sesión del usuario
    req.session.destroy(error => {
        if(error)
        return res.status(500).send({status: 'error', error: 'error en la eliminacion'})
       res.redirect('/');
    })
});

export default router;
