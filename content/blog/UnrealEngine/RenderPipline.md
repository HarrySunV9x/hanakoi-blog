---
title: 渲染流程
date: 2025-01-22
---

# 基础概念

**UWorld**：代表了一个游戏世界，可以加载和卸载多个关卡（Level）。

**ULevel**：游戏世界中的一个具体关卡。

**USceneComponent**：场景组件，是所有可以被加入到场景的物体的父类，比如灯光、模型、雾等。

**UPrimitiveComponent**：图元组件，是所有**可渲染或拥有物理模拟的物体**父类。是CPU层裁剪的最小粒度单位，比如UCameraComponent可以加入到场景但不会被渲染，不属于图元。

**ULightComponent**：光源组件，是所有光源类型的父类。

**FScene**：是UWorld在渲染模块的代表。只有加入到FScene的物体才会被渲染器感知到。渲染线程拥有FScene的所有状态（游戏线程不可直接修改）。

**FPrimitiveSceneProxy**：图元场景代理，是UPrimitiveComponent在渲染器的代表，镜像了UPrimitiveComponent在渲染线程的状态，用于告知渲染器如何渲染该组件，例如使用的材质、渲染设置、是否启用某些渲染效果（如阴影、透明度等）。

**FPrimitiveSceneInfo**：渲染器内部状态，表示一个 **UPrimitiveComponent** 在渲染模块中的详细信息。它不仅仅包括渲染设置，还包含具体的渲染数据，如几何信息（顶点、索引、网格数据等），并且用于物体渲染时的实际操作。

**FSceneView**：描述了FScene内的单个视图（view），一个 **FScene** 可以有多个 **FSceneView**，*每个视图对应一个摄像机的视角。每一帧都会创建新的view实例。*

**FViewInfo**：view在渲染器的内部代表，只存在渲染器模块，引擎模块不可见。

**FSceneViewState**：存储与视图相关的渲染器私有信息，这些信息在多个帧之间保持一致。它跨帧存储渲染器的状态，例如摄像机位置、视锥体等。在Game实例，每个ULocalPlayer拥有一个FSceneViewState实例。

**FSceneRenderer**：每帧都会被创建的对象，封装了帧间的临时数据和渲染过程。它是渲染流程的核心。下派生FDeferredShadingSceneRenderer（延迟着色场景渲染器）和FMobileSceneRenderer（移动端场景渲染器），分别代表PC和移动端的默认渲染器。

# 引擎的编译和安装

引擎不能通过Epic商城下载， 否则只能看到源码，但是无法编译

```sh
git clone --branch=release --depth=1 https://github.com/EpicGames/UnrealEngine.git
cd .\UnrealEngine\
.\Setup.bat
GenerateProjectFiles.bat
通过Rider打开Default.uprojectdirs即可（前提要有VS编译环境）: UE官网教程
```

# 渲染机制

## 多线程渲染

游戏引擎是庞大的，具有多个复杂的功能：核心系统、物理、动画、AI、音频、网络、Gameplay框架、编辑器工具链和跨平台支持等。在传统单线程渲染中，渲染任务通常与其他游戏逻辑运行在同一个线程上，这种方式虽然结构简单，但容易因为渲染任务的复杂性（如大量的顶点处理、纹理加载、光照计算等）导致帧率下降，甚至阻塞其他系统的正常运行。为了提高性能，现代游戏引擎通常将渲染功能独立到一个或多个线程中。

UE5中，渲染的大体流程如图：

![image-20250124104600371](.\RenderThread.png)

**Game Thread**：生成渲染所需的**基础数据**。如物体变换信息、材质参数、光源属性。

> 在非渲染部分，游戏线程还负责处理游戏逻辑的逐帧更新（如角色行为、动画状态机、用户输入响应、游戏事件触发等）

**Rendering Thread**：接收并处理 Game Thread 提供的渲染数据，执行 **可见性计算**（视锥体裁剪、遮挡剔除），生成渲染指令（绘制调用、着色器参数绑定、资源状态转换），管理渲染管线（后处理效果、Lumen/Nanite 等高级特性），负责渲染资源的异步加载与流送（Texture Streaming、Mesh LOD）。

**RHI Thread**：提供跨平台的硬件抽象层，将 Rendering Thread 的绘制命令封装为底层图形 API（如 OpenGL、DirectX、Vulkan、Metal）的调用，提交最终的绘制指令给 GPU 执行。

## 并行渲染

在线程内部的实现机制上，也采用了并行渲染的方式：
![image-20250124110523254](.\ParallelRendering.png)

TODO..

# 多线程初始化

C++的函数入口都是Main() 函数入口，UE5也是一样，以Windows为例：

Engine/Source/Runtime/Launch/Private/Windows/LaunchWindows.cpp

```cpp
int32 WINAPI WinMain(_In_ HINSTANCE hInInstance, _In_opt_ HINSTANCE hPrevInstance, _In_ char* pCmdLine, _In_ int32 nCmdShow)
{
	int32 Result = LaunchWindowsStartup(hInInstance, hPrevInstance, pCmdLine, nCmdShow, nullptr);
	LaunchWindowsShutdown();
	return Result;
}
```

Main会一路调用到FEngineLoop::PreInit。

![image-20250124164039433](.\EnginePreInit.png)

从FEngineLoop::PreInit开始初始化的流程：

