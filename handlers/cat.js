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
        let form = new formidable.IncomingForm();

        form.parse(req,(err,fields,files) => {
            if(err) throw err;

            let oldPath = files.upload.path;
            let newPath = path.normalize(path.join(__dirname,'../content/images/' + files.upload.name));

            fs.rename(oldPath,newPath,(err) => {
                if(err) throw err;
                console.log("Files was uploaded successfully !");
            });

            fs.readFile("./data/cats.json", 'utf8',(err,data) => {
                if(err) throw err;

                let allCats = JSON.parse(data);
                allCats.push({ id: cats.length + 1, ...fields, image: files.upload.name, taken: false});
                let json = JSON.stringify(allCats);
                fs.writeFile("./data/cats.json", json, () => {
                    res.writeHead(301,{ location: '/'});
                    res.end();
                });
            });
        });
    }else if(pathname === '/cats/add-breed' && req.method === 'POST'){
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
    }else if(pathname.includes('/cats-edit') && req.method === 'GET'){
        let filePath = path.normalize(path.join(__dirname,'../views/editCat.html'));
        const input = fs.createReadStream(filePath);
        const currentCat = cats[Number(pathname.match(/\d+$/g)) - 1];
        console.log(currentCat);

        input.on('data', (data) => {
            let modifiedData = data.toString().replace('{{id}}',currentCat.id);
            modifiedData = modifiedData.toString().replace('{{name}}',currentCat.name);
            modifiedData = modifiedData.toString().replace('{{description}}',currentCat.description);
            
            const breedsAsOption = breeds.map((b) => `<option value ="${b}">${b}</option>`);
            modifiedData = modifiedData.replace("{{catBreeds}}",breedsAsOption.join("/"));

            modifiedData = modifiedData.replace("{{breed}}",currentCat.breed);
            res.write(modifiedData);
        });

        input.on("end",() => res.end());
        input.on("error",(err) => console.log(err));
    }else{
        true;
    }
};