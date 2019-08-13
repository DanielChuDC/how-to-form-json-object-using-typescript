if (typeof Object.assign != 'function') {
    (function () {
        Object.assign = function (target) {
            'use strict';
            if (target === undefined || target === null) {
                throw new TypeError('Cannot convert undefined or null to object');
            }
            var output = Object(target);
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index];
                if (source !== undefined && source !== null) {
                    for (var nextKey in source) {
                        if (source.hasOwnProperty(nextKey)) {
                            output[nextKey] = source[nextKey];
                        }
                    }
                }
            }
            return output;
        };
    })();
}
// 'use strict';
// Purely using JSON stringify
console.log(JSON.stringify({ name: 'bob', age: 34, created: new Date() }));
console.log(JSON.parse('{"name":"bob","age":34,"created":"2016-03-19T18:15:12.710Z"}'));
function encodeUser(user) {
    return {
        name: user.name,
        age: user.age,
        created: user.created.toString()
    };
}
function decodeUser(json) {
    return {
        name: json.name,
        age: json.age,
        created: new Date(json.created)
    };
}
function encodeUserInterface(user) {
    return Object.assign({}, user, {
        created: user.created.toString()
    });
}
function decodeUserInterface(json) {
    return Object.assign({}, json, {
        created: new Date(json.created)
    });
}
var myuser = {};
myuser.age = 11;
myuser.created = new Date();
myuser.name = 'moxing';
// const result = Object.assign({}, myuser, { created: myuser.created.toString() });
console.log(encodeUser(myuser));
// console.log(result);
console.log(encodeUserInterface(myuser));
// Test with Class
var User = /** @class */ (function () {
    function User(name, age) {
        this.created = new Date();
        this.name = name;
        this.age = age;
        this.created = new Date();
    }
    User.prototype.getName = function () {
        return this.name;
    };
    // Encode the class and return as JSON
    User.prototype.encode = function () {
        return Object.assign({}, this, {
            created: this.created.toString()
        });
    };
    User.decode = function (json) {
        var user = Object.create(User.prototype);
        return Object.assign(user, json, {
            created: new Date(json.created)
        });
    };
    // function to json stringify
    // When JSON.stringify is invoked on an object, it checks for a method called
    // toJSON to convert the data before ‘stringifying’ it.In light of this,
    // let’s rename encode and decode to toJSON and fromJSON.
    // toJSON is automatically used by JSON.stringify
    User.prototype.toJSON = function () {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this, {
            // convert fields that need converting
            created: this.created.toString()
        });
    };
    User.fromJSON = function (json) {
        var user = Object.create(User.prototype);
        return Object.assign(user, json, {
            created: new Date(json.created)
        });
    };
    // This is good, but we can do better. JSON.parse accepts a second parameter
    // called reviver which is a function that gets called with every key / value pair
    //  in the object as it’s being parsed.The root object is passed to reviver with an empty string as the key.
    // Let’s add a reviver function to our User class.
    User.reviver = function (key, value) {
        return key === '' ? User.fromJSON(value) : value;
    };
    return User;
}());
// We don’t need to call user.encode() explicitly anymore!
var data1 = JSON.stringify(new User('moxing', 39)); //When JSON.stringify is invoked on an object, it checks for a method called toJSON to convert the data before ‘stringifying’ it. In light of this, let’s rename encode and decode to toJSON and fromJSON.
var usr = User.fromJSON(JSON.parse(data1));
var usr1 = JSON.parse(data1, User.reviver);
console.log('this is data ' + data1);
console.log('this is user class data ' + JSON.stringify(usr));
console.log('this is reviver ' + JSON.stringify(usr1));
// To form the requirement json object
// We will use a class
// nested class Panel
var Panel = /** @class */ (function () {
    // Create a constructor
    // Initialize all the values
    function Panel(cpu, memory, disk_0, disk_1, disk_type, quantity) {
        this.cpu = cpu;
        this.memory = memory;
        this.disk_0 = disk_0;
        this.disk_1 = disk_1;
        this.disk_type = disk_type;
        this.quantity = quantity;
    }
    return Panel;
}());
// root Class
var Cluster = /** @class */ (function () {
    // Create a constructor
    // Initialize all the values
    function Cluster(hostname, network_speed, os, type, control_panel, worker_panel, storage_panel, date) {
        // Add in new field date
        this.created = new Date();
        this.hostname = hostname;
        this.network_speed = network_speed;
        this.os = os;
        this.type = type;
        this.control_panel = control_panel;
        this.worker_panel = worker_panel;
        this.storage_panel = storage_panel;
        this.created = new Date();
    }
    // Getter && Setter below
    // Temporary no need
    // Create encode below
    // function to json stringify
    // When JSON.stringify is invoked on an object, it checks for a method called
    // toJSON to convert the data before ‘stringifying’ it.In light of this,
    // let’s rename encode and decode to toJSON and fromJSON.
    // toJSON is automatically used by JSON.stringify
    Cluster.prototype.toJSON = function () {
        // copy all fields from `this` to an empty object and return in
        return Object.assign({}, this, {
            // convert fields that need converting
            created: this.created.toString()
        });
    };
    Cluster.fromJSON = function (json) {
        var panel = Object.create(Panel.prototype);
        return Object.assign(panel, json, {
            created: new Date()
        });
    };
    // This is good, but we can do better. JSON.parse accepts a second parameter
    // called reviver which is a function that gets called with every key / value pair
    //  in the object as it’s being parsed.The root object is passed to reviver with an empty string as the key.
    // Let’s add a reviver function to our User class.
    Cluster.reviver = function (key, value) {
        return key === '' ? User.fromJSON(value) : value;
    };
    return Cluster;
}());
// Initialize and create 3 panels here
var controlpanel = new Panel('8', '32', '100', '500', 'SSD'); //When JSON.stringify is invoked on an object, it checks for a method called toJSON to convert the data before ‘stringifying’ it. In light of this, let’s rename encode and decode to toJSON and fromJSON.
var workerpanel = new Panel('8', '32', '100', '500', 'SSD', '1');
var storagepanel = new Panel('8', '32', '100', '500', 'SSD', '1');
var mycluster = JSON.stringify(new Cluster('myhostname', 1000, 'REDHAT', 'dev', controlpanel, workerpanel, storagepanel, new Date()));
var mycluster1 = User.fromJSON(JSON.parse(mycluster));
//let usr1 = JSON.parse(data1, User.reviver);
console.log('this is mycluster ' + mycluster);
console.log('this is mycluster1 ' + JSON.stringify(mycluster1));
// console.log('this is reviver ' + JSON.stringify(usr1));
