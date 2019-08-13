// //Worker around
//https://github.com/Microsoft/TypeScript/issues/3429
interface ObjectConstructor {
  assign(target: any, ...sources: any[]): any;
}

if (typeof Object.assign != 'function') {
  (function() {
    Object.assign = function(target) {
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

// Using interface

interface Userint {
  name: string;
  age: number;
  created: Date;
}
interface UserJSON {
  name: string;
  age: number;
  created: string;
}

function encodeUser(user: Userint): UserJSON {
  return {
    name: user.name,
    age: user.age,
    created: user.created.toString()
  };
}

function decodeUser(json: UserJSON): Userint {
  return {
    name: json.name,
    age: json.age,
    created: new Date(json.created)
  };
}

function encodeUserInterface(user: Userint): UserJSON {
  return Object.assign({}, user, {
    created: user.created.toString()
  });
}

function decodeUserInterface(json: UserJSON): Userint {
  return Object.assign({}, json, {
    created: new Date(json.created)
  });
}

const myuser = {} as Userint;
myuser.age = 11;
myuser.created = new Date();
myuser.name = 'moxing';

// const result = Object.assign({}, myuser, { created: myuser.created.toString() });

console.log(encodeUser(myuser));
// console.log(result);
console.log(encodeUserInterface(myuser));

// Test with Class
class User {
  // if the user has an account
  private account: Account;

  created: Date = new Date();
  private name: string;
  private age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
    this.created = new Date();
  }

  getName(): string {
    return this.name;
  }

  // Encode the class and return as JSON
  encode(): UserJSON {
    return Object.assign({}, this, {
      created: this.created.toString()
    });
  }

  static decode(json: UserJSON): User {
    let user = Object.create(User.prototype);
    return Object.assign(user, json, {
      created: new Date(json.created)
    });
  }

  // function to json stringify
  // When JSON.stringify is invoked on an object, it checks for a method called
  // toJSON to convert the data before ‘stringifying’ it.In light of this,
  // let’s rename encode and decode to toJSON and fromJSON.

  // toJSON is automatically used by JSON.stringify
  toJSON(): UserJSON {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this, {
      // convert fields that need converting
      created: this.created.toString()
    });
  }

  static fromJSON(json: UserJSON): User {
    let user = Object.create(User.prototype);
    return Object.assign(user, json, {
      created: new Date(json.created)
    });
  }

  // This is good, but we can do better. JSON.parse accepts a second parameter
  // called reviver which is a function that gets called with every key / value pair
  //  in the object as it’s being parsed.The root object is passed to reviver with an empty string as the key.
  // Let’s add a reviver function to our User class.
  static reviver(key: string, value: any): any {
    return key === '' ? User.fromJSON(value) : value;
  }
}

// We don’t need to call user.encode() explicitly anymore!
let data1 = JSON.stringify(new User('moxing', 39)); //When JSON.stringify is invoked on an object, it checks for a method called toJSON to convert the data before ‘stringifying’ it. In light of this, let’s rename encode and decode to toJSON and fromJSON.
let usr = User.fromJSON(JSON.parse(data1));
let usr1 = JSON.parse(data1, User.reviver);

console.log('this is data ' + data1);
console.log('this is user class data ' + JSON.stringify(usr));
console.log('this is reviver ' + JSON.stringify(usr1));

// To form the requirement json object
// We will use a class
// nested class Panel
class Panel {
  cpu: string;
  memory: string;
  disk_0: string;
  disk_1: string;
  disk_type: string;
  quantity?: string;

  // Create a constructor
  // Initialize all the values
  constructor(
    cpu: string,
    memory: string,
    disk_0: string,
    disk_1: string,
    disk_type: string,
    quantity?: string
  ) {
    this.cpu = cpu;
    this.memory = memory;
    this.disk_0 = disk_0;
    this.disk_1 = disk_1;
    this.disk_type = disk_type;
    this.quantity = quantity;
  }
}

// root Class
class Cluster {
  // By default is public
  // use private accessors to keep it private
  private hostname: string;
  private network_speed: number;
  private os: string;
  private type: string;
  private control_panel: Panel;
  private worker_panel: Panel;
  private storage_panel: Panel;
  // Add in new field date
  created: Date = new Date();

  // Create a constructor
  // Initialize all the values
  constructor(
    hostname: string,
    network_speed: number,
    os: string,
    type: string,
    control_panel: Panel,
    worker_panel: Panel,
    storage_panel: Panel,
    date: Date
  ) {
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
  toJSON(): Cluster {
    // copy all fields from `this` to an empty object and return in
    return Object.assign({}, this, {
      // convert fields that need converting
      created: this.created.toString()
    });
  }

  static fromJSON(json: Cluster): Panel {
    let panel = Object.create(Panel.prototype);
    return Object.assign(panel, json, {
      created: new Date()
    });
  }

  // This is good, but we can do better. JSON.parse accepts a second parameter
  // called reviver which is a function that gets called with every key / value pair
  //  in the object as it’s being parsed.The root object is passed to reviver with an empty string as the key.
  // Let’s add a reviver function to our User class.
  static reviver(key: string, value: any): any {
    return key === '' ? User.fromJSON(value) : value;
  }
}

// Initialize and create 3 panels here
let controlpanel = new Panel('8', '32', '100', '500', 'SSD'); //When JSON.stringify is invoked on an object, it checks for a method called toJSON to convert the data before ‘stringifying’ it. In light of this, let’s rename encode and decode to toJSON and fromJSON.
let workerpanel = new Panel('8', '32', '100', '500', 'SSD', '1');
let storagepanel = new Panel('8', '32', '100', '500', 'SSD', '1');

let mycluster = JSON.stringify(
  new Cluster(
    'myhostname',
    1000,
    'REDHAT',
    'dev',
    controlpanel,
    workerpanel,
    storagepanel,
    new Date()
  )
);
let mycluster1 = User.fromJSON(JSON.parse(mycluster));
//let usr1 = JSON.parse(data1, User.reviver);

console.log('this is mycluster ' + mycluster);
console.log('this is mycluster1 ' + JSON.stringify(mycluster1));

// For more enhancement, you can create getter and setter to access private properties / attributes


