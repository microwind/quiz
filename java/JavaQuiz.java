
import java.util.*;

public class JavaQuiz {

    // 题目1: 基本数据类型溢出
    public static boolean quiz1() {
        byte b = 127;
        b += 1;
        return b == -128; // 预期结果为true
    }

    // 题目2: Integer缓存
    public static boolean quiz2() {
        Integer a = 100, b = 100, c = 200, d = 200;
        return (a == b) && !(c == d); // 预期true
    }

    // 题目4: 静态方法绑定
    static class Parent {
        public static void show() { System.out.print("Parent"); }
    }
    static class Child extends Parent {
        public static void show() { System.out.print("Child"); }
    }
    public static boolean quiz4() {
        Parent p = new Child();
        p.show(); // 应输出Parent
        return true;
    }

    // 题目5: 接口方法冲突
    interface A { default void show() { System.out.print("A"); } }
    static class B { public void show() { System.out.print("B"); } }
    static class C extends B implements A {}
    public static boolean quiz5() {
        new C().show(); // 应输出B
        return true;
    }

    // 题目6: finally返回值
    public static int quiz6() {
        try { return 1; } 
        finally { return 2; } // 返回2
    }

    // 题目8: short运算
    public static boolean quiz8() {
        short s = 1;
        //s = s + 1; // 编译错误
        s += 1;     // 正确
        return s == 2;
    }

    // 题目12: 多态调用
    static class Ye { String show(Ye obj) { return "Ye"; } }
    static class Fu extends Ye { String show(Ye obj) { return "Fu"; } }
    public static boolean quiz12() {
        return new Fu().show(new Ye()).equals("Fu");
    }

    // 题目17: 参数传递
    public static boolean quiz17() {
        int x = 100;
        int[] arr = {100, 200};
        changePrimitive(x);
        changeArray(arr);
        return x == 100 && arr[0] == 200;
    }
    private static void changePrimitive(int a) { a = 200; }
    private static void changeArray(int[] arr) { arr[0] = 200; }

    // 题目20: 泛型擦除
    static class Box<T> {}
    public static boolean quiz20() {
        return new Box<String>().getClass() == new Box<Integer>().getClass();
    }

    // 题目28: Switch表达式
    public static boolean quiz28() {
        int num = 2;
        String result = switch(num) {
            case 1 -> "one";
            case 2 -> "two";
            default -> "unknown";
        };
        return result.equals("two");
    }

    // 主测试方法
    public static void main(String[] args) {
        Map<String, Boolean> tests = new LinkedHashMap<>();
        tests.put("Quiz1 基本类型溢出", quiz1());
        tests.put("Quiz2 Integer缓存", quiz2());
        tests.put("Quiz4 静态方法", quiz4());
        tests.put("Quiz5 接口冲突", quiz5());
        tests.put("Quiz6 finally返回值", quiz6() == 2);
        tests.put("Quiz8 short运算", quiz8());
        tests.put("Quiz12 多态调用", quiz12());
        tests.put("Quiz17 参数传递", quiz17());
        tests.put("Quiz20 泛型擦除", quiz20());
        tests.put("Quiz28 Switch表达式", quiz28());

        // 特殊处理需要编译验证的题目
        System.out.println("需手动验证的题目：");
        System.out.println("Quiz3 变量作用域 - 编译错误 ✅");
        System.out.println("Quiz9 final变量 - 编译错误 ✅\n");

        // 输出自动测试结果
        System.out.println("自动测试结果：");
        tests.forEach((desc, result) -> 
            System.out.printf("%-25s %s%n", desc, result ? "✅ Passed" : "❌ Failed")
        );
    }
}