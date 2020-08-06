const express = require('express');
const fs = require('fs');
const file_upload = require('express-fileupload');
const path = require('path')

const app = express();

app.use(file_upload());

// // Allowed file extensions
const allowed_extensions = [
    'jpg', 'jpeg', 'png', 'gif',    // images
    'mp3', 'mp4', 'flav', 'wav',    // videos
    'doc', 'docx', 'pdf'            // documents
];

// Uploading a file
app.post('/file/:dir', (req, res)=>{

    console.log('holaa');
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            status: "error",
            error:{              
                message: "No file has been upoad"
            }
        });
    }

    // Getting the file from body
    let file = req.files.file;
    let dir = req.params.dir;

    // Verifying that file is supported
    let file_splitted = file.name.split('.');
    let file_extension = file_splitted[file_splitted.length - 1];

    if(allowed_extensions.indexOf(file_extension) < 0){
        return res.status(400).json({
            "status":"error",
            "error":{
                "message": "Your file extension is not supported"
            }
        });
    }

    // Building the path
    let dirname = dir.replace('-', '/');
    let full_path = path.resolve(__dirname, `../../../data/${dirname}`);
    console.log(full_path);
    // Verifying the path
    if(!fs.existsSync(full_path)){
        return res.status(404).json({
            "status":"error",
            "error":{
                "message": "Directory not found",
                "possible_fix": "Please, create a new directory"
            }
        });
    }

    file.mv(`${full_path}/${file.name}`, (err)=>{
        if(err){
            return res.status(500).json({
                "status":"error",
                "error":err
            });
        }

        return res.json({
            "status":"success",
            "message": "The file has been upload"
        })
    })

});

app.get('/file/:dir', (req, res)=>{

    let dir = req.params.dir === '_'? '':req.params.dir;

    dir = dir.replace(new RegExp('-', 'gi'), '/');
    dir = dir.replace(new RegExp('%20', 'gi'), ' ');

    let full_path = path.resolve(__dirname, `../../../data/${dir}`);
    console.log(full_path);

    if(!fs.existsSync(full_path)){
        return res.status(404).json({
            "status":"error",
            "error":{
                "message": "Your directory does not exist"
            }
        })
    }

    fs.readdir(full_path, (err, files)=>{

        if(err){
            return res.status(500).json({
                "status":"error",
                "error": err
            });
        }
        
        let data = [];

        files.forEach(element => {
            console.log(element);
            let extension = getExtension(element);
            console.log("extension",element);


            if(extension in allowed_extensions){
                data.push(element);
            }
        });

        console.log(data);

        return res.json({
            "status":"success",
            "files": data
        });
    })
})

let getExtension = (element)=>{
    let split = element.split('.');

    return split.length == 1? "mp4":split[split.length - 1];
}

module.exports = app;