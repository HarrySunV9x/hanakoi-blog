---
title: 设计模式——单例模式
date: 2024-07-17
---

# 前言

对象是类的实例，通常情况下，一个类可以创建多个对象实例。但是有些情况下，一个类，我们希望他的对象是唯一的。

一个典型的例子是日志记录。

在一个应用中，如果有一个专门记录日志的类，那我们肯定希望一个程序只有一个记录日志的示例，而不需要多份。

# 示例

```cpp
#include <iostream>
#include <fstream>
#include <mutex>
#include <string>

class Logger {
public:
    // 要点：声明一个公有静态方法用于获取单例实例
    static Logger& getInstance() {
        static std::mutex mutex_; // 局部静态变量，避免不必要的全局静态变量
        std::lock_guard<std::mutex> guard(mutex_);
        // 要点：初始化唯一变量，通过static实现，简单且内存安全，但缺少"延迟初始化"特性。
        static Logger instance;
        return instance;
    }

    // 要点：删除拷贝构造函数和赋值操作符，防止拷贝实例
    // 我还没找到反例需要这个……
    Logger(const Logger&) = delete;
    Logger& operator=(const Logger&) = delete;

    // 写日志的方法
    void log(const std::string& message) {
        std::lock_guard<std::mutex> guard(mutex_);
        if (logfile.is_open()) {
            logfile << message << std::endl;
        } else {
            std::cerr << "Log file is not open" << std::endl;
        }
    }

private:
    // 要点：私有构造函数，防止实例化
    Logger() {
        logfile.open("log.txt", std::ios::out | std::ios::app);
        if (!logfile.is_open()) {
            std::cerr << "Failed to open log file" << std::endl;
        }
    }

    ~Logger() {
        if (logfile.is_open()) {
            logfile.close();
        }
    }
    
    std::ofstream logfile;
    std::mutex mutex_; // 成员变量，保护logfile的访问
};

int main() {
    // 要点：选择单例时，从构造函数替换为2.静态方法
    Logger& logger = Logger::getInstance();
    logger.log("This is a log message.");
    logger.log("Logging another message.");

    return 0;
}

```

#  实现方式

1. 在类中添加一个私有静态成员变量用于保存单例实例，在本例中，通过公共调用static的方式实现了私有化：`static Logger instance;`

2. 声明一个公有静态构建方法用于获取单例实例：`static Logger& getInstance()`

3. 在静态方法中实现"延迟初始化"。（可选特性）此后该方法每次被调用时都返回该实例。在本例中，无延迟初始化特性。

   可以配合1.通过私有变量来实现延迟化特性。缺点是多线程危险与内存管理：

   ```cpp
   public:
   Singleton *Singleton::GetInstance(const std::string& value)
   {
   	if(singleton_==nullptr){
           singleton_ = new Singleton(value);
       }
       return singleton_;
   }
   ...
   private:
   static Singleton* singleton_;
   ```
   
4. 将类的构造函数设为私有。 类的静态方法仍能调用构造函数， 但是其他对象不能调用。

5. 检查调用代码， 选择单例时，从构造函数替换为2.静态方法。