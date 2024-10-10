---
title: 动态内存与智能指针
date: 2024-07-24
---

# 前言

C++程序有三种内存：

- 静态内存
- 栈内存
- 动态内存（堆内存）

其中，堆内存的管理有直接内存管理和智能指针两种方式。

# 直接内存管理

C++定义了两个运算符来分别和释放动态内存：new和delete。

- 不能依赖类对象拷贝、赋值和销毁操作的任何默认定义。
- 容易出错。

## new

```cpp
int *pi1 = new int;			// 默认初始化
int *pi2 = new int();			// 值初始化
int *pi3 = new int(999);	 	// 直接初始化

auto *pi4 = new auto(obj);		// auto
const int *pi5 = new const int(999);	//const

int *pi6 = new (nothrow) int(999);	// 默认情况下，new失败抛出std::bad_alloc
    								// 加入 nothrow 改为返回空指针

int* pi7 = new int[10]; 	// 初始化指针数组
 
```

## delete

```cpp
// 删除之前判断指针是否为空
if (pi1 != nullptr) {
	delete pi1;		// 要 delete 的必须是非悬空指针（指向已经被释放的内存或无效地址）
    pi1 = nullptr; 	// 防止悬空指针
}

if (pi5 != nullptr) {
	delete pi5; 	// const 对象的值不能被改变，但是对象可以被销毁
    pi5 = nullptr; 	// 同样避免悬空指针
}

if (pi7 != nullptr) {
	delete[] pi7; 	// 释放动态数组内存
    pi7 = nullptr; 	// 同样避免悬空指针
}

```

## 容易出错

1.忘记delete内存。new 出的内存在delete之前会一直存在。如果在一个作用域忘记delete内，会导致这块内存无法被delete掉。所以需要①delete不用的内存，或者②返回这块内存指针防止内存泄漏；

2.使用已经释放的内存。delete后设置指针为空，避免悬空指针。

3.同一块内存释放两次。

# 智能指针

智能指针用来自动控制内存的创建与销毁，包括shared_ptr、unique_ptr和weak_ptr。

智能指针使用相同的头文件引入`#include <memory>`

## shared_ptr类

共享所有权智能指针，可以多个指针共同拥有同一个对象。当最后一个 `shared_ptr` 被销毁时，所指向的对象才会被销毁。

```
shared_ptr<string> p1 = make_shared<string>(10, 9);
```

`shared_ptr` 主要通过两个数据结构实现共享所有权和资源管理：

- **资源指针（Resource Pointer）**：指向实际管理的资源，即堆上分配的对象。
- **控制块（Control Block）**：包含管理共享资源的元数据，包括引用计数、弱引用计数、以及用于资源管理的额外信息。
  - **引用计数（Reference Count）**：记录当前有多少个 `shared_ptr` 指向该资源。
  - **弱引用计数（Weak Reference Count）**：记录当前有多少个 `weak_ptr`（弱引用） 指向该资源。弱引用不增加引用计数，但可以检测资源是否还存在。
  - **资源指针（Resource Pointer）**：指向实际的资源。

当你创建一个 `shared_ptr` 时，它会分配一个控制块，并初始化引用计数为 1。

当你复制一个 `shared_ptr` 时，新的 `shared_ptr` 会共享相同的控制块，并将引用计数增加 1。

当一个 `shared_ptr` 被销毁时，它会将引用计数减 1。如果引用计数变为 0，表示没有 `shared_ptr` 再指向该资源，控制块会删除资源并释放内存。

## unique_ptr类

`unique_ptr` 与 `shared_ptr`  都是 C++11 引入的智能指针。`unique_ptr `旨在提供独占所有权语义，确保一个资源只能由一个 `unique_ptr` 管理。由于这个特性，`unique_ptr` 没有引用计数，因此更加轻量。

```cpp
std::unique_ptr<int> p1(new int(10));  // C++11
std::unique_ptr<int> p1 = std::make_unique<int>(10);  //C++14

std::unique_ptr<int> p2 = p1;  // 错误，不允许复制
std::unique_ptr<int> p2 = std::move(p1);  // p1 的所有权转移给 p2
// 当 p2 离开作用域时，资源自动释放
```

在C++11中，还仅支持`make_shared`，在C++17中才引入`make_unique`。更推荐通过make_xx的方式创建智能指针。这种方式是原子方式，避免new到返回的过程中出现异常而造成内存泄漏。

## weak_ptr类

是一种不控制所指向对象生存期的智能指针，指向一个shared_ptr管理的对象，用于解决 `std::shared_ptr` 所带来的循环引用（循环依赖）问题。

# 调用自己

头文件<memory>中还有一个模板类enable_shared_from_this。

当类A被share_ptr管理，且在类A的成员函数里需要把当前类对象作为参数传给其他函数时，就需要传递一个指向自身的share_ptr。

```CPP
#include <memory>
#include <iostream>
 
struct Good : std::enable_shared_from_this<Good> // 注意：继承
{
public:
	std::shared_ptr<Good> getptr() {
		return shared_from_this();
	}
	~Good() { std::cout << "Good::~Good() called" << std::endl; }
};
 
int main()
{
	// 大括号用于限制作用域，这样智能指针就能在system("pause")之前析构
	{
		std::shared_ptr<Good> gp1(new Good());
		std::shared_ptr<Good> gp2 = gp1->getptr();
		// 打印gp1和gp2的引用计数
		std::cout << "gp1.use_count() = " << gp1.use_count() << std::endl;
		std::cout << "gp2.use_count() = " << gp2.use_count() << std::endl;
	}
	system("pause");
} 
```

