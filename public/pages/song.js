import { startRequest } from './../script.js'

window.addEventListener('load', e => {
    const headers = {};
    const request = new Request('/list?list=songs', { method: 'GET', headers });
    startRequest('songs', request, document.querySelector('.table-div > table tbody'), 'beforeend', '/');
})

document.querySelector('tbody').addEventListener('click', e => {
    if (!e.target.classList.contains('name')) return;
    const link = e.target.parentElement.querySelector('.dl > a').href;
    const player = document.querySelector('.player-div');
    player.classList.remove('hidden');
    const src = document.createElement('source');
    console.log(link);
    src.src = link;
    src.type = 'audio/mpeg';
    console.log(src);
    player.querySelector('audio').innerHTML = '';
    player.querySelector('audio').appendChild(src);
})