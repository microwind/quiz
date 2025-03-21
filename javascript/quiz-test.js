/**
 * quiz-test.js
 * 本文件包含对 JavaScript 中赋值与引用、变量提升、函数定义、函数对象与原型、值传递、this 执行环境、异步执行以及闭包等概念的示例及测试用例。
 * 每个模块均使用自执行匿名函数隔离作用域，方便测试与观察各部分效果。
 */

/* ============================
   1. 赋值与引用 (Assignment vs Reference)
   ============================ */
   (function() {
    console.log("===== 赋值与引用 =====");

    // 测试1：基本赋值
    var a = 1;
    var b = 2;
    b = a;
    console.log("赋值测试：", a, b); // 预期输出：1 1
    console.assert(a === 1 && b === 1, "【错误】赋值测试失败");

    // 测试2：引用类型赋值
    var c = [1, 2];
    var d = c;
    d[0] = 'a';
    console.log("引用测试：", c, d); // 预期输出：['a', 2] ['a', 2]
    console.assert(c[0] === 'a' && d[0] === 'a', "【错误】引用测试失败");

    // 测试3：新引用（重新赋值）测试
    var c2 = [1, 2];
    var d2 = c2;
    d2 = []; // d2 指向新数组
    d2[0] = 'a';
    console.log("新引用测试：", c2, d2); // 预期：c2 为 [1,2]，d2 为 ['a']
    console.assert(c2[0] === 1 && d2[0] === 'a', "【错误】新引用测试失败");

    // 测试4：连续赋值测试
    var c3 = [1, 2];
    var d3 = c3 = {};
    d3[0] = 'a';
    console.log("连续赋值测试：", c3, d3); // 预期：c3 与 d3 为同一对象，属性 0 = 'a'
    console.assert(c3[0] === 'a' && d3[0] === 'a', "【错误】连续赋值测试失败");

    // 测试5：循环引用测试
    try {
        var aObj = { a: a }; // 此处 a 已存在（值为1）
        console.log("循环引用测试：", aObj);
    } catch (e) {
        console.log("循环引用测试错误：", e);
    }

    // 测试6：连续赋值中全局变量泄露
    function testLeak() {
        var a = b = 1; // b 未用 var 声明，因此为全局变量
        console.log("内部赋值测试：", a, b);
        console.assert(a === 1 && b === 1, "【错误】内部赋值测试失败");
    }
    testLeak();
    console.log("全局检测：", "typeof a =", typeof a, "b =", b);
    // 注意：本文件中 a 已被多次声明，可能已被覆盖，b 是全局变量

})();


/* ============================
   2. 变量提升 (Variable Hoisting)
   ============================ */
(function() {
    console.log("\n===== 变量提升 =====");

    var num1 = 1;
    var num2 = 2;
    (function foo() {
        if (num1) {
           var num1 = 11;
        }
        console.log("hoisting - num1:", num1); // 预期：11

        if (!num2) {
           var num2 = 22;
        }
        console.log("hoisting - num2:", num2); // 预期：2

        console.assert(num1 === 11, "【错误】变量提升测试：num1 不等于 11");
        console.assert(num2 === 2, "【错误】变量提升测试：num2 不等于 2");
    })();

    // 测试函数声明与函数表达式的提升差异
    (function() {
        fooHoist(); // 函数声明提升，可调用
        function fooHoist() {
            console.log("函数声明提升测试：fooHoist 已调用");
        }
        try {
            fooExpr(); // 此时 fooExpr 仍为 undefined
        } catch(e) {
            console.log("函数表达式提升测试：fooExpr 未定义，如预期", e);
        }
        var fooExpr = function() {
            console.log("函数表达式测试：fooExpr 已调用");
        };
    })();

    // 测试 hoisting 与 arguments 的关系
    (function() {
        var a = 1;
        function foo(a) {
            a = 2;
            arguments[0] = 3;
            var a;
            console.log("hoisting and arguments:", a, this.a);
            console.assert(a === 2, "【错误】hoisting with arguments 测试失败");
        }
        foo(a);
    })();

    // 测试 hoisting 与 arguments（第二种情况）
    (function() {
        var a = 1;
        function foo(a, b) {
            a = 2;
            arguments[0] = 3;
            arguments[1] = 4;
            var a;
            console.log("hoisting and arguments 2:", a, this.a, b);
        }
        foo(a);
    })();

})();


/* ============================
   3. 函数定义优先 (Function Defined First)
   ============================ */
(function() {
    console.log("\n===== 函数定义优先 =====");

    // 测试：函数声明提升优先于变量声明
    var a;
    console.log("函数定义优先测试：", a); // 预期输出：函数 a
    console.assert(typeof a === "function", "【错误】函数定义优先测试失败");

    // 测试 hoisting 中内部函数提升
    (function() {
        var num1 = 1;
        function foo() {
            var num1;
            return num1;
            function num1() {
                return num1 + '|' + this.num1;
            }
        }
        var result = foo();
        console.log("hoisting with function defined:", result);
    })();

    // 测试函数表达式与变量提升
    (function() {
        var num1 = 1;
        function foo() {
            return num1;
            var num1 = function() {
                return num1 + '|' + this.num1;
            }
        }
        var result = foo();
        console.log("hoisting with function expression:", result);
        console.assert(result === undefined, "【错误】函数表达式提升测试失败");
    })();

    // 测试函数对象属性
    (function() {
        function foo() {
            console.log("函数对象测试：", foo, foo.name);
        }
        foo();
        var foo2 = function() {
            console.log("函数表达式对象测试：", foo2, foo2.name);
        };
        foo2();
        try {
            foo1(); // foo1 未定义
        } catch(e) {
            console.log("预期错误：foo1 未定义", e);
        }
    })();

})();


/* ============================
   4. 函数对象、构造器与原型 (Function Object and Constructor & Prototype)
   ============================ */
(function() {
    console.log("\n===== 函数对象与原型 =====");

    // 测试函数作为对象的属性
    function foo() { this.name = 'foo_name'; }
    foo.a = '1';
    foo.b = 'b';
    var f1 = foo;
    f1.a = '2';
    f1.name = 'f1';
    console.dir(f1);
    console.log("函数对象静态属性：", Object.keys(foo).map(function(item) {
       return (item + '=' + foo[item]);
    }));
    
    // 测试构造器与原型
    function Foo() { this.name = 'foo_name'; }
    Foo.prototype.getName = function() {
        return this.name;
    }
    Foo.a = '1';
    Foo.b = 'b';
    var f2 = new Foo();
    console.log("构造器测试：", Object.keys(f2).map(function(item) {
       return (item + '=' + f2[item]);
    }), f2.getName());
    console.assert(f2.getName() === 'foo_name', "【错误】构造器测试失败");

    // 测试原型属性和遍历
    function Foo2() { this.name = 'foo_name'; }
    Foo2.prototype.b = 'b1';
    var f3 = new Foo2();
    console.log("原型属性测试：", Object.keys(f3).map(function(item) {
       return (item + '=' + f3[item]);
    }));
    for (var item in f3) {
        console.log("遍历属性：", item + " => " + f3[item]);
    }
    Foo2.prototype.b = 'change b';
    Foo2.prototype.getB = function() {
        return this.b;
    }
    console.log("getB 测试：", f3.getB());
    Foo2.prototype.name = 'change Foo';
    Foo2.prototype.getName = function() {
        return this.name;
    }
    console.log("getName 测试：", f3.getName());

    // 测试实例构造器与原型链关系
    function A() {}
    var a1 = new A();
    console.log("实例关系测试1：", a1.constructor, a1.constructor == A,
        a1 instanceof A, A.prototype.isPrototypeOf(a1));
    A.prototype = {};
    var a2 = new A();
    console.log("实例关系测试2：", a2.constructor, a2.constructor == A,
        a2 instanceof A, A.prototype.isPrototypeOf(a2));

    // 测试原型链更改对实例的影响
    function A2() {}
    A2.prototype.name = 'A';
    var a1_2 = new A2();
    console.log("原型链测试：", a1_2.name, a1_2.constructor, a1_2.constructor == A2,
        a1_2 instanceof A2, A2.prototype.isPrototypeOf(a1_2));
    A2.prototype.name = 'A2';
    A2.prototype = {};
    A2.prototype.name = 'B';
    var a2_2 = new A2();
    console.log("原型链测试2：", a1_2.name, a2_2.name, a2_2.constructor, a2_2.constructor == A2,
        a2_2 instanceof A2, A2.prototype.isPrototypeOf(a2_2));

    // 测试更改原型后实例的构造器及关系
    function A3() {}
    var a1_3 = new A3();
    console.log("更改原型前：", a1_3.constructor, a1_3.constructor == A3,
        a1_3 instanceof A3, A3.prototype.isPrototypeOf(a1_3));
    var a2_3 = new A3();
    A3.prototype = {};
    console.log("更改原型后：", a2_3.constructor, a2_3.constructor == A3,
        a2_3 instanceof A3, A3.prototype.isPrototypeOf(a2_3));

    // 测试更改原型后实例属性的差异
    function A4() {}
    var a1_4 = new A4();
    A4.prototype.name = 'A';
    console.log("更改前属性：", a1_4.name, a1_4.constructor, a1_4.constructor == A4,
        a1_4 instanceof A4, A4.prototype.isPrototypeOf(a1_4));
    var a2_4 = new A4();
    A4.prototype.name = 'A2';
    A4.prototype = {};
    A4.prototype.name = 'B';
    console.log("更改后属性：", a1_4.name, a2_4.name, a2_4.constructor, a2_4.constructor == A4,
        a2_4 instanceof A4, A4.prototype.isPrototypeOf(a2_4));

})();


/* ============================
   5. 值传递与引用传递 (Pass by Value vs Pass by Reference)
   ============================ */
(function() {
    console.log("\n===== 值传递与引用传递 =====");

    // 测试1：原始类型按值传递
    var a = 'a1';
    var b = ['b1', 'b2'];
    function passValueTest(a, b) {
        a = 'a2';
        b[0] = 'b2';
        console.log("传值测试1：", a, b);
        console.assert(a === 'a2', "【错误】原始值传递测试失败");
        console.assert(b[0] === 'b2', "【错误】引用传递测试失败");
    }
    passValueTest(a, b);
    console.log("传值测试1后：", a, b); // 预期：a 仍为 'a1'，b 已被修改
    console.assert(a === 'a1', "【错误】传值后原始值测试失败");
    console.assert(b[0] === 'b2', "【错误】传值后引用测试失败");

    // 测试2：引用对象被重新赋值，内部修改无影响
    var a2 = 'a1';
    var b2 = ['b1', 'b2'];
    function passValueTest2(a, b) {
        a = 'a2';
        b = ['b3', 'b4']; // 重新赋值 b 为新数组
        b[0] = 'b2';
        console.log("传值测试2：", a, b);
        console.assert(a === 'a2', "【错误】传值测试2 原始值失败");
        console.assert(b[0] === 'b2', "【错误】传值测试2 引用失败");
    }
    passValueTest2(a2, b2);
    console.log("传值测试2后：", a2, b2); // 预期：a2 为 'a1'，b2 保持不变
    console.assert(a2 === 'a1', "【错误】传值测试2 后 原始值失败");
    console.assert(b2[0] === 'b1', "【错误】传值测试2 后 引用失败");

})();


/* ============================
   6. 执行环境中的 this (Execution Context of 'this')
   ============================ */
(function() {
    console.log("\n===== 执行环境中的 this =====");

    var A = {
        nickname: 'A',
        getName: function() {
            return this.nickname;
        },
        showName: function() {
            // 自执行函数中 this 指向全局对象
            return (function() {
                return this.nickname;
            })();
        },
        echoName: function() {
            return function() {
                return this.nickname;
            };
        }
    };
    console.log("this 测试：", A.getName(), A.showName(), A.echoName()());
    // 预期：A.getName() 返回 'A'
    // A.showName() 返回全局对象的 nickname（在浏览器下可能为 undefined，在 Node 中可能为空）
    // A.echoName()() 同上

    // 测试函数绑定
    this.nickname = 'global name';
    var A2 = {
        nickname: 'A',
        getName: function() {
            return this.nickname;
        },
        showName: function() {
            return (function() {
                return this.nickname;
            })();
        }
    };
    var B = {
        nickname: 'B'
    };
    B.getName = A2.getName;
    console.log("绑定测试1：", B.getName()); // 预期返回 'B'
    console.log("绑定测试2：", A2.getName.call(B)); // 预期返回 'B'
    console.log("直接赋值执行测试：", (B.getName = A2.getName)()); // 预期返回全局 nickname

    // 测试子对象中的 this
    var A3 = {
        name: 'A',
        B: {
            name: 'B',
            getName: function() {
                console.log("子对象 this 测试：", this.name);
            }
        }
    };
    A3.B.getName(); // 预期输出：B
    var C = {};
    C.getName = A3.B.getName;
    C.getName(); // 预期输出：undefined 或全局变量的 name

    // 测试变量作用域对 this 的影响
    function outer() {
        this.var1 = 'A1';
        var var2 = 'A2';
        function inner() {
            this.var1 = 'B1';
            var2 = 'B2';
            function subInner() {
                var3 = 'B3'; // 未声明的变量，隐式全局
                console.log('subInner:', this.var1, typeof var2, typeof var3);
            }
            console.log('inner:', this.var1, typeof var2, typeof var3);
            subInner();
        }
        console.log('outer:', this.var1, typeof var2, typeof var3);
        inner();
    }
    console.log("作用域测试前：", this.var1, typeof var2, typeof var3);
    outer();
    console.log("作用域测试后：", this.var1, typeof var2, typeof var3);

})();


/* ============================
   7. 异步执行 (Async Execution)
   ============================ */
(function() {
    console.log("\n===== 异步执行 =====");

    var num = 0;
    function echo(n) {
        console.log("异步输出：", n);
    }
    for (var i = 0; i < 10; i++) {
        setTimeout(function() {
            echo(i);
        }, 0);
    }
    console.log("异步前输出：", num, i);

    // 使用闭包解决异步中变量捕获问题
    for (var j = 0; j <= 5; j++) {
        (function(j) {
            setTimeout(function() {
                console.log("闭包捕获异步输出：", j);
            }, 0);
        })(j);
    }
    console.log("闭包异步前输出：", num, i);

    // 事件异步执行示例
    // 注意：此测试在浏览器环境下有效，Node 环境中 document 可能不存在
    if (typeof document !== "undefined") {
        for (var k = 0, l = 10; k < l; k++) {
            document.onclick = function() {
                console.log("点击事件输出：", k);
            }
        }
    }
})();


/* ============================
   8. 闭包 (Closure)
   ============================ */
(function() {
    console.log("\n===== 闭包 =====");

    // 测试闭包保存内部变量
    var a = 'a';
    var b = 'b';
    function foo() {
        var a = 'a1';
        var b = 'b1';
        return function(b) {
            console.log("闭包测试：", a, b);
        }
    }
    (function () {
      a = 'a2';
      b = 'b2';
      foo()(b);
    })();
    console.log("闭包外部：", a, b);

    // 测试闭包中的变量保存
    function outer() {
        var n = 10;
        function inner(m) {
           return n += m;
        }
        return inner;
    }
    var test = outer();
    var result = test(1);
    console.log("闭包变量测试结果：", result);
})();
