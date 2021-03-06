用 SwiftyDB 管理 SQLite 数据库"

> 作者：AppCoda，[原文链接](http://www.appcoda.com/swiftydb/)，原文日期：2016-03-16
> 译者：[Crystal Sun](http://www.jianshu.com/users/7a2d2cc38444/latest_articles)；校对：[numbbbbb](http://numbbbbb.com/)；定稿：[shanks](http://codebuild.me/)
  









选择哪种数据持久化的方式，是我们在开发 App 时常常遇到的问题。我们有太多选择了：创建一个单独的文件、使用 CoreData 或者创建 SQLite 数据库。使用 SQLite 数据库有点麻烦，因为首先要先创建数据库，提前写好表和字段。此外，从编程的角度来看，数据的存储、更新、和获取都不是很容易的操作。



而当我们使用 GitHub 上的 SwiftyDB 这个第三方库时，上面的这些问题都可以轻而易举地解决。SwiftyDB，用作者的话来说，就是即插即用型的好帮手。SwiftyDB 将开发者从繁重的手动创建 SQLite 数据库的工作中解放出来，再也不用提前定义好各种表和字段了。SwiftyDB 中类的属性能够自动完成上述工作，可以直接用类作为数据模型。除此之外，所有对数据库的操作都被封装起来，开发者可以把所有的注意力放到应用的逻辑层面上。简单强悍的 API 可以让处理数据成为小菜一碟的事情。

不过需要强调一下，SwiftyDB 并不能创造奇迹。它只是一个靠谱的第三方库，可以很好地完成它该做的事情（虽然有一些特性目前还不具备）。尽管如此，它仍然是一个非常好用的工具，值得你花时间学习。在本篇文章中，我们将学习 SwiftyDB 的基本使用操作。

可以从[这里](http://oyvindkg.github.io/swiftydb/)找到文档，看完这篇文章后最好再去看看文档。如果你一直想用 SQLite，可是从来没有真正开始，那 SwiftyDB 是一个好的开始。

好了，让我们开始探索这个全新的、令人期待的工具吧。

## 关于 Demo App

在这篇文章中，我们要创建一个非常简单的笔记应用，可以实现如下这些基本操作：

 - 列出笔记
 - 创建新的笔记
 - 更新已经创建的笔记的内容
 - 删除笔记
 
很明显，SwiftyDB 将要管理一个 SQLite 数据库，上面列出的操作足以向你展示如何使用 SwiftyDB。

简单起见，我事先创建了一个[工程](https://raw.githubusercontent.com/appcoda/SwiftyDB-Demo/master/NotesDBStarter.zip)，点击下载然后打开工程。用 Xcode 打开工程后，能够看到所有的基本功能，不过缺少与数据有关的代码。运行项目，你就能看到全貌了。

应用有一个导航栏，在第一个 view controller 中，有一个 tableview 列出所有笔记。

<center>
![](http://www.appcoda.com/wp-content/uploads/2016/03/t50_1_note_list.png)
</center>

点击某个笔记，我们可以编辑更新内容，如果向左滑动某条笔记，可以删除笔记：

<center>
![](http://www.appcoda.com/wp-content/uploads/2016/03/t50_2_delete_note.png)
</center>


创建一个新笔记只需点击导航栏上的加号按钮，下面是我们在编辑笔记时可以进行的操作：

 1. 设置笔记的标题和内容。
 2. 更改字体。
 3. 更改字体的大小。
 4. 更改字体的颜色。
 5. 添加图片。
 6. 移动图片到另外一个位置。

上述所有值的改变都会存储到数据库中。在最后两条中，图片实际上是存储在应用的 documents directory 中，我们在数据库中只是存储图片的名字和 frame。此外，我们还要创建一个类来管理图片（更多细节参见后面的内容）。

<center>
![](http://www.appcoda.com/wp-content/uploads/2016/03/t50_3_edit_note.png)
</center>


最后还要强调一点，虽然你只是下载了一个简单的项目，但是在下一节中它会变成一个 workspace，因为我们要使用 **CocoaPods** 来下载 SwiftyDB 以及其他依赖项目。

准备好了吗？如果你在 Xcode 中打开了刚刚下载的初始工程，那么请先关闭。

## 安装 SwiftyDB

第一件事情就是下载 SwiftyDB，然后在工程中使用。下载库的文件然后放到工程中可不管用，我们要先安装 [**CocoaPods**](https://cocoapods.org)。安装过程不复杂，不会花费太多时间，即使你从来没有用过 CocoaPods。详细内容请点击链接。

### 安装 CocoaPods

我们要将 CocoaPods 安装到系统中，如果你已经安装了 CocoaPods，那么请跳过这一步，如果没有，那么打开 **Terminal 终端** ，输入下列命令：

~~~
sudo gem install cocoapods

~~~

然后按回车，输入 Mac 密码，等一会然后开始下载，下载完毕后不要关闭 Terminal 终端 ，我们之后还会用到。


### 安装 SwiftyDB 和其他的依赖库

使用 **cd** 命令找到初始工程对应的文件夹（仍然是在 Terminal 终端中进行操作）。

~~~
cd PATH_TO_THE_STARTER_PROJECT_DIRECTORY
~~~

现在可以创建 **Podfile** 文件了，我们在 Podfile 里写出我们需要的下载的库。最简单的方法是输入下列命名，让 CocoaPods 给我们创建一个 Podfile。

~~~
pod init
~~~

一个名为 `Podfile` 的文件就创建好了，在工程文件夹里，打开 Podfile，最好使用文本编辑软件（最好不要用 TextEdit 这个软件），然后将内容修改成：

~~~
use_frameworks!

target 'NotesDB' do
	pod "SwiftyDB"
end
~~~

<center>
![](http://www.appcoda.com/wp-content/uploads/2016/03/t50_4_podfile.png)
</center>


这行代码实际上就做了 `pod "swiftyDB"` 一件事。CocoaPods 会下载 SwiftyDB 库和所有的依赖库，还会创建一些新的子文件夹，以及一个 Xcode workspace。

编辑完 `Podfile` 文件后，保存关闭。确保你关闭了初始工程，回到 Terminail 终端上，输入下列命令：

~~~
pod install
~~~

<center>
![](http://www.appcoda.com/wp-content/uploads/2016/03/t50_5_pod_install_2.png)
</center>


安装完毕之后继续。我们这次不再打开初始工程，而是打开 `NoteDB.xcworkspace`。

<center>
![](http://www.appcoda.com/wp-content/uploads/2016/03/t50_6_folder_after_installation.png)
</center>


## 开始使用 SwiftyDB - 我们的 Model

在 `NotesDB` 工程中，有个文件叫做 `Note.swift`，目前还是空的。这就是我们今天要讲述的重点内容，我们要创建一些类，表示一条笔记的实体，在理论层面上，即将完成的工作就是 iOS [MVC](https://developer.apple.com/library/ios/documentation/General/Conceptual/DevPedia-CocoaCore/MVC.html) 模式里的 `Model`。

首先需要引入 SwiftyDB 库，在文件的头部输入如下代码：

    
    import SwiftyDB

现在，声明最重要的一个类：

    
    class Note: NSObject, Storable {
    
    }

我们使用 SwiftyDB 时，需要遵循几条规则，上面这个类的第一行体现出其中两条：

 1. 带有属性的类如果要用 SwiftyDB 存到数据库，必须是 `NSObject` 类的子类
 2. 带有属性的类如果要用 SwiftyDB 存到数据库，必须必须遵守 `Storable` 协议（也是一个 SwiftyDB 协议）。
 
现在，我们要想一想，这个类需要哪些属性，这就需要了解 SwiftyDB 的一条新规则：从数据库中获取数据时，`datatypes` 属性必须是[这里](http://oyvindkg.github.io/swiftydb/#howToRetrieveObjects)列出的一种，以便能载入整个 `Note` 对象，而不是简单数据（比如一个都是字典的数组）。如果有某个属性是“不兼容的”数据类型，那么我们就需要额外做一些操作，把它们转换成建议的类型（我们在之后会进行详细的说明）。默认情况下，将数据存储到数据库时，不兼容的数据类型的数据都会被 SwiftyDB 直接忽略掉。也不会创建对应的表单。同样的，对于我们不想存储到数据库中的其他属性，我们也会特殊对待的。

目前需要说明的最后一条要求：遵守 `Storable` 协议的类必须执行 `init` 方法：

    
    class Note: NSObject, Storable {
    	
    	override required init() {
    		super.init()
    		
    	}
    }

现在，我们已经有所需的信息了，下面开始声明类的属性吧。有些属性后面才需要用到，这里先声明好：

    
    class Note: NSObject, Storable {
    	
    	let database: SwiftyDB! = SwiftyDB(databaseName: "notes")
        var noteID: NSNumber!
        var title:String!
        var text:String!
        var textColor: NSData!
        var fontName:String!
        var fontSize:NSNumber!
        var creationDate:NSDate!
        var modificationDate:NSDate!
        
        ...
    }

除了第一个之外，其他的无需多言。对象初始化后（如果数据库不存在）会创建一个新的数据库（名为 `notes.sqlite`）并自动创建一个表，表单会和拥有正确数据类型的属性匹配。反之，如果数据库已经存在了，就会直接打开数据库。

你可能会注意到，上面的属性都是描述一条笔记和我们想存储的特性（标题、问题、文字颜色、字体和大小、创建和修改日期），但是唯独没有笔记中存储的图片。哈哈，我是故意的，我要给图片单独创建一个类，只存储两个属性：图片的名字和尺寸。

所以，继续在 `Note.swift` 文件中创建下列类，放到之前的那个类的上方或者下方皆可：

    
    class ImageDescriptor: NSObject, NSCoding {
        
        var frameData: NSData!
        var imageName: String!
        
    }

注意，在类中，图片的 frame 是一个 `NSData` 对象，不是 `CGRect` 对象。必须这样操作，因为这样我们可以非常容易的将值存储到数据库里。过一会你就会看到我们是如何转换的，到时候你就明白为什么我们要使用 `NSCoding` 协议。

回到 `Note` 类，我们声明一个 `ImageDescriptor` 数组，如下文：

    
    class Note: NSObject, Storable {
    	...
    	
    	var images: [ImageDescriptor]!
    	
    	...
    }

这里有一个限制，现在是时候提到它了，就是实际上 SwiftyDB `不会把集合存储到数据库中`。简单来说，我们的 `images` 数组永远不会被存储到数据库里，我们不得不解决图片的存储问题。我们可以使用受支持的数据类型中的一个（看我之前提供的连接），而最合适的数据类型是 `NSData`。所以，我们不会把 `images` 数组存储到数据库里，而是存储下列新的属性：

    
    class Note: NSObject, Storable {
    	...
    	
    	var imageData:NSData!
    	
    	...
    }

但是我们如何才能将带有 `ImageDescriptor` 对象的 `images` 数组变成 `imagesData``NSData` 对象呢？恩，答案就是 `归档（archiving）` 这个 `images` 数组，使用 `NSKeyedArchiver` 类生成 `NSData` 对象。我们在后面会演示如何用代码实现，这里只是介绍一下实现思路，后面再来修改 `ImageDescriptor` 类。

如你所知，一个类可以被归档（在其他编程语言中也就做 `序列化（serialized）`），只要类的所有属性都可以被序列化就行。在我们的例子中，这是可行的，因为`ImageDescriptor` 类里的这两个属性的数据类型（`NSData` 和 `String`）是可以被序列化的。然而这还不够，因为我们还必须要 `编码（encode）` 和 `解码（decode）` 它们，以便于归档和解压（unarchive），这也就是我们需要 `NSCoding` 协议的原因。有了 `NSCoding` 协议，我们可以引进如下方法（其中一个就是 `init` 方法），从而能恰当地编码和解码这两个属性：

    
    class ImageDescriptor: NSObject, NSCoding {
    	...
        
        required init?(coder aDecoder: NSCoder) {
            frameData = aDecoder.decodeObjectForKey("frameData") as! NSData
            imageName = aDecoder.decodeObjectForKey("imageName") as! String
        }
        
        func encodeWithCoder(aCoder: NSCoder) {
            aCoder.encodeObject(frameData, forKey: "frameData")
            aCoder.encodeObject(imageName, forKey: "imageName")
        }
        
    }

更多关于 `NSCoding` 协议和 `NSKeyedArchiver` 类的信息请参见[这里](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Protocols/NSCoding_Protocol/)和[这里](https://developer.apple.com/library/mac/documentation/Cocoa/Reference/Foundation/Classes/NSKeyedArchiver_Class/)，我们不会在这里讨论。

除此之外，我们定义一个便利的自定义的 `init` 方法。代码非常简单，一看就懂：

    
    class ImageDescriptor: NSObject, NSCoding {
        ...
            
        init(frameData: NSData!, imageName: String!) {
            super.init()
            self.frameData = frameData
            self.imageName = imageName
        }   
    }

在这一节中我们快速介绍了 SwiftyDB 库。虽然我们还没有大量使用 SwiftyDB，但是这部分很重要，因为它包含三个要点：

 1. 创建一个能使用 SwiftyDB 库的类。
 2. 了解一些在使用 SwiftyDB 库时的规则。
 3. 了解一些有关数据类型的限制要求，哪些数据类型可以被存储到 SwiftyDB里。
 
`注意`：如果你在 Xcode 中看到错误提示，立即 Build 工程（Command + B），错误提示就会消失了。

## 主键和忽略属性

在和数据库打交道时，强烈推荐使用 `主键（primary keys）`，它们能够帮你在数据库表中创建独一无二的标识符，进行各种各样的操作（例如，更新某个数据）。你可以在[这里](http://databases.about.com/cs/administration/g/primarykey.htm)找到有关主键的定义。

在 SwiftyDB 数据库中，将类中的某个或某些属性定义为主键的操作非常简单，库里提供了 `PrimaryKeys` 协议，所有类都应该实现这个协议，从而让对应的表中有主键，这样对象才能有独一无二的标识符。实现方法非常简单，动手吧。

在 `NotesDB` 工程中找到名为 `Extensions.swift` 的文件，点击打开，加入下列代码：

    
    extension Note: PrimaryKeys {
    	class func primaryKeys() -> Set<String> {
    		return ["noteID"]
    	}
    }

在我们的 demo 里，我想让 `noteID` 属性成为 sqlite 数据库对应的表里唯一的主键。如果需要更多的主键，用逗号分隔即可（比如，`return ["key1","key2","key3"]`）。

除此之外，并不是类中所有的属性都要存储到数据库中，你应该明确指出哪些不存储。例如，在 `Note` 类中，我们有两个属性是不存储到数据库里的（要么就是不能被存储，要么就是我们不想存储）：`images` 数组和 `database` 对象。我们如何明确地排除这两个属性呢？引入 SwiftyDB 提供的另外一个协议：`IgnoredPropertie`：

    
    extension Note: IgnoredProperties {
        class func ignoredProperties() -> Set<String> {
            return ["images","database"]
        }
    }

如果还有更多属性我们不想存储到数据库中，那么也需要添加到上面的代码中，例如，假设我们有这么一个属性：

    
    var noteAuthor: String!

我们不想把它存储到数据库中，这就需要把这个属性添加到 `IgnoredProperties` 协议里：

    
    extension Note: IgnoredProperties {
        class func ignoredProperties() -> Set<String> {
            return ["images","database","noteAuthor"]
        }
    }

## 保存一个新笔记

我们在 `Note` 里已经做了很多工作，是时候回到 demo app 的功能了。我们还没有给新的类添加任何方法呢，接下来就做这件事，补全所有缺失的功能。

首先要有笔记，需要告诉 App 如何正确地使用 SwiftyDB 来保存笔记和两个新创建的类。大部分的操作会在 `EditNoteViewController.swift` 中实现，打开此文件，在写代码之前，我先列出几条特别重要的属性：

 - `imageViews`：这个数组里有所有的 image view 对象，对象里有所有添加到笔记的图片。这个数组已经存在了，过会就能发现它的强大作用。
 - `currentFontName`：里面有应用于文本的字体名字。
 - `currentFontSize`：里面是文本的字体的字号。
 - `editedNoteID`：即将更新内容的笔记的 `noteID` 值（primary key）。一会儿我们就会用到。

基础的功能已经在初始工程中提前写好了，我们需要做的就是补全缺失的 `saveNote()` 方法中的逻辑。首先做两件事情：一、如果笔记没有标题或者笔记没有内容，那么，不允许用户保存笔记。二、在保存笔记时，隐藏键盘。如下：

    
    func saveNote() {
        if txtTitle.text?.characters.count == 0 || tvNote.text.characters.count == 0 {
            return
        }
        
        if tvNote.isFirstResponder() {
            tvNote.resignFirstResponder()
        }
         
    }

继续初始化一个新的 `Note` 对象，给各个属性赋值。images 属性需要特殊对待，我们在后边再处理。

    
    func saveNote() {
        ...
                
        let note = Note()
        note.noteID = Int(NSDate().timeIntervalSince1970)
        note.creationDate = NSDate()
        note.title = txtTitle.text
        note.text = tvNote.text!
        note.textColor = NSKeyedArchiver.archivedDataWithRootObject(tvNote.textColor!)
        note.fontName = tvNote.font?.fontName
        note.fontSize = tvNote.font?.pointSize
        note.modificationDate = NSDate()       
    }

现在稍微解释一下上面的代码：

 - `noteID` 属性需要 Int 类型的数字作为主键。你可以创建生成任何你想要的值，只要它们是独一无二的。在这里，我们把当前时间戳作为我们的主键，不过在实际的应用开发中这不是一个好主意，因为时间戳包含了太多数字。然而对我们目前的这个应用来说，时间戳还是一个不错的选择，毕竟这是创建独一无二数值最简单的方法。

 - 当我们第一次存储一条新笔记时，把当前时间（也就是 NSDate 对象）设置为创建日期和修改日期。
 
 - 这里唯一需要特殊处理的行为是将文本颜色转换成 NSData 对象，通过使用 `NSKeyedArchiver` 类来存储颜色对象。
 
接下来看如何存储图片。我们创建一个新的方法来处理图片数组。这个方法主要做两件事：将实际图片存储到应用的 documents 目录下，给每个图片创建 `ImageDescriptor` 对象并添加到 `images` 数组里。

在实现这个方法之前，我们先要修改一下 `Note.swift` 文件。先看代码：

     
    func storeNoteImagesFromImageViews(imageViews: [PanningImageView]) {
        if imageViews.count > 0 {
            if images == nil {
                images = [ImageDescriptor]()
            }
            else {
                images.removeAll()
            }
            
            for i in 0..<imageViews.count {
                let imageView = imageViews[i]
                let imageName = "img_\(Int(NSDate().timeIntervalSince1970))_\(i)"
                
                images.append(ImageDescriptor(frameData: imageView.frame.toNSData(), imageName: imageName))
                
                Helper.saveImage(imageView.image!, withName: imageName)
            }
            
            imagesData = NSKeyedArchiver.archivedDataWithRootObject(images)
        }
        else {
            imagesData = NSKeyedArchiver.archivedDataWithRootObject(NSNull())
        }
    }

上面这个方法到底做了什么呢：

 1. 首先，我们确认 `images` 数组是否存在。如果为空，进行初始化，如果存在，我们只需要将里面的数据清除即可，在更新既有的笔记时，第二个方法在会非常有用。
 2. 然后对每个图片我们创建一个独一无二的名字，每个名字都类似这样：“img_12345679_1”。
 3. 使用 `init` 方法初始化一个新的 `ImageDescriptor` 方法， image view 的 frame 和名字是该方法的参数。`toNSData()` 方法已经实现好了，是 `CGRect` 的扩展，你可以从 `Extensions.swift` 文件里找到。目的是将 frame 转换成 `NSData` 对象。一旦新的 `ImageDescriptor` 对象准备好了，就可以添加到 `images` 数组里了。
 4. 我们将实际的图片存储到 documents 目录下，`saveImage(_: withName:)` 类方法可以在 `Helper.swift` 文件里找到，这里还有很多有用的类方法。
 5. 最后，当所有的 image views 都处理过后，通过 archiving（归档）我们将 `images` 数组转换成 `NSData` 对象，存储到 `imagesData` 属性里。上面代码中的最后一行，是 `NSCoding` 协议必须实现的方法。

上面的 `else` 看起来似乎有些多余，实际上很有用。默认情况下，`imagesData` 为空，如果某条笔记里没有添加图片，就会一直为空直。然而，SQLite 不识别 nil（空），SQLite 理解的是 `NSNull`，也就是转换成 `NSData` 对象。

回到 `EditNoteViewController.swift` 文件中，用上我们刚刚创建的方法：

    
    func saveNote() {
    	...
    	
    	note.storeNoteImagesFromImageViews(imageViews)
    }

现在回到 `Note.swift`，实现实际存储到数据库的方法。这里有个重点：SwiftyDB 可以同步或异步执行任何数据库相关操作，选择哪种方法取决于应用的性质。然而，我建议使用异步方法，这样在进行数据库操作时，不会阻塞主线程，也不会出现 UI 控件突然卡住这种不好的用户体验。不过我还是再强调一次，选择哪种方法，完全由你决定。

这里我们用异步方式来存储数据。如你所见，每个 SwiftyDB 方法都包含一个闭包，可以返回执行结果。你可以在[这里](http://oyvindkg.github.io/swiftydb/#resultFormat)阅读相关的信息，实际上，我建议你现在先去阅读。

现在来实现我们的新方法：

    
    func saveNote(shouldUpdate: Bool = false, completionHandler: (success: Bool) -> Void) {
        database.asyncAddObject(self, update: shouldUpdate) { (result) -> Void in
            if let error = result.error {
                print(error)
                completionHandler(success: false)
            }
            else {
                completionHandler(success: true)
            }
        }
    }

从上面的实现方法可以知道，我们要使用相同的方法来更新笔记。把 `shouldUpdate` 设置为布尔值，作为该方法的参数，然后根据 `asyncDataObject` 的值来判断是否创建一个新的笔记，或者更新一个已存在的笔记。

此外，第二个参数是 completion handler。能否用合适的参数值调用它，取决于我们的存储是否成功。当你的任务在后台使用异步方法时，我建议你使用 completion handler。这样，当任务完成后，你就能通知调用方法，将任何结果或者数据调回来。

上面你看到的这些，其他的数据库相关方法中也有。我们会先检查错误，然后根据是否存在结果来执行下一步的操作。在上面的例子中，如果出现错误，我们就可以调用 completion handler，传入 `false` 值，意味着存储失败，反之，我们传入 `true` 值，表示操作成功。

回到 `EditNoteViewController` 类，完成 `saveNote()` 方法。调用上面创建的方法，如果笔记存储成功了，pop 当前的 view controller，如果存储发生了错误，我们显示一段提示信息。

    
    func saveNote() {
    	 ...
        
        let shouldUpdate = (editedNoteID == nil) ? false : true
        
        note.saveNote(shouldUpdate) { (success) -> Void in
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
                if success {
                self.navigationController?.popViewControllerAnimated(true)
                }
                else {
                    let alertController = UIAlertController(title: "NotesDB", message: "An error occurred and the note could not be saved.", preferredStyle: UIAlertControllerStyle.Alert)
                    alertController.addAction(UIAlertAction(title: "OK", style: UIAlertActionStyle.Default, handler: { (action) -> Void in
                        
                    }))
                    self.presentViewController(alertController, animated: true, completion: nil)
                }
            })
        }
    }

注意上面方法中的 `shouldUpdate` 变量，它能否得到合适的值，取决于 `editedNoteID` 属性是否为空，也就是笔记是否被更新。

现在，你可以运行 App 然后试着存储一条新笔记了。如果你是按照上面一步一步走到现在的，那么存储笔记功能已经可以正常使用了。

## 下载和列出笔记

创建和存储新笔记的功能已经实现了，我们可以继续开发读取笔记功能了。读取笔记意味着将笔记列在 `NoteListViewController` 类中，在我们正式开始之前，先在 `Note.swift` 文件里读取数据。

    
    func loadAllNotes(completionHandler: (notes: [Note]!) -> Void) {
        database.asyncObjectsForType(Note.self) { (result) -> Void in
            if let notes = result.value {
                completionHandler(notes: notes)
            }
            
            if let error = result.error {
                print(error)
                completionHandler(notes: nil)
            }
        }
    }

SwiftyDB 里执行读取功能的方法是 `asyncObjectsForType(...)`，是一个异步执行的方法。结果要么是一个错误，要么就是从数据库里读取一个 note 对象集合（数组）。在第一种情况下，我们调用 completion handler 传入 nil，告诉调用者这里在读取数据时遇到了问题。在第二种情况下，把 'Note' 对象传入 completion handler，这样可以在方法之外使用它们。

现在回到 `NoteListViewController.swift` 文件，首先必须声明一个数组包含 `Note` 对象（刚刚从数据库中读取出来）。这个数组就是 tableview 的 datasource（很明显嘛）。所以，在类的开头，加入下列代码：

    
    var notes = [Note]()

除此之外，初始化一个新的 `Note` 对象，可以使用之前创建的 `loadAllNotes(...)` 方法：

    
    var note = Note()

是时候写一个简单的新方法了，调用上面的方法，读取所有存储在数据库中的对象，放到 `notes` 数组里。

    
    func loadNotes() {
        note.loadAllNotes { (notes) -> Void in
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
                if notes != nil {
                    self.notes = notes
                    self.sortNotes()
                    self.tblNotes.reloadData()
                }
            })
        }
    }

请注意，在读取所有的笔记后用主线程重新加载 tableview.当然，在重载之前，把所有的笔记存到 `notes` 数组里。

上面的两个方法就是我们所需的全部方法。有了这两个方法，我们就能从数据库里得到之前存储的笔记。别忘了，`loadNotes()` 必须在某个地方被调用，我们在 `viewDidLoad()` 方法中调用 `loadNotes()` 。

    
    override func viewDidLoad() {
    	...
    	
    	loadNotes()
    }

光是读取笔记还不够，读取笔记数据之后还要使用这些数据。我们先更新 tableview 的相关方法，从行数开始：

    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return notes.count
    }

接下来我们把笔记的数据放到 tableview 中，具体说来，我们会展示笔记的标题、创建笔记和修改笔记的日期。

    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("idCellNote", forIndexPath: indexPath) as! NoteCell
        
        let currentNote = notes[indexPath.row]
        
        cell.lblTitle.text = currentNote.title!
        cell.lblCreatedDate.text = "Created: \(Helper.convertTimestampToDateString(currentNote.creationDate!))"
        cell.lblModifiedDate.text = "Modified: \(Helper.convertTimestampToDateString(currentNote.modificationDate!))"
        
        return cell
        
    }

现在运行应用吧，你创建的所有笔记都会出现在 tableview 中了。

## 另外一种获取数据的方法

现在我们是用 `asyncObjectsForType(...)` 方法来加载数据库中所有的笔记。如你所知，这个方法会返回一个数组对象（在我们的例子里，就是 `Note` 对象），我觉得这个方法特别有用，但并不能适应所有情况。某些情况下，读取实际的数值数据会更方便。

这一点 SwiftyDB 也能做到，它提供了另外一种方法来获取数据：`asyncDataForType(...)` （或 `dataForType(...)`，如果你想使用同步操作的话）。它会返回一个字典类型的集合，格式 `[[String: SQLiteVlalue]]`（在这里 `SQLiteVlalue` 是任何一种支持的数据类型）。

你可以在[这里](http://oyvindkg.github.io/swiftydb/#asyncRetrieveData)和[这里](http://oyvindkg.github.io/swiftydb/#syncRetrieveData)找到更多的信息，我把这个任务留给你，作为一个练习：修改 `Note` 类，加载简单的数据和数值，而不是只加载对象。

## 更新一条笔记

我们还想让应用具有编辑笔记的功能，换句话说，当用户点击某一行时，我们就显示 `EditNoteViewController` 界面，其中包含这条笔记的所有信息；用户修改之后保存，我们需要存储笔记修改后的信息。

首先，在 `NoteListViewController.swift` 文件里，我们需要一个新的属性来存储所选笔记的 ID，所以我们在类的顶部写入下列代码：

    
    var idOfNoteToEdit: Int!

下面我们来实现一个 `UITableViewDelegate` 方法，根据所有的行找到对应的 `noteID` 值，通过 segue 来显示 `EditViewContrller`：

    
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        idOfNoteToEdit = notes[indexPath.row].noteID as Int
        performSegueWithIdentifier("idSegueEditNote", sender: self)
    }

在 `prepareForSegue(...)` 方法里，我们把 `idOfNoteToEdit` 值传给接下来出现的 view controller：

    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if let identifier = segue.identifier {
            if identifier == "idSegueEditNote" {
                let editNoteViewController = segue.destinationViewController as! EditNoteViewController
                editNoteViewController.delegate = self
                
                if idOfNoteToEdit != nil {
                    editNoteViewController.editedNoteID = idOfNoteToEdit
                    idOfNoteToEdit = nil
                }
            }
        }
    }

到这里我们已经完成了一半的工作了，在我们回到 `EditNoteViewController` 类之前，先去 `Note` 类里实现一个简单的新方法，能通过输入的 ID 值取回单条笔记的信息，下面是实现方法：

    
    func loadSingleNoteWithID(id: Int, completionHandler: (note: Note!) -> Void) {
        database.asyncObjectsForType(Note.self, matchingFilter: Filter.equal("noteID", value: id)) { (result) -> Void in
            if let notes = result.value {
                let singleNote = notes[0]
                
                if singleNote.imagesData != nil {
                    singleNote.images = NSKeyedUnarchiver.unarchiveObjectWithData(singleNote.imagesData) as? [ImageDescriptor]
                }
                
                completionHandler(note: singleNote)
            }
            
            if let error = result.error {
                print(error)
                completionHandler(note: nil)
            }
        }
    }

这里有个新东西，我们首次使用 `filter` 方法来对返回的结果进行过滤。使用 Filter 类里的 `equal(...)` 方法可以设置我们想要的过滤条件。别忘了看一下[这个](http://oyvindkg.github.io/swiftydb/#filterResults)链接，里面有更多实现过滤的方法（在从数据库里取数据或者对象时）。

通过上面的过滤方法，我们实际上可以让 SwiftyDB 只加载符合条件的笔记：上面方法中参数的值对应的 `noteID` 的笔记。当然，只会返回一条笔记，因为我们这里使用的是主键，一个主键只对应一个记录。

返回的结果会作为 `Note` 对象的数组，所以需要先获取集合的第一个（唯一一个）元素。然后，必须将 image data（如果存在的话）转换为 `ImageDescriptor` 对象数组，然后将其赋值给 `images` 属性。这点很重要，如果跳过这一步，下载下来的笔记里的图片都无法显示。最后，根据是否成功取得笔记数据，我们调用 completion handler。如果成功取得笔记，我们把读取来的对象传给 completion handler，让调用者使用，如果没有成功取得笔记，返回 nil，因为没有取得对象。

现在，回到 `EditNoteViewController.swift` 文件，声明并初始化一个新的 `Note` 属性：

    
    var editedNote = Note()

这个对象首先调用上面实现的新方法，然后存储从数据库中加载的数据。

使用 `loadSingleNote(...)` 方法来，根据 `editedNoteID` 属性来加载特定的某条笔记。对我们而言，我们要定义 `viewWillAppear(_:)` 方法，在这里我们要扩展一些逻辑。

在下面的代码中你会看到，`loadSingleNotedWithID(...)` 会在 completion handler 获取到笔记之后给所有属性赋值。也就是说，我们会设置笔记的标题、内容、文字颜色、文字字体等等。不仅如此，如果笔记里有图片，我们还会给每条笔记创建 images view 控件，控件的大小使用的当然是 `ImageDescriptor` 对象里具体的 frames 值。

    
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)
        
        if editedNoteID != nil {
            editedNote.loadSingleNoteWithID(editedNoteID, completionHandler: { (note) -> Void in
                dispatch_async(dispatch_get_main_queue(), { () -> Void in
                    if note != nil {
                        self.txtTitle.text = note.title!
                        self.tvNote.text = note.text!
                        self.tvNote.textColor = NSKeyedUnarchiver.unarchiveObjectWithData(note.textColor!) as? UIColor
                        self.tvNote.font = UIFont(name: note.fontName!, size: note.fontSize as CGFloat)
                        
                        if let images = note.images {
                            for image in images {
                                let imageView = PanningImageView(frame: image.frameData.toCGRect())
                                imageView.image = Helper.loadNoteImageWithName(image.imageName)
                                imageView.delegate = self
                                self.tvNote.addSubview(imageView)
                                self.imageViews.append(imageView)
                                self.setExclusionPathForImageView(imageView)
                            }
                        }
                        
                        self.editedNote = note
                        
                        self.currentFontName = note.fontName!
                        self.currentFontSize = note.fontSize as CGFloat
                    }
                })
            })
        }
    }

在所有属性都被赋值后，不要忘了把 `note` 赋值给 `editedNote` 对象，后面我们会用到。

这里还需要最后一步：更新 `saveNote()` 方法，这样当一条已有笔记更新内容后，不会创建一条新的 `Note` 对象，也不会生成一个新的主键和创建日期。

所以，找到这三行代码（在 `saveNote()` 方法里）：

    
    let note = Note()
    note.noteID = Int(NSDate().timeIntervalSince1970)
    note.creationDate = NSDate()

替换成下面这堆代码：

    
    let note = (editedNoteID == nil) ? Note() : editedNote
    
    if editedNoteID == nil {
        note.noteID = Int(NSDate().timeIntervalSince1970)
        note.creationDate = NSDate()
    }

剩下的部分保持不变（至少现在来说是这样）。

## 更新笔记列表

如果现在测试 App，你会发现创建新的笔记或者编辑某条笔记后，笔记清单没有更新。这很正常，因为你还没有开发这个功能呢，在这一节中，我们会修复这个问题。

你可能已经猜到了，我们会使用 `代理模式（Delegation pattern）` 来通知 `NoteListViewController` 类，告知 `EditViewController` 里发生的变动。我们的出发点是在 `EditViewController` 里创建一个新的协议，协议包含两个必须实现的方法，如下：

    
    protocol EditNoteViewControllerDelegate {
        func didCreateNewNote(noteID: Int)
        
        func didUpdateNote(noteID: Int)
    }

在这两种情况下，我们都给委托方法提供新的或编辑笔记的 ID 值。现在到 `EditNoteViewController` 类，添加下列属性：

    
    var delegate: EditNoteViewControllerDelegate!

最后，我们最后一次修改 `saveNote()` 方法，首先找到 completion handler 闭包：

    
    lf.navigationController?.popViewControllerAnimated(true)

将上面这行代码删掉，换成下方这堆的代码：

    
    if self.delegate != nil {
        if !shouldUpdate {
            self.delegate.didCreateNewNote(note.noteID as Int)
        }
        else {
            self.delegate.didUpdateNote(self.editedNoteID)
        }
    }
    self.navigationController?.popViewControllerAnimated(true)

从今往后，每当创建新笔记或者编辑已有笔后，对应的 delegate 方法就会被调用。目前我们只完成了一半的工作，让我们回到 `NoteListViewController.swift` 文件，首先在类的开头遵守新的协议：

    
    class NoteListViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, EditNoteViewControllerDelegate {
    	...
    }

接下来，在 `prepareForSegue(...)` 方法里，让 `NoteListViewController` 类成为 `EditNoteViewController` 的委托对象。在 `let editNoteViewController = segue.destinationViewController as! EditNoteViewController` 这行增加下方代码：

    
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        if let identifier = segue.identifier {
            if identifier == "idSegueEditNote" {
                let editNoteViewController = segue.destinationViewController as! EditNoteViewController
                editNoteViewController.delegate = self // 增加这一行代码
                
                ...
                
            }
        }
    }

不错，大部分的工作都完成了。还需要实现两个协议方法，我们先处理创建新笔记这种情况：

    
    func didCreateNewNote(noteID: Int) {
        note.loadSingleNoteWithID(noteID) { (note) -> Void in
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
                if note != nil {
                    self.notes.append(note)
                    self.sortNotes()
                    self.tblNotes.reloadData()
                }
            })
        }
    }

如你所见，我们从数据库里获取 `noteID` 参数值对应的对象，然后（如果对象存在）我们把对象添加到 `notes` 数组，重新加载 tableview。

继续实现另一个操作：

    
    func didUpdateNote(noteID: Int) {
        var indexOfEditedNote: Int!
        
        for i in 0..<notes.count {
            if notes[i].noteID == noteID {
                indexOfEditedNote = i
                break
            }
        }
        
        if indexOfEditedNote != nil {
            note.loadSingleNoteWithID(noteID, completionHandler: { (note) -> Void in
                if note != nil {
                    self.notes[indexOfEditedNote] = note
                    self.sortNotes()
                    self.tblNotes.reloadData()
                }
            })
        }
    }

在这种情况下，我们首先在 `notes` 字典里找到被编辑过笔记的 index，找到之后从数据库里加载对应的笔记，用新的对象替换旧的对象，然后更新 tableview，新的修改日期就会出现了。

## 删除记录

还有最后一个主要的功能没有开发，那就是删除笔记。很明显，我们需要在 `Note` 类里实现我们最后一个方法，每次想删除笔记时都会调用这个方法。请打开 `Note.swift` 文件。

这里唯一的一个知识点就是 SwiftyDB 方法会从数据库里直接删除数据，在接下来的实现方法中你会看到这一点。和以前一样，这个操作还是异步操作，一旦执行结束，调用 completion handler，最后用一个过滤器指明需要被删除的行。

    
    func deleteNote(completionHandler: (success: Bool) -> Void) {
        let filter = Filter.equal("noteID", value: noteID)
        
        database.asyncDeleteObjectsForType(Note.self, matchingFilter: filter) { (result) -> Void in
            if let deleteOK = result.value {
                completionHandler(success: deleteOK)
            }
            
            if let error = result.error {
                print(error)
                completionHandler(success: false)
            }
        }
    }

现在打开 `NoteListViewController.swift`，定义下一个方法 `UITableViewDataSource`：

    
        func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
    		if editingStyle == UITableViewCellEditingStyle.Delete {
    		
    		}
    	}

把上面的方法添加到代码中之后，每次你左滑一行笔记，右边会出现默认的 `Delete` 按钮。而且，当用户点击 Delete 按钮时，会执行 if 后面对应的代码，如下：

    
    func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == UITableViewCellEditingStyle.Delete {
            let noteToDelete = notes[indexPath.row]
            
            noteToDelete.deleteNote({ (success) -> Void in
                dispatch_async(dispatch_get_main_queue(), { () -> Void in
                    if success {
                        self.notes.removeAtIndex(indexPath.row)
                        self.tblNotes.reloadData()
                    }
                })
            })
        }
    }

首先，找到所选中行对应的对象，然后，调用 `Note` 类里的新方法进行删除，如果删除成功，从 `notes` 数组里移除 `Note` 对象，重新加载 tableview，更新 UI 显示内容。

就是这么简单！

## 那么，如何排序呢？

你可能正在想，如何对读取出来的数据进行排序。排序非常有用，可以基于一个或者多个字段进行升序或降序排列，最后改变返回数据的顺序。例如，我们可以将我们所有的笔记按照修改日期的先后进行排序。

不幸的是，在我写这篇教程时，SwiftyDB 还不支持对数据进行排序，这确实是个劣势，不过还有一个解决办法：手动排序。为了演示手动排序的方法，我们在 `NoteListViewController.swift` 文件里创建最后一个方法 `sortNotes()`。这里会使用 Swift 自带的 `sort()` 函数：

    
    func sortNotes() {
        notes = notes.sort({ (note1, note2) -> Bool in
            let modificationDate1 = note1.modificationDate.timeIntervalSinceReferenceDate
            let modificationDate2 = note2.modificationDate.timeIntervalSinceReferenceDate
            
            return modificationDate1 > modificationDate2
        })
    }

由于我们无法直接比较 `NSDate` 对象，我们先转换成时间戳（double 类型的值）。接着执行比较，返回比较的结果。上面的代码让我们进行笔记排序，最新修改的笔记排在 `notes` 数组最前面。

只要 `notes` 数组发生了改变，上面的方法就要被调用。我们先更新 `loadNotes` 方法，如下：

    
    func loadNotes() {
        note.loadAllNotes { (notes) -> Void in
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
                if notes != nil {
                    self.notes = notes
                    
                    self.sortNotes()  // 添加此行代码对所有的笔记进行排序
                    
                    self.tblNotes.reloadData()
                }
            })
        }
    }

接着在下方的两个 delegate 方法里做同样的事情：

    
    func didCreateNewNote(noteID: Int) {
        note.loadSingleNoteWithID(noteID) { (note) -> Void in
            dispatch_async(dispatch_get_main_queue(), { () -> Void in
                if note != nil {
                    self.notes.append(note)
    
                    self.sortNotes() // 添加此行代码对所有的笔记进行排序
                    
                    self.tblNotes.reloadData()
                }
            })
        }
    }

    
    func didUpdateNote(noteID: Int) {
        ...
        
        if indexOfEditedNote != nil {
            note.loadSingleNoteWithID(noteID, completionHandler: { (note) -> Void in
                if note != nil {
                    self.notes[indexOfEditedNote] = note
                    
                    self.sortNotes()  // 添加此行代码对所有的笔记进行排序
                    
                    self.tblNotes.reloadData()
                }
            })
        }
    }

现在再运行 App，所有的笔记都会按照它们的修改时间顺序显示。

## 总结

毫无疑问，SwiftyDB 是非常棒的工具，可以用在各种应用里。非常简单、高效且可靠，当我们的应用必须使用数据库时，SwiftyDB 可以满足各种需求。在本文的 demo 辅导教程里，我们了解了 SwiftyDB 的基本知识，还有很多东西等待你去学习。当然，如需更多帮助，这里有官方文档供你查阅。在今天的例子讲解中，为了方便编写辅导教程，我们创建的这个数据库有一个表对应 `Note` 类。在实际开发中，你想创建多少表就能创建多少表，只要有对应的 model 代码即可（对应的类）。就我个人而言，我肯定会在我的项目中使用 SwiftyDB 的，实际上，我正在这样做。现在你已经了解了 SwiftyDB，你也见识了它如何工作的，如何实现的。SwiftyDB 能否成为你工具箱里的新成员，完全由你决定。总之，我希望阅读这篇文章并不是在浪费你的时间，希望你也学到了一些新的知识，在我们下一教程出来之前，祝您开心！

仅供参考，你可以[在 GitHub 上下载完整的工程](https://github.com/appcoda/SwiftyDB-Demo)
> 本文由 SwiftGG 翻译组翻译，已经获得作者翻译授权，最新文章请访问 [http://swift.gg](http://swift.gg)。