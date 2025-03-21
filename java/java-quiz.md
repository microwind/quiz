# Java 易错题 Quiz

### **基础语法**

#### **1. 基本数据类型**
```java
public class Test {
    public static void main(String[] args) {
        byte b = 127;
        b += 1;
        System.out.println(b);
    }
}
```
A. 128  
B. -128 ✅  
C. 编译错误  
D. 运行时异常

解释： `byte` 的取值范围为 -128 到 127，当执行 `b += 1;` 时发生溢出，结果变为 -128。

#### **2. == 和 equals()**
```java
public class Test {
    public static void main(String[] args) {
        Integer a = 100;
        Integer b = 100;
        Integer c = 200;
        Integer d = 200;
        System.out.println(a == b);
        System.out.println(c == d);
    }
}
```
A. true true  
B. true false ✅  
C. false true  
D. false false

解释： Java 对 `Integer` 值 -128 到 127 进行了缓存，因此 a 与 b 指向同一对象，而 c 与 d 超出缓存范围，各自为不同对象。`==` 比较的是引用。

#### **3. 变量作用域**
```java
public class Test {
    public static void main(String[] args) {
        int x = 10;
        {
            int x = 20;
            System.out.println(x);
        }
    }
}
```
A. 10  
B. 20  
C. 编译错误 ✅  
D. 运行时异常

解释： 在同一作用域内不能重新定义同名变量，因此内部块中的声明会导致编译错误。

### **面向对象**

#### **4. 方法重写（静态方法）**
```java
class Parent {
    public static void show() {
        System.out.println("Parent");
    }
}

class Child extends Parent {
    public static void show() {
        System.out.println("Child");
    }
}

public class Test {
    public static void main(String[] args) {
        Parent p = new Child();
        p.show();
    }
}
```
A. Parent ✅  
B. Child  
C. 编译错误  
D. 运行时异常

解释： 静态方法不会参与动态绑定，调用 `p.show()` 实际上等同于调用 `Parent.show()`。

#### **5. 接口与抽象类（原有）**
```java
interface A {
    default void show() {
        System.out.println("A");
    }
}

class B {
    public void show() {
        System.out.println("B");
    }
}

class C extends B implements A {}

public class Test {
    public static void main(String[] args) {
        new C().show();
    }
}
```
A. A  
B. B ✅  
C. 编译错误  
D. 运行时异常

解释： 类 C 继承自 B，因此调用了 B 中的 `show()` 方法，忽略了接口 A 的默认实现。

#### **6. try-catch-finally**
```java
public class Test {
    public static void main(String[] args) {
        System.out.println(test());
    }
    
    public static int test() {
        try {
            return 1;
        } finally {
            return 2;
        }
    }
}
```
A. 1  
B. 2 ✅  
C. 编译错误  
D. 运行时异常

解释： `finally` 块总会执行，并且会覆盖 `try` 块中的 return 值，所以最终返回 2。

#### **7. 线程启动（原有）**
```java
public class Test {
    public static void main(String[] args) {
        Thread t = new Thread() {
            public void run() {
                System.out.println("Thread Running");
            }
        };
        t.run();
    }
}
```
A. Thread Running ✅  
B. 编译错误  
C. 无输出  
D. 运行时异常

解释： 直接调用 `run()` 方法不会启动新线程，而是在当前线程中顺序执行。

#### **8. short 类型的运算**
```java
public class Test {
    public static void main(String[] args) { 
        short s = 1; 
        s = s + 1; // 编译错误
        s += 1;    // 正确，等价于 s = (short)(s + 1)
    }
}
```
A. s = s + 1 和 s += 1 均正确  
B. s = s + 1 编译错误，而 s += 1 正确 ✅  
C. s = s + 1 正确，而 s += 1 编译错误  
D. 均编译错误

解释： 表达式 `s + 1` 的结果为 `int` 类型，直接赋值给 `short` 需要显式类型转换；而 `+=` 运算符内部自动做了类型转换。

#### **9. 基本类型默认值与 final 修饰符**
```java
class Test {
    final int i; // 编译错误，final 成员变量必须显式初始化
    int j;       // 正确，默认值为 0
}
```
A. 均正确  
B. 均编译错误  
C. i 编译错误，j 默认值为 0 ✅  
D. i 默认值为 0，j 编译错误

解释： 被 `final` 修饰的成员变量必须在声明时或构造器中初始化，而普通成员变量会自动获得默认值。

#### **10. 浮点数精度问题**
```java
public class Test {
    public static void main(String[] args) {
        float f1 = 3.10;       // 编译错误，需加 f 后缀
        float f2 = 3.10f;      // 正确
        for (float i = 2000000000f; i <= 2000000010f; i++) {
            System.out.println(i);
        }
    }
}
```
A. f1 编译错误，f2 正确，循环正常结束  
B. f1 编译错误，f2 正确，但循环可能无限 ✅  
C. 均正确  
D. 均编译错误

解释： 浮点数常量默认为 `double` 类型，需要加 `f` 后缀；同时由于 `float` 精度有限，循环变量的增量可能不足以改变其值，导致循环条件一直成立。

#### **11. 抽象类与接口**
```java
abstract class Name {
    private abstract void method(); // 错误，抽象方法不能为 private
}

interface A { 
    int x = 0; // 隐含 public static final
}

class C implements A {
    void pX() { System.out.println(x); } // 编译错误，需明确写作 A.x
}
```
A. 编译错误 ✅  
B. 运行正常  
C. 运行时异常  
D. 输出 0

解释： 抽象方法不能为 `private`；接口中的字段默认是 `public static final`，使用时必须明确引用，如 `A.x`。

#### **12. 多态与方法重写（实例方法）**
```java
class Ye { 
    String show(Ye obj) { 
        return "Ye"; 
    } 
}

class Fu extends Ye { 
    String show(Ye obj) { 
        return "Fu"; 
    } 
}

public class Test {
    public static void main(String[] args) {
        Ye y = new Fu();
        System.out.println(y.show(y)); // 输出 "Fu"
    }
}
```
A. Ye  
B. Fu ✅  
C. 编译错误  
D. 运行时异常

解释： 实例方法根据对象的实际类型进行动态绑定，此处实际类型为 `Fu`。

#### **13. 集合框架的继承关系**
关于集合框架，下列说法正确的是：

A. List 和 Set 继承自 Collection，Map 也继承自 Collection  
B. List 和 Set 继承自 Collection，Map 是独立接口；LinkedBlockingQueue 为有界队列，PriorityQueue 为无界队列，均支持 null 值  
C. List 和 Set 继承自 Collection，Map 是独立接口；LinkedBlockingQueue 为有界队列，PriorityQueue 为无界队列，均不支持 null 值 ✅  
D. List、Set 和 Map 均继承自 Collection

解释： List 与 Set 是 Collection 的子接口，而 Map 独立于 Collection；另外，多数阻塞队列和优先级队列不允许存储 null 值。

#### **14. 线程与同步**
```java
public class Test {
    public static void pong() {
        System.out.print("pong");
    }
    public static void main(String[] args) {
        Thread t = new Thread(() -> pong());
        t.run();      // 同步调用，在当前线程中执行
        t.start();    // 启动新线程，执行顺序不确定
    }
}
```
A. 总是输出 "pongpong"  
B. 总是输出 "pingpong"  
C. 输出顺序不定，但结果为两个 "pong" ✅  
D. 编译错误

解释： 直接调用 `run()` 方法会在当前线程中执行，而调用 `start()` 会创建新线程，其执行顺序不可预测。

#### **15. volatile 与原子性**
关于 volatile 关键字，下列说法正确的是：

A. volatile 保证原子性和可见性  
B. volatile 保证可见性和有序性，但不保证原子性 ✅  
C. volatile 不保证可见性  
D. volatile 同时保证可见性和原子性

解释： volatile 能确保变量的可见性和一定的有序性，但对于复合操作（如 i++）并非原子操作。

#### **16. 异常处理**
关于异常处理，下列说法正确的是：

A. finally 块只有在无异常时执行  
B. finally 块总会执行 ✅  
C. catch 块一定会捕获所有异常  
D. try 块中的代码不会抛出异常

解释： 无论是否发生异常，finally 块总会执行，适合用于释放资源等操作。

#### **17. 内存模型与对象引用**
```java
public class Test {
    public static void change(int a, int b) { 
        // 基本类型，值传递，不影响原值
    }
    
    public static void change(int[] arr) { 
        arr[0] = 200; 
    }
    
    public static void main(String[] args) {
        int x = 100;
        int[] arr = {100, 200};
        change(x, 50);
        change(arr);
        System.out.println(x);
        System.out.println(arr[0]);
    }
}
```
A. x 和 arr[0] 均不变  
B. x 不变，arr[0] 变为 200 ✅  
C. 均改变  
D. 编译错误

解释： Java 中所有参数传递均为值传递。对于基本类型传递的是值的拷贝，对于引用类型传递的是引用的拷贝，因此修改对象内部状态会影响原对象。

#### **18. 字符串不可变性**
```java
public class Test {
    public static void main(String[] args) {
        String x = "fmn";
        x.toUpperCase();
        String y = x.replace('f', 'F');
        System.out.println(x);
        System.out.println(y);
    }
}
```
A. 输出 "fmn" 和 "Fmn" ✅  
B. 输出 "Fmn" 和 "Fmn"  
C. 输出 "fmn" 和 "fmn"  
D. 编译错误

解释： 字符串不可变，对字符串的操作会返回新对象，原字符串保持不变。

#### **19. 数组初始化**
```java
public class Test {
    public static void main(String[] args) {
        int[] arr = new int[3]{1, 2, 3}; // 编译错误，不能同时指定大小和初始化值
        int[][] f = new int[6][];         // 正确，第二维可动态分配
    }
}
```
A. 语法正确  
B. 第一行编译错误，第二行正确 ✅  
C. 均编译错误  
D. 均正确

解释： 数组初始化时不能同时指定大小和元素列表，但二维数组可先指定第一维，第二维稍后分配。

#### **20. 泛型类型擦除**
```java
class GenericTest<T> {}
public class Test {
    public static void main(String[] args) {
         GenericTest<String> t1 = new GenericTest<>();
         GenericTest<Integer> t2 = new GenericTest<>();
         System.out.println(t1.getClass() == t2.getClass());
    }
}
```
A. false  
B. true ✅  
C. 编译错误  
D. 运行时异常

解释： Java 泛型采用类型擦除，运行时两个实例的类型相同。

#### **21. Lambda 表达式捕获变量**
```java
public class Test {
    public static void main(String[] args) {
         int num = 10;
         Runnable r = () -> {
             // num = num + 1; // 编译错误：num 必须是 final 或有效 final
             System.out.println(num);
         };
         r.run();
    }
}
```
A. 输出 10  
B. 编译错误 ✅  
C. 输出 11  
D. 运行时异常

解释： Lambda 表达式中引用的外部局部变量必须是 final 或有效 final，不能修改其值。

#### **22. 方法引用**
```java
import java.util.Arrays;
public class Test {
    public static void main(String[] args) {
         String[] arr = {"b", "a", "c"};
         Arrays.sort(arr, String::compareToIgnoreCase);
         System.out.println(Arrays.toString(arr));
    }
}
```
A. [a, b, c] ✅  
B. [c, b, a]  
C. 编译错误  
D. 运行时异常

解释： 方法引用 `String::compareToIgnoreCase` 正确传递给排序方法，排序后输出结果为 [a, b, c]。

#### **23. try-with-resources**
```java
import java.io.*;
public class Test {
    public static void main(String[] args) throws IOException {
         try (FileReader fr = new FileReader("test.txt")) {
             // 读取操作
         }
         System.out.println("Done");
    }
}
```
A. 总是执行 finally 块  
B. 自动关闭资源 ✅  
C. 不需要 catch 块  
D. 编译错误

解释： try-with-resources 能自动关闭实现了 AutoCloseable 接口的资源，无需显式调用 close()。

#### **24. Stream API 中间操作顺序**
```java
import java.util.stream.Stream;
public class Test {
    public static void main(String[] args) {
         Stream.of("a", "b", "c")
               .filter(s -> {
                   System.out.print(s);
                   return true;
               })
               .forEach(System.out::print);
    }
}
```
A. 输出 a b c  
B. 输出 aa bb cc  
C. 输出 abcabc  
D. 输出 aabbcc ✅

解释： 对每个元素， filter 打印一次，再由 forEach 打印一次，所以输出为 "aabbcc"（无空格）。

#### **25. Optional 用法**
```java
import java.util.Optional;
public class Test {
    public static void main(String[] args) {
         Optional<String> opt = Optional.of("hello");
         System.out.println(opt.orElse("default"));
    }
}
```
A. hello ✅  
B. default  
C. 编译错误  
D. 运行时异常

解释： Optional 中存在 "hello"，因此 orElse 返回 "hello"。

#### **26. Reflection API 修改私有字段**
```java
import java.lang.reflect.Field;
class Person {
    private String name = "Tom";
}
public class Test {
    public static void main(String[] args) throws Exception {
         Person p = new Person();
         Field f = Person.class.getDeclaredField("name");
         f.setAccessible(true);
         f.set(p, "Jerry");
         System.out.println(f.get(p));
    }
}
```
A. Tom  
B. Jerry ✅  
C. 编译错误  
D. 运行时异常

解释： 通过反射设置 `setAccessible(true)` 可修改私有字段，输出修改后的值 "Jerry"。

#### **27. 接口默认方法冲突解决**
```java
interface A {
    default void hello() {
        System.out.println("Hello from A");
    }
}
interface B {
    default void hello() {
        System.out.println("Hello from B");
    }
}
class C implements A, B {
    public void hello() {
         A.super.hello();
    }
}
public class Test {
    public static void main(String[] args) {
         new C().hello();
    }
}
```
A. Hello from A ✅  
B. Hello from B  
C. 编译错误  
D. 运行时异常

解释： 当多个接口提供相同默认方法时，必须在子类中显式指定调用哪个接口的实现。

#### **28. Switch 表达式（Java 14+）**
```java
public class Test {
    public static void main(String[] args) {
         int num = 2;
         String result = switch(num) {
             case 1 -> "one";
             case 2 -> "two";
             default -> "unknown";
         };
         System.out.println(result);
    }
}
```
A. one  
B. two ✅  
C. unknown  
D. 编译错误

解释： Java 14 引入了 Switch 表达式，num 为 2 时输出 "two"。

#### **29. record 类型（Java 16+）**
```java
public record Point(int x, int y) {}
public class Test {
    public static void main(String[] args) {
         Point p = new Point(1, 2);
         System.out.println(p.x());
    }
}
```
A. 1 ✅  
B. 2  
C. 编译错误  
D. 运行时异常

解释： record 类型自动生成访问器，此处 p.x() 返回 x 值。

#### **30. var 关键字（局部变量类型推断）**
```java
public class Test {
    public static void main(String[] args) {
         var list = java.util.List.of("a", "b", "c");
         System.out.println(list.get(0));
    }
}
```
A. a ✅  
B. b  
C. 编译错误  
D. 运行时异常

解释： var 用于局部变量类型推断，这里 list 被推断为 List<String>，故输出第一个元素 "a".


答案与引用汇总  
| 知识点           | 对应题目编号 |
|------------------|--------------|
| 数据类型转换     | 8            |
| 多态与继承       | 12           |
| 集合与线程安全   | 13, 14       |
| 内存管理         | 17           |
| 字符串与数组     | 18, 19       |
| 泛型与 Lambda    | 20, 21       |
| Stream、Optional | 22~25       |
| 反射与新特性     | 26~30       |

