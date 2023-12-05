const express =  require('express');
const path = require('path');
const multer = require('multer');
const {v4:uuidv4} = require('uuid');

//inicializaciones
const app = express();

//setting
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware
const storage = multer.diskStorage({
    destination:path.join(__dirname,'../public/uploads'),
    filename:(req, file, cb)=>{
        cb(null, uuidv4() + path.extname(file.originalname).toLowerCase());
    }
})

app.use(multer({
    storage,
    dest: path.join(__dirname,'public/uploads'),
    limits:{fileSize:5000000},
    fileFilter:(req, file, cb)=>{
        const filetype = /jpg|png|jpeg|gif/;
        const minetype =filetype.test(file.mimetype);
        const extname = filetype.test(path.extname(file.originalname));
        if(minetype && extname){
            return cb(null, true);
        }
        cb("error:Archivo debe ser una imagen valida");
    }
}).single('image')); 

//Routes
app.use(require('./routes/index.routes'));

//static files
app.use(express.static(path.join(__dirname,'public')))

// iniciar el servidor
app.listen(app.get('port'), ()=>{
    console.log(`Server on port http://localhost:${app.get('port')}`);
});
