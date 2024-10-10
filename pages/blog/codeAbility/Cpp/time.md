---
title: 时间函数
date: 2024-07-17
---

# 前言

`<chrono>` 是C++11引入的时间库，提供了一组类型和函数来表示和操作时间。它包含三种主要的时间概念：时钟、时间点和持续时间。以下是对 `<chrono>` 的全面介绍，包括如何使用它来处理时间和计时。

### 1. 时钟 (Clocks)

时钟代表系统中的时间来源。`<chrono>` 提供了三种主要时钟：

- `std::chrono::system_clock`: 代表系统范围内的真实时间，一般用于获取当前时间点。
- `std::chrono::steady_clock`: 单调时钟，不会回拨，适用于测量时间间隔。
- `std::chrono::high_resolution_clock`: 高分辨率时钟，通常是上述两个时钟之一的别名，具体依赖于实现。

### 2. 时间点 (Time Points)

时间点表示特定的时刻。时间点与某个时钟关联，可以用来表示特定时间。

### 3. 持续时间 (Durations)

持续时间表示两个时间点之间的时间长度。它可以表示为不同的时间单位，如秒、毫秒、纳秒等。

# 基本使用

#### 1. 获取当前时间

```cpp
#include <iostream>
#include <chrono>

int main() {
    std::chrono::system_clock::time_point now = std::chrono::system_clock::now();
    
    std::time_t now_time = std::chrono::system_clock::to_time_t(now);				// 标准时间
    
    std::chrono::time_point<std::chrono::system_clock, std::chrono::milliseconds> now_ms = 
        std::chrono::time_point_cast<std::chrono::milliseconds>(now);				// 毫秒时间点
    
    std::cout << "Current time: " << std::ctime(&now_time) << std::endl;			// Current time: Wed Jul 17 06:55:50 2024
    std::cout << "Current ms time: " << now_ms.time_since_epoch().count() << std::endl;		// Current ms time: 1721199350478
    return 0;
}
```

为了简洁，如果不做函数参数，可以用auto，本文后续代码为了简洁，都将使用auto：

```cpp
auto now = std::chrono::system_clock::now();
auto now_time = std::chrono::system_clock::to_time_t(now);
auto now_ms = std::chrono::time_point_cast<std::chrono::milliseconds>(now);
```

复习完模板后，对原理进行研究。

#### 2. 计算时间差

```cpp
#include <iostream>
#include <chrono>
#include <thread>

int main() {
    // steady_clock 不受系统时间调整的影响，system_clock 可能会因为系统时间的调整而导致测量不准确
    auto start = std::chrono::steady_clock::now();

    // 模拟一个耗时操作
    std::this_thread::sleep_for(std::chrono::seconds(2));

    auto end = std::chrono::steady_clock::now();
    auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(end - start);

    std::cout << "Elapsed time: " << duration.count() << " milliseconds" << std::endl;
    return 0;
}
```

- `std::chrono::time_point_cast` 用于时间点
- `std::chrono::duration_cast` 用于时间差

#### 3. 持续时间转换

```cpp
#include <iostream>
#include <chrono>

int main() {
    std::chrono::seconds sec(1);          // 1秒
    std::chrono::milliseconds ms = sec;   // 转换为毫秒
    std::chrono::microseconds us = sec;   // 转换为微秒

    std::cout << sec.count() << " seconds is equivalent to " << ms.count() << " milliseconds or " << us.count() << " microseconds." << std::endl;
    return 0;
}
```

#### 4. 时间点操作

```cpp
#include <iostream>
#include <chrono>

int main() {
    auto now = std::chrono::system_clock::now();
    auto future = now + std::chrono::hours(1); // 当前时间加1小时

    std::time_t future_time = std::chrono::system_clock::to_time_t(future);
    std::cout << "Future time: " << std::ctime(&future_time) << std::endl;

    return 0;
}
```
