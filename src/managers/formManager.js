const responsesMap = new Map()

const addResponse = (userId, response) => {
    let responses = getResponses(userId)
    if (responses) {
        responses.push(response)
    } else {
        responses = [response]
    }
    responsesMap.set(userId, responses)
}

const clearResponse = (userId) => {
    responsesMap.delete(userId)
}

const getResponse = (userId, question) => getResponses(userId)[question-1]

const getResponses = (userId) => responsesMap.get(userId)

module.exports = {addResponse, clearResponse, getResponse, getResponses}