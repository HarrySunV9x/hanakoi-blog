---
title: 快速语法笔记
date: 2024-10-22
---

### 1. **字符串处理**

#### (1) 字符串排序

使用 `sort` 函数排序字符串：

```cpp
#include <algorithm>
#include <string>

std::string s = "bcda";
std::sort(s.begin(), s.end());  // 结果: "abcd"
```

#### (2) 字符串截取

`substr` 用于截取字符串的一部分：

```cpp
#include <string>

std::string s = "HelloWorld";
std::string sub = s.substr(0, 5);  // 结果: "Hello"
```

#### (3) 字符串拼接

可以直接使用 `+` 操作符拼接字符串：

```cpp
#include <string>

std::string s1 = "Hello";
std::string s2 = "World";
std::string result = s1 + " " + s2;  // 结果: "Hello World"
```

#### (4) 查找字符或子串

使用 `find` 查找字符或子串在字符串中的位置：

```cpp
#include <string>

std::string s = "HelloWorld";
size_t pos = s.find("World");  // 结果: 5
if (pos != std::string::npos) {
    // 找到了
}
```

#### (5) 字符串分隔

C++ 标准库没有直接提供字符串分隔函数，但可以通过 `stringstream` 或者 `find` 实现分隔。

**使用 `stringstream`：**

```cpp
#include <sstream>
#include <string>
#include <vector>

std::string s = "apple,banana,orange";
std::vector<std::string> result;
std::stringstream ss(s);
std::string item;
while (std::getline(ss, item, ',')) {
    result.push_back(item);
}
// 结果: ["apple", "banana", "orange"]
```

**使用 `find` 和 `substr`：**

```cpp
#include <string>
#include <vector>

std::string s = "apple,banana,orange";
std::vector<std::string> result;
size_t start = 0;
size_t end = s.find(',');
while (end != std::string::npos) {
    result.push_back(s.substr(start, end - start));
    start = end + 1;
    end = s.find(',', start);
}
result.push_back(s.substr(start));  // 加入最后一部分
```

#### (6) 字符串比较

`compare` 函数可以比较字符串的大小。返回值：相等为 `0`，左小于右返回负数，左大于右返回正数。

```cpp
#include <string>

std::string s1 = "apple";
std::string s2 = "banana";
int result = s1.compare(s2);  // 结果: 负数 (因为 "apple" 小于 "banana")
```

你也可以直接使用 `==`、`!=`、`<`、`>` 等操作符来进行字符串比较：

```cpp
if (s1 == s2) {
    // 字符串相等
}
if (s1 < s2) {
    // 字符串 s1 小于 s2
}
```

#### (7) 去除空格（首尾）

使用 `erase` 和 `find_first_not_of`/`find_last_not_of` 来去除字符串的首尾空格：

```cpp
#include <string>

std::string s = "  Hello World  ";
s.erase(0, s.find_first_not_of(' '));  // 去除前导空格
s.erase(s.find_last_not_of(' ') + 1);  // 去除尾随空格
// 结果: "Hello World"
```

#### (8) 字符串转换为数字

可以使用 `stoi`, `stol`, `stod` 等函数将字符串转换为整数或浮点数：

```cpp
#include <string>

std::string s = "123";
int num = std::stoi(s);  // 结果: 123
double d = std::stod("123.45");  // 结果: 123.45
```

### 2. **数组处理**

#### (1) 数组排序

使用 `sort` 函数排序数组：

```cpp
#include <algorithm>

int arr[] = {3, 1, 4, 1, 5};
std::sort(arr, arr + sizeof(arr) / sizeof(arr[0])); // 结果: [1, 1, 3, 4, 5]
```

#### (2) 数组拼接

可以通过 `insert` 或者直接操作两个 `vector` 来实现数组的拼接：

```cpp
#include <vector>

std::vector<int> v1 = {1, 2, 3};
std::vector<int> v2 = {4, 5, 6};
v1.insert(v1.end(), v2.begin(), v2.end());  // 结果: v1 = [1, 2, 3, 4, 5, 6]
```

#### (3) 数组查找元素

使用 `find` 函数在数组或 `vector` 中查找元素，找到返回迭代器，未找到返回 `end` 迭代器：

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {1, 2, 3, 4, 5};
auto it = std::find(v.begin(), v.end(), 3);
if (it != v.end()) {
    // 找到了元素 3
}

// 从左查找位置
auto it = std::find(v.begin(), v.end(), 3);
int left = std::distance(v.begin(), it);

// 从右查找位置
auto it_end = std::find(v.rbegin(), v.rend(), 3);
int right = std::distance(v.begin(), it_end.base()) - 1;
```

#### (4) 数组去重

使用 `unique` 去重，然后再调整数组大小（适用于有序和无序数组）：

```cpp
#include <algorithm>
#include <vector>

std::vector<int> v = {1, 2, 2, 3, 4, 4};
auto it = std::unique(v.begin(), v.end());  // 结果: [1, 2, 3, 4, ...]
v.erase(it, v.end());  // 删除多余元素
```

### 3. **哈希表（unordered_map）**

#### (1) 创建哈希表

`unordered_map` 是 C++ 中的哈希表，适合快速查找：

```cpp
#include <unordered_map>

std::unordered_map<std::string, int> myMap;
myMap["apple"] = 1;
myMap["banana"] = 2;
```

#### (2) 查找元素

使用 `find` 来查找哈希表中的元素：

```cpp
if (myMap.find("apple") != myMap.end()) {
    // 找到了 key "apple"
    int value = myMap["apple"];
}
```

#### (3) 遍历哈希表

可以使用迭代器来遍历哈希表：

```cpp
for (auto& pair : myMap) {
    std::cout << pair.first << ": " << pair.second << std::endl;
}
```

#### (4) 删除元素

可以通过 `erase` 删除哈希表中的元素：

```cpp
myMap.erase("apple");  // 删除 key 为 "apple" 的元素
```

#### (5) 统计元素出现次数

可以使用 `unordered_map` 统计字符串或数字出现的次数：

```cpp
#include <unordered_map>
#include <string>

std::unordered_map<std::string, int> countMap;
std::string s = "apple banana apple";
std::istringstream iss(s);
std::string word;
while (iss >> word) {
    countMap[word]++;
}
// 结果: countMap["apple"] = 2, countMap["banana"] = 1
```

### 4. **STL 常见操作**

#### (1) 线性结构

`vector` 是动态数组，可以灵活调整大小。

```cpp
std::vector<int> v = {1, 2, 3};			// vector
v.push_back(4);  			// 尾部插入
v.pop_back();    			// 尾部删除
v.insert(v.begin(), 0);  	// 头部插入
v.erase(v.begin());  		// 头部删除

std::stack<int> s;			// stack
s.push(1);				// 入栈
s.push(2);				// 入栈
s.pop();				// 出栈
s.top();				// 查看栈顶
s.empty();				// 检查空

std::queue<int> q;			// queue
q.push(1);				// 入队列
q.push(2);				// 入队列
q.push(3);				// 入队列
q.push(0);				// 入队列
q.pop();				// 出队列
q.front();				// 查看队首
q.back();				// 查看队尾
q.empty();				// 检查空

std::deque<int> dq = {1, 2, 3, 4};   	// deque
dq.push_back(5);  	// 尾部插入
dq.pop_back();  	// 尾部删除
dq.push_front(0);  	// 头部插入
dq.pop_front();  	// 头部删除
```

**堆栈只能空初始化**

或者迭代器赋值

```cpp
std::vector<int> vec = {1, 2, 3};
std::stack<int> s(std::move(vec));  // 使用 vector 初始化 stack
std::stack<int> s(vec.begin(), vec.end()); // 使用 vector 初始化栈

std::deque<int> d = {1, 2, 3};
std::stack<int> s(d);  // 使用 deque 初始化 stack
std::stack<int> s(d.begin(), d.end()); 
```

#### (3) 常用算法

`min` 和 `max` 可以同时应用在两个数或者容器中：

```cpp
int m = std::min(a, b);  // 结果: 10
int sum = std::accumulate(v.begin(), v.end(), 0);  // 结果: 15
std::reverse(v.begin(), v.end());  // 结果: [4, 3, 2, 1]
```

### 5.**二进制**

### 6.知识点

#### 定长滑动窗口 + 字母异位词判断:

https://leetcode.cn/problems/find-all-anagrams-in-a-string/description/?envType=study-plan-v2&envId=top-100-liked