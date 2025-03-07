---
title: 多线程编程
date: 2024-01-04
---

# 前言

**多线程编程**是使程序能够同时执行多个任务的技术，是提高应用程序效率和性能的重要手段。**线程**是操作系统中能够进行运算调度的最小单位，通常包含在进程中。一个进程可以包含多个线程，每个线程在执行时都有自己的独立上下文，包括程序计数器、寄存器集合和栈。

**多线程**是指在单个程序中同时运行多个线程，每个线程执行不同的任务。这些线程可以共享进程资源，从而提高线程间的通信效率。然而，多线程编程也存在潜在的风险，如**数据竞争**和**死锁**。实际应用中应合理使用锁，避免多线程编程造成的风险。

多线程既可以并行处理（多个任务同时进行），也可以并发处理（多个任务交替进行）。在切换线程时，操作系统会保存当前线程的状态并恢复另一个线程的状态。

在多核处理器上，多线程技术能显著提高程序的运行效率。譬如，在数据处理时，将数据分割并由不同核心并行处理能大幅缩短计算时间。这在计算芯片上得以体现，2023年发售的M3芯片的Macbook，尽管其制造工艺的进步到3nm，但单核性能实际并未显著提升，老库克通过对核玩法（达到16+40核心），硬是将M3 Pro Max芯片在性能上接近于Intel的13900K。当然，这个价格……你懂的。

另外，在图形界面应用中，多线程对于保持界面响应性和后台任务的同时执行至关重要。例如，在Unity应用中，无论是在安卓平台还是OpenHarmony平台上，均设有两个主要线程：`Main`（负责逻辑处理）和`GFXDevice`（负责渲染）。这种设计确保了这两个线程能够独立运作，不会相互造成阻塞。

由于硬件限制，一个核的计算能力是有限的。随着计算机性能的不断提高，单核处理器的计算能力已经达到了一定瓶颈。为了提高计算机的整体性能，必须利用多核处理器的优势。当代计算机软件开发离不开多线程编程。

# 使用

以C++为例，C++11标准库引入了`<thread>`库，以支持多线程编程。

**简单示例**

```C++
#include <iostream>
#include <thread>

// 定义一个简单的函数，线程将执行这个函数
void threadFunction() {
    std::cout << "Hello, Thread!" << std::endl;
}

int main() {
    // 创建一个线程并执行上面定义的函数
    std::thread t(threadFunction);

    // 在主线程中继续执行
    std::cout << "Hello, Main!" << std::endl;

    // 等待线程完成任务
    t.join();

    return 0;
}
```

在这个示例中，我们创建了一个线程`t`，用于执行名为`threadFunction`的函数。与此同时，程序的主线程继续执行并打印消息。通过`t.join()`，我们确保主线程会等待线程`t`完成其任务。

**基本操作**：

1. **线程启动**: 使用`std::thread`构造函数来创建新线程，与之关联的线程函数就开始执行。
2. **等待线程**: 使用`join()`方法，阻塞调用它的线程，直到与 `std::thread` 对象关联的线程完成执行。
3. **分离线程**: 使用`detach()`方法可以分离线程在后台运行。一旦线程被分离，你不能再与它同步，它将独立运行直到任务完成。

# 风险

#### **数据竞争**

上面的例子只创建了一个线程并实现了一个简单的示例，但是在多线程编程中，有可能发生这种情况：当两个或更多线程同时访问同一个数据，并且至少有一个线程在修改这个数据时，就会发生数据竞争。

我们假设正在玩超级马里奥，超级马里奥有一个金币的数据。我们假设有一个线程，负责马里奥吃到的时候增加一个金币。又有另一个线程，负责马里奥死亡的时候扣除一个金币。那么当马里奥总共吃到1000个金币，同时总共死过1000次后，马里奥身上的金币应该为0（这边假设金币可以为负数）。

```C++
#include <iostream>
#include <thread>

int marioCoins = 0; // 马里奥的金币数量

// 吃到金币啦：增加金币
void collectCoins() {
    for (int i = 0; i < 1000; ++i) {
        marioCoins++; // 玛丽捡到一个金币，增加金币数量
    }
}

// 死掉了：减少金币
void spendCoins() {
    for (int i = 0; i < 1000; ++i) {
        marioCoins--; // 玛丽使用一个金币，减少金币数量
    }
}

int main() {
    std::thread collectorThread(collectCoins); // 创建线程，执行马里奥吃到了金币的函数
    std::thread spenderThread(spendCoins); // 创建另一个线程，执行马里奥死掉时候扣除一个金币的函数

    // 等待线程结束
    collectorThread.join(); 
    spenderThread.join();

    std::cout << "Mario's total coins: " << marioCoins << std::endl; // 看看马里奥还有多少金币

    return 0;
}
```

此时执行得到结果：

```markdown
Mario's total coins: 0
```

看着没什么问题，但是如果我们把次数从1000增加到100000：

```c++
...
// 吃到金币啦：增加金币
void collectCoins() {
    for (int i = 0; i < 100000; ++i) {
        marioCoins++; // 玛丽捡到一个金币，增加金币数量
    }
}

// 死掉了：减少金币
void spendCoins() {
    for (int i = 0; i < 100000; ++i) {
        marioCoins--; // 玛丽使用一个金币，减少金币数量
    }
}
...
```

再看看结果：

```
Mario's total coins: 91136
```

多执行几次：

```
Mario's total coins: -44504
Mario's total coins: 1793
Mario's total coins: -5104
```

这下出现问题了，随着循环次数增加，数据竞争的概率也随之增大，出现了预期意外的结果。

可以使用同步机制，如互斥锁（`std::mutex`），来确保每次只有一个线程可以访问`marioCoins`。这将避免数据竞争，并确保最终结果是正确的。

```c++
...
std::mutex coinMutex; // 用于保护marioCoins的互斥锁

void collectCoins() {
    for (int i = 0; i < 100000; ++i) {
        std::lock_guard<std::mutex> lock(coinMutex);
        marioCoins++; // 在互斥锁保护下增加金币数量
    }
}

void spendCoins() {
    for (int i = 0; i < 100000; ++i) {
        std::lock_guard<std::mutex> lock(coinMutex);
        marioCoins--; // 在互斥锁保护下减少金币数量
    }
}

...
```

再次查看结果：

```
Mario's total coins: 0
```

OK，问题得到解决（如果线程模式使用的是detach，要等待一段实际确保线程执行完，再查看结果）。

#### 迭代器失效

**迭代器**

迭代器是一个对象，它能够遍历一个容器（特别是STL容器）的元素。迭代器的行为类似于指针：它指向容器中的特定元素，并提供了访问该元素的方法。迭代器有多种类型，常见的包括输入迭代器、输出迭代器、前向迭代器、双向迭代器和随机访问迭代器。这些类型根据它们支持的操作（如读取、写入、前后移动等）而有所不同。

在C++中，迭代器通常通过STL容器的方法如 `begin()` 和 `end()` 获得。`begin()` 返回指向容器第一个元素的迭代器，而 `end()` 返回指向容器尾部的迭代器（即最后一个元素的下一个位置）。

示例：通过迭代器遍历vector。

```c++
#include <iostream>
#include <vector>

int main() {
    std::vector<int> vec = {1, 2, 3, 4, 5};

    // 使用迭代器遍历vector
    for (auto it = vec.begin(); it != vec.end(); ++it) {
        std::cout << *it << " ";
    }
    std::cout << std::endl;

    return 0;
}
```

示例：通过迭代器判断是否存在某个元素

```c++
//vector
if (std::find(myVector.begin(), myVector.end(), valueToFind) != myVector.end()) {} 

//set
if (nums_set.find(num) == nums_set.end()){}
```

**迭代器失效**

在某些操作后，如删除或插入元素，迭代器可能会失效。失效的迭代器指向未定义的内存区域，继续使用它将导致未定义的行为。

还是以马里奥捡金币举例，我们假设金币是一个对象，通过类Coin进程创建，我们有两种类型的金币，现在马里奥获得了大奖，每种类型的金币会给他一百个，但是库霸王不开心了，拿走了其中的偶数个：

```c++
#include <iostream>
#include <vector>
#include <thread>

struct Coin {
    int x; // 假设 x 代表金币的位置
    char category; // 金币的类别
};

std::vector<Coin> globalVector;

void collectAndRemoveCoins(char category) {
    // 马里奥获得了大奖，得到一百个金币
    for (int i = 0; i < 100; ++i) {
        globalVector.push_back({i, category});
        std::this_thread::sleep_for(std::chrono::microseconds(10)); // 拿钱需要一点时间
    }

    // 库霸王生气了，夺走所有的偶数位金币
    for (auto it = globalVector.begin(); it != globalVector.end();) {
        if (it->x % 2 == 0) {
            it = globalVector.erase(it); // 移除金币
            std::this_thread::sleep_for(std::chrono::microseconds(10)); // 抢钱也需要一点时间
        } else {
            ++it;
        }
    }
}

int main() {
    std::thread workerA([]{ collectAndRemoveCoins('A'); });
    std::thread workerB([]{ collectAndRemoveCoins('B'); });

    workerA.join();
    workerB.join();

    // 打印剩余的金币位置
    for (const auto& coin : globalVector) {
        std::cout << coin.x << " ";
    }
    std::cout << std::endl;
    
    return 0;
}
```

输出：

```
1 1 3 3 5 5 7 7 9 9 11 11 13 13 15 15 17 17 19 19 21 21 23 23 25 25 27 27 29 29 31 31 33 33 35 35 37 37 39 39 41 41 43 43 45 45 47 47 49 49 51 51 53 53 55 55 57 57 59 59 61 61 63 63 65 65 67 67 69 69 71 71 73 73 75 75 77 77 79 79 81 81 83 83 85 85 87 87 89 89 91 91 93 93 95 95 97 97 99 99 
```

由于程序比较简单，金币被规则的存在了数组里。

那么假设，我们有四类金币呢？是否还会规律的放进马里奥的口袋里呢？

```c++
	...
	std::thread workerA([]{ collectAndRemoveCoins('A'); });
    std::thread workerB([]{ collectAndRemoveCoins('B'); });
    std::thread workerC([]{ collectAndRemoveCoins('C'); });
    std::thread workerD([]{ collectAndRemoveCoins('D'); });

    workerA.join();
    workerB.join();
    workerC.join();
    workerD.join();
    ...
```

很不幸，报错了：

```
*** Error in `./a.out': double free or corruption (fasttop): 0x00007f0ec80008c0 ***
*** Error in `./a.out': double free or corruption (fasttop): 0x00007f0ec80008c0 ***
*** Error in `./a.out': double free or corruption (fasttop): 0x00007f0ec80008c0 ***
```

这是由于，当线程多起来，程序变得更加复杂，这相当于马里奥四只手在往口袋里塞金币，库霸王四个手在抢金币，这就导致可能会出现库霸王盯着一个金币，结果被另一只手抢先抓走了，这在程序里就是空指针问题，会导致程序崩溃。

为了解决这个问题，我们可以将四种金币放进四个线程对应的口袋里，以解决迭代器失效的问题：

```c++
...
thread_local std::vector<Coin> globalVector;
...
    
void collectAndRemoveCoins(char category) {
    ...
        
    // 打印剩余的金币位置，将main函数里的打印移动到这里，标记口袋
    std::cout << "Remaining coins of category " << category << " at positions: ";
    for (const auto& coin : globalVector) {
        std::cout << coin.x << " ";
    }
    std::cout << std::endl;
}
...
```

输出：

```
Remaining coins of category B at positions: 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39 41 43 45 47 49 51 53 55 57 59 61 63 65 67 69 71 73 75 77 79 81 83 85 87 89 91 93 95 97 99 
Remaining coins of category C at positions: 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39 41 43 45 47 49 51 53 55 57 59 61 63 65 67 69 71 73 75 77 79 81 83 85 87 89 91 93 95 97 99 
Remaining coins of category D at positions: 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39 41 43 45 47 49 51 53 55 57 59 61 63 65 67 69 71 73 75 77 79 81 83 85 87 89 91 93 95 97 99 
Remaining coins of category A at positions: 1 3 5 7 9 11 13 15 17 19 21 23 25 27 29 31 33 35 37 39 41 43 45 47 49 51 53 55 57 59 61 63 65 67 69 71 73 75 77 79 81 83 85 87 89 91 93 95 97 99 
```

尽管顺序有些不同，但没有什么影响，金币被正确的放到了口袋里。

PS：thread_local在mingw使用似乎有Bug，通过互联网检索在线C++11编译器可正常运行。
