---
title: 锁的使用
date: 2024-07-17
tag: cpp
---

# 前言

C++中的锁（Locks）是用于控制多线程程序中对共享资源的访问，避免数据竞争和保证线程安全。以下是一些常见的锁类型及其使用场景：

# 互斥锁

## 基本互斥锁：`std::mutex`
`std::mutex` 是最基本的互斥锁。它保证在同一时刻只有一个线程可以锁定它，从而保护临界区。

**使用场景：**
适用于简单的临界区保护。例如，在一个多线程程序中对一个共享变量进行操作时，可以使用 `std::mutex` 来保证线程安全。

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex mtx;
int shared_data = 0;

void autoLock() {
    // 通过 RAII 实现自动锁
    std::lock_guard<std::mutex> lock(mtx);
    ++shared_data;
}

void manualLock() {
    // 手动开关锁
    mtx.lock();
    ++shared_data;
    mtx.unlock();
}

int main() {
    std::thread t1(autoLock);
    std::thread t2(manualLock);

    t1.join();
    t2.join();

    std::cout << "Shared Data: " << shared_data << std::endl;
    return 0;
}
```

## 有限等待互斥锁： `std::timed_mutex`
`std::timed_mutex` 是 `std::mutex` 的变体，它允许线程在一定时间内尝试获取锁。

**使用场景：**
适用于需要尝试获取锁但不希望无限期等待的场景。例如，尝试访问一个资源，如果不能立即访问，可以执行其他操作。

```cpp
#include <iostream>
#include <thread>
#include <mutex>
#include <chrono>

std::timed_mutex tmtx;

void try_lock() {
    if (tmtx.try_lock_for(std::chrono::seconds(1))) {
        std::cout << "Lock acquired" << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(2));
        tmtx.unlock();
    } else {
        std::cout << "Failed to acquire lock" << std::endl;
    }
}

int main() {
    std::thread t1(try_lock);
    std::thread t2(try_lock);

    t1.join();
    t2.join();

    return 0;
}
```

## 递归互斥锁： `std::recursive_mutex`
`std::recursive_mutex` 允许同一线程多次锁定相同的互斥锁，并且需要相同次数的解锁操作才能真正解锁。

**使用场景：**
适用于递归函数中需要锁的场景。例如，在递归函数中保护共享资源。

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::recursive_mutex rmtx;

void recursive_function(int depth) {
    rmtx.lock();
    std::cout << "Depth: " << depth << std::endl;
    if (depth > 0) {
        recursive_function(depth - 1);
    }
    rmtx.unlock();
}

int main() {
    std::thread t(recursive_function, 3);
    t.join();

    return 0;
}
```

## 共享互斥锁：`std::shared_mutex`
`std::shared_mutex` 允许多个线程同时读取数据，但只有一个线程可以写数据。

**使用场景：**
适用于读多写少的场景。例如，多个线程读取数据而很少有线程写数据的场景。

```cpp
#include <iostream>
#include <thread>
#include <shared_mutex>
#include <vector>

std::shared_mutex smtx;
std::vector<int> data;

void reader() {
    std::shared_lock<std::shared_mutex> lock(smtx);
    for (const auto& elem : data) {
        std::cout << elem << " ";
    }
    std::cout << std::endl;
}

void writer(int value) {
    std::unique_lock<std::shared_mutex> lock(smtx);
    data.push_back(value);
}

int main() {
    std::thread t1(writer, 1);
    std::thread t2(writer, 2);
    std::thread t3(reader);
    std::thread t4(reader);

    t1.join();
    t2.join();
    t3.join();
    t4.join();

    return 0;
}
```

## 锁管理工具：`std::unique_lock`
`std::unique_lock` 提供更灵活的锁定机制，可以延迟锁定、提前解锁、重新锁定等。

**使用场景：**
适用于需要灵活控制锁定行为的场景。例如，锁定后可以解锁并在需要时重新锁定。

```cpp
#include <iostream>
#include <thread>
#include <mutex>

std::mutex mtx;
int shared_data = 0;

void flexible_lock() {
    std::unique_lock<std::mutex> lock(mtx, std::defer_lock);
    // Some other work
    lock.lock();
    ++shared_data;
    lock.unlock();
    // Some other work
}

int main() {
    std::thread t1(flexible_lock);
    std::thread t2(flexible_lock);

    t1.join();
    t2.join();

    std::cout << "Shared Data: " << shared_data << std::endl;
    return 0;
}
```

# 自旋锁

**自旋锁**是一种忙等待的锁，它在锁未被释放时会不断地循环检查锁的状态，直到锁变为可用。自旋锁在等待期间不会阻塞线程，因此适用于锁持有时间非常短的情况，可以减少上下文切换的开销。C++ 标准库中并没有提供自旋锁的直接实现，但你可以使用原子操作来实现自旋锁。常用的自旋锁库包括：

- **`std::atomic_flag`** 或 **`std::atomic`**（C++11及以后的标准库提供的工具）：可以用于实现自旋锁。
- **`std::spinlock`**（C++20标准中引入的 `std::spinlock`）：直接支持自旋锁的实现。

# 原子锁

**原子锁**是基于原子操作的同步机制，用于确保对共享资源的原子性访问。原子操作可以在不使用锁的情况下保证对某个变量的安全操作，通常用于实现更高效的锁或同步机制。C++ 标准库中的 `std::atomic` 模板提供了原子操作的支持。