const startRequest = (category, request, HTMLelem, posn, path, childCls) => {
    fetch(request)
        .then(resp => resp.json())
        .then(body => { insertRows(category, HTMLelem, body, posn, path, childCls) });
}

const insertRows = (category, HTMLelem, body, posn, path, childCls) => {
    body.forEach((elem, index) => { createAndInsertHTML(elem, index, category, body, HTMLelem, posn, path, childCls); });
    HTMLelem.querySelectorAll('.toggle').forEach(link => {
        link.addEventListener('click', e => {
            const classes = [...e.target.closest('a').classList].filter(cls => cls !== 'toggle');
            e.target.closest('a').classList.toggle('expanded');
            e.target.closest('a').classList.toggle('collapsed');
            if (classes.includes('collapsed')) {
                // classlist of node now toggle expanded name
                const name = classes.filter(cls => cls !== 'collapsed');
                const headers = {};
                console.log(e.target);
                console.log(`/list?list=${category}&path=${name}`);
                const request = new Request(`/list?list=${category}&path=${name}`, { method: 'GET', headers });
                startRequest(category, request, e.target.closest('tr'), 'afterend', `${path}${name}/`, childCls + childCls ? '-child' : 'child');
            } else {
                // classlist of node now toggle expanded name
                //start collapsing fnality here
            }
        })
    })
}

const createAndInsertHTML = (elem, index, category, body, HTMLelem, posn, path, childCls) => {
    const html = `<tr><td class="name ${childCls}">${elem[0]}</td><td class="type">${elem[1] ? 'file' : `directory\
<a id="${index}" class="toggle collapsed ${elem[0]}" href="javascript:;"><img src="images?img=drop-down.png"></a>`}\
</td><td class="dl"><a href="${`/download?category=${category}&file=${body[index][0]}&type=${elem[1] ? 'file' : 'directory'}\
&path=${path}`}" target="_blank" class="file-dl" download="${elem[0]}">Download</a></td></tr>`
    HTMLelem.insertAdjacentHTML(posn, html);
}

export { startRequest }