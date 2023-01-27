const {glob} = require('glob')
const {promisify} = require('util')
const proGlob = promisify(glob)

const loadFiles = async (dirName) => {
    const files = await proGlob(`${process.cwd().replace(/\\/g, '/')}/src/${dirName}/*.js`)
    files.forEach(file => delete require.cache[require.resolve(file)])
    return files
}

module.exports = {loadFiles}