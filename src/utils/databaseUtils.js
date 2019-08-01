let Datastore = require('nedb');
let db = new Datastore({ filename: 'db/patients.db', autoload: true });
let vdb = new Datastore({ filename: 'db/visits.db', autoload: true });
//Backup Patient details and visits 
exports.doBackUp = function (){
    var jsonData;
    var jsonDataContent;
    new Promise((resolve, reject) => {
        // Get all persons from the database with matching name
        db.find({}, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    })
        .then((docs)=>{
            console.log(docs);
        })
        .catch(err => { console.log(err) });

}
// Adds a person
exports.addPatient = function (firstname, lastname, age, sex, complaints, meds, amount) {
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    }
    var date=dd+"/"+mm+"/"+yyyy;
    db.count({}, function (err, number) {

        var person = {
            "firstname": firstname,
            "lastname": lastname,
            "age": age,
            "sex": sex,
            "reg_no": "REG-" + (number + 1)
        };
        var visit = {
            "reg_no": "REG-" + (number + 1),
            "visits": [{
                "complaints": complaints,
                "meds": meds,
                "amount": amount,
                "date":date,
            }]
        }

        // Save the person to the database
        db.insert(person, function (err, docs) {
            console.log("Added entry", docs);
            vdb.insert(visit, function (err, vdocs) {
                console.log("Added visit for REG-", (number + 1), "->", vdocs);
            })
        });
    });

    // Create the person object

};

// Returns persons with match name
exports.getPersons = function (name, callback) {
    new Promise((resolve, reject) => {
        var regex = new RegExp(["^", name, "$"].join(""), "i");
        // Get all persons from the database with matching name
        db.find({ firstname: regex }, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    })
        .then(docs => { callback(docs) })
        .catch(err => { console.log(err) });
};

// Load visits of the patient with passed Red-No
exports.getVisits = function (reg_no, callback) {
    new Promise((resolve, reject) => {
        var regex = new RegExp(["^", reg_no, "$"].join(""), "i");
        // Get all visits for the reg_no
        vdb.findOne({ reg_no: regex }, function (err, docs) {
            if (err) {
                reject(err);
            } else {
                resolve(docs);
            }
        });
    })
        .then(docs => { callback(docs) })
        .catch(err => { console.log(err) });
}

exports.addVisit = function (reg,complaints,meds,amount, callback) {
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    }
    var date=dd+"/"+mm+"/"+yyyy;
       var newVisit={
            "complaints": complaints,
            "meds": meds,
            "amount": amount,
            "date":date
        }

        new Promise((resolve,reject)=>{
            vdb.update({reg_no:reg},{$push:{visits:newVisit}},{},function(err,num){
                if(err){
                    reject(err);
                }
                else{
                    resolve(num);
                }
            });
        }).then(num=>{console.log("Added ",num," entry")})
        .catch(err=>{console.log(err)});
}
// db.update({ _id: 'id6' }, { $push: { fruits: 'banana' } }, {}, function () {
//     // Now the fruits array is ['apple', 'orange', 'pear', 'banana']
//   });

