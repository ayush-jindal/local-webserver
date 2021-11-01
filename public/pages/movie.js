import { startRequest } from './../script.js'

window.addEventListener('load', e => {
    const headers = {};
    const request = new Request('/list?list=movies', { method: 'GET', headers });
    startRequest('movies', request, document.querySelector('.table-div > table tbody'), 'beforeend', '/');
})
