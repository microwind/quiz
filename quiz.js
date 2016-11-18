/**
 * @file:   quiz.js
 * @desc:   the following is some quizzes of JavaScript
 * @author: jarryli
 * @date: 2016-09-01

/* ##################### */
/* Part 1: The basis of language */
/* ##################### */


/*******************************************
 # assignment value reference javascript
********************************************/
// assignment
var a = 1;
var b = 2;
b = a;
console.log(a, b);

// reference
var c = [1, 2];
var d = c;
d[0] = 'a';
console.log(c, d);

// new reference
var c = [1, 2];
var d = c;
d = [];
d[0] = 'a';
console.log(c, d);

// continued assignment
var c = [1, 2];
var d = c = {};
d[0] = 'a';
console.log(c, d);

// # variable hoisting
var num1 = 1;
var num2 = 2;
(function foo() {
    if (num1) {
       var num1 = 11;
    }
    console.log('num1:', num1);

    if (!num2) {
       var num2 = 22;
    }
    console.log('num2:', num2);
})();

// # function defined first
var a;
console.log(a);
function a() {
    return 'a';
}

// hoisting with function defined
var num1 = 1;
function foo() {
    return num1;
    function num1() {
        return num1 + '|' + this.num1;
    }
}
foo();
foo()();

// hoisting with function defined
var num1 = 1;
function foo() {
    return num1;
    var num1 = function() {
        return num1 + '|' + this.num1;
    }
}
foo();
foo()();

// hoisting and arguments
var a = 1;
function foo(a) {
    a = 2;
    arguments[0] = 3;
    var a;
    console.log(a, this.a);
}
foo(a);

// hoisting and arguemnts 2
var a = 1;
function foo(a, b) {
    a = 2;
    arguments[0] = 3;
    arguments[1] = 4;
    var a;
    console.log(a, this.a, b);
}
foo(a);

/*******************************************
 # assignment value reference javascript
********************************************/
foo();
function foo() {
    alert(foo);
}
foo2();
var foo2 = function() {
    alert(foo2);
}
// error
foo1();

/*******************************************
 # function object and constructor and prototype
********************************************/
function foo() { this.name = 'foo'; };
foo.a = '1';
foo.b = 'b';
var f1 = foo;
f1.a = '2';
console.log( Object.keys(foo).map(function(item) {
   return (item + '=' + foo[item]);
}) );

//prototype
function foo() { this.name = 'foo'; };
foo.a = '1';
foo.b = 'b';
var f2 = new foo();
console.log( Object.keys(f2).map(function(item) {
   return (item + '=' + f2[item]);
}) );

// prototype variable and constructor variable
function foo() { this.name = 'foo'; };
foo.prototype.b = 'b1';
var f3 = new foo();
console.log( Object.keys(f3).map(function(item) {
   return (item + '=' + f3[item]);
}) );
for (var item in f3) {
    console.log(item + '=>' + f3[item]);
}
foo.prototype.b = 'change b';
foo.prototype.getB = function() {
    return this.b;
}
f3.getB();
foo.prototype.name = 'change foo';
foo.prototype.getName = function() {
    return this.name;
}
f3.getName();

/*******************************************
 # function object and constructor and prototype
********************************************/
function A() {};
var a1 = new A();
console.log(a1.constructor, a1.constructor == A,
    a1 instanceof A, A.prototype.isPrototypeOf(a1));
A.prototype = {};
var a2 = new A();
console.log(a2.constructor, a2.constructor == A,
    a2 instanceof A, A.prototype.isPrototypeOf(a2));

/*******************************************
 # function object and constructor and prototype
********************************************/
function A() {};
A.prototype.name = 'A';
var a1 = new A();
console.log(a1.name, a1.constructor, a1.constructor == A,
    a1 instanceof A, A.prototype.isPrototypeOf(a1));
A.prototype.name = 'A2';
A.prototype = {};
A.prototype.name = 'B';
var a2 = new A();
console.log(a1.name, a2.name, a2.constructor, a2.constructor == A,
    a2 instanceof A, A.prototype.isPrototypeOf(a2));

/*******************************************
# change prototype after instancing
********************************************/
function A() {};
var a1 = new A();
console.log(a1.constructor, a1.constructor == A,
    a1 instanceof A, A.prototype.isPrototypeOf(a1));
var a2 = new A();
A.prototype = {};
console.log(a2.constructor, a2.constructor == A,
    a2 instanceof A, A.prototype.isPrototypeOf(a2));

/*******************************************
# change prototype after instancing 2
********************************************/
function A() {};
var a1 = new A();
A.prototype.name = 'A';
console.log(a1.name, a1.constructor, a1.constructor == A,
    a1 instanceof A, A.prototype.isPrototypeOf(a1));
var a2 = new A();
A.prototype.name = 'A2';
A.prototype = {};
A.prototype.name = 'B';
console.log(a1.name, a2.name, a2.constructor, a2.constructor == A,
    a2 instanceof A, A.prototype.isPrototypeOf(a2));

/*******************************************
# pass value
********************************************/
var a = 'a1';
var b = ['b1', 'b2'];
function foo(a, b) {
    // var a, b;
    a = 'a2';
    b[0] = 'b2';
    console.log(a, b);
};
foo(a, b);
console.log(a, b);
//
var a = 'a1';
var b = ['b1', 'b2'];
function foo(a, b) {
    a = 'a2';
    b = ['b3', 'b4'];
    b[0] = 'b2';
    console.log(a, b);
};
foo(a, b);
console.log(a, b);

/*******************************************
# execute environment of this
********************************************/
var A = {
    name: 'A',
    getName: function() {
        return (this.name);
    },
    showName: function() {
        (function() {
            return (this.name);
        })();
    },
    echoName: function() {
        return function() {
            return this.name;
        };
    }
};
A.getName();
A.showName();
A.echoName()();

// function bind
var A = {
    name: 'A',
    getName: function() {
        return (this.name);
    },
    showName: function() {
        (function() {
            return (this.name);
        })();
    }
};
var B = {
    name: 'B'
};
// likes bind
B.getName = A.getName;
B.getName();
// call or apply
A.getName.call(B);
// direct assignment and execution
(B.getName = A.getName)();

// this in global environment
var A = {
    name: 'A',
    getName: function() {
        function showName() {
            console.log(this.name);
        }
        showName();
    }
};
A.getName();

// this in property of child object environment
var A = {
    name: 'A',
    B: {
        name: 'B',
        getName: function() {
            console.log(this.name);
        }
    }
};
A.B.getName();
var C = {};
C.getName = A.B.getName;
C.getName();

// change outer property
function outer() {
    this.name = 'A';
    function inner() {
        this.name = 'B';
    }
    inner();
}
console.log('before:', this.name);
outer();
console.log('after', this.name);

/*******************************************
# async execution
********************************************/
var num = 0;
function echo(n) {
    console.log(n);
}
for(var i = 0; i <= 10; i++) {
    setTimeout(function() {
         console.log(i);
    }, 0);
};
console.log(num, i);

// envent runing after current execution
for (var i = 0, l = 10; i< l; i++) {
    document.onclick = function() {
        console.log(i);
    }
}

// solve the index by closure
var num = 0;
function echo(n) {
    console.log(n);
}
for(var i = 0; i <= 10; i++) {
    (function(i) {
        setTimeout(function() {
             console.log(i);
        }, 0);
    })(i);
};
console.log(num, i);

// closure inner variable
(function(){
  var x = y = 1;
})();
console.log(y);
console.log(x);

/*******************************************
# closure
********************************************/
var a = 'a';
var b = 'b';
function foo() {
    var a = 'a1';
    var b = 'b1';
    return function(b) {
        console.log(a, b);
    }
}
(function () {
  a = 'a2';
  b = 'b2';
  foo()(b);
})();
console.log(a, b);

/*******************************************
# closure
********************************************/
function outer() {
    var n = 10;
    function inner(m) {
       return n += m;
    }
    return inner;
}
var test = outer();
var result = test(1);
console.log(result);

// defined/execution variable in closure
function outer() {
    var n = 10;
    function inner(m) {
       return n += m;
    }
    return inner;
}
var test = outer();
var result1 = test(1);
var result2 = test(2);
var result3 = test(3);
console.log(result1, result2, result3);

/*******************************************
# inherits example
********************************************/
// # inherits 1
function Parent() { this.title = 'Parent'; this.name = 'Parent';}
Parent.prototype.alias = 'Father';
Parent.prototype.getName = function() {
    return 'Parent:' + this.name;
}
function Child() { this.name = 'Child';}
Child.prototype.alias = 'Son';
Child.prototype.getName = function() {
    return 'Child:' + this.name;
}
// instancing inheritance. copy constructor and inherits prototype
Child.prototype = new Parent();
// c1.construtor = Parent;
// c1.__proto__ => Child.__proto__ => Parent.prototype;
var c1 = new Child();
// changing parent property is effected child's instance
Parent.prototype.alias = 'FatherChanged';
console.log(c1, c1.constructor, c1.__proto__, c1.prototype);
console.log(Child.prototype.isPrototypeOf(c1),
    Parent.prototype.isPrototypeOf(c1), Object.getPrototypeOf(c1));

// # inherits 2
function Parent() { this.title = 'Parent'; this.name = 'Parent';}
Parent.prototype.alias = 'Father';
Parent.prototype.getParentName = function() {
    return 'Parent:' + this.name;
}
function Child() { this.name = 'Child';}
Child.prototype.alias = 'Son';
Child.prototype.getName = function() {
    return 'Child:' + this.name;
}
// reference prototype to parent's prototype, do not copy parent constructor
Child.prototype = Parent.prototype;
// c2.constructor = Child; copy Child constructor;
// c2.__proto__ => Parent.prototype
var c2 = new Child();
// Child and Parent has same prototype, change the prototype will be effected
Parent.prototype.alias = 'FatherChanged';
console.log(c2, c2.constructor, c2.__proto__, c2.prototype);
console.log(Child.prototype.isPrototypeOf(c2),
    Parent.prototype.isPrototypeOf(c2), Object.getPrototypeOf(c2));

// # inheritance simple1
function inherits(Child, Parent) {
    var ChildProto = Child.prototype;
    var ParentProto = Parent.prototype;
    // create a temp clazz
    function Super() {}
    // assignment prototype
    Super.prototype = ParentProto;
    // instance temp clazz for Child prototype,
    // don't extends parent's constructor
    Child.prototype = new Super();
    // copy prototype from th origin Child
    for (var item in ChildProto) {
        Child.prototype[item] = ChildProto[item];
    }
    Child.__super__ = ParentProto;
    // reset Child constructor
    Child.prototype.constructor = Child;
    return Child;
}
function Parent() { this.title = 'Parent'; this.name = 'Parent';}
Parent.prototype.alias = 'Father';
Parent.prototype.getParentName = function() {
    return 'Parent:' + this.name;
}
function Child() { this.name = 'Child';}
Child.prototype.alias = 'Son';
Child.prototype.getName = function() {
    return 'Child:' + this.name;
}
Child.prototype.getParentAlias = function() {
    return 'getParentAlias:' + Child.__super__.alias;
}
Parent.prototype.getParentName = function() {
    return 'getParentName:' + Child.__super__.name;
}
inherits(Child, Parent);
var c3 = new Child();
Parent.prototype.alias = 'FatherChanged';
console.log(c3, c3.constructor, c3.__proto__, c3.prototype);
console.log(Child.prototype.isPrototypeOf(c3),
    Parent.prototype.isPrototypeOf(c3), Object.getPrototypeOf(c3));

// # simple2 copy constructor
function inherits(Child, Parent) {
    var ChildProto = Child.prototype;
    var ParentProto = Parent.prototype;

    /* function Super() { Parent.apply(this, arguments); } */
    // `apply` will copy Parent's properties to __proto__

    function Super() {}
    // copy constructor properties to function constructor
    Super = ParentProto.constructor;
    // or executing constructor to constructor
    // Super.constructor = ParentProto.constructor();
    // assignment prototype
    Super.prototype = ParentProto;

    // Child = ParentProto.constructor;
    // instance temp clazz for Child prototype
    Child.prototype = new Super();
    // copy prototype from th origin Child, child will override parent
    for (var item in ChildProto) {
        Child.prototype[item] = ChildProto[item];
    }
    Child.__super__ = ParentProto;
    // reset Child constructor
    Child.prototype.constructor = Child;
    return Child;
}
function Parent() { this.title = 'Parent'; this.name = 'Parent';}
Parent.prototype.alias = 'Father';
Parent.prototype.getParentName = function() {
    return 'Parent:' + this.name;
}
function Child() { this.name = 'Child';}
Child.prototype.alias = 'Son';
Child.prototype.getName = function() {
    return 'Child:' + this.name;
}
Child.prototype.getParentAlias = function() {
    return 'getParentAlias:' + Child.__super__.alias;
}
Parent.prototype.getParentName = function() {
    return 'getParentName:' + Child.__super__.name;
}
inherits(Child, Parent);
var c3 = new Child();
Parent.prototype.alias = 'FatherChanged';
console.log(c3, c3.constructor, c3.__proto__, c3.prototype);
console.log(Child.prototype.isPrototypeOf(c3),
    Parent.prototype.isPrototypeOf(c3), Object.getPrototypeOf(c3));

// @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create


/* ##################### */
/* Part 2: The puzzle of language */
/* ##################### */

/*******************************************
# type convertion
********************************************/
data type:
primitive type: string number boolean undefined null symbol (new in ECMAScript 6)
all data is: object

// # type evaluation
typeof null;             // "object"
typeof undefined;        // "undefined"
typeof 0;                // "number" (`typeof NaN` is also "number")
typeof true;             // "boolean"
typeof "foo";            // "string"
typeof {};               // "object"
typeof function () {};   // "function"
typeof [];               // "object"
typeof (Symbol('test')); // "symbol"

// # type evaluation 2
typeof(String);
typeof(new String('123'));
typeof(String('123'));
typeof(Number('abc'));
typeof(new Number(123));
typeof(Function);
typeof(new Function());
typeof(Array);
typeof(new Array);


// # someone instanceof of Object
var a = {};a instanceof Object;
[] instanceof Object;
function a() {};
a instanceof Object;
null instanceof Object;
undefined instanceof Object;
NaN instanceof Object;

// # judgement

if ( !undefined
  && !null
  && !0
  && !NaN
  && !''
) {
  console.log('true');
} else { console.log('false');}

// primitive value type conversion
var a = 1, b = 'str', c = null, d = undefined, e = false, f = NaN, g = Symbol("1");
console.log(String(a), String(b), String(c), String(d), String(e), String(f), String(g));
// "1" "str" "null" "undefined" "false" "NaN" "Symbol(1)"
console.log(Number(a), Number(b), Number(c), Number(d), Number(e), Number(f), Number(g));
// 1 NaN 0 NaN 0 NaN Cannot convert
console.log(Boolean(a), Boolean(b), Boolean(c), Boolean(d), Boolean(e), Boolean(f), Boolean(g));
// true true false false false false true
console.log(Object(a), Object(b), Object(c), Object(d), Object(e), Object(f), Object(g));
// Object {} Boolean {[[PrimitiveValue]]: false}__proto__: Boolean[[PrimitiveValue]]: false Number {[[PrimitiveValue]]: NaN} Symbol {[[PrimitiveValue]]: Symbol(0)}

// object type convertion
var g = [1, 'str'], h = { a: 'a', '2': 2}, i = new Date(),
        j = function() { var a = 'a'},
        k = new RegExp(/\d+/), l = new Boolean(false);
console.log(String(g), String(h), String(i), String(j), String(k), String(l));
// 1,str [object Object] Thu Oct 20 xxx function () { var a = 'a'} /\d+/ false
console.log(Number(g), Number(h), Number(i), Number(j), Number(k), Number(l));
// NaN NaN 1476955170664 NaN NaN 0
console.log(Boolean(g), Boolean(h), Boolean(i), Boolean(j), Boolean(k), Boolean(l));
// true true true true true true
console.log(Object(g), Object(h), Object(i), Object(j), Object(k), Object(l));
// [1, "str"] Object {2: 2, a: "a"} Thu Oct 20 xxx () { var a = 'a'} /\d+/ Boolean {[[PrimitiveValue]]: false}

// number value convertion
var a = 1, b = -1, c = 0, d = 3.1415926, e = Infinity, f = -Infinity, g = -0;
console.log(String(a), String(b), String(c), String(d), String(e), String(f), String(g));
// "1" "-1" "0" "3.1415926" "Infinity" "-Infinity" "0"
console.log(Number(a), Number(b), Number(c), Number(d), Number(e), Number(f), Number(g));
// 1 -1 0 3.1415926 Infinity -Infinity -0
console.log(Boolean(a), Boolean(b), Boolean(c), Boolean(d), Boolean(e), Boolean(f), Boolean(g));
// true true false true true true false
console.log(Object(a), Object(b), Object(c), Object(d), Object(e), Object(f), Object(g));
// Number {[[PrimitiveValue]]: 1} Number {[[PrimitiveValue]]: -1} Number {[[PrimitiveValue]]: 0} Number {[[PrimitiveValue]]: 3.1415926} Number {[[PrimitiveValue]]: Infinity} Number {[[PrimitiveValue]]: -Infinity} Number {[[PrimitiveValue]]: -0}

// string comparison
'str' == new String('str');
String("str") === "str";
'str' === new String('str');
'str' === 'str';
'str' === ['str'].toString();
'str' === ['s', 't', 'r'].join('').toString();
String("str") === ['str'].toString();
String("str") === new String("str");
'0' === String(-0);

// string's property comparison
var a = String(123);
var b = '123';
a === b;
var a = String('str');
a.name = 'a';
var b = new String('str');
b.name = 'a';
a.name == b.name;

// compare string with String this
String.prototype.getSelf = function() { return this; }
var a = 'str';
var b = a.getSelf();
a === b;
a.valueOf() === b.valueOf();

// number comparison
123 === Number(123);
123 === new Number(123);
123 === Number('123');
123 === Number([123]);
123 === Number(['123']);
123 === Number([1,2,3]);

// boolean compare
true === Boolean(true);
false === Boolean(false);
true === new Boolean(true);
true === new Boolean(false);
false === Boolean(-1);
false === Boolean(1);
false === new Boolean(false);
var bool = new Boolean(false);
if(bool) {  console.log('true'); } else { console.log('false');}
// true

// object compare
var a = {}, b = Object({}), c = new Object(), d = [], e = new Function;
console.log(a === {}, a === b, a === c, a === d, a === e);
console.log(b === c, b === d, b === e);
console.log(c === d, c === e);
console.log(d === [], d === e);

/*******************************************
# assignment operation
********************************************/
// # assignment operation
1 + '2';                 // '12'
1 - 2;                   // -1
1 - '2';                 // -1
'1' - '2';               // -1
1 + -'2';                // -1
'1' + -'2';              // '1-2'
'1' - +'2'               // -1
'1' - -'2';              // 3
+'1' + 2                 // 3
-'1' + 2                 // 1
'1' * 2                  // 2
'1' / 2                  // 0.5
'1' + + '2'              // '12'

!!(1);                    // true
!!(0);                    // false
-!!true;                   // -1
+!false;                   // 1

// operator computing
1 + true;                 // 2
+'0' + false;             // 0
+'0' - true;              // -1
-'0' - true;              // -1
1 + 2 + 3;                // 6
1 + 2 + '3';              // 33
1 + (2 + '3');            // 123
1 + '2' + 3;              // 123
1 + +'2' + 3;             // 6
1 - -'2' + '3';           // 2

// number and parseInt
Number('1') === parseInt('1');
Number('-1') === parseInt(-'1');
Number('-1'+1) === parseInt(-'1'+'1');
Number('1x') === parseInt('1x');
Number('x1') === parseInt('x1');
Number('1x') === Number('1x');
parseInt('1x') === parseInt('1x');
parseInt('x1') === parseInt('x1');
1 === 1.00
parseInt('01.0') === Number('01.0');
parseFloat('01.1') === Number('01.100');

/* ##################### */
/* Part 3: The confusion of language */
/* ##################### */
// # operator with object
![];   ~[];   +[];   -[];
console.log(![], ~[], +[], -[]);

!{};   ~{};   +{};   -{};
console.log(!{}, ~{}, +{}, -{});

!new Date();  ~new Date();  +new Date();  -new Date();
console.log(!new Date(), ~new Date(), +new Date(), -new Date());

new Date() - 0;
new Date() + 0;

console.log(!'-1', ~'-1', +'-1', -'-1');

// # operator with function
!function(){ console.log('!'); }
!function(){ console.log('!'); }();
~function(){ console.log('~') }
~function(){ console.log('~') }();
+function(){ console.log('+') }
+function(){ console.log('+') }();
-function(){ console.log('-') }
-function(){ console.log('-') }();

~1.2;   ~~1.2;   ~(1.2);  ~~(1.2);
console.log(~1.2, ~~1.2, ~(1.2), ~~(1.2));

// # null and undefined and boolean
null === null;  undefined === undefined;  NaN === NaN;
undefined === null; !undefined === null;  !undefined === !null;
true === !false;
undefined === false;  undefined === !false;
undefined === true;  undefined === !true;
!undefined === !false; !undefined === !true;
false === 0;  !false === 0;  !true === 0;  true === !0;

// # map and parseInt
["1.1", "2.2", "3.3"].map(parseFloat);
["1.1", "2.2", "3.3"].map(parseInt);

// # three unary
var a = 1;
var result = 1 + '0' + (a === 1) ? a : 0;
console.log(result);

// # array has `undefined` member
var a = [0, null, undefined, 3];
a[5] = 6;
console.log(a[5], a.length);
// forEach
a.forEach(function(item, idx) {
    console.log(idx, item);
});
// filter
a.filter(function(item) {
    return !item;
});
// for
for (var i = 0, l = a.length; i < l; i++) {
    console.log(i, a[i]);
}
// # precision computing
console.log(0.2 - 0.1,  0.5 - 0.4);
console.log(0.6 - 0.3,  0.7 - 0.4);
console.log(0.1 + 0.1,  0.3 - 0.1);
console.log(0.8 - 0.5,  0.5 - 0.2);

// # switchcase
function foo(number) {
   switch(number) {
       case 'a':
         console.log('string');
         break;
       case 1:
         console.log('number');
         break;
       case null:
         console.log('undefined');
         break;
       default:
         console.log('unknown');
   }
}
foo(new String('a'));
foo(Number(1));
foo(Object(null));

// # array value
var a = [0];
var b = [1];
console.log(a == true, b == true);
if (a) {
    console.log('a');
}
if (b) {
    console.log('b');
}

// number computing
console.log(1 - + 1);
console.log(1 - + + 1);
console.log(1 - - 1);
console.log(1 - - - 1);
console.log(1 - + - 1);

// arguments
function reset(arg) {
   arg[0] = 0;
}
function foo(a, b, c) {
    arguments[2] = 2;
    reset(arguments);
    console.log(a, b, c);
    console.log(arguments);
}
foo(1, 1);
// VS
// arr
function reset(arg) {
   arg[0] = 0;
}
var a = 1, b = 1, c;
var arr = [a, b, c];
function foo(arr) {
    arr[2] = 2;
    reset(arr);
    console.log(a, b, c);
    console.log(arr);
}
foo(arr);

// array and number
[1] == [1];
1   == [1];
[1, 2] > [2, 1];
[1, '2'] < [2, 1];

// function length
Function.length === new Function().length;

// date
var a = new Date("2000/01/01");
var b = new Date(2000, 01, 01);
console.log(a, b);

/*** References  **/
// The 10 Most Common Mistakes JavaScript Developers Make
https://www.sitepoint.com/automatic-type-conversion/
https://www.toptal.com/javascript/10-most-common-javascript-mistakes
http://javascript.ruanyifeng.com/grammar/conversion.html
http://web.jobbole.com/85326/
http://www.jianshu.com/p/668e1f998776
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Grammar_and_types
http://www.adequatelygood.com/Object-to-Primitive-Conversions-in-JavaScript.html
http://stackoverflow.com/questions/12982114/auto-type-conversion-in-javascript
https://www.sitepoint.com/automatic-type-conversion/
http://www.w3cin.com/2016/09/22/javascript-types/
http://www.jianshu.com/p/1e7d0ab79b9e
https://segmentfault.com/a/1190000003867801
http://www.2ality.com/2013/04/quirk-implicit-conversion.html
http://www.2ality.com/2012/01/object-plus-object.html
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Comparison_Operators
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Equality_comparisons_and_sameness
http://rocha.la/JavaScript-bitwise-operators-in-practice

http://javascript-puzzlers.herokuapp.com/
http://perfectionkills.com/javascript-quiz/
http://zxhfighter.github.io/blog/javascript/2013/03/14/javascript-quiz.html
http://bonsaiden.github.io/JavaScript-Garden/
http://www.mollypages.org/misc/js.mp
http://blog.163.com/jinlu_hz/blog/static/11383015220114105812141/
http://davidshariff.com/js-quiz/
http://madebyknight.com/javascript-scope/
http://tutorialzine.com/2014/08/what-does-this-function-do/
http://dmitry.baranovskiy.com/post/91403200
https://www.nczonline.net/blog/2010/01/26/answering-baranovskiys-javascript-quiz/
https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md
