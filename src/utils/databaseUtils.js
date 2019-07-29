let Datastore =require('nedb');
let db=new Datastore({filename:'db/patients.db',autoload:true});
// Adds a person
exports.addPatient = function(firstname, lastname,age,sex,complaints,meds,amount) {
    db.count({}, function(err, number) {
        
        var person = {
            "firstname": firstname,
            "lastname": lastname,
            "age":age,
            "sex":sex,
            "complaints":complaints,
            "meds":meds,
            "amount":amount,
            "reg_no":"REG-"+(number+1)
        };
    
        // Save the person to the database
        db.insert(person, function(err, docs) {
            console.log("Added entry",docs);
        });
    });
   
    // Create the person object
   
};

// Returns all persons
exports.getPersons = function(name,callback) {
    // var ret_obj;
    // var regex = new RegExp(["^", name, "$"].join(""), "i");
    // // Get all persons from the database
    // db.find({firstname:regex}, function(err, docs) {
    //     ret_obj=docs;  
    // })
    // .then(()=>{console.log(ret_obj)})
    // .then(()=>{return ret_obj});
    new Promise((resolve,reject)=>{
        var regex = new RegExp(["^", name, "$"].join(""), "i");
        // Get all persons from the database
        db.find({firstname:regex}, function(err, docs) {
            if(err){
                reject(err);
            }else {
                resolve(docs);
            }
        });
    })
    .then(docs=>{callback(docs)})
    .catch(err=>{console.log(err)});
}

