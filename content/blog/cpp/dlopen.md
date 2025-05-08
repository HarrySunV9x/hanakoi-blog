---
title: 外部链接库
date: 2025-05-08
---

# 前言

在开发时，我们要善用他人的智慧，引用各种库提高开发效率。

实现这种引用的主要方式有两种：静态链接和动态链接。

1. **静态链接**：在编译链接时，静态库的代码就会被引入，体现在代码里就是我们可以在代码中直接引入头文件，然后调用库提供的接口。
2. **动态链接**：不通过头文件引入，实现代码层面的解耦，通过`dlopen`系列函数（Linux）在程序运行时按需加载动态库并获取其接口。

# 静态链接

通常会有一个地方专门用于存储各种静态链接库，比如Linux的静态链接文件**.a**通常在/usr/lib目录，而Windows的静态链接文件.lib通常在编译器的lib目录里，如C:\mingw64\lib或者vscode指定的lib目录。

这样，在编译时可以通过-l参数引入目录里的静态文件。

如LearnOpenGL教学里的GLFW，其获取的lib文件是**glfw3.lib**，那我们就在编译时加上-lglfw3参数来进行链接。

当然，也可以在CMake中添加或者用任何你喜欢的编译方式，最终，我们可以通过引用头文件\#include <GLFW\glfw3.h>来使用这个库。

# 动态链接

动态链接不引入头文件，而是在需要使用的地方，通过系统函数(如Linux中是dlopen)获取动态链接库的句柄，并调用其中的方法。

我们看示例代码（代码来源于OpenHarmony仓[GpuCounter](https://gitee.com/openharmony/developtools_profiler/blob/master/host/smartperf/client/client_command/GpuCounter.cpp)的实现）：

```cpp
        class GameServicePlugin {
        public:
            uint32_t version;
            const char *pluginName;

            virtual int32_t StartGetGpuPerfInfo(int64_t duration, std::unique_ptr <GpuCounterCallback> callback) = 0;
            virtual int32_t StopGetGpuPerfInfo() = 0;
        };

class GameEventCallback {
    public:
    GameEventCallback() = default;
    virtual ~GameEventCallback() = default;
    virtual void OnGameEvent(int32_t type, std::map<std::string, std::string> &params) = 0;
};

class GameEventCallbackImpl  : public GameEventCallback {
    public:
    GameEventCallbackImpl() {};
    void OnGameEvent(int32_t type, std::map<std::string, std::string> &params) override;
};

```

这里，我们在A程序定义了一个虚类GameServicePlugin和一个虚类GameEventCallback，其中GameServicePlugin由B实现（这里B必须要通过头文件引用到A，即静态链接），其中有一个参数是GpuCounterCallback由A实现(GameEventCallbackImpl)。

这里的机制是：
A定义借口I，B注册A的接口I，A实现这个借口并注册到B，当B调用I的方法时候，就会调用到A的实现。

简单说，我们定义并实现了OnGameEvent，而调用则交给B，我们需要把声明好的变量传给B。

我们假设B有一个结构体：

```cpp
#ifdef __cplusplus
extern "C" {
#endif
GameServicePlugin *CreatePlugin();
#ifdef __cplusplus
}
#endif
```

这样子，可以通过dlopen调用：

```cpp
pluginHandle[type] = dlopen(soFilePathChar, RTLD_LAZY);
           typedef GameServicePlugin *(*GetServicePlugin)();
            GetServicePlugin servicePlugin = (GetServicePlugin)dlsym(handle, createPlugin.c_str());
            if (!servicePlugin) {
                WLOGE("GameServicePlugin Error loading symbol");
                return;
            }

           
            servicePlugin()->StartGetGpuPerfInfo(duration, std::move(gpuCounterCallback));
```

