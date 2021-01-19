# 理解JavaScript特性

## 第一部分，语言基本理解

### assignment赋值
```js
let a = 1;
let b = 2;
b = a;
console.log(a, b);
// 这里a是1，b是1，a的值不会因为b赋值而改变。直接量赋值，b初始value为2，后来b赋值为a的值1，其所占空间由垃圾回收器回收，新的b指向a的引用值，而不是a本身。
// 变量本身是一个空间，指向了value。value分为原始数据类型与对象。原始数据存于栈，对象存于堆。
```

### reference引用
```js
let c = [1, 2];
let d = c;
d[0] = 'a';
console.log(c, d);
// 变量d指向了c的引用的值，该值是一个对象，也就是c和d指向的是同一个引用空间。相当于指向了一个盒子而非盒子里面的东西，盒子是同一个，改变里面的内容时会同时影响到c与d。因此，c[0]也为a。
// 变量c指向一个引用对象，c本身占空间，其指向的数组是个引用空间，存储结构是数组，里面包含的value是1和2。

// new reference
var c = [1, 2];
var d = c;
d = [];
d[0] = 'a';
console.log(c, d);
// 当d赋值为c，然后又重新指向一个新的引用对象是，这时候相当于换了一个盒子。因此两者不再相关。
```
```js
// continued assign
var c = [1, 2];
var d = c = {};
d[0] = 'a';
console.log(c, d);
// 支持连续多个变量赋值，d = c, c = 空对象，c与d相同，指向共同的引用对象，更改d的引用指向就是更改c的引用。
var a = { a: 'a' };
a.b = a;
// 连续赋值从左到右解释执行。首先a.b 赋值为a, 变成了一个循环引用，
console.log(a);
a.b = { b: a, c: 2 };
console.log(a, a.b);
// 然后将a.b赋值为新的引用对象，里面有b指向a，c指向2。
function foo() {
    // 局部变量a赋值为1，b为全局变量
    var a = b = 1;
    console.log(a, b);
}
foo();
console.log(typeof a, b);
// 连续赋值要注意，等号操作自左至右单独解释，此时b为全局变量。
```

### variable hoisting变量提升
```js
var num1 = 1;
var num2 = 2;
(function foo() {
    if (num1) {
       console.log('num1 true')
       var num1 = 11;
    }
    console.log('num1:', num1);

    if (!num2) {
       console.log('num2 not true')
       var num2 = 22;
    }
    // 变量提升，num1与num2因为在函数内部声明，故初始value都是undefined。
    // num1执行时为条件判断为undefined，故没有执行赋值。
    // num2执行时条件为true，故赋值成功。
    // var声明的变量会提升至顶部，执行时再赋值，let则不允许定义前调用
    console.log('num2:', num2);
})();
console.log(num1, num2);

```
```js
// 函数表达式声明，函数会预处理，foo函数在调用时就已经存在了。因此调用有效。
foo();
function foo() {
    console.log(foo);
}

// 声明式函数，变量foo2会提升，此时是undefined，但赋值在后，故此调用报错。
foo2();
var foo2 = function foo2() {
    console.log(typeof foo2);
};
// 表达式声明的函数按照顺序变量顺序先后执行赋值
```

```js
// 函数定义优先
var a;
console.log(a);
function a() {
    return 'a';
}
// 函数是个特殊的对象，既是函数也是类(拥有构造器与原型链)，同时也是一等公民，可以赋值运算。
// 函数会预先定义，因此打印function a。
```

### 变量提升与函数定义
```js
var num1 = 1;
function foo() {
    var num1;
    return num1;
    function num1() {
        return num1 + '|' + this.num1;
    }
}
foo();
foo()();
// foo的function num1 预先定义，故返回function num1，函数作用域位于函数内部，this在定义时默认指向global
// froo的var num1内部变量声明但没有赋值，故调用函数时不会发生赋值操作。
// this.num1因为函数定义时确定上下文为全局，运行时也没有改变，故指向window。
```
```js
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
// 表达式声明函数不会提前，但是num1变量声明会提前，
// 故foo执行时返回undefined，foo()()调用报错
```

```js
// hoisting and arguments提升与形参
var a = 1;
function foo(a) {
    a = 2;
    arguments[0] = 3;
    var a;
    console.log(a, this.a);
}
foo(a);
// arguments是一个类数组对象，本质上是{}，但拥有了[]的原型链的一些方法
// arguemnts可以被修改。arguemnts[0]与内部的a是指向同一位置。内部的a被修改了，外部的a仍然原始值。

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
// 原理同上，注意当形参定义了，而实际并未传参时，arguments里的[1]不存在，与b无关联。
```

### 函数名称与函数
```js
foo();
function foo() {
    console.log(foo, foo.name);
}
var foo1 = function foo123() {
    console.log(foo1, foo1.name);
};
foo1();
var foo2 = function() {
    console.log(foo2, foo2.name);
};
foo2();

// foo是定义式声明函数，foo1和foo2是表达式声明函数
// foo函数名称是foo，同时会建立foo变量, foo123具名函数，赋值给foo1变量, foo2是个匿名函数，赋值给foo2变量。函数的name查找优先找名字，然后找变量。
```

### function object and constructor and prototype
### 函数对象与构造器和原型
```js
function foo() { this.name = 'foo_name'; };
foo.a = '1';
foo.b = 'b';
var f1 = foo;
f1.a = '2';
f1.name = 'f1';
console.dir(f1);
console.log( Object.keys(foo).map(function(item) {
   return (item + '=' + foo[item]);
}) );
// 函数构造器内通过this声明属性，通过instance获取
// 函数同时也是一个静态对象，可以添加属性等，function foo的name只读，不能修改。
// Object.keys仅打印自身直接的属性，name不属于。
```

```js
// prototype
function Foo() { this.name = 'foo_name'; };
Foo.prototype.getName = function() {
    return this.name;
}
Foo.a = '1';
Foo.b = 'b';
var f2 = new Foo();
console.log( Object.keys(f2).map(function(item) {
   return (item + '=' + f2[item]);
}) , f2.getName());
// 实例化之后的对象可以获取构造器的属性和方法, keys仅能获取直接属性
```

```js
// prototype variable and constructor variable
function Foo() { this.name = 'foo_name'; };
Foo.prototype.b = 'b1';
var f3 = new Foo();
console.log( Object.keys(f3).map(function(item) {
   return (item + '=' + f3[item]);
}) );
for (var item in f3) {
    console.log(item + '=>' + f3[item]);
}
Foo.prototype.b = 'change b';
Foo.prototype.getB = function() {
    return this.b;
}
f3.getB();
Foo.prototype.name = 'change Foo';
Foo.prototype.getName = function() {
    return this.name;
}
f3.getName();
// Foo原型链更改后，会影响到在此之前实例化的f3对象，因为f3的__proto__指向Foo.prototype
// Foo原型链属性name更改后并不会影响到构造器里面的属性，因此this.name依然是构造器中的name
// 构造器中的属性是作为直接属性复制到对象中，因此优先原型链属性
// for 循环可以打印全部属性
```

### function object and constructor and prototype
### 函数对象与构造器和原型
```js
function A() {};
var a1 = new A();
console.log(a1.constructor, a1.constructor == A,
    a1 instanceof A, A.prototype.isPrototypeOf(a1));
A.prototype = {};
var a2 = new A();
console.log(a2.constructor, a2.constructor == A,
    a2 instanceof A, A.prototype.isPrototypeOf(a2));
// 实例的构造器是类，因此a1.constructor == A，a1也是A的一个实例，a1的原型链指向A的prototype
// 将A的原型链更改为新的对象后，将prototype上的constructor也一并更改了，这只是constructor名称更改
// 构造器指向改变了，但实例关系与原型链关系还在
```
```js
 function object and constructor and prototype */
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
// a1实例化之后再更改A原型链name属性，会影响到a1的name
// A的prototype重新赋值后，a1与A新的原型链无关连，a1与原有A的原型链关系在
// A的prototype重新赋值后，a2的__proto__上的constructor被改写为Object, a1指向的是A原来的，因此仍然是A
// a1的name是A原来的原型链的name, a2的name是新原型链上的name
// a1与a2的构造器实际都来自A，但A的prototype更改后，a1实例属于原来的A, a2实例属于新的A
```

### 实例化之后的原型链
```js
function A() {};
var a1 = new A();
console.log(a1.constructor, a1.constructor == A,
    a1 instanceof A, A.prototype.isPrototypeOf(a1));
var a2 = new A();
A.prototype = {};
console.log(a2.constructor, a2.constructor == A,
    a2 instanceof A, A.prototype.isPrototypeOf(a2));
// 实例a1在A的prototype被更改前，因此构造器、实例关系都指向A
// 当A的prototype指向新的对象后，才实例化a2，此时构造器被更改，原型链关系指向了新Object
```

### 实例化之后的原型链更改 2
```js
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
// a1输出时没有更改过A的prototype，一切都符合预期
// a2实例化后，设置了A的prototype.name，之后又将prototype指向到新的Object
// 此时相当于原先a1.__proto__与原来A.prototype是同一个，而a2的__proto__指向了新的Object的prototype
// 因此a2的name还是之前原型链上的name，a1的name也是A的prototype更改前的赋值。
// 实例对象的原型链(__proto__)与原型对象(prototype)指向同一个引用对象，当类的原型对象改变指向后，两者就不是同一个了
```

### pass value 值传递
```js
var a = 'a1';
var b = ['b1', 'b2'];
function foo(a, b) {
    a = 'a2';
    b[0] = 'b2';
    console.log(a, b);
}
foo(a, b);
console.log(a, b);
// JavaScript都是值传递，而不是引用传递。
// 函数内的a与外面并非同一个a, 内部的a被改变自然不会影响到外部的变量
// 函数内的b与外面的b也并非同一个，但是因为b是引用对象，
// 外部的b与内部的b指向同一个引用对象，所以更改引用对象内部成员时影响到了外部的b
```
```js
// pass value
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
// 如果引用对象本身被重新赋值，而不是其中内容改动了，此时内部b与外部b没有关系
// 一个变量本身占一个空间，大小固定，它的值也占空间(内容决定大小)
// 外部b和内部b都是一个引用对象，各自本身都占空间，他们的值指向同一个引用空间
// 在函数内部b被重新赋值了，此时b指向了新的引用空间
```

```js
// pass value and hoisting
var a = 1;
function foo(a) {
    if (a) {
        var a = 2;
    }
    console.log(a);
    a = 3;
}
foo(a);
console.log(a);
// 内部a是一个新变量，内部有var a，变量定义会提升，定义时value为undefined。
// 参数传递1以后，a为真，此时执行a=2，打印得到2
// a = 3是针对函数题内部的赋值，没有意义，执行完毕被垃圾回收
// 外部的a仍然是1
```

```js
// assign and hoisting
if (!this.a1) {
    var a1 = 1;
    if (!('a2' in this)) {
        var a2 = 2;
    }
}
console.log(a1, a2);
// 定义时a1为undefined，!this.a1判断为true，因此a1为1赋值成功
// a2是一个全局的变量，存于this中，只是未赋值而已，因此in条件判断结果是false
```

### execute environment of this
```js
var A = {
    nickname: 'A',
    getName: function() {
        return (this.nickname);
    },
    showName: function() {
        (function() {
            return (this.nickname);
        })();
    },
    echoName: function() {
        return function() {
            return this.nickname;
        };
    }
};
console.log(A.getName(), A.showName(), A.echoName()());
// 函数作用域为词法作用域或叫静态作用域，也就是在声明定义时确定
// 函数this指向调用它的对象，通过call或apply可以动态改变this
// 这几个函数都是通过A.的方式调用，因此this都指向A
// showName与echoName中的this在子函数中，此时this指向全局对象
// showName中的函数是一个与外部无法访问的子函数，因此无法改变this
// echoName因为通过闭包形式返回一个函数，可以借用call改变this。如:A.echoName().call(A);
```

```js
// function bind
this.nickname = 'global name';
var A = {
    nickname: 'A',
    getName: function() {
        return (this.nickname);
    },
    showName: function() {
        return (function() {
            return (this.nickname);
        })();
    }
};

var B = {
    nickname: 'B'
};
// likes bind
B.getName = A.getName;
B.getName();
// call or apply
A.getName.call(B);
// direct assignment and execution
(B.getName = A.getName)();
// B的函数赋值为A的同名函数，this指向调用方，当调用方为B时，打印B的属性值
// call或者apply可以改变调用时的执行上下文，也就是改变this指向
// 直接赋值执行相当于把函数赋值给临时的变量，然后调用该变量，此时调用方为全局的this
// A.showName中的this永远指向全局，返回的是一个自执行函数结果

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
// 永远打印的是undefined，定义的作用域位于子函数内，this是全局，内部函数直接执行没法被改变this

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
// 函数的this指向调用它的对象，C.getName执行时，this指向C
```

```js
// variable of scope 变量作用域
function outer() {
    this.var1 = 'A1';
    var var2 = 'A2';
    function inner() {
        this.var1 = 'B1';
        var2 = 'B2';
        function subInner() {
            var3 = 'B3';
            console.log('step3:', this.var1, typeof var2, typeof var3);
        }
        console.log('step2:', this.var1, typeof var2, typeof var3);
        subInner();
    }
    console.log('step1:', this.var1, typeof var2, typeof var3);
    inner();
}
console.log('before:', this.var1, typeof var2, typeof var3);
outer();
console.log('after', this.var1, typeof var2, typeof var3);
// 内部影响到外部属性，此例中this均指向全局this
// before打印的是初始全局this(浏览器环境下是window)的name
// 执行outer后，先改为this.var1，再改为局部变量var2
// 执行subInner时改变的var3是全局变量，注意函数调用与实例化时构造函数执行不同
// 可以试下将outer()改为new outer()或者将var3加上var
```

### async execution 异步执行
```js
var num = 0;
function echo(n) {
    console.log(n);
}
for(var i = 0; i < 10; i++) {
    setTimeout(function() {
         echo(i);
    }, 0);
};
console.log(num, i);
// 结果是先打印0和10，然后打印十遍10
// 先输出0和10因为for虽然在前，但是异步执行，总在同步之后
// 打印十遍10是因为setTimeout中拿到的i是for循环执行完之后的结果
```

```js
// envent runing after current execution
for (var i = 0, l = 10; i< l; i++) {
    document.onclick = function() {
        console.log(i);
    }
}
// 常见的事件赋值属于异步操作，执行时获取到的value是最后结果
// 要解决此问题就是闭包传递i或者将i依依存储起来，事件执行时再用。另：此种循环中直接挂载事件方式不妥
```
```js
// solve the index by closure
var num = 0;
function echo(n) {
    console.log(n);
}
for(var i = 0; i <= 5; i++) {
    (function(i) {
        setTimeout(function() {
             echo(i);
        }, 0);
    })(i);
};
console.log(num, i);
// 闭包解决异步执行的问题，相当于把循环中的i的值放到异步的执行空间里

// closure inner variable
(function(){
  var x = y = 1;
})();
console.log(y);
console.log(x);
// x属于内部变量，外部无法直接访问
// y赋值时作为全局变量存在，这种写法在strict模式下无效
```

### closure 闭包
```js
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
// 匿名函数立即执行，函数内先改变a与b的值，同时调用foo函数
// foo函数被执行时，分别给内部变量a和b赋值，同时返回一个内部函数，该内部函数打印a与b的值
// 得到返回函数后再立即执行该函数，并传递参数b，此时b的值是b2
// 返回函数被执行，打印a与b的值，此时自身并没有a，通过作用域链向上找到外部foo中定义了变量a，值为a1，b为外部传递的参数，值为b2
// 外部再次打印a与b，此时a在匿名函数中被更改为a2，b已被改为b2
```

```js
// defined/execution variable in closure
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
// test赋值为outer返回的一个内部函数，其中含有n这个闭包变量，n会一直存在test中
```

```js
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
// 每次执行test后，n的值会一直递增，从而函数执行完毕，n依然存在不回收
```

### functional programming 函数式编程
```js
var arr = [1, 'a', 'b', 'c', 'a', 'b', 1, 1];
arr = arr.filter(function(item, idx) {
    console.log(item, idx, arr.indexOf(item));
    return arr.indexOf(item) === idx;
});
console.log(arr);
// 本例子会去掉数组中重复项。
// 数组filter函数是将当前项放到传入的处理函数中执行，当结果为真时过滤该项
// 数组indexOf函数是逐个比较数组成员与查找对象，匹配时返回下标
// 这个例子是filter传递是indexOf函数，即找到相同项目就返回true
```

### inherits example 原型继承

#### inherits 1
```js
function Parent() { this.title = 'Parent'; this.name = 'Parent';}
Parent.prototype.alias = 'Father';
Parent.prototype.getName = function() {
    return 'Parent:' + this.name;
}
function Child() { this.name = 'Child'; this.title = 'Child';}
Child.prototype.alias = 'Son';
Child.prototype.getName = function() {
    return 'Child:' + this.name;
}
// instancing and prototype inheritance. copy constructor and inherits prototype
Child.prototype = new Parent();
// c1.construtor = Parent;
// c1.__proto__ => Child.__proto__ => Parent.prototype;
var c1 = new Child();
// changing parent property is effected child's instance
Parent.prototype.alias = 'FatherChanged';
console.log(c1, c1.constructor, c1.__proto__, c1.prototype, c1.alias);
console.log(Child.prototype.isPrototypeOf(c1),
    Parent.prototype.isPrototypeOf(c1), Object.getPrototypeOf(c1));
// Child的prototype指向Parent的实例，等于将Parent构造器属性复制一份给Child.prototype
// 同时Child的prototype的__proto__指向了Parent的prototype，因此建立原型链关系
// Child自身的__proto__依然指向Function.prototype，函数的prototype.constructor指向自身
// c1没有prototype，c1的__proto__指向Child.prototype，从而根据原型链拥有了Parent的prototype属性
// c1的原型链受到Parent.prototype改变的影响，继承生效，但c1的constructor改为Parent
// 这种方式下子类构造器要想拥有父类的初始化操作就需要与父类构造器保持一致，或者通过Parent.apply调用来完成
```

#### inherits 2 sharing prototype
```js
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
// 这里直接将Child的prototype赋值为Parent.prototype，双方公用一个prototype，也达到继承作用
// 这种方法不是原型继承，不会改变Child.__proto__，而是原型公用
// 这种方式下子类实例不能拥有父类的构造器内容，且父类原型的更改等于修改了子类的原型
```
#### inheritance function simple1
```js
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
// 继承函数，创建一个临时函数作为通用父类，将子类的constructor重新修正
// 建立一个跟父类关联的__super__属性，用于查找父类
// 这种方式下父类构造器内容并没有复制到子类，仅是将父类原型复制到临时类上
```

#### simple2 copy constructor
```js
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
    Child.__super__ = Super;
    // reset Child constructor
    Child.prototype.constructor = Child;
    return Child;
}
function Parent() {
    this.title = arguments[0] || 'Parent'; 
    this.name = 'Parent';
    console.log(this.title);
}
Parent.prototype.alias = 'Father';
Parent.prototype.getParentName = function() {
    return 'Parent:' + this.name;
}
function Child() {
    this.name = 'Child'; 
    // 执行父类构造器
    // Child.__super__.apply(this, arguments);
}
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
var c3 = new Child('c3');
Parent.prototype.alias = 'FatherChanged';
console.log(c3, c3.constructor, c3.__proto__, c3.prototype);
console.log(Child.prototype.isPrototypeOf(c3),
    Parent.prototype.isPrototypeOf(c3), Object.getPrototypeOf(c3));
// 标准版继承，新建临时函数作为桥接
// 临时函数赋值赋值父类的prototype.constructor
// 子类原型赋值为父类实例时执行父类构造器操作，将属性方法复制到子类prototype中
// 子类实例化时并不会执行父类构造器，如果执行父类构造器需要在子类增加Child.__super__.apply(this, arguments);

// @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/create
```


# 第一部分，语言高级理解
#
### type conversion
```js
data type:
primitive type: string number boolean undefined null symbol (new in ECMAScript 6) 
all data is: object
// 原生(原始)数据类型一共5种，ES6新增了一种，一共6中
// 通过typeof 得到的一共7种，function是一种特殊的对象

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
// null是一个空object，但又不是一个空的{}，在JS基本没有什么用处，某些情况下初始化时可以作为一个value
// undefined变量定义但为赋值，或者变量中无该属性时通过.号操作符取获取时返回得到
// number是数字和浮点数
// boolean是逻辑非与是
// string 是字符串
// object 是对象，JS中一切届对象，这里的对象表示引用，以区别于原始数据类型
// function是一种特殊对象，并非原始数据类型
// 数组跟map或者list一样，只是一种包装数据类型
// symbol是新增的一个原始数据类型，定义在对象中时不可更改，不可枚举或属性访问得到
```

### type evaluation 2
```js
typeof(String);
typeof(new String('123'));
typeof(String('123'));
typeof(Number('abc'));
typeof(new Number(123));
typeof(Function);
typeof(new Function());
typeof(Array);
typeof(new Array);
// String/Number/Function/Array等都是一个构造函数(类)，执行后返回原始数据
// new就是实例化类，从而得到一个实例对象，构造器可以直接执行
// 实例对象通过valueOf可以获得原始值
```

```js
// # someone instanceof of Object
var a = {};a instanceof Object;
[] instanceof Object;
function a() {};
a instanceof Object;
null instanceof Object;
undefined instanceof Object;
NaN instanceof Object;
// 对象、数组、函数等的原型链都指向Object，因此都是Object的实例
// null/undefined等原始数据类型并非来自Object，NaN是种特殊number，表示非数字
```

```js
// primitive value type conversion
var a = 1, b = 'str', c = null, d = undefined, e = false, f = NaN, g = Symbol("1");
console.log(String(a), String(b), String(c), String(d), String(e), String(f), String(g));
// "1" "str" "null" "undefined" "false" "NaN" "Symbol(1)"
// 字符串类型转换，数字直接转字符串，null与undefined,布尔值NaN等直接按名称转为string类型

console.log(Number(a), Number(b), Number(c), Number(d), Number(e), Number(f), Number(g));
// 1 NaN 0 NaN 0 NaN Cannot convert
// 数字转换，null、false转为0，undefined、NaN、字符串转为NaN
// 字符串数字直接转对应数值，相当于parseInt，symbol无法转换

console.log(Boolean(a), Boolean(b), Boolean(c), Boolean(d), Boolean(e), Boolean(f), Boolean(g));
// true true false false false false true
// 布尔转换，字符串、数字1、symbol转换为真
// 空字符串、数字0、null、undefined、NaN为假

console.log(Object(a), Object(b), Object(c), Object(d), Object(e), Object(f), Object(g));
// Object {} Boolean {[[PrimitiveValue]]: false}__proto__: Boolean[[PrimitiveValue]]: false Number {[[PrimitiveValue]]: NaN} Symbol {[[PrimitiveValue]]: Symbol(0)}
// 对象转换，根据typeof调用构造函数实例化，比如数字、字符串、布尔、函数、NaN、null、Symbol转对应对象，根据所属类型来实例化
// 注意与直接构造器赋值的区别，比如Object('abc') == String('abc')为true，而Object('abc') === String('abc')为false
// 虽然typeof undefined得到undefined，undefined同样通过Object实例化
```

```js
// object type conversion
var g = [1, 'str'], h = { a: 'a', '2': 2}, i = new Date(),
        j = function() { var a = 'a'},
        k = new RegExp(/\d+/), l = new Boolean(false);
console.log(String(g), String(h), String(i), String(j), String(k), String(l));
// 1,str [object Object] Thu Oct 20 xxx function () { var a = 'a'} /\d+/ false
// 引用对象转数组，都是调用对象toString方法
// 数组转字符串，数组直接量直接转字符串，成员逗号间隔，与join(',')相同，会深层遍历转换
// 对象转字符串，返回toString()结果，默认是[object object]
// 日期字符串，得到具体日期
// 函数或正则转字符串，返回定义内容的字符串
// 布尔转字符，直接返回true或false的字符串

console.log(Number(g), Number(h), Number(i), Number(j), Number(k), Number(l));
// NaN NaN 1476955170664 NaN NaN 0
// 对象转数字对象，日期与布尔得到数字，其他均为NaN

console.log(Boolean(g), Boolean(h), Boolean(i), Boolean(j), Boolean(k), Boolean(l));
// true true true true true true
// 对象转布尔值，全部为真，注意这里与原始数据类型的区别

console.log(Object(g), Object(h), Object(i), Object(j), Object(k), Object(l));
// [1, "str"] Object {2: 2, a: "a"} Thu Oct 20 xxx () { var a = 'a'} /\d+/ Boolean {[[PrimitiveValue]]: false}
// 对象转对象，按照对象类型调用对应的对象实例化，时间与正则转换为字符串内容

// number value conversion
var a = 1, b = -1, c = 0, d = 3.1415926, e = Infinity, f = -Infinity, g = -0;
console.log(String(a), String(b), String(c), String(d), String(e), String(f), String(g));
// "1" "-1" "0" "3.1415926" "Infinity" "-Infinity" "0"
// 数字转字符串，等于Number()之后再toString(), 注意-0变为"0"

console.log(Number(a), Number(b), Number(c), Number(d), Number(e), Number(f), Number(g));
// 1 -1 0 3.1415926 Infinity -Infinity -0
// 数字转数字，执行构造函数，获得同样的值

console.log(Boolean(a), Boolean(b), Boolean(c), Boolean(d), Boolean(e), Boolean(f), Boolean(g));
// true true false true true true false
// 对象转布尔，0与-0为false，其他为true，注意字符串中的空串与'0'为false, 但Boolean(0)为false，Boolean('0')为真。

console.log(Object(a), Object(b), Object(c), Object(d), Object(e), Object(f), Object(g));
// Number {[[PrimitiveValue]]: 1} Number {[[PrimitiveValue]]: -1} Number {[[PrimitiveValue]]: 0} Number {[[PrimitiveValue]]: 3.1415926} Number {[[PrimitiveValue]]: Infinity} Number {[[PrimitiveValue]]: -Infinity} Number {[[PrimitiveValue]]: -0}
// 数字转对象，相当于根据类型实例化，全部转为Number对象。
// 注意与通过构造器转换的区别。比如Object('1')与Number(1)的比较。
// 根据刚才的类型转换，请比较下几个：
Number(1) == Number(1);
String(1) == Number('1');
Object(1) == String('1');
Object('1') == Number(1);
Boolean('') == Object('');
Boolean('') == Object('0');
Boolean(0) == Object('');
Boolean('0') == Object('0');
Boolean('') == Boolean('0');
// 全等比较
Object(1) === Number(1);
String(1) === String('1');
Number(1) === Number('1');
Object(1) === Object('1');
Object(1) === Object(1);

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
// 字符串与字符串直接量比较全等为true
// 当字符串直接量与字符串对象比较时全等为false
```

```js
// string's property comparison
var a = String(123);
var b = '123';
a === b;
var a = String('str');
a.name = 'a';
var b = new String('str');
b.name = 'a';
a.name == b.name;
// String是构造函数，返回原始值。new是实例化类，返回一个对象，其PrimitiveValue保存在属性中。
// 原始值不能设置属性，而封装对象可以设置
```
```js
/* compare string with String this */
String.prototype.getSelf = function() { return this; }
var a = 'str';
var b = a.getSelf();
console.log(
    a === b, 
    a.valueOf() === b.valueOf(), 
    typeof a, typeof b
    );
// 字符串直接量是自身的value，但如果通过原型方法获得this时，这时获得的实例对象
// 因此直接量与对象不全等，而valueOf获得的直接量，从类型上判断就能看出不一样
```

```js
// change valueOf or toString of Object
var obj = {
    a: 1,
    valueOf: function() {
        return this.a + 2;
    },
    toString: function() {
        return this.a.toString();
    }
};
console.log(obj + 1,  obj < 3, obj + '');
// 改变valueOf，对象在发生类型转换时会使用新的valueOf获取自己的value
// toSring也一样。对象在+-操作时，先调用valueOf获取原始值，再计算。

// number comparison
123 === Number(123);
123 === new Number(123);
123 === Number('123');
123 === Number([123]);
123 === Number(['123']);
123 === Number([1,2,3]);
// Number是通过构造函数转为数字返回，new Number是返回Number对象
// 构造函数会将字符串按数字转型返回，如果是长度为1 的数组，则取出成员进行转型

// boolean compare
true === Boolean(true);
false === Boolean(false);
true === new Boolean(true);
true === new Boolean(false);
false === Boolean(-1);
true === Boolean(1);
true === Boolean('1');
false === Boolean(0);
false === Boolean('0');
false === new Boolean(false);
// 构造函数与类实例化的区别，构造函数返回valueOf中的原始值
// Boolean中1相当于true，0、undefined、null当作false
// 非1、0、true、false、undefined、null的内容一律当作true返回，比如'0'
```

### object compare
```js
var a = {}, b = Object({}), c = new Object(), d = [], e = new Function;
console.log(a === {}, a === b, a === c, a === d, a === e);
console.log(b === c, b === d, b === e);
console.log(c === d, c === e);
console.log(d === [], d === e);
// 对象都不等于新的对象，全等与非全等是一样的，因为不是同一个指向

// instanceof
'abc' instanceof String;
String('abc') instanceof String;
123 instanceof Number;
Number(123) instanceof Number;
true instanceof Boolean;
Boolean(false) instanceof Boolean;
new String('abc') instanceof String;
new Number(123) instanceof Number;
// 原始数据类型并非来自对象的实例化，构造函数进行的初始化得到的原始类型
```

### type judgement
```js
if ( !undefined
  && !null
  && !0
  && !NaN
  && !''
) {
  console.log('true');
} else { console.log('false');}
// 这几项取非时都为true，但它们之间都不全等(===)，原因类型并不相同。
// 其中除了null == undefined, 0 == ''，其他也并不相等。

// && operator
function foo(a) {
    return a && -1;
}
console.log(foo(true), foo(false), foo(0), foo(-1));
// -1 与 false， && 操作符左真返回右，否则返回左，这种写法不建议使用

// && with || operator
function foo(a) {
    return a && 'aa' || 'bb';
}
console.log(foo(true), foo(false), foo(-1), foo(0));
// && 混合 ||使用，这种写法更容易迷惑
// && 是左真返右，|| 是左真返回左，由真返右
// 同级操作符自左往右确定优先级
function foo(a) {
    return a || 'aa' && 'bb';
}
console.log(foo(true), foo(false), foo(-1), foo(0));

function foo(a, b) {
    return a || b && 'aa';
}
console.log(foo(true, true), foo(true, false), foo(false, 1), foo(false, 0));
// 这几个是逻辑思维推理。或是左返真，且与之相反

// && operator
function foo(a) {
    return a && -1 || 'a' && 'b';
}
console.log(foo(true), foo(false), foo('0'), foo(0));
// 与之前几个道题类似，注意'0'与0的区别，0 == '0' == false, if(0)//false, if('0')//true
// 在==比较时，一方是number或boolean时会将另一方转number比较，逻辑非则直接转型比较。
// 如果一方是string，则先转string进行比较。
```

### assignment operation
#### assignment operation 
```js
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
// 加操作，则先转字符再运行，+号表示拼接
// 减、乘、除操作，先转数字类型后运行
// 如果给字符串前加上加减号相当于类型转换

!!(1);                    // true
!!(0);                    // false
-!!true;                   // -1
+!false;                   // 1
// 逻辑非，负负得正
// 加与减操作，将逻辑true换为1，false换为0

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
// 加号拼接优先，减号转数字运算优先

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
// parseInt会去除多余的字符串，它按照第一个字符转型
```

# 第三部分，让人迷惑
### operator with object
```js
!{};   ~{};   +{};   -{};
console.log(!{}, ~{}, +{}, -{});

![];   ~[];   +[];   -[];
console.log(![], ~[], +[], -[]);
// 加减空数组得0，原因是+-会取出数组第一项的原始值进行操作
// 其他与普通对象一样，按位取反为-1
[] + {} // [object object]
{} + [] // 0
// 原因是在+号时一般数据与对象会自己先转string然后拼接，[]也会转string取第1个值是'',
// {},null在+时，会提前把自己按照number转型，此时+号两边都是number，故此是[]是数值操作

!new Date();  ~new Date();  +new Date();  -new Date();
console.log(!new Date(), ~new Date(), +new Date(), -new Date());
// 日期操作会换算为数字再计算
```

```js
// # operator with function
!function(){ console.log('!'); }              // false
!function(){ console.log('!'); }();           // true
~function(){ console.log('~') }               // -1 
~function(){ console.log('~') }();            // -1
+function(){ console.log('+') }               // NaN
+function(){ console.log('+') }();            // NaN
-function(){ console.log('-') }               // NaN
-function(){ console.log('-') }();            // NaN
// 可以对一个对象进行加减操作，得到NaN
// 逻辑取值时对象为true
// ~按位非，对象相当于0，因此获得值是-1，字符串转整数时可以使用，但不建议

// date and zero 
new Date() - 0;
new Date() + 0;
0 + +new Date();
// 注意这里+-操作的区别，日期-会换算数字，如果2个加号，会先让日期转数字再计算

console.log(!'-1', ~'-1', +'-1', -'-1');
// 操作符号在前会转为数字
```

### boolean conversion
```js
new Boolean(false) == false;
new Boolean(false) == 0;
var bool = new Boolean(false);
if(bool) {  console.log('true'); } else { console.log('false');}
if(0) {  console.log('true'); } else { console.log('false');}
// new Boolean(false)返回的是空的对象，严格比较就不等于false
// 对象返回值不是原始value，而是一个对象，因此逻辑判断并非取原始value比较，因此为真

// # null and undefined and boolean
null === null;  undefined === undefined;  NaN === NaN;
undefined === null; !undefined === null; !undefined === !null; 
true === !false; undefined === false;  undefined === !false;
undefined === true;  undefined === !true; undefined == !true;  !undefined == !true;
!undefined === !false; !undefined === !true; !null === !true;
false === 0;  !false === 0;  !true === 0;  true === !0;
// undefined与null都是原始数据类型，undefined是未定义，null表示空对象，这个空对象并非empty
// undefined与null在做逻辑比较时都会当作false，但它们类型并不相同
// true与false都是布尔值。NaN是一个特殊的原始number类型，但它表示非数字
// 0与1在进行赋值或逻辑操作时也当作false与true，但它们是number类型
// 注意：==逻辑判断与if()逻辑判断中是不一样的，因为!true等于false，!undefined并不等于false
```

### map and parseInt
```js
["1.1", "2.2", "3.3"].map(parseFloat);
["1.1", "2.2", "3.3"].map(parseInt);
// map语法，遍历数组，返回新数组。arr.map(callback[, thisArg]);
// parseInt(string, radix); 接受2个参数。第1个是成员，第2个是基数，而map传入的是下标
// parseInt('5.1', 5); parseInt('5.1', 10); 基数在2-36之间，2、8、10、16之外的要求基数大于数值。
// parseFloat(string); 接受1个参数，就是循环中的数组成员

// * precision computing */
console.log(0.2 - 0.1,  0.5 - 0.4);
console.log(0.1 + 0.2, 01 + 0.2 == 0.3);
console.log(0.6 - 0.3,  0.7 - 0.4);
console.log(0.1 + 0.1,  0.3 - 0.1);
console.log(0.8 - 0.5,  0.5 - 0.2);
// JS并没有对浮点数进行封装处理，浮点数与整数一样都是number类型，
// 每个浮点数占64位，浮点数按加减乘除操作都时按二进制就可能会得到很多小数
// 这时需要自己对这些数据进行类似4舍5入的修正，或者依靠其他类库以及后台来协助处理
// IEEE 754 中最常用的浮点数值表示法是：单精确度（32位）和双精确度（64位）,JavaScript 采用的是后者。
```

### three unary
```js
var a = 1;
var result = 2 || !(a === 1) ? a : 0;
var result2 = 2 && !(a === 1) ? a : 0;
console.log(result, result2);
// 三目运算中取值为?之后的运算结果，与其他操作符一起时?前面的算作同一个算式。
```

```js
// * the length and member of array */
var a = new Array(3);
a[0] = 0;
a[-1] = -1;
a[3] = undefined;
a[null] = null;
a[6] = 6;
a['10'] = 10;
a['x'] = 'x';
console.log(a.length, a[2], a[6], a);
// 数组长度无需提前指定，可以动态变更内容，按成员下标最大值+1得到length
// 下标顺序也可以不连续，成员项按照定义时的下标取值
// 设定下标时正整数字符串按数字下标处理，其他按照对象成员key来处理。

for (var i = 0, l = a.length; i < l; i++) {
    console.log(i, a[i]);
}
// for 循环按照最大长度逐个遍历，同时打印全部成员，不含属性

for (var idx in a) {
    console.log(idx, a[idx]);
}
// for in 打印实际存在的成员和属性
// for in循环体除了遍历数组元素外，还会遍历自定义属性，且顺序不能保证
// 如果对顺序有要求且有自定义属性时，不建议使用此方式遍历数组

a.forEach(function(item, idx) {
    console.log(idx, item);
});
// forEach 按照while循环逐个遍历成员，然后判断是否为实际成员
// 然后按照定义时下标取得全部实际成员，类似for-in，区别是不取属性

a.filter(function(item, idx) {
    console.log(item, idx);
    return !item;
});
// 过滤符合条件的实际成员，遍历规则同forEach，得到新数组

a.map(function(item, idx) {
    console.log(item, idx);
    return !item;
});
// 按照实际成员循环，返回运算结果集合，下标不变，是循环+in判断结合处理


for(let item of a) {
    console.log(item);
}
// for-of用来遍历有迭代器对象如数组、Map、Set中的值，只是遍历成员，无下标

// * array value comparison */
var a = [0];
var b = [1];
console.log(a == true, b == true);
if (a) {
    console.log('a');
}
if (b) {
    console.log('b');
}
// 对于数组来讲，等于比较会把value取出来比较
// 逻辑判断时，并没有将内容取出，而是直接判断对象，此时对象都存在
```

### array number value
```js
[1] == [1];
1   == [1];
[1, 2] > [2, 1];
[1, '2'] < [2, 1];
// 引用用对象之间的比较都是false，因为指向空间不同
// 数组判断时根据对象来判断
// 当与原始书类型比较时会取出第一个value来进行对比
// 数组><比较是按照toString()后的value进行比较

/* # switchcase */
function foo(number) {
   switch(number) {
       case 'a': 
         console.log('string');
         break;
       case 1: 
         console.log('number');
         break;
       case null: 
       case undefined:
         console.log('undefined');
         break;
       default:
         console.log('unknown');
   }
}
foo(new String('a'));
foo(Number(1));
foo(Object(null));
foo(null);
foo(undefined);
// switch 会按照对象严格比较，会校验类型，new String以及Object(null)都变成object了
```
```js
// multiple operator with number computing
console.log(1 - + 1);
console.log(1 - + + '1');
console.log('1' - + + '1');
console.log('1' + + - 1);
console.log('1' - - 1);
console.log(1 - - - '1');
console.log(1 - + - '1');
console.log(1 - * 1);
console.log(1 + % 1);
// JS允许放多个操作符号，这时+-用来改变数字的正负状态
// 如果是字符串在前后面直接跟+号，这时是连接符号，而不是计算符号

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
foo(1, 1, 1);
// arguments是一个类数组，参数作为成员按顺序排列，具备数据的一些方法和length属性
// 非严格模式参数会影响arguments中的值，而严格模式下不影响
// arguments作为一个引用对象，传递后内部成员更改将影响之前的引用
// 如果传入参数少于行参时，没有传入的实参的形参变量就不是arguments的成员
// VS
// arguments is array
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
// 这里参数只有1个数组参数，此参数相当于arguments[0]
// 注意区别于arguments本身，这里传递和修改的只是arr
```

```js
// function length
Function.length === new Function().length;
// 对象本身length为1，实例化后的构造函数length为0
(function([], undefined, {}, NaN){}).length;

/* # date declare */
var a = new Date("2000/01/01");
var b = new Date(2000, 01, 01);
var a = new Date("2000/13/01");
var b = new Date(2000, 13, 01);
console.log(a, b);
// 参数形势下初始化，月份会比输入的大1个月，但如果数值过大会自动按年月日转换

/* # Number to string */
Number.MIN_VALUE > 0;
Number.MAX_VALUE > 0;
1.toString();    // error
var a = 1;
a.toString();    // '1'
1..toString();   // '1'
1 .toString();   // '1'
(1).toString();  // '1'
1...toString();  // error
1..a             // undefined
// MIN_VALUE也是大于0，数字不能直接toString，而是需要先声明为一个变量
// 如果数字后面空格或者跟上.符号则相当于把1转为声明之后的结果来执行

// assign and comma operator
var a = 3, b = a == a ? 1 : 2;
console.log(b);
var c = (a = 3, b = 4);
console.log(c, b);
var d = (a = 3, b = 5, b != 4);
console.log(d, b);
// 逗号之后b接着被赋值，相当于第二个语句
// 括号内先执行逗号前，再执行逗号后，相当于赋值为括号后一个执行结果
// 连等时为多个赋值
function hit(num) {
    var range = ['A', 'B', 'C', 'D'];
    return result = range[num++] || range[(num = 0, ++num)];
}
console.log(hit(), hit(3), hit(0), hit(5));
// 逗号操作省去if判断，这里++在前表示当前赋值时提前计算
```

### function caller
```js
// function arguments
(function foo(foo){
    console.log(foo);
    return typeof foo();
  })(function(){ return 1; });
// 传入是function，typeof的是function的返回值

// function name scope
var f = function foo(){ return 123; };
typeof foo();
console.dir(f);
// 与定义式不通，表达式声明的函数名只是函数的name，并没有声明name的变量
// 命令式则同时定义了一个变量

// function name scope
var foo = function foo1() {
    console.log(foo === foo1);
    return foo1; 
};
console.log(typeof foo(), typeof foo1);
// 表达式声明函数内部可以访问到函数的name，name是函数的一个属性，属于内部变量
// 外部无法直接访问到该name

// carriage return
function foo() {
    return
   {
        a: 'a'
    };
}
console.log( foo() );
// return如果加了换行符相当于两个语句

// comma operator and carriage return
var b = 1, 
c = (2, function() { return arguments[0] }), 
a = (3, b + c
        ({ x : 4}, {x: 10}).x);
console.log(a, c);
// 逗号操作符相当于新语句，()后的换行则仍然表示当前语句，
// 因此c赋值为2， 再赋值等于一个函数，该函数返回第一个参数
// a赋值3，再为b + c执行的结果的x属性，逗号操作符在形参里面作分隔符
```

```js
// constructor return self
function Foo(){ return Foo; }
var foo = new Foo();
console.log(foo instanceof Foo, foo === Foo);
console.dir(foo);
// 在构造器里面return了构造器，而不是默认的this，new操作时等于将foo赋值为Foo

// constructor return object
function Foo(){ this.a = 'a'; return {}; }
var foo = new Foo();
console.log(foo instanceof Foo, foo === Foo);
console.dir(foo);
// 在构造器里面return了新对象，相当于给foo赋值给该新对象

// execute function immediately
var f = (function f(){ return "1"; alert(1); }, 
         function g(){ return 2; })();
typeof f;
// 立即执行函数按逗号操作符取后一个执行

// assign in condiction
var x = 1;
if (function f(){}) {
    console.log('inner 1:', x, typeof f);
    x = typeof f;
    console.log('inner 2:', x, typeof f);
}
console.log(x, typeof f);
// 条件判断时一个对象时为真，但此时该函数并未定义
// 因此无论是内部还是外部都无法获得该函数

// recursion and double `&` symbol
var a = 1;
var b = function a(x) {
    x && a(--x);
    a = x--;
    var c = x--;
    console.log('a=' + a, 'x=' + x, 'c=' + c);
};
b(a);
console.log(a);
// b函数内输出时会打印两次，第2次执行是因为a(--x)递归调用
// 第一次进入函数，然后执行递归，x递减，递归再进入到函数，此时x为0，不再进入递归
// 第一次打印递归调用里面的输出，x最初是0，两次递减后x=-2, a=-1, c=-1(赋值为x--，还是x递减前的值)
// 第二次打印最初函数执行的输出，x最初是1，有三次递减后，x=-2, a=-1, c =-1
// 表达式赋值函数给b，a是函数name，不能被修改，于是内部访问a得到的仍然是函数a

// simple example for recursion
var times = 0;
function a(x) {
    console.log('before:', x, times);
    times++;
    if (x) {
        console.log('inner:', x, times);
        x -= 1;
        a(x);
    }
    console.log('after:', x, times);
};
a(3);
// 递归调用，递归之前顺序执行，调用自身时中止后面的执行，再次进入函数，顺序是自外向内
// 递归完毕后(不再继续递归)，继续后面的执行，后面的执行有多少次函数调用就执行多少次
// 执行的顺序是按照最近的递归调用到最初调用(自近向远)的顺序
```

### assign label object and change value
```js
var a = 1, foo = { a: a };
foo: {
    a: ++a;
    console.log('inner:', a);
    a: {
        a++;
        break foo;
    };
    a: ++a;
};
console.log('outer:', foo.a, a);
// :表示一个label，加上{}标识label block，块内语句逐条执行
// break可以跳出label块，跳出后后面不再继续，一般与for结合使用
// lable定义并非变量声明，名称仅在label内使用，不会影响同名变量
```

# Reference

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
https://www.toptal.com/javascript/10-most-common-javascript-mistakes

http://javascript-puzzlers.herokuapp.com/

http://perfectionkills.com/javascript-quiz/

http://zxhfighter.github.io/blog/javascript/2013/03/14/javascript-quiz.html

http://bonsaiden.github.io/JavaScript-Garden/

http://davidshariff.com/js-quiz/

http://madebyknight.com/javascript-scope/

https://zhuanlan.zhihu.com/p/95318421

http://tutorialzine.com/2014/08/what-does-this-function-do/

http://dmitry.baranovskiy.com/post/91403200

https://www.nczonline.net/blog/2010/01/26/answering-baranovskiys-javascript-quiz/

https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md

https://github.com/lydiahallie/javascript-questions/blob/master/zh-CN/README-zh_CN.md