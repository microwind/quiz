class Quiz {
  public Quiz() {

  }

  static void assign() {
    int a = 1;
    int b = 2;
    b = a;
    a = 3;
    // 变量本身是一个空间，指向了值。值存于栈中，对象存于堆。
    // a赋值为1，b赋值为2，b被重新赋值a的值，也就是1。
    System.out.println(a + " " + b);
  }

  static void numberCovert(Integer n) {
    double num = 3.141592653589793238462;
    if (n > num) {
      System.out.println(n + ">" + num);
    } else {
      System.out.println(n + "<" + num);
    }
  }

  public static void main(String[] args) {
    numberCovert(1);
    assign();
  }
}