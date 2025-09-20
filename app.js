let startDate = localStorage.getItem('quitStartDate') || Date.now();

function updateCounter() {
    const now = Date.now();
    const diff = now - startDate;
    
    // Дни
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    document.getElementById('days').textContent = days;
    
    // Сэкономленные деньги (150₽/день)
    const saved = days * 150;
    document.getElementById('saved').textContent = saved.toLocaleString();
    
    // Время в часах
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    document.getElementById('time').textContent = hours;
    
    // Обновление каждую минуту
    setTimeout(updateCounter, 60000);
}

// Запуск
updateCounter();

function resetCounter() {
    if (confirm('Сбросить счётчик? Это нельзя будет отменить!')) {
        localStorage.removeItem('quitStartDate');
        startDate = Date.now();
        updateCounter();
    }
}