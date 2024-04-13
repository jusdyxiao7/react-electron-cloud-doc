/**
 * @作者 Conor Sun
 * @开源仓库 $ http://github.com/jusdyxiao7
 * @创建时间 2024/4/13 0013 下午 14:53
 */
// const fs = window.require('fs')
// const path = window.require('path')
const fs = require('fs')
const path = require('path')


const fileHelper = {
    readFile: (path, cb) => {
        fs.readFile(path, {encoding: 'utf8'}, (err, data) => {
            if (!err) {
                cb(data)
            }
        })
    },
    writeFile: (path, content, cb) => {
        fs.writeFile(path, content, {encoding: 'utf8'}, (err) => {
            if (!err) {
                cb()
            }
        })
    }
}

const testPath = path.join(__dirname, 'helper.js')
const testWritePath = path.join(__dirname, 'hello.md')

fileHelper.readFile(testPath, (data) => {
    console.log(data)
})
fileHelper.writeFile(testWritePath, '## hello world', () => {
    console.log('写入成功')
})
