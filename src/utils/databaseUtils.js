let Datastore = require('nedb');
let db = new Datastore({ filename: 'db/patients.db', autoload: true });
let vdb = new Datastore({ filename: 'db/visits.db', autoload: true });
// Adds a person
exports.addPatient = function (firstname, lastname, age, sex, complaints, meds, amount) {
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
                "amount": amount
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
   
       var newVisit={
            "complaints": complaints,
            "meds": meds,
            "amount": amount
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

