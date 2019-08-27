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

let json; // Variable to hold the json data from RDAP

app.get('/', function (req, res) {
    res.render('index.html');
});

app.post('/', function (req, res) {
    let query = req.body['query'];
    let entityType = req.body['object-type'];
    let baseUrl = 'https://rdap.afrinic.net/rdap/';

    function commonData() {
       return {
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
                "https://rdap.afrinic.net/rdap/",
            ],
            "prefixList": {
                "owl": "http://www.w3.org/2002/07/owl#",
                "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                "xsd": "http://www.w3.org/2001/XMLSchema#",
                "": "http://visualdataweb.de/ontobench/ontology/13/",
                "xml": "http://www.w3.org/XML/1998/namespace",
                "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
            },
            "iri": "https://rdap.afrinic.net/rdap/"
        }
      };

    }

    function getCommonClassAttributes(json, vizJson) {
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

            return vizJson;

    }


    switch (entityType) {
        case "ip":
            axios.get(baseUrl + 'ip/' + query)
                .then(response => {
                    let json = response.data;
                   // console.log(json);
                    let vizJson = commonData();
                    vizJson.class = [
                        {
                            "id": "0",
                            "type": "rdfs:Class"
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
                    let vizJson = commonData();

                    vizJson.class = [
                        {
                            "id": "0",
                            "type": "rdfs:Class"
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
            axios.get(baseUrl + 'domain/' + query)
                .then(response => {
                     json = response.data;

                    let vizJson = commonData();
                    vizJson.class = [
                        {
                            "id": "0",
                            "type": "rdfs:Class"
                        }
                    ];
                    vizJson.classAttribute = [
                        {
                            "id": "0",
                            "label": json.handle,
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
                                }],

                                "Object Type": [{
                                    "identifier": "Object Type",
                                    "language": json["entities"][i].lang,
                                    "value": json["entities"][i]["objectClassName"],
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

                    for(let i=0; i < json["nameservers"].length; i++){
                        let skip = json.entities.length;
                        let _class = {
                            "id": (skip + i).toString(),
                            "type": "owl:Class"
                        };
                        vizJson.class.push(_class);

                        let _classAttribute = {
                            "id": (skip + i).toString(),
                            "label": json["nameservers"][i]["handle"],
                            "annotations": {
                                "ldhName": [{
                                    "identifier": "ldhName",
                                    "value": json["nameservers"][i].ldhName,
                                    "type": "label"
                                }],

                                "objectClassName": [{
                                    "identifier": "Object Class Name",
                                    "value": json["nameservers"][i].objectClassName,
                                    "type": "label"
                                }]
                            }
                        };

                        vizJson.classAttribute.push(_classAttribute);

                        let _property = {
                            "id": (skip + i).toString(),
                            "type": "owl:ObjectProperty"
                        };
                        vizJson.property.push(_property);

                        let _propertyAttribute = {
                            "id": (( skip + i) * 10).toString(),
                            "label": "Name Server",
                            "domain": (skip+ i).toString(),
                            "range": (0).toString()
                        };

                        vizJson.propertyAttribute.push(_propertyAttribute);
                    }
                    saveFile(vizJson);

                } ).catch(function (err) {
                console.log(err);
            });
            break;

        case "entity":
            axios.get(baseUrl + 'entity/' + query).
            then(response => {
              json = response.data;
              let vizJson = commonData();
                vizJson.class = [
                    {
                        "id": "0",
                        "type": "rdfs:Class"
                    }
                ];

                vizJson.classAttribute = [
                    {
                        "id": "0",
                        "label": json.handle,
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

                            "status": [{
                                "identifier": "Status",
                                "language": json.lang,
                                "value": json.status,
                                "type": "label"
                            }]
                        }
                    }
                ];

                for(let i = 0; i < json.entities.length; i++){
                    vizJson.class.push({
                        "id": (i + 1).toString(),
                        "type": "owl:Class"
                    });

                    let _classAttribute = {
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
                            }],

                            "Object Type": [{
                                "identifier": "Object Type",
                                "language": json["entities"][i].lang,
                                "value": json["entities"][i]["objectClassName"],
                                "type": "label"
                            }]
                        }
                    };
                    vizJson.classAttribute.push(_classAttribute);
                }
                saveFile(vizJson);

            })
            .catch(function (err) {
                console.log(err);
            });
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