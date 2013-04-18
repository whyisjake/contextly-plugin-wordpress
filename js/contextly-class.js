Contextly = Contextly || {};

Contextly.createClass = function (data)
{
    var abstracts = data.abstracts || [],
        statics = data.statics || {},
        extend = data.extend || [];

    if(!(extend instanceof Array))
        extend  = [extend];

    // define constructor
    var constructor;
    if(data.construct) {
        constructor = data.construct;
    } else if(extend.length) {
        constructor = function() {
            for(var i=0; i<extend.length; i++) {
                extend[i].apply(this, arguments);
            }
        }
    } else {
        constructor = function() {};
    }

    // prototype for our class.
    var proto = {};

    delete data.construct;
    delete data.abstracts;
    delete data.statics;
    delete data.extend;


    // borrow methods from parent classes
    for(var i=0; i<extend.length; i++) {
        var parent = extend[i];

        // static constructor
        if( typeof parent.construct == "function")
            parent.construct.call(constructor);

        // copy static methods
        for(var p in parent) {
            if (typeof parent[p] != "function" || p == "construct") // copy only functions
                continue;
            constructor[p] = parent[p];
        }

        // Copy prototype methods
        for(var p in parent.prototype) {
            if (typeof parent.prototype[p] != "function" || p == "constructor")
                continue;
            proto[p] = parent.prototype[p];
        }
    }

    // build abstract static methods
    if(statics.abstracts) {
        for(var p=0; p<statics.abstracts.length; p++) {
            proto[ statics.abstracts[p] ] = function() {
                throw p + ' is static abstract method'
            };
        }
    }

    // build abstract prototype methods
    for(var p=0; p<abstracts.length; p++) {
        proto[ abstracts[p] ] = function() {
            throw p + ' is abstract method'
        };
    }

    // internal methods
    proto.instanceOf = function(_class) {
        if(arguments.length > 1) {
            var res = true;
            for(var i=0; i<arguments.length; i++)
                res = res && this.instanceOf(arguments[i]);
            return res;
        }

        if(constructor === _class)
            return true;

        for(var i=0; i<extend.length; i++) {
            if( extend[i].prototype.instanceOf.call(this, _class) )
                return true;
        }

        return _class === Object;
    };

    // Use the following regex to test whether _super is actually used in the derived function.
    // http://ejohn.org/blog/simple-javascript-inheritance/
    var fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

    // rest of data are prototype methods
    for(var p in data) {
        if (typeof data[p] != "function") // copy only functions
            continue;

        if (typeof proto[p] == "function" && fnTest.test(data[p]) ) {
            proto[p] = (function(_super, func){
                return function() {
                    var tmp = this._super;
                    this._super = _super;
                    var ret = func.apply(this, arguments);
                    this._super = tmp;
                    return ret;
                };
            }(proto[p], data[p]));
        }
        else
            proto[p] = data[p];
    }

    // static functions of class
    for(var p in statics) {
        if (typeof statics[p] != "function") // copy only functions
            continue;
        constructor[p] = statics[p];
    }

    // static constructor
    if( typeof statics.construct == "function")
        statics.construct.call(constructor);

//	proto.constructor = constructor;
    constructor.prototype = proto;
    constructor.fn = proto; // short case

    // Finally, return the constructor function
    return constructor;
}
