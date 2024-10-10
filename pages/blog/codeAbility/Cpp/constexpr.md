---
title: constexpr的用法
date: 2024-08-19
---

# 前言

`constexpr` 是 C++11 引入的关键字，用于表示常量表达式。`constexpr`的效果与内联函数一样，它使得编译器能够在编译时计算值，从而提高程序的效率。`constexpr` 可以用于变量、函数、构造函数等。以下是 `constexpr` 的一些用法：

# `constexpr` 变量
`constexpr` 变量必须在编译时初始化，并且其值在程序运行期间不变。

```cpp
constexpr int max_value = 100;
```

# `constexpr` 函数
`constexpr` 函数能够在编译时计算出值。它们的函数体应该是简单的表达式，且只能包含 `return` 语句和一些简单的控制流语句（如 `if`、`while`）。

```cpp
constexpr int square(int x) {
    return x * x;
}
```

# `constexpr` 构造函数
`constexpr` 构造函数允许在编译时创建对象，这对于某些类型的对象非常有用。

```cpp
class Point {
public:
    constexpr Point(int x, int y) : x_(x), y_(y) {}
    constexpr int getX() const { return x_; }
    constexpr int getY() const { return y_; }
private:
    int x_, y_;
};
```

# `constexpr` 和 `const` 的区别
- `const` 表示常量，在运行时不能被修改，但它不一定在编译时求值。
- `constexpr` 表示在编译时能够计算的常量，通常也会是 `const` 的。

# 使用 `constexpr` 与模板
`constexpr` 可以与模板结合使用，来创建编译时计算的常量。

```cpp
template<int N>
constexpr int factorial() {
    return N * factorial<N - 1>();
}

template<>
constexpr int factorial<0>() {
    return 1;
}
```

**注意事项**

1. `constexpr` 函数必须在编译时可求值。如果函数体比较复杂，可能会导致编译器无法在编译时求值。
2. C++14 及以后的版本允许 `constexpr` 函数包含更多的控制流和局部变量，使得编写复杂的常量表达式更加灵活。

通过合理使用 `constexpr`，可以使得程序更加高效，减少运行时开销。