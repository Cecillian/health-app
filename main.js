const tabs = ['home', 'food', 'fitness', 'sleep'];

function showTab (t) {
    tabs.forEach(tab => {
      document.getElementById(tab).classList.add('hidden');
      document.getElementById(`open-${tab}`).classList.remove('active');
    });
    document.getElementById(t).classList.remove('hidden');
    document.getElementById(`open-${t}`).classList.add('active');
  }
  
  tabs.forEach(t => {
    document.getElementById(`open-${t}`).addEventListener('click', () => {
      showTab(t);
    });
  });
  
  showTab(tabs[0]);