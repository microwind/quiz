
// 函数预处理，函数声明和变量一样会提前，函数提前且赋值
console.log(foo) // 打印function内容
foo() // 函数写在上面，可以打印1
function foo() {
  console.log(1)
}
console.log(a) // undefined
var a = 10

// 函数声明提前如果遇到{}块
// 在支持块级作用域的浏览器提前调用会报错
console.log(foo) // 打印undefined
foo() // 调用报错，受作用域影响
console.log(a) // var不受作用域影响
if (true) {
  var a = 10
  function foo() {
    console.log(1)
  }
}


// 如果放在函数声明以下调用则不会报错
// 注意与let或const声明的变量不同
console.log(foo)
let a
if (true) {
  a = 10
  const b = 20
  function foo() {
    console.log(1)
  }
}
console.log(a) // 不报错，因为变量在同一作用域下声明
console.log(b) // 报错，因为变量作用域不同
foo() // 可以打印1，变量在同一作用域下，赋值在其后



// 函数声明调用在前，不在同一作用域
(function() {
  console.log(foo) // undefined，提升但未赋值
  // foo()  // 报错，因为函数foo在块级作用下，foo是undefined
  if (true) { // true可以进入块内，赋值成功
    function foo() {
      console.log(1)    
    }
  }
  foo() // 可以调用，前面true进入块内可以调用
})()

// 函数声明调用在前，不在同一作用域
(function() {
  console.log(foo) // undefined，提升但未赋值
  // foo()  // 报错，因为函数foo在块级作用下，foo是undefined
  if (false) { // false无法进入块内
    function foo() {
      console.log(1)
    }
  }
  foo() // 报错。因为false没法赋值
})()

// 函数变量作用域层级，注意JS分为全局和函数作用域，外层不能访问内部
(function() {
  //console.log(foo1, foo2) // foo1 undefined，foo2则会报错
  // foo1() // 报错，因为foo1声明在块级作用域内 
  if (true) { // true可以进入块内，赋值成功，foo1在之后调用可生效
    function foo1() {
      console.log('foo1')
      function foo2() {
        console.log('foo2')
      }
    }
  }
  foo1() // 调用成功，因为foo1变量会提升至外层作用域
  foo2() // 调用失败，foo2属于foo1函数作用域，外部无法访问
})()


// 函数声明, 采用strict模式
(function() {
  'use strict'
  console.log(foo) // 严格模式下foo没声明打印会报错
  console.log(foo2) // 函数是var表达式声明，foo2变量提升，是undefined
  foo() // 严格模式下，前置调用会报错
  foo2() // 调用报错
  if (true) {
    function foo() {
      console.log(1)
    }
    var foo2 = function() {
      console.log('foo2') 
    }
  }
  console.log(foo) // 严格模式下，foo不在同一作用域下会报错
  foo() // 严格模式下，foo不在同一作用域下会报错
  foo2() // 调用合法，因为是var声明的
})()

// 函数声明, 采用strict模式
(function() {
  'use strict'
  console.log(foo) // 严格foo在前可以访问
  foo() // 严格模式下，同一作用域，可以访问
  function foo() {
    console.log(1)
  }
  console.log(foo) // 严格模式下，foo在同一作用域可以访问
  foo() // 严格模式下，foo在同一作用域可以访问
})()

/*
1. 函数声明提升，调用在后。console打印undefined，foo()调用打印1，如果是false则报错。因为函数名也是一个变量一样会提升，但因为es6块级作用域问题，虽然函数声名提升，但是不会赋值，只有执行到块语句里才会赋值。false就进不去块内，后面依然无法访问。es5下则不然，false依然可以赋值，能得到1。所以高版本浏览器默认是块级作用域，老浏览器<=ie8则不是。
2. 函数声明提升，调用在前。如果调用在前，直接访问时打印undefined，foo()调用报错，因为增加了块，则只有声明而没有赋值。因此，无论是true和false都会报错。
3. strict模式。直接访问打印错误，foo()调用也是错误。strict模式下，变量必须声明在前，即变量不提升。

关于函数声明提升与预处理。

首先，函数声明式定义包括函数名提升与赋值以及预处理(确定作用域等)
1. 函数名也是一个变量，所以会提升。因此函数调用在前也可以正常访问。
2. 当有块级作用域时(es6)，函数名会提升，也会预处理但是不会赋值。只有块被执行后才会赋值处理(此时if判断起作用)，类似在另外的函数内。但函数内的子函数只会提升至函数顶部，不会超过块。
3. strict模式下，若函数不在块内则会提升且赋值，若在块内则因为非var声明就不会提前，访问直接报错。
*/

