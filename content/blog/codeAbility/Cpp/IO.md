---
title: IO读写
date: 2024-07-10
tag: cpp
---

# 前言

在日常开发的过程中，对文件的处理是必不可少的。C++ 的输入／输出（input/output）由标准库提供。标准库定义了一族类型，支持对文件和控制窗口等设备的读写（IO）。还定义了其他一些类型，使 string对象能够像文件一样操作，从而使我们无须 IO 就能实现数据与字符之间的转换。

# 头文件

IO 类型在三个独立的头文件中定义：

## **iostream：读写控制台窗口的类型。**

- **istream**、**wistream**：用于读取流。
- **ostream**、**wostream**：用于写入流。
- **iostream**、**wiostream**：用于读写流。

```cpp
#include <iostream>

int main() {
    std::string input;
    std::cout << "Enter something: ";
    std::cin >> input; // 读取用户输入
    std::cout << "You entered: " << input << std::endl; // 输出用户输入
    return 0;
}
```

## fstream：读写文件的类型。

- **ifstream**、**wifstream**：用于读取文件。
- **ofstream**、**wofstream**：用于写入文件。
- **fstream**、**wfstream**：用于读写文件。

```cpp
#include <fstream>
#include <iostream>

int main() {
    std::ofstream outFile("example.txt"); // 创建文件并打开写入模式
    outFile << "Hello, file!" << std::endl; // 写入内容到文件
    outFile.close(); // 关闭文件

    std::ifstream inFile("example.txt"); // 打开文件读取模式
    std::string content;
    std::getline(inFile, content); // 读取文件内容
    std::cout << "File content: " << content << std::endl; // 输出文件内容
    inFile.close(); // 关闭文件

    return 0;
}
```

## sstream：读写内存中的string对象的类型。

- **istringstream**、**wistringstream**：用于读取string。
- **ostringstream**、**wostringstream**：用于写入string。
- **stringstream**、**wstringstream**：用于读写string。

```cpp
#include <sstream>
#include <iostream>

int main() {
    std::stringstream ss;
    ss << "123 45.67"; // 向字符串流写入内容

    int num;
    double decimal;
    ss >> num >> decimal; // 从字符串流读取内容

    std::cout << "Integer: " << num << ", Decimal: " << decimal << std::endl; // 输出读取内容

    return 0;
}
```

# IO 类型的特点

## 继承关系

ifstream与istringstream都**继承**自istream，可以像使用istream一样使用ifstream与istringstream。其他类型同理。

## 不允许复制或赋值

不允许复制或赋值操作，因此不能存储在容器中，不能作为形参或返回类型。

## 条件状态

流对象的基类具有以下标志符用于记录流的状态：

- `strm::iostate`：表示流状态的整体状态，可以包含多个状态标志
- `strm::badbit`：指出流已崩溃
- `strm::failbit`：指出IO操作失败
- `strm::eofbit`：指出流到达文件结束
- `strm::goodbit`：指出流未处于错误状态

这些标志符用于记录流的状态。流的对象拥有以下函数通过鉴别不同标志位的状态以返回不同的结果：

- `s.eof()`：返回 true 表示到达文件结尾。eofbit
- `s.fail()`：返回 true 表示 IO 操作失败。badbit || failbit
- `s.bad()`：返回 true 表示流损坏。badbit
- `s.good()`：返回 true 表示流状态正常。goodbit
- `s.clear()`：重置流状态。
- `s.setstate(flag)`：设置指定条件状态。
- `s.rdstate()`：返回当前条件状态。

如s.eof()会检测strm::eofbit是否为1.

我们可以通过流的状态实现一些操作，如：

**检测文件是否存在**

```cpp
ifstream fileIn("example.txt");
if (fileIn) {
    // 文件存在且成功打开
}
```

**检测文件读取状态状态**

```cpp
ifstream fileIn("example.txt");
if (fileIn.is_open()) {
    if (fileIn.good()) {
        // 成功，进行读取操作
    }
    fileIn.close();
}
```

**写文件时，若文件不存在则创建**

```cpp
ofstream fileOut("example.txt");
if (fileOut) {
    // 输出文件成功打开或成功创建
}
```

**检测文件写入状态状态**

```cpp
ofstream fileOut("example.txt");
if (fileOut.is_open()) {
    if (fileOut.good()) {
        // 成功，进行写入操作
    }
    fileOut.close();
}
```

除了检测状态，我们还可以**对流的状态进行修改管理**

```cpp
auto old_state = cin.rdstate(); //记住cin的当前状态
cin.clear(); //使cin有效
process_input (cin); //使用cin
cin.setstate (old_state) ； //将cin置为原状态
    
// clear可以接收参数, 单独清除特定位
cin.clear(cin.rdstate() & ~cin.failbit & ~cin.badbit)  // 复位failbit和badbit，保持其他位置不变
```

**处理输入流中的错误**

```cpp
int ival;
while (cin >> ival, !cin.eof()) {
    if (cin.bad()) throw runtime_error("IO stream corrupted");
    if (cin.fail()) {
        cerr << "bad data, try again";
        cin.clear(istream::failbit);
        continue;
    }
    // 处理 ival
}
is.setstate(ifstream::badbit | ifstream::failbit); // 设置 badbit 和 failbit
```

# 输出缓冲区的管理

C++的标准输入输出均有一个缓冲区，用来平衡CPU与IO速度的差异。参考文章：[谈谈 C++ 中流的缓冲区](https://liam.page/2017/12/31/buffer-of-stream-in-Cpp/)

- 在程序正常结束时、缓冲区满时、使用 endl 或 flush 时会刷新缓冲区。

```cpp
cout << "hi!" << endl;
cout << "hi!" << flush;
cout << "hi!" << ends;
```

- 使用 unitbuf 操作符在每次写操作后刷新缓冲区。

```cpp
// unitbuf 设置为无缓冲， nounitbuf复原。
cout << unitbuf << "first" << " second" << nounitbuf;
```

- 使用 tie 函数将输出流与输入流关联（不懂，需要进一步研究）。

```cpp
cin.tie(&cout);
ostream *old_tie = cin.tie();
cin.tie(0); // 取消关联
```

# 文件的输入和输出

fstream 类型定义了 open 和 close 操作。初始化时提供文件名即打开文件。

stream 类型定义了 open 和 close 操作。初始化时提供文件名即打开文件。

```cpp
ifstream infile(ifile.c_str());
ofstream outfile(ofile.c_str());
```

检查文件是否成功打开：

```cpp
if (!infile) {
    cerr << "error: unable to open input file: " << ifile << endl;
    return -1;
}
```

重新绑定文件时，先关闭当前文件再打开新文件。

```cpp
ifstream infile("in");
infile.close();
infile.open("next");
```

处理多个文件时，需在每次读写前调用 clear 清除状态。

```cpp
ifstream input;
vector<string>::const_iterator it = files.begin();
while (it != files.end()) {
    input.open(it->c_str());
    if (!input) break;
    while (input >> s) process(s);
    input.close();
    input.clear();
    ++it;
}
```

# 文件模式

常见的文件模式包括：

- `in`：读操作
- `out`：写操作
- `app`：每次写之前找到文件尾
- `ate`：打开文件后定位到文件尾
- `trunc`：打开文件时清空文件
- `binary`：以二进制模式进行 IO 操作

```cpp
ofstream outfile("file1");
ofstream outfile2("file1", ofstream::out | ofstream::trunc);
ofstream appfile("file2", ofstream::app);
```

默认情况下，fstream 对象以 in 和 out 模式同时打开。当文件同时以 in 和 out 打开时不清空。

（如何替换某部分？）

# 字符串流

将流与内存中的 string 对象捆绑。

- 创建 stringstream 对象：`stringstream strm;`
- 绑定已有 string 对象：`stringstream strm(s);`
- 获取/设置流中的 string 对象：`strm.str()` 和 `strm.str(s)`

## **基本使用**

字符串流（`stringstream`、`istringstream`、`ostringstream`）的最基本用法是将字符串进行格式化，然后可以轻松读取每一个以空白字符分隔的单词：

```cpp
std::istringstream stream(line);  // 假设 line 为: Hello World and hello happiness!
while (stream >> word) {  // 会分别读取 Hello, World, and, hello, happiness 这五个单词
    // 处理 word
}
```

在实际场景中，我们可以配合 `getline` 处理多行输入：

```cpp
std::string line, word;
std::cout << "请输入文本: ";
while (std::getline(std::cin, line)) {  // 从标准输入（通常是键盘）读取一行到 line 中
    std::istringstream stream(line);  // 创建字符串流，分隔 line 中的单词
    while (stream >> word) {  // 逐个读取一行中以空格隔开的单词
        // 处理 word
    }
}

```

并且可以与文件输入流一起使用，处理文本文件的输入：

```cpp
std::ifstream file("example.txt");
if (file.is_open()) {
    std::string line;
    while (std::getline(file, line)) {  // 从文件中逐行读取
        std::cout << line << std::endl;
    }
    file.close();
}
```

## **指定分隔符**

g`getline` 默认使用换行符作为分隔符。如果我们想使用自定义的分隔符，可以为 `getline` 提供第三个参数：

```cpp
std::string line, word;
std::cout << "请输入文本: ";
while (std::getline(std::cin, line)) {  // 从标准输入读取多行
    std::istringstream stream(line);  
    while (std::getline(stream, word, ',')) {  // 使用逗号作为分隔符
        // 处理 word
    }
}
```

`getline` 是一个函数，用于从输入流中读取字符，直到遇到指定的分隔符（默认是换行符）。每次调用后，读取的位置会自动前移。

假设我们有一组字符串：`"Hello,Alice"`, `"Hello,Emma"`, `"Hello,Olivia"`, `"Hello,Ava"`, `"Hello,Sophia"`。我们可以这样读取所有的名字：

```cpp
 std::string name = "Hello,Alice\nHello,Emma\nHello,Olivia\nHello,Ava\nHello,Sophia";
 std::istringstream input(name);  // 将字符串封装到 istringstream 中
 std::string line;

 while (std::getline(input, line)) {  // 从 input 流中逐行读取
     std::istringstream c(line);
     std::string strHello, strName;
     std::getline(c, strHello, ',');  // 读取 "Hello"
     std::getline(c, strName, ',');   // 读取名字部分，如 "Alice"
     // 处理 strName
     std::cout << "名字: " << strName << std::endl;  // 示例处理：输出名字
 }
```

## **实现类型转换和格式化**

活用空白符，`stringstream` 还可以用于类型转换和字符串格式化。例如：

```cpp
int val1 = 512, val2 = 1024;
std::ostringstream format_message;
format_message << "val1: " << val1 << "\n" << "val2: " << val2 << "\n";
// 此时的format_message结果：
// val1: 512
// val2: 1024


std::istringstream input_istring(format_message.str());
std::string dump;
input_istring >> dump >> val1 >> dump >> val2;
// 从字符串流中读取数据，并将其分配给变量。
// 流可以分隔空白，val1: ,512,val2: ,1024 四个word
// 这样，就可以将512赋值给val1，1024赋值给val2

std::cout << val1 << " " << val2 << std::endl;
// 512 1024
```

这样，int 型值自动转换为可打印的字符串。
