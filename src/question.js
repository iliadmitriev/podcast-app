export class Question {
    static create(question) {
        return fetch('https://podcast-app-idm-default-rtdb.firebaseio.com/question.json', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify(question)
        })
            .then(response => response.json())
            .then(data => {
                question.id = data.name
                return question
            })
            .then(question => _addToLocalStorage(question))
            .then(() => Question.renderList())
            .catch()
    }
    
    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error">Ошибка: не верный логин или пароль</p>')
        }
        return fetch(`https://podcast-app-idm-default-rtdb.firebaseio.com/question.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                if (response && response.error) {
                    return `<p class="error">${response.error}</p>`
                }
                return response
                    ? Object.keys(response).map(key => ({
                        id: key,
                        ...response[key]
                    }))
                    : []
            })
    }
    
    static renderList() {
        const questions = _getQuestionsFromLocalStorage()
        const html = questions.length
            ? questions.map(toCard).join(' ')
            : `<div class="mui--text-headline">Нет вопросов</div>`
        const list = document.getElementById('list')
        list.innerHTML = html
    }
    
    static listToHTML(questions) {
        return questions.length
            ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
            : '<p>Вопросов нет</p>'
    }
}

const toCard = (question) => `
                <div class="mui--text-black-54">
                    ${new Date(question.date).toLocaleDateString()}
                    ${new Date(question.date).toLocaleTimeString()}
                </div>
                <div>${question.text}</div>
                <br>
`


function _addToLocalStorage(question) {
    const allQuestionRecords = _getQuestionsFromLocalStorage()
    allQuestionRecords.push(question)
    localStorage.setItem('question', JSON.stringify(allQuestionRecords))
}

function _getQuestionsFromLocalStorage() {
    try {
        if (!Array.isArray(JSON.parse(localStorage.getItem('question')) || '[]')) {
            return JSON.parse('[]')
        }
        return JSON.parse(localStorage.getItem('question') || '[]')
    } catch (e) {
        console.error('Ошибка в localStorage по ключу question не массив json', e)
        return JSON.parse('[]')
    }
}