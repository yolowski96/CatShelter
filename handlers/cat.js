const url = require('url');
const fs = require('fs');
const path = require('path');
const qs = require('querystring');
const formidable = require('formidable');
const breeds = require('../data/breeds.json');
const cats = require('../data/cats.json');



module.exports = (req,res) => {

    const pathname = url.parse(req.url).pathname;

    if(pathname === '/cats/add-cat' && req.method === 'GET'){
        let filePath = path.normalize(
            path.join(__dirname,'../views/addCat.html')
        );

        let input = fs.createReadStream(filePath);
        
        input.on('data', (data) => {
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);
            let modifiedData = data.toString().replace('{{catBreeds}}', catBreedPlaceholder);
            res.write(modifiedData);
        });

        input.on('end', () => {
            res.end();
        });

        input.on('error', (err) => {
            console.log(err);
        });

    }else if(pathname === '/cats/add-breed' && req.method === 'GET'){
        let filePath = path.normalize(
            path.join(__dirname,'../views/addBreed.html')
        );

        fs.readFile(filePath,(err,data) =>{
            if(err){
                console.log(err);
                res.writeHead(404,{
                    'Content-Type': 'text/plain'
                });

                res.write('404 Not Found');
                res.end();
                return;
            }

            res.writeHead(200,{
                'Content-Type': 'text/html'
            });

            res.write(data);
            res.end();
        });
    }else if(pathname === '/cats/add-cat' && req.method === 'POST'){

    }else if(pathname === "/cats/add-breed" && req.method === 'POST'){
        let filePath = path.normalize(path.join(__dirname, "../data/breeds.json"));
        
        let formData = "";  

        req.on("data", (data) => {
            formData += data;
        });

        req.on("end", () => {
            let body = qs.parse(formData);
            console.log(body);
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log("Error: ", err);
                    return;
                }

                let breeds = JSON.parse(data);

                breeds.push(body.breed);

                let json = JSON.stringify(breeds.sort());
                fs.writeFile(filePath, json, () => console.log("The breed was uploaded successfully!"));                                                     // 4. Update the breeds.json file
            });

            res.writeHead(301, { "location": "/" });
            res.end();
        });
    }else{
        true;
    }
};