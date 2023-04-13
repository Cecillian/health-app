const tabs = ['home', 'food', 'fitness', 'sleep'];

function formatTime (time) {
  let [hh, mm] = time.split(':').map(v => Number(v));
  if (hh > 12) {
    if (mm < 10){
      return `${hh - 12}: 0${mm} PM`;
    }else{
      return `${hh - 12}: ${mm} PM`;
    }
  }else if(hh == 0) {
    if (mm < 10) {
      return `${hh + 12}: 0${mm} AM`;
    } else {
      return `${hh + 12}: ${mm} AM`;
    }
  }else if(hh == 12){
    if (mm < 10){
      return `${hh}: 0${mm} PM`;
    }else{
      return `${hh}: ${mm} PM`;
    }
  }else{
    if (mm < 10){
      return `${hh}: 0${mm} AM`;
    }else{
      return `${hh}: ${mm} AM`;
    }
  }
}

function findLatestGoal () {
  let goalStore = localStorage.getItem('store');
  var temp = [];
  if (goalStore) {
    goalStore = JSON.parse(goalStore);
    if (goalStore.goals) {
      for (let goal of goalStore.goals) {
        temp.push(goal)
      }
      return temp; 
    }
  }
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

function findLatestWorkout () {

}

function findLatestSleep () {

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

    let fit = false;
    if (fit) {

    } else {
      document.getElementById('recentFitness').textContent = 'No record.'
    }

    let sleep = false;
    if (sleep) {

    } else {
      document.getElementById('recentSleep').textContent = 'No record.'
    }

    let daily = findLatestGoal();
    console.log(daily);
    if (daily.length != 0) {
      var goalList = ""
      for (let item of daily) {
        goalList += item + '\n'
      }
      console.log(goalList);
      document.getElementById('food-goals').textContent = `${goalList}`
    } else {
      document.getElementById('food-goals').textContent = `No goals yet.`
    }

    let dailyFitness = []
    if (dailyFitness.length != 0) {
      var goalList = ""
      for (let item of dailyFitness) {
        goalList += item + '\n'
      }
      console.log(goalList);
      document.getElementById('fitness-goals').textContent = `${goalList}`
    } else {
      document.getElementById('fitness-goals').textContent = `No goals yet.`
    }

    let dailySleep = []
    if (dailySleep.length != 0) {
      var goalList = ""
      for (let item of dailySleep) {
        goalList += item + '\n'
      }
      console.log(goalList);
      document.getElementById('sleep-goals').textContent = `${goalList}`
    } else {
      document.getElementById('sleep-goals').textContent = `No goals yet.`
    }
  }
}

tabs.forEach(t => {
  document.getElementById(`open-${t}`).addEventListener('click', () => {
    showTab(t);
  });
});

showTab(tabs[0]);