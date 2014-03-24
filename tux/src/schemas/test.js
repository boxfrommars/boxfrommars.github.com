var tv4 = require('tv4');

var schema = {
    "title": "Order Schema",
    "type": "object",
    "properties": {
        "id": {
            "type": "integer"
        }
    },
    "required": ["id"]
}

var data = {
    "firstName": "Dmitry",
    "age": "hello"
}

var valid = tv4.validateMultiple(data, schema);

console.log(valid);

if (!valid) {
    console.log(tv4.error);
}