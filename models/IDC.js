const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema
let IDC = new Schema({
    id: {
        type: String
    },
    loaiIDC: {
        type: String
    },
    am:{
        type: Object
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
    extendDate:{
        type: Object
    },
    cancelDate:{
        type: Date
    },
    remark:{
        type: String
    },
}, {
    collection: 'idc'
})

module.exports = mongoose.model('IDC', IDC)