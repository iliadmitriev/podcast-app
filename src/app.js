import {Question} from "./question"
import {createModal, isValid} from "./utils"
import {authWithEmailAndPassword, getAuthForm} from "./auth"
import './style.css'


const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')

form.addEventListener('submit', submitFormHandler)
input.addEventListener('input', () => submitBtn.disabled = !isValid(input.value))
window.addEventListener('load', Question.renderList)
modalBtn.addEventListener('click', openModal)

function submitFormHandler(ev) {
    ev.preventDefault()
    if (isValid(input.value)) {
        const question = {
            text: input.value.trim(),
            date: new Date().toJSON()
        }
        submitBtn.disabled = true
        Question.create(question).then(() => {
            input.value = ''
            input.className = ''
            submitBtn.disabled = false
        })
        
    }
}

function openModal() {
    createModal('Авторизация', getAuthForm())
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler, {once: true})
}

function authFormHandler(ev) {
    ev.preventDefault()
    const btnSubmit = ev.target.querySelector('button')
    const email = ev.target.querySelector('#email').value
    const password = ev.target.querySelector('#password').value

    btnSubmit.disabled = true
    authWithEmailAndPassword(email, password)
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .finally(() => btnSubmit.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка', content)
    } else {
        createModal('Список вопросов', Question.listToHTML(content))
    }
}