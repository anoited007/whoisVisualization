const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/css', express.static(__dirname + '/css'));
app.use('/js', express.static(__dirname + '/js'));
app.use('/data', express.static(__dirname + '/data'));

app.set('static', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(express.urlencoded());
app.use(express.json());

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
const $ = (require('jquery'))(dom.window);

app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/', function (req, res) {
    let query = req.body['query'];
    let entityType = req.body['object-type'];
    let baseUrl = 'https://rdap.afrinic.net/rdap/';


    switch (entityType) {
        case "ip":
            axios.get(baseUrl + 'ip/' + query)
                .then(response => {
                    let json = response.data;
                    console.log(json);
                    let vizJson = {
                        "_comment": "This is the AFRINIC RDAP server.",
                        "header": {
                            "title" : {
                                "language": json.lang,
                                "undefined" : json["notices"][0]["links"][0].value
                            },
                            "description" : {
                                "undefined" : json["notices"][0]["links"][0].href
                            },
                            "baseIris": [
                                "https://rdap.afrinic.net/rdap/ip/",
                            ],
                            "prefixList": {
                                "owl": "http://www.w3.org/2002/07/owl#",
                                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                                "xsd": "http://www.w3.org/2001/XMLSchema#",
                                "": "http://visualdataweb.de/ontobench/ontology/13/",
                                "xml": "http://www.w3.org/XML/1998/namespace",
                                "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
                            },
                            "iri": "https://rdap.afrinic.net/rdap/ip/"
                        }
                    };
                    vizJson.class = [
                        {
                            "id": "0",
                            "type": "owl:Class"
                        }
                    ];
                    vizJson.classAttribute = [
                        {
                            "id": "0",
                            "label": json.name,
                            "comment": {
                                "undefined": json["objectClassName"]
                            },
                            "annotations": {
                                "type": [{
                                    "identifier": "IP Type",
                                    "language" : json.lang,
                                    "value" : json.type,
                                    "type" : "label"
                                }],
                                "handle": [{
                                    "identifier": "Handle",
                                    "language": json.lang,
                                    "value": json.handle,
                                    "type": "label"
                                }],
                                "startAddress": [{
                                    "identifier": "Start Address",
                                    "language": json.lang,
                                    "value": json.startAddress,
                                    "type": "label"
                                }],
                                "endAddress": [{
                                    "identifier": "End Address",
                                    "language": json.lang,
                                    "value": json.endAddress,
                                    "type": "label"
                                }],
                                "parentHandle": [{
                                    "identifier": "Parent Handle",
                                    "language": json.lang,
                                    "value": json.parentHandle,
                                    "type": "label"
                                }],
                                "ipVersion": [{
                                    "identifier": "IP Version",
                                    "language": json.lang,
                                    "value": json.ipVersion,
                                    "type": "label"
                                }],
                                "country": [{
                                    "identifier": "Country",
                                    "language": json.lang,
                                    "value": json.country,
                                    "type": "label"
                                }],
                                "status": [{
                                    "identifier": "Status",
                                    "language": json.lang,
                                    "value": json.status,
                                    "type": "label"
                                }]
                            }
                        }
                    ];
                    vizJson.property = [];
                    vizJson.propertyAttribute = [];

                    for (let i = 0; i < json.entities.length; i++) {
                        vizJson.class.push({
                            "id": (i + 1).toString(),
                            "type": "owl:Class"
                        });
                        vizJson.classAttribute.push({
                            "id": (i + 1).toString(),
                            "label": json["entities"][i]["handle"],
                            "annotations": {
                                "language": [{
                                    "identifier": "Language",
                                    "language": json["entities"][i]["lang"],
                                    "value": json["entities"][i].lang,
                                    "type": "label"
                                }],
                                "status": [{
                                    "identifier": "Status",
                                    "language": json["entities"][i].lang,
                                    "value": json["entities"][i].status,
                                    "type": "label"
                                }],
                                "roles": [{
                                    "identifier": "Roles",
                                    "language": json["entities"][i].lang,
                                    "value": json["entities"][i]["roles"],
                                    "type": "label"
                                }]
                            },
                        });
                        vizJson.property.push({
                            "id": ((i + 1) * 10).toString(),
                            "type": "owl:ObjectProperty"
                        });
                        vizJson.propertyAttribute.push({
                            "id": ((i + 1) * 10).toString(),
                            "label": "entity",
                            "domain": (i + 1).toString(),
                            "range": (0).toString()
                        });
                    }

                    saveFile(vizJson);

                } ).catch(function (err) {
                console.log(err);
            });
            break;

        case "as-number":
            axios.get(baseUrl + 'autnum/' + query)
                .then(response => {
                    let json = response.data;
                    let vizJson = {
                        "_comment": "This is the AFRINIC RDAP server.",
                        "header": {
                            "title": {
                                "language": json.hreflang,
                                "undefined": json["notices"][0]["links"][0].value
                            },
                            "description": {
                                "undefined": json["notices"][0]["links"][0].href
                            },
                            "baseIris": [
                                "https://rdap.afrinic.net/rdap/autnum/",
                            ],
                            "prefixList": {
                                "owl": "http://www.w3.org/2002/07/owl#",
                                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                                "xsd": "http://www.w3.org/2001/XMLSchema#",
                                "": "http://visualdataweb.de/ontobench/ontology/13/",
                                "xml": "http://www.w3.org/XML/1998/namespace",
                                "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
                            },
                            "iri": "https://rdap.afrinic.net/rdap/ip/"
                        }
                    };

                    vizJson.class = [
                        {
                            "id": "0",
                            "type": "owl:Class"
                        }
                    ];
                    vizJson.classAttribute = [
                        {
                            "id": "0",
                            "label": json.name,
                            "comment": {
                                "undefined": json["objectClassName"]
                            },
                            "annotations": {
                                "handle": [{
                                    "identifier": "Handle",
                                    "language": json.lang,
                                    "value": json.handle,
                                    "type": "label"
                                }],
                                "startAutnum": [{
                                    "identifier": "Start Autnum",
                                    "language": json.lang,
                                    "value": json.startAutnum,
                                    "type": "label"
                                }],
                                "endAutnum": [{
                                    "identifier": "End Autnum",
                                    "language": json.lang,
                                    "value": json.endAutnum,
                                    "type": "label"
                                }],

                                "status": [{
                                    "identifier": "Status",
                                    "language": json.lang,
                                    "value": json.status,
                                    "type": "label"
                                }]
                            }
                        }
                    ];

                    vizJson.property = [];
                    vizJson.propertyAttribute = [];

                    for (let i = 0; i < json.entities.length; i++) {
                        vizJson.class.push({
                            "id": (i + 1).toString(),
                            "type": "owl:Class"
                        });
                        vizJson.classAttribute.push({
                            "id": (i + 1).toString(),
                            "label": json["entities"][i]["handle"],
                            "annotations": {
                                "language": [{
                                    "identifier": "Language",
                                    "language": json["entities"][i]["lang"],
                                    "value": json["entities"][i].lang,
                                    "type": "label"
                                }],
                                "status": [{
                                    "identifier": "Status",
                                    "language": json["entities"][i].lang,
                                    "value": json["entities"][i].status,
                                    "type": "label"
                                }],
                                "roles": [{
                                    "identifier": "Roles",
                                    "language": json["entities"][i].lang,
                                    "value": json["entities"][i]["roles"],
                                    "type": "label"
                                }]
                            },
                        });

                        vizJson.property.push({
                            "id": ((i + 1) * 10).toString(),
                            "type": "owl:ObjectProperty"
                        });

                        vizJson.propertyAttribute.push({
                            "id": ((i + 1) * 10).toString(),
                            "label": "entity",
                            "domain": (i + 1).toString(),
                            "range": (0).toString()
                        });

                    }
                    saveFile(vizJson);
                }).catch(function (err) {
                    console.log(err);
            });
                    break;


        case "rdns":
            break;


        case "entity":
            break;

    }
    res.send("Good");

});

app.get('/whois', function (req, res) {
    res.render('whois-visual.html');
});

function saveFile(jsonData){
    const fileName = Date.now() + '.json';
    fs.writeFileSync(`data/${fileName}`, JSON.stringify(jsonData, null, 4));
}

app.listen(PORT, (err) => {
    if (err) {
        return console.log('something bad happened', err);
    }
    console.log(`server is listening on ${PORT}`);
});