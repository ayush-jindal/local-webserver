const startRequest = (category, request, HTMLelem, posn, path, childCls) => {
    console.log(path);
    fetch(request)
        .then(resp => resp.json())
        .then(body => { insertRows(category, HTMLelem, body, posn, path, childCls) });
}

const insertRows = (category, HTMLelem, body, posn, path, childCls) => {
    body.forEach((elem, index) => { createAndInsertHTML(elem, index, category, body, HTMLelem, posn, path, childCls); });
}

const expandCollapse = (e, category, path, childCls) => {
    const classes = [...e.target.closest('button').classList].filter(cls => cls !== 'toggle');
    e.target.closest('button').classList.toggle('expanded');
    e.target.closest('button').classList.toggle('collapsed');
    if (classes.includes('collapsed')) {
        // classlist of node now toggle expanded name
        const name = classes.filter(cls => cls !== 'collapsed');
        const headers = {};
        const newPath = `${path}${name}/`
        console.log(`/list?list=${category}&path=${newPath}`);
        const request = new Request(`/list?list=${category}&path=${newPath}`, { method: 'GET', headers });
        startRequest(category, request, e.target.closest('tr'), 'afterend', `${newPath}`, childCls + (childCls ? '-child' : 'child'));
    } else {
        // classlist of node now toggle expanded name
        while ([...e.target.closest('tr').nextElementSibling.classList].some(cls => cls.includes('child')))
            e.target.closest('tr').nextElementSibling.remove();
    }
}

const createAndInsertHTML = (elem, index, category, body, HTMLelem, posn, path, childCls) => {
    const tr = document.createElement('tr');
    if (childCls) tr.classList.add(childCls);
    const td1 = document.createElement('td');
    td1.classList.add('name');
    td1.textContent = elem[0];
    tr.appendChild(td1);
    const td2 = document.createElement('td');
    td2.classList.add('type');
    if (elem[1]) {
        td2.textContent = 'file';
    } else {
        td2.textContent = 'directory';
        const div = document.createElement('div');
        div.classList.add('img-div');
        const btn = document.createElement('button');
        btn.classList.add('toggle', 'collapsed', elem[0]);
        btn.onclick = e => { expandCollapse(e, category, path, childCls) };
        div.appendChild(btn);
        td2.appendChild(div);
    }
    tr.appendChild(td2);
    const td3 = document.createElement('td');
    const a = document.createElement('a');
    a.href = `/download?category=${category}&file=${body[index][0]}&type=${elem[1] ? 'file' : 'directory'}&path=${path}`;
    a.target = '_blank';
    a.classList.add('file-dl');
    a.download = elem[0];
    a.textContent = 'Download';
    td3.appendChild(a);
    tr.appendChild(td3);
    HTMLelem.insertAdjacentElement(posn, tr);
}

export { startRequest }