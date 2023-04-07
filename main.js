const tabs = ['home', 'food', 'fitness', 'sleep'];

function formatTime (time) {
  let [hh, mm] = time.split(':').map(v => Number(v));
  if (hh > 12) {
    return `${hh - 12}: ${mm} PM`;
  }
  return `${hh}: ${mm} AM`;
}

function findLatestMeal () {
  let foodStore = localStorage.getItem('store');
  if (foodStore) {
    foodStore = JSON.parse(foodStore);
    if (foodStore.list) {
      foodStore.list.sort((a, b) => b.date - a.date);
      for (let day of foodStore.list) {
        if (day.meals) {
          day.meals.sort((a, b) => b.Time.localeCompare(a.Time));
          // console.log(day.meals);
          for (let meal of day.meals) {
            return meal;
          }
        }
      }
    }
  }
}

function showTab (t) {
  tabs.forEach(tab => {
    document.getElementById(tab).classList.add('hidden');
    document.getElementById(`open-${tab}`).classList.remove('active');
  });
  document.getElementById(t).classList.remove('hidden');
  document.getElementById(`open-${t}`).classList.add('active');

  if (t === 'home') {
    let f = findLatestMeal();
    if (f) {
      document.getElementById('recentFood').textContent = `${formatTime(f.Time)} - ${f.Name}`
    } else {
      document.getElementById('recentFood').textContent = `No record.`
    }
  }
}

tabs.forEach(t => {
  document.getElementById(`open-${t}`).addEventListener('click', () => {
    showTab(t);
  });
});

showTab(tabs[0]);