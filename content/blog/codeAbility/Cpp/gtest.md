---
title: gtest的引入与使用
date: 2024-08-01
---

# 前言

单元测试（Unit Testing）是软件开发过程中用来验证软件代码正确性的技术。它通过对代码中的最小可测试单元（通常是函数或方法）进行独立测试，以确保其按预期工作。`gtest`（Google Test）是Google开发的C++测试框架，广泛用于编写单元测试。它提供了丰富的测试功能，包括断言、测试用例、测试套件等。

本文将详细介绍`gtest`的主要功能和用法。

`gtest`（Google Test）是Google开发的C++测试框架，广泛用于编写单元测试。它提供了丰富的测试功能，包括断言、测试用例、测试套件等。下面详细介绍`gtest`的主要功能和用法。

# 基本断言（Assertions）

**断言（Assertions）**：验证某个条件是否为真。如果断言失败，测试用例会报告失败。断言分为两种类型：

- `EXPECT_*`：产生非致命错误，不会中止当前函数。
- `ASSERT_*`：在失败时会产生致命错误，并中止当前函数。

通常，EXPECT_* 更受青睐，因为它们允许在一个测试中报告多个错误。然而，如果在相关断言失败时继续进行没有意义，就应该使用 ASSERT_* 。

`gtest`提供了多种断言，用于验证测试条件是否满足。常见的断言包括：

- **简单断言**：
  - `EXPECT_EQ(val1, val2)`：期望`val1`等于`val2`。
  - `EXPECT_NE(val1, val2)`：期望`val1`不等于`val2`。
  - `EXPECT_LT(val1, val2)`：期望`val1`小于`val2`。
  - `EXPECT_LE(val1, val2)`：期望`val1`小于等于`val2`。
  - `EXPECT_GT(val1, val2)`：期望`val1`大于`val2`。
  - `EXPECT_GE(val1, val2)`：期望`val1`大于等于`val2`。
- **真值断言**：
  - `EXPECT_TRUE(condition)`：期望`condition`为真。
  - `EXPECT_FALSE(condition)`：期望`condition`为假。
- **字符串断言**：
  - `EXPECT_STREQ(str1, str2)`：期望C字符串`str1`等于`str2`。
  - `EXPECT_STRNE(str1, str2)`：期望C字符串`str1`不等于`str2`。
  - `EXPECT_STRCASEEQ(str1, str2)`：期望C字符串`str1`（忽略大小写）等于`str2`。
  - `EXPECT_STRCASENE(str1, str2)`：期望C字符串`str1`（忽略大小写）不等于`str2`。
- **浮点数断言**：
  - `EXPECT_FLOAT_EQ(val1, val2)`：期望`float`值`val1`和`val2`几乎相等。
  - `EXPECT_DOUBLE_EQ(val1, val2)`：期望`double`值`val1`和`val2`几乎相等。
  - `EXPECT_NEAR(val1, val2, abs_error)`：期望`val1`和`val2`的差值在`abs_error`范围内。
- **谓词断言**
  - `EXPECT_PRED1(pred, val1)`：检查一元谓词 `pred(val1)` 是否为真。如果为假，报告失败并显示 `val1` 的值。
  - `EXPECT_PRED2(pred, val1, val2)`：检查二元谓词 `pred(val1, val2)` 是否为真。如果为假，报告失败并显示 `val1` 和 `val2` 的值。
  - `EXPECT_PRED3(pred, val1, val2, val3)`：检查三元谓词 `pred(val1, val2, val3)` 是否为真。如果为假，报告失败并显示 `val1`, `val2` 和 `val3` 的值。
  - `EXPECT_PRED4(pred, val1, val2, val3, val4)`：检查四元谓词 `pred(val1, val2, val3, val4)` 是否为真。如果为假，报告失败并显示 `val1`, `val2`, `val3` 和 `val4` 的值。
  - `EXPECT_PRED5(pred, val1, val2, val3, val4, val5)`：检查五元谓词 `pred(val1, val2, val3, val4, val5)` 是否为真。如果为假，报告失败并显示 `val1`, `val2`, `val3`, `val4` 和 `val5` 的值。
- **FATAL断言**：与`EXPECT_*`系列断言对应的还有`ASSERT_*`系列断言。这些断言在失败时，会中止当前测试用例的执行。

# 测试用例与测试套件

在`gtest`中，测试用例（Test Case）由多个测试函数组成，通常对应一个特定的功能或类。

- **定义测试用例**：
  - 使用宏`TEST(TestSuiteName, TestName)`来定义一个测试用例。
  - `TestSuiteName`是测试套件名，`TestName`是测试用例名。

  ```cpp
  TEST(MathTest, Add) {
    EXPECT_EQ(2 + 2, 4);
  }
  ```

- **测试套件**：一个测试套件（Test Suite）可以包含多个测试用例。可以将相关的测试用例分组到同一个测试套件中。

# 自定义测试Fixture

当需要在多个测试用例之间共享测试代码时，可以使用测试夹具（Test Fixture）。`gtest`通过继承`::testing::Test`来实现这一点。

- **定义测试夹具**：
  
  ```cpp
  class MyTest : public ::testing::Test {
  protected:
    void SetUp() override {
      // 在每个测试用例执行之前调用
    }
  
    void TearDown() override {
      // 在每个测试用例执行之后调用
    }
  };
  ```

- **使用测试夹具**：
  
  - 使用`TEST_F(TestFixtureName, TestName)`定义测试用例。
  
  ```cpp
  TEST_F(MyTest, Test1) {
    // 使用SetUp()初始化的数据
  }
  ```

**TEST与TEST_F**

注意，这里使用的是TEST_F而不是TEST。TEST仅共享环境，但不会调用 `SetUp` 和 `TearDown` 方法。。

# 参数化测试

`gtest`支持参数化测试，即同一个测试用例可以使用不同的参数值进行多次测试。

- **定义参数化测试**：
  
  ```cpp
  class MyParamTest : public ::testing::TestWithParam<int> {
  };
  
  TEST_P(MyParamTest, Test1) {
    int value = GetParam();
    EXPECT_LE(value, 10);
  }
  ```

- **注册参数**：
  
  ```cpp
  INSTANTIATE_TEST_SUITE_P(
    MyValues,
    MyParamTest,
    ::testing::Values(1, 2, 3, 4, 5)
  );
  ```

# 测试主函数

`gtest`默认提供了一个主函数`main()`，可以通过以下方式进行替代和自定义：

```cpp
int main(int argc, char **argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
```

# 其他功能

- **忽略测试**：使用`DISABLED_`前缀命名测试用例或测试套件，可以暂时禁用它们。
- **设置全局SetUp和TearDown**：可以通过继承`::testing::Environment`来定义全局的SetUp和TearDown函数。
- **类型参数化测试**：通过继承`::testing::Test`和使用`TYPED_TEST`宏，可以进行类型参数化测试。

这些是`gtest`的主要功能和用法，它可以帮助你轻松编写高质量的C++单元测试。