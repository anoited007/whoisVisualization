const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/css', express.static(__dirname + '/css'))
app.use('/js', express.static(__dirname + '/js'))
app.use('/data', express.static(__dirname + '/data'))

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
  const baseUrl = 'https://rdap.afrinic.net/rdap/';
  console.log(req.body);
  let param = req.body;
  let objectType = param['object-type'];
  let query = param['query'];

  switch (objectType) {
    case 'ip':
      fetch(baseUrl + 'ip/' + query)
          .then(data => data.json())
          // .then(data => res.send(data))
          .catch(err => console.log(err));
      //return res.send("It kinda worked")
      break;
    default:
      break;

  }
  res.send('Did not work');

});



app.post('/json', (req, res) => {
  let json = req.body;
  let vizJson = {
    "_comment": "This is the AfriNIC RDAP server.",
    "header": {
      "title" : {
        "undefined" : json.notices[0].description.toString()
      },
      "description" : {
        "undefined" : json.notices[0].description.toString()
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
      "label": `${json.name}`,
      "comment": {
        "undefined": json.objectClassName
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
          "value": json.status.toString(),
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
      "label": json.entities[i].handle,
      "annotations": {
        "language": [{
          "identifier": "Language",
          "language": json.entities[i].lang,
          "value": json.entities[i].lang,
          "type": "label"
        }],
        "status": [{
          "identifier": "Status",
          "language": json.entities[i].lang,
          "value": json.entities[i].status.toString(),
          "type": "label"
        }],
        "roles": [{
          "identifier": "Roles",
          "language": json.entities[i].lang,
          "value": json.entities[i].roles.toString(),
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
  const fileName = Date.now() + '.json';
  fs.writeFileSync(`data/${fileName}`, JSON.stringify(vizJson, null, 2));
  res.status(200).json({ fileName })
});


app.listen(PORT, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }
  console.log(`server is listening on ${PORT}`);
});