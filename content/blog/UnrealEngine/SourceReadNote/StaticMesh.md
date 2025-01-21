---
title: StaticMesh源码阅读笔记
data: 2024-10-21
---

# 前言

文件名：\UE_5.4\Engine\Source\Runtime\Engine\Classes\Engine\StaticMesh.h

# 阅读笔记

## 枚举：EStaticMeshAsyncProperties

```cpp
enum class EStaticMeshAsyncProperties : uint32
{
	None                    = 0,
	RenderData              = 1 << 0,
	//OccluderData            = 1 << 1,
	SourceModels            = 1 << 2,
	SectionInfoMap          = 1 << 3,
	OriginalSectionInfoMap  = 1 << 4,
	NavCollision            = 1 << 5,
	LightmapUVVersion       = 1 << 6,
	BodySetup               = 1 << 7,
	LightingGuid            = 1 << 8,
	ExtendedBounds          = 1 << 9,
	NegativeBoundsExtension = 1 << 10,
	PositiveBoundsExtension = 1 << 11,
	StaticMaterials         = 1 << 12,
	LightmapUVDensity       = 1 << 13,
	IsBuiltAtRuntime        = 1 << 14,
	MinLOD                  = 1 << 15,
	LightMapCoordinateIndex = 1 << 16,
	LightMapResolution      = 1 << 17,
	HiResSourceModel		= 1 << 18,
	UseLegacyTangentScaling = 1 << 19,

	All                     = MAX_uint32
};
```

定义静态网格 (`Static Mesh`) 在异步加载时的属性集合：

1. **`None`**：无任何属性。

   这是一个默认值，用于初始化或表示不加载任何属性。

2. **`RenderData = 1 << 0`**：是否加载渲染数据。

   渲染数据包括顶点、索引和其他 GPU 资源，决定了模型如何在场景中显示。

3. **`SourceModels = 1 << 2`**：加载源模型信息（例如 LOD）。

   源模型信息通常包括多个细节层次（LOD）的数据，以便根据距离和性能需求切换不同的细节。

4. **`SectionInfoMap = 1 << 3`**：加载模型的节目信息映射（Section Info Map）。

   每个静态网格通常会有多个部分（Section），这个映射定义了每个部分的材质和渲染设置。

5. **`OriginalSectionInfoMap = 1 << 4`**：加载原始的节目信息映射。

   可能用于恢复或调试模型在某个特定时间点的原始状态。

6. **`NavCollision = 1 << 5`**：加载用于导航系统的碰撞信息。

   导航碰撞数据通常用于生成导航网格，以便 AI 和玩家可以在游戏世界中移动。

7. **`LightmapUVVersion = 1 << 6`**：加载光照贴图 UV 版本信息。

   这个信息通常用于追踪 UV 坐标的版本，以便于计算和应用光照贴图。

8. **`BodySetup = 1 << 7`**：加载物理体设置（Body Setup）。

   `BodySetup` 包含物理模拟的相关数据，包括碰撞和刚体属性，用于实现模型的物理行为。

9. **`LightingGuid = 1 << 8`**：加载照明 GUID。

   这个 GUID 用于唯一标识光照信息，在光照计算和保存时很有用。

10. **`ExtendedBounds = 1 << 9`**：加载扩展边界信息。

    这些边界信息可能用于碰撞检测、裁剪或其他与模型尺寸和位置相关的操作。

11. **`NegativeBoundsExtension = 1 << 10`**：加载负边界扩展。

12. ​	这是一个模型边界的额外负偏移量，可能用于调整模型的物理或渲染范围。

13. **`PositiveBoundsExtension = 1 << 11`**：加载正边界扩展。

    这与负边界扩展相反，是模型边界的正向扩展，用于类似目的。

14. **`StaticMaterials = 1 << 12`**：加载静态材质信息。

    静态网格可能有多个材质槽（Material Slot），这个选项决定是否加载这些材质槽及其相关属性。

15. **`LightmapUVDensity = 1 << 13`**：加载光照贴图 UV 密度。

    这个信息用于计算光照贴图的分辨率和细节。

16. **`IsBuiltAtRuntime = 1 << 14`**：指示模型是否在运行时构建。

    如果为 `true`，说明模型的某些部分是在运行时生成的，可能需要特殊处理。

17. **`MinLOD = 1 << 15`**：加载最低 LOD（细节层次）的信息。

    通常用于确定在渲染时最低可以使用的细节层次，以优化性能。

18. **`LightMapCoordinateIndex = 1 << 16`**：加载光照贴图坐标索引。

    这个值指示哪一个 UV 通道用于光照贴图计算。

19. **`LightMapResolution = 1 << 17`**：加载光照贴图的分辨率。

    这个值决定了光照贴图的细节水平，影响模型的渲染质量。

20. **`HiResSourceModel = 1 << 18`**:加载高分辨率源模型信息。

    这个选项可能用于在编辑器中使用更高分辨率的模型数据。

21. **`UseLegacyTangentScaling = 1 << 19`**是否使用旧版的切线缩放方法。

    这个选项可能用于保持向后兼容性，以确保旧版本的模型在新引擎中正确渲染。

22. **`All = MAX_uint32`**：表示加载所有属性。

    这通常用于全量加载模型数据，不进行任何过滤。