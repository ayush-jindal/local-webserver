window.addEventListener('load', e => {
    const headers = {};
    const request = new Request('/list?list=books', { method: 'GET', headers });
    startRequest(request, document.querySelector('.table-div > table tbody'), 'beforeend', '/');
})

const startRequest = (request, HTMLelem, posn, path) => {
    fetch(request)
        .then(resp => resp.json())
        .then(body => { insertRows(HTMLelem, body, posn, path) });
}

const insertRows = (HTMLelem, body, posn, path) => {
    body.forEach((elem, index) => {
        const html = `<tr><td>${elem[0]}</td><td>${elem[1] ? 'file' : `directory<br><a id="${index}" class="expand ${elem[0]}" href="javascript:;">Click to expand</a>`}</td><td><a href="${`/book-download?file=${body[index][0]}&type=${elem[1] ? 'file' : 'directory'}&path=${path}`}" target="_blank" class="file-dl">Download</a></td></tr>`
        HTMLelem.insertAdjacentHTML(posn, html);
    });
    HTMLelem.querySelectorAll('.expand').forEach(link => {
        link.addEventListener('click', e => {
            const name = [...e.target.classList].filter(cls => cls !== 'expand')[0];
            const headers = {};
            const request = new Request(`/list?list=books&path=${name}`, { method: 'GET', headers });
            // e.target.closest('tr').insertAdjacentHTML('afterend', '<div><table><tbody></tbody></table></div>');
            // console.log(e.target.closest('tr').nextElementSibling.querySelector('tbody'));
            startRequest(request, e.target.closest('tr'), 'afterend', `${path}${name}/`);
        })
    })
}

