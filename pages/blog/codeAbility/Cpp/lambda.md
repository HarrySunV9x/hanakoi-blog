---
title: lambda与this的组合使用
date: 2024-10-14
---

# 前言

近日开发中遇到了一个多线程编程的问题：如何启用单例中的多线程函数？

在普通的thread使用中会出错，需要lambda与this结合使用才可以正常运行，本文将详细介绍这个场景。

# 多线程的正常使用

首先，给出多线程正常使用方法：

```cpp
void func() {
    ...
}

std::thread t1;
t1 = std::thread(func);
t1.join();
```

# 初始代码的问题

如果我们想要调用某个对象里的方法来启用多线程：

```cpp
t1 = std::thread(objectA.func);
```

假设 `func` 是一个单例或某个类的成员变量，这样直接传递成员函数给 `std::thread` 的方式是不行的。

