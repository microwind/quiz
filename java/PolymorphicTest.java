/**
 * 多态测试完整示例
 * 包含4个层级的类结构：A <- B <- C/D
 * 重点演示方法重写、动态绑定和编译期类型检查机制
 */

// -------------------- 类定义 --------------------
// 父类A
class A {
  /**
   * 方法1：处理D类型参数
   * 这个方法不会被任何子类重写
   */
  public String show(D obj) {
    return "A and D";
  }

  /**
   * 方法2：处理A类型参数（包括子类）
   * 这个方法会被B类重写
   */
  public String show(A obj) {
    return "A and A";
  }
}

// B是A的子类，重写了父类的方法
class B extends A {
  /**
   * 方法3：处理B类型参数（包括子类）
   * 这是B类特有的方法，不会重写父类方法
   */
  public String show(B obj) {
    return "B and B";
  }

  /**
   * 方法4：重写父类的show(A)
   * 当使用A类型引用调用时，会根据实际对象类型动态绑定
   */
  @Override
  public String show(A obj) {
    return "B and A";
  }
}

// C和D是B的子类，它们继承了B的所有方法
class C extends B {
} // 继承B的所有方法

class D extends B {
} // 继承B的所有方法

// -------------------- 测试代码 --------------------
public class PolymorphicTest {

  public static void main(String[] args) {
    // 初始化测试对象
    A baseA = new A(); // 纯A类型实例
    A polyAB = new B(); // A类型引用指向B实例（向上转型）
    B pureB = new B(); // 纯B类型实例
    C childC = new C(); // C实例（B的子类）
    D childD = new D(); // D实例（B的子类）

    /* 测试组1：使用纯A类型实例调用 */
    // 1. A.show(B) -> 寻找A中匹配方法：无show(B)，向上转型找show(A)
    System.out.println("[1] A.show(B) => " + baseA.show(pureB)); // A and A

    // 2. A.show(C) -> C继承链：C->B->A，匹配show(A)
    System.out.println("[2] A.show(C) => " + baseA.show(childC)); // A and A

    // 3. A.show(D) -> 直接匹配A.show(D)
    System.out.println("[3] A.show(D) => " + baseA.show(childD)); // A and D

    /* 测试组2：使用多态引用polyAB（A类型引用指向B实例） */
    // 4. polyAB.show(B) -> 实际类型B中查找：
    // - B有show(B)？存在 -> 直接调用（动态绑定）
    System.out.println("[4] polyAB.show(B) => " + polyAB.show(pureB)); // B and B

    // 5. polyAB.show(C) -> C的继承链查找：
    // - B中找show(C)？无 -> 找show(B)（C是B子类，参数向上转型）
    System.out.println("[5] polyAB.show(C) => " + polyAB.show(childC)); // B and B

    // 6. polyAB.show(D) -> 直接匹配A.show(D)（B未重写）
    System.out.println("[6] polyAB.show(D) => " + polyAB.show(childD)); // A and D

    /* 测试组3：使用纯B类型实例调用 */
    // 7. B.show(B) -> 直接匹配B.show(B)
    System.out.println("[7] B.show(B) => " + pureB.show(pureB)); // B and B

    // 8. B.show(C) -> C继承自B，匹配B.show(B)
    System.out.println("[8] B.show(C) => " + pureB.show(childC)); // B and B

    // 9. B.show(D) -> B中无show(D)，向上到A中查找
    System.out.println("[9] B.show(D) => " + pureB.show(childD)); // A and D

    /* 测试组4：多态方法重写验证 */
    // 10. polyAB.show(A) -> 实际类型B中查找：
    // - B重写了show(A)，优先调用子类实现
    System.out.println("[10] polyAB.show(A) => " + polyAB.show(baseA)); // B and A
  }
}

/**
 * 测试结果:
 * [1] A.show(B) => A and A
 * [2] A.show(C) => A and A
 * [3] A.show(D) => A and D
 * [4] polyAB.show(B) => B and B
 * [5] polyAB.show(C) => B and B
 * [6] polyAB.show(D) => A and D
 * [7] B.show(B) => B and B
 * [8] B.show(C) => B and B
 * [9] B.show(D) => A and D
 * [10] polyAB.show(A) => B and A
 */

/**
 * # 核心机制说明
 * 动态绑定规则：
 * 实例方法调用基于运行时类型（实际对象类型）
 * 参数匹配基于编译时类型（引用声明类型）
 * 
 * 方法匹配优先级：精确参数类型匹配 --> 子类参数类型匹配 --> 父类参数类型匹配
 * 
 * 多态调用过程：
 * 步骤1：根据调用者运行时类型，查找匹配方法
 * 步骤2：参数类型向上转型匹配最近父类型方法
 * 步骤3：若子类重写父类方法，优先调用子类实现
 * 
 * 重要特性验证：
 * 测试4/5演示：即使使用父类引用，仍能调用子类特有的show(B)方法
 * 测试10演示：子类重写方法优先于父类实现
 * 测试6/9演示：未重写的方法沿用父类实现
 */

 // 详见：https://github.com/microwind/design-patterns/tree/main/programming-paradigm/object-oriented-programming/polymorphism