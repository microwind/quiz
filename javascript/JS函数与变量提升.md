> JS语言非常灵活，因其独特魅力受到大家的追捧。一开始人们觉得JS很简单，同时也会觉得都不像程序语言。当深入使用过后，才会发觉设计者无心插柳的妙处。

# 函数预处理，函数声明时会提前，并做好预处理，函数名赋值和确定作用域的范围

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1270f2afdd854d28a37f41f5590bea94~tplv-k3u1fbpfcp-zoom-1.image)[]()

以上代码片段中foo调用在函数foo声明之前，这是没问题的。原因是function会提前进行预处理，js引擎在词法解析时会建立一个foo变量，赋值为foo函数，同时确定函数的作用域。

其中var 声明的a变量虽然提升了，但是并没有赋值，因此a此时为undefined。如果采用let或者const声明则不会提升，提前调用则会报错。所以，js中最好别用var声明，而是采用let或const。

# 函数提升时赋值是会受作用域影响，因为es6之后引入了块级作用域

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6fe911e291ef41e4bc976a11838001dd~tplv-k3u1fbpfcp-zoom-1.image)[]()

以上代码片段，foo函数变量也会提升，但是因为作用域问题并不会赋值，因此打印时undefined，而执行时报错。如果是es5环境，则没有块级作用域，那么foo()提前调用也是合法的。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b25d132e2e1f44259355a8a4cd6bc458~tplv-k3u1fbpfcp-zoom-1.image)[]()

注意块级作用域下函数变量声明和赋值是分开的，只要调用在后面，虽然不在同一个作用域下也没问题。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89e56aad479b49faa41eee83f42305f7~tplv-k3u1fbpfcp-zoom-1.image)[]()

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/20cb0f407a604d25be516838d230bd46~tplv-k3u1fbpfcp-zoom-1.image)[]()

赋值在运行时执行，这里if是false，因此并未赋值，从而放在后面调用时也会报错。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4435ee898600401bb05f7fc2cb573b21~tplv-k3u1fbpfcp-zoom-1.image)[]()

JS作用域分为全局作用域与函数级作用域两级，外部不能访问内容，函数可以嵌套，通过作用域链函数内部可以逐级向上访问查找变量，直到全局作用域。注意块级只是区隔，与函数作用域作为层级概念并不相同。

# strict严格模式下的函数提升与作用域

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/244e7c8c54f249dc85bd5a1022addb4f~tplv-k3u1fbpfcp-zoom-1.image)[]()

在严格模式下，函数变量声明也不提升了，还得严格遵循块级作用域。

# 总结

1.  函数名也是一个变量，也会提升。函数还会提前预处理，赋值和确定作用域，因此函数调用在前也可以正常访问。
1.  在块级作用域下，函数会跨级提升，会确定作用域，但是不会赋值。只有块被执行后才会赋值。函数作用域下的子函数名只会提升至父函数，不会超过父函数的作用域。
1.  strict模式下，若函数不在块内则会提升且赋值，若在块内则因为非var声明就不会提前，直接访问报错。

以上对于熟悉JS的来说可能比较好懂，对于熟悉Java和C语言的人来讲可能会彻底懵圈。编程的有趣在于，不同的语言有不同的特点，当你掌握各种编程语言时，就像见证了各地风俗人情，思路会变得非常开阔。
