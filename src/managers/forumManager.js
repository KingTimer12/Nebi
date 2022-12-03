const tagsEmoji = []

const add = (name, id) => {
    tagsEmoji.push({name: name, id: id})
}

const array = () => {return tagsEmoji}

module.exports = {add, array}