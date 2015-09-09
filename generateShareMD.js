import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'


let basePath = './source/_posts'
let targetPath = './share/'


let originInfo = new Promise(function (resolve, reject) {
  fs.readdir(basePath, (err, files) => {
    if (err) throw err
    resolve(files.filter(file => !(file.indexOf(".") === 0)))
  })
})
.then(files => Promise.all(
  files.map(
    file => new Promise((resolve, reject) =>
      fs.readFile(path.join(basePath, file), function (err, content) {
        if (err) throw err
        content = content.toString()
        resolve({
          dirName: content.match(/permalink: (.*)/)[1].trim(),
          fileName: content.match(/title: "(.*)"/)[1].trim(),
          content: content
        })
      })
    )
  )
))
.then(files => files.map(file => {
  let origin = file.content
  origin = origin.substr(origin.indexOf("---") + 3)
  origin = origin.replace(/!\[(.*?)\]\((.*?)\)/g, "![$1](http://swift.gg$2)")
  origin = origin.replace(/<center>!\[给译者打赏\]\(.*?\)<\/center>/, "")
  origin = origin.replace("<!--more-->", "")
  let jianshu = origin
  jianshu = file.fileName + "\n" + jianshu
  let wechat = file.fileName + "\n" + origin
  return {
    dirName: file.dirName,
    jianshu: jianshu,
    wechat: wechat
  }
}))
.then(shareContents => shareContents.map(
  shareContent => {
    new Promise((resolve, reject) => {
      let fullPath = path.join(targetPath, shareContent.dirName, "jianshu.md")
      mkdirp(path.dirname(fullPath), err => {
        if (err) throw err
        fs.writeFile(fullPath, shareContent.jianshu, (err) => {
          if (err) throw err
          resolve()
        })
      })
    })
    .then(() => {
      new Promise((resolve, reject) => {
        let fullPath = path.join(targetPath, shareContent.dirName, "wechat.md")
        mkdirp(path.dirname(fullPath), err => {
          if (err) throw err
          fs.writeFile(fullPath, shareContent.wechat, (err) => {
            if (err) throw err
            resolve()
          })
        })
      })
    })
  }
))
.catch(err => console.log(err))