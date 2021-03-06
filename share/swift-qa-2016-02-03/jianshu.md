每周 Swift 社区问答 2016-02-03"


作者：[shanks](http://codebuild.me)

本周共整理了 5 个问题。主要涉及到的知识点有：defer关键字，emoji表情提取，便利构造器的继承，元组的存在感和如何重写didSet。

本周整理问题如下：

* [Is “defer” guaranteed to be called in Swift?](#Q1)
* [How to extract emojis from a string?](#Q2)
* [Subclassing a class that has convenience initializers.](#Q3)
* [Tuple vs Struct in Swift](#Q4)
* [Overriding didSet](#Q5)




对应的代码都放到了 github 上，有兴趣的同学可以下载下来研究：[点击下载](https://github.com/SwiftGGTeam/SwiftCommunityWeeklyQA/tree/master/20160203)

<!--more-->

<a name="Q1"></a>

## Question1: Is “defer” guaranteed to be called in Swift?

[Q1链接地址](http://stackoverflow.com/questions/35108261/is-defer-guaranteed-to-be-called-in-swift)


### 问题描述

这个问题比较有意思，楼主贴出以下代码，第一个 `defer` 顺利执行，而第二个 `defer` 没有执行。中间夹杂着一个 `try` 语句抛出了异常。

    enum SomeError: ErrorType {
        case BadLuck
    }
    
    func unluckey() throws {
        print("\n\tunluckey(💥) -> someone will have a bad day ;)\n")
        throw SomeError.BadLuck
    }
    
    func callsUnluckey() throws {
        
        print("callsUnluckey() -> OPENING something")
        defer {
            print("callsUnluckey(😎) -> CLOSEING something")
        }
        
        print("callsUnluckey() -> WORKING with something")
        
        try unluckey()
        print("callsUnluckey() -> will never get here so chill...")
        
        defer {
            print("callsUnluckey(💩) -> why this is not getting called?")
        }
    }
    
    do {
        try callsUnluckey()
    } catch {
        print("")
        print("someone had a bad day")
    }

### 问题解答

官方文档对这个隐藏逻辑应该没有提到，如果是程序运行中，没有运行到  `defer` 的代码段，在函数结束之前， `defer` 代码也不会执行。大家可以试试，去掉 `try` 语句，加上 `return` 语句也是一样的效果。也就是说。 `defer` 最好写在 `try` 和 `return` 之前。



<a name="Q2"></a>

## Question2: How to extract emojis from a string?

[Q2链接地址](http://stackoverflow.com/questions/35106059/how-to-extract-emojis-from-a-string)

### 问题描述

这是一个纯知识点的问题：如何找出字符串中的 `emoji` 表情？

### 问题解答

直接看代码注释：

    // 获取字符编码对应的数值
    extension Character {
        private var unicodeScalarCodePoint: Int {
            let characterString = String(self)
            let scalars = characterString.unicodeScalars
            return Int(scalars[scalars.startIndex].value)
        }
    }
    
    //扩展定义字符串的一个计算属性，得到字符串中的emoji字符数组。
    extension String {
        var emojis:[Character] {
            let emojiRanges = [0x1F601...0x1F64F, 0x2702...0x27B0] // emoji 的范围，可以自己扩充
            let emojiSet = emojiRanges.reduce(Set<Int>()) { (result, elm) -> Set<Int> in
                return result.union(elm)
            }
            return self.characters.filter { emojiSet.contains($0.unicodeScalarCodePoint) }
        }
    }
    
    let sentence = "😃 hello world 🙃"
    sentence.emojis // ["😃", "🙃"]



<a name="Q3"></a>

## Question3: Subclassing a class that has convenience initializers.

[Q3链接地址](https://forums.developer.apple.com/thread/30537)

### 问题描述

请看代码描述：

    class BaseClass {
        var property1 = 0
        
        init(property1: Int) {
            self.property1 = property1
        }
        
        convenience init(value1: Int, value2: Int) {
            self.init(property1: value1 + value2)
        }
    }
    
    class SubClass: BaseClass {
        var property2: Int?
        
        init(property2: Int) {
            super.init(property1: 10)
            self.property2 = property2
        }
    }
    
    let c1 = SubClass(property2: 4)
    print(c1.property2!)
    
    // 以下代码报错
    let c2 = SubClass(value1: 5, value2: 5)
    print(c2.property1)

### 问题解答

`Swift` 官方教程里面说明了，如果要继承父类的便利构造器，那么子类需要重写所有父类的指定构造器，把代码变成下面的样子就行啦：

    class SubClass1: BaseClass {
        var property2: Int?
        
        override init(property1: Int) {
            super.init(property1: 10)
            self.property2 = property1
        }
    }
    
    let c3 = SubClass1(property1: 4)
    print(c3.property2!)
    
    // 以下代码报错
    let c4 = SubClass1(value1: 5, value2: 5)
    print(c4.property1)



<a name="Q4"></a>

## Question4: Tuple vs Struct in Swift

### 问题链接

[Q4链接地址](http://stackoverflow.com/questions/35153873/tuple-vs-struct-in-swift)

### 问题描述

楼主的问题：结构体也可以定义多个属性，而且看起来更加间接，为啥还有元组( `Tuples` )这样的东西存在？

### 问题解答

跟帖中提到了2点，来试图解释 `Tuples` 的作用，仅供参考：

* 第一点：要实现一个结构体的对象的 "=" 操作符，那我们需要去显式的实现它，比如以下的例子：

    struct Foo {
        var a : Int = 1
        var b : Double = 2.0
        var c : String = "3"
    }
    
    var a = Foo()
    var b = Foo()
    func == (lhs: Foo, rhs: Foo) -> Bool {
        return lhs.a == rhs.a && lhs.b == rhs.b && lhs.c == rhs.c
    }
    
    a == b

而在即将到来的 `Swift 2.2` 中，有一个关于元组的提议，已经被实现了，请参见[Tuple comparison operators](https://github.com/apple/swift-evolution/blob/master/proposals/0015-tuple-comparison-operators.md), 带来的变化是：
	如果元组的中的元素个数 `<=6`，那么编译器会帮你解决元组比较的问题，前提是元素中的满足 `Equatable` 协议，如果满足 `Comparable` 协议，甚至是支持 `<` , `<= `, `>=` , `>` 等比较操作符。见以下例子：

    /* 以下代码将在 Swift 2.2 中实现，不用自己实现 */
    @warn_unused_result
    public func == <A: Equatable, B: Equatable, C: Equatable>(lhs: (A,B,C), rhs: (A,B,C)) -> Bool {
        return lhs.0 == rhs.0 && lhs.1 == rhs.1 && lhs.2 == rhs.2
    }
    /* 更多的比较 ...           */
    
    var aa = (1, 2.0, "3")
    var bb = (1, 2.0, "3")
    
    aa == bb // true
    aa.0 = 2
    aa == bb // false

* 第二点：`Tuples` 的访问可以更加灵活，可以使用 `.0`,`.1`这样的访问方式，也可以使用标签。而结构体只能访问定义的属性。



<a name="Q5"></a>

## Question5: Overriding didSet

### 问题链接

[Q5链接地址](http://stackoverflow.com/questions/35128118/overriding-didset)

### 问题描述

楼主的问题：为神马不能重写 `didSet？` 见以下代码：

    class Foo {
        var name: String = "" { didSet { print("name has been set") } }
    }
    
    let foo = Foo();
    foo.name = "test"
    class Bar: Foo {
        override var name: String = "" {
            didSet {
                print("print this first")
                // print the line set in the superclass
            }
        }
    }

### 问题解答

实际上，不是不能重写，在重写时报错：具有 `getter` 和 `setter` 的变量不能有初始值。适用于子类重写属性的情况。不过这个错误提示有一些歧义，在父类中，其实是可以赋初始值的，见以下代码：

    class Foo {
        var name: String = "" { didSet { print("name has been set") } }
    }
    
    class Bar: Foo {
        override var name: String  {
            didSet {
                print("print this first")
                // print the line set in the superclass
            }
        }
    }
    
    let bar = Bar()
    bar.name = "name"

更多关于继承属性和 `didSet` 的介绍，见[官方教程](http://wiki.jikexueyuan.com/project/swift/chapter2/13_Inheritance.html#overriding)
