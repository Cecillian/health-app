let goalList = document.getElementById('goal-list');
let goalForm = document.getElementById('goal-form');
let goalInput = document.getElementById('goal-input');
let list = document.getElementById('list');
let listForm = document.getElementById('list-form');
let listInput = document.getElementById('list-input');
let modal = document.getElementById('add-item-modal');

let currentAddingIndex = 0;

function pad (num) {
  return num >= 10 ? num : '0' + num;
}

let storedData = localStorage.getItem('store');
let store = storedData ? JSON.parse(storedData) : {
  goals: [],
  list: [],
};

function saveStore () {
  localStorage.setItem('store', JSON.stringify(store));
}

function formatDate (date) {
  return new Date(date).toLocaleString('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatTime (time) {
  let [hh, mm] = time.split(':').map(v => Number(v));
  if (hh > 12) {
    return `${hh - 12}: ${mm} PM`;
  }
  return `${hh}: ${mm} AM`;
}

function renderGoals () {
  let { goals } = store;
  goalList.innerHTML = goals.map((v, i) => `
  <div class="goal">
  <input type="checkbox" data-index="${i}" data-action="check-goal">
  <div>${v}</div>
  </div>
  `).join('');
}

let dragging = null;
let over = null;

function findDraggingEl (e, cls) {
  return e.target.classList.contains(cls) ? e.target : e.target.closest(`.${cls}`);
}

function dragStart (e, cls) {
  e.stopPropagation();
  let el = findDraggingEl(e, cls);
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', null);
  dragging = el;
  over = null;
  // console.log('start', dragging);
}

function dragEnd (e) {
  e.stopPropagation();
  swap(dragging, over);
  dragging = null;
  over = null;
}

function dragOver (e, cls) {
  e.stopPropagation();
  if (!dragging) return;
  let el = findDraggingEl(e, cls);
  if (!el) return;
  if (dragging.getAttribute('data-group') !== el.getAttribute('data-group')) return;
  over = el;
}

function _swap (arr, i, j) {
  let b = arr[j];
  arr[j] = arr[i];
  arr[i] = b;
}

function swap (node1, node2) {
  if (node1 === node2) {
    return;
  }
  // console.log(node1, node2);
  if (node1.getAttribute('data-group-index')) {
    _swap(
      store.list[node1.getAttribute('data-group-index')].meals,
      node1.getAttribute('data-index'),
      node2.getAttribute('data-index')
    );
  } else {
    _swap(
      store.list,
      node1.getAttribute('data-index'),
      node2.getAttribute('data-index')
    );
  }
  saveStore();
  renderList();
}

function renderList () {
  list.innerHTML = store.list.map((v, i) => `
  <div 
    class="list-item"  
    draggable="true"
    data-index="${i}"
    data-group="list"
    ondragstart="dragStart(event, 'list-item')"
    ondragend="dragEnd(event)"
    ondragover="dragOver(event, 'list-item')"
  >
  <div class="list-title">
<div class="name">${formatDate(v.date)}</div>
  <div class="delete d-none" data-action="delete" data-index="${i}">×</div>
  <div class="more" data-action="more">⫶</div>
</div>
  ${v.meals.map((m, j) => `
  <div 
    class="list-meal"
    data-action="edit"
    data-index="${j}"
    data-group-index="${i}"
    draggable="true"
    data-group="item-${i}"
    ondragstart="dragStart(event, 'list-meal')"
    ondragend="dragEnd(event)"
    ondragover="dragOver(event, 'list-meal')"
   >
  <div class="name">${formatTime(m.Time)} - ${m.Name}</div>
  <div class="delete d-none" data-action="delete" data-group-index="${i}" data-index="${j}">×</div>
  <div class="more" data-action="more">⫶</div>
  </div>
  `).join('')}
  <div class="list-add"><button type="button" data-action="add" data-index="${i}">+ New Item</button></div>
  </div>
  `).join('');
}

renderGoals();
renderList();

/**
 * add goal
 */
goalForm.addEventListener('submit', e => {
  e.preventDefault();
  let goal = goalInput.value;
  store.goals.push(goal);
  saveStore();
  renderGoals();
  goalInput.value = '';
});

/**
 * add list item
 */
listForm.addEventListener('submit', e => {
  e.preventDefault();
  let date = listInput.value;
  store.list.unshift({
    date: new Date(date).getTime(),
    meals: []
  });
  saveStore();
  renderList();
  listInput.value = '';
});

let editGroupIndex = null;
let editIndex = null;

/**
 * global event delegator
 */
document.addEventListener('click', e => {
  let action = e.target.getAttribute('data-action');
  let closet = e.target.closest('[data-action]');
  let closetAction = closet ? closet.getAttribute('data-action') : '';
  if (action === 'check-goal') {
    e.target.parentNode.style['text-decoration'] = 'line-through';
    setTimeout(() => {
      let index = Number(e.target.getAttribute('data-index'));
      store.goals.splice(index, 1);
      saveStore();
      renderGoals();
    }, 500);
  } else if (action === 'add') {
    editIndex = null;
    editGroupIndex = null;
    modal.querySelector('.add-title').textContent = 'Add Item';
    modal.classList.remove('d-none');
    modal.querySelector('form').reset();
    let now = new Date();
    currentAddingIndex = Number(e.target.getAttribute('data-index'));
    modal.querySelector('input[type=time]').value = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  } else if (action === 'more') {
    let del = e.target.parentNode.querySelector('.delete');
    del.classList.toggle('d-none');
  } else if (action === 'delete') {
    let groupIndex = e.target.getAttribute('data-group-index');
    let index = e.target.getAttribute('data-index');
    if (groupIndex) {
      store.list[groupIndex].meals.splice(index, 1);
    } else {
      store.list.splice(index, 1);
    }
    saveStore();
    renderList();
  } else if (closetAction === 'edit') {
    editGroupIndex = closet.getAttribute('data-group-index');
    editIndex = closet.getAttribute('data-index');
    let data = store.list[editGroupIndex].meals[editIndex];
    let form = modal.querySelector('form');
    modal.querySelector('.add-title').textContent = 'Edit Item';
    //form.reset();
    for (let k in data) {
      form.querySelector(`[name=${k}]`).value = data[k];
    }
    modal.classList.remove('d-none');
  }
});

modal.querySelector('.cancel').addEventListener('click', e => {
  modal.classList.add('d-none');
});

modal.querySelector('form').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.target);
  const value = Object.fromEntries(data.entries());
  if (editIndex !== null) {
    store.list[editGroupIndex].meals[editIndex] = value;
  } else {
    store.list[currentAddingIndex].meals.push(value);
  }
  saveStore();
  renderList();
  e.target.reset();
  modal.classList.add('d-none');
});

