const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let Dauso = new Schema({
    id: {
        type: String
    },
    loaiDauso: {
        type: String
    },
    dauso: {
        type: String
    },
    unitCode:{
        type: String
    },
    userName:{
        type: String
    },
    comTaxCode:{
        type: String
    },
    comName:{
        type: String
    },
    registrationDate:{
        type: Date
    },
    cancelDate:{
        type: Date
    },
    remark:{
        type: String
    },
}, {
    collection: 'dauso'
})

module.exports = mongoose.model('Dauso', Dauso)