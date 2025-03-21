public class PolymorphicNormal {

    public static void main(String[] args) {

        System.out.println(args);

        A a = new A();
        A ab = new B();
        B b = new B();
        C c = new C();
        D d = new D();

        // A and A, 直接打印自己
        System.out.println("1--" + a.show(b));

        // A and A, C继承B，B继承C，最后指向A
        System.out.println("2--" + a.show(c));

        // A and D, D继承自B，同C
        System.out.println("3--" + a.show(d));

        // B and A, ab是B的实例,用A声明，即向上转型得到的类型是A,
        // 引用是B,A对象中没有打印B的方法,有打印A的方法,
        // 但ab是B对象引用，B中重写了A中打印A的方法，
        // 于是调用B中的打印A方法。若A有show(B)，则直接调用B.show(B)。
        // A无show(B)，调用B.show(A),如果A也有show(A)。
        // 也可以理解为从A开始查找起，但被覆盖的优先。
        System.out.println("4--" + ab.show(b));

        // B and A, 与上同
        System.out.println("5--" + ab.show(c));

        // A and D, A里面有打印D对象的方法
        System.out.println("6--" + ab.show(d));

        // B and B, B里面有打印B的方法,
        System.out.println("7--" + b.show(b));

        // B and B, 同上,C继承自B
        System.out.println("8--" + b.show(c));

        // A and D, B中没有D, 调用A中打印D的方法
        System.out.println("9--" + b.show(d));

        // B and A 父类声明子类，由子类来决定调用方法，该方法在父类中有声明(也就是被覆盖了)，否则父类优先)
        System.out.println("10--" + ab.show(a));
    }

}

// A是超类，提供两个方法
class A {

    // 传入D类型
    public String show(D object) {
        return ("A and D");
    }

    // 传入A类型
    public String show(A object) {
        return ("A and A");
    }
    /*
     * public String show(B object) {
     * return ("A and B");
     * }
     */
}

// B继承A
class B extends A {

    // 传入B类型
    public String show(B object) {
        return ("B and B");
    }

    // 传入B的子类型
    public String show(A object) {
        return ("B and A");
    }

}

// C继承B
class C extends B {
}

// D继承B
class D extends B {
}

/**
 * 运行结果：
 * 1--A and A
 * 2--A and A
 * 3--A and D
 * 4--B and A
 * 5--B and A
 * 6--A and D
 * 7--B and B
 * 8--B and B
 * 9--A and D
 * 10--B and A
 */

// 详见：https://github.com/microwind/design-patterns/tree/main/programming-paradigm/object-oriented-programming/polymorphism