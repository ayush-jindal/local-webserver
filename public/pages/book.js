import { startRequest } from './../script.js'

window.addEventListener('load', e => {
    const headers = {};
    const request = new Request('/list?list=books', { method: 'GET', headers });
    startRequest('books', request, document.querySelector('.table-div > table tbody'), 'beforeend', '/', '');
})

