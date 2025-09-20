let startDate = localStorage.getItem('quitStartDate');
let isStarted = startDate ? true : false;

// Параметры курения
const CIGARETTES_PER_DAY = 20; // пачка в день
const CIGARETTE_PRICE = 170 / 20; // 170₽ за пачку = 8.5₽ за сигарету
const SECONDS_PER_DAY = 24 * 60 * 60;

// Массив с фактами о бросании курить
const facts = [
    "Через 20 минут: нормализуется давление и пульс",
    "Через 8 часов: уровень кислорода в крови возвращается к норме",
    "Через 24 часа: риск сердечного приступа снижается",
    "Через 48 часов: обоняние и вкус начинают восстанавливаться",
    "Через 72 часа: бронхи начинают расслабляться, дышать легче",
    "Через 2 недели: улучшается кровообращение, лёгкие работают лучше",
    "Через 1 месяц: кашель уменьшается, лёгкие очищаются",
    "Через 3 месяца: лёгкие функционируют на 30% лучше",
    "Через 9 месяцев: риск респираторных инфекций падает вдвое",
    "Через 1 год: риск коронарной болезни сердца уменьшается вдвое",
    "Через 5 лет: риск инсульта снижается до уровня некурящего",
    "Через 10 лет: риск рака лёгких уменьшается на 50%",
    "Через 15 лет: риск сердечных заболеваний как у некурящего",
    "Каждый день без сигарет — это +11 минут жизни!",
    "Сигареты содержат 4000+ химикатов, 60 из них — канцерогены",
    "Никотин — один из самых сильных ядов для нервной системы",
    "У курильщиков кожа стареет в 2 раза быстрее",
    "Курение крадёт 10 лет жизни в среднем",
    "Через 1 день без курения печень начинает регенерировать",
    "Каждый выкуренный блок — минус 2 дня жизни",
    "Одна сигарета отравляет организм на 25 минут",
    "Курение повышает риск инфаркта в 4 раза",
    "Через 72 часа без никотина нервная система успокаивается",
    "Лёгкие курильщика покрыты смолой толщиной 1 мм"
];

function getRandomFact() {
    return facts[Math.floor(Math.random() * facts.length)];
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    
    if (!isStarted) {
        // До старта
        document.getElementById('days').textContent = '0';
        document.getElementById('time').textContent = '00:00:00';
        document.getElementById('saved').textContent = '0';
        document.getElementById('cigarettes').textContent = '0';
        document.getElementById('dailyFact').textContent = 'Нажми "Я БРОСИЛ!" чтобы начать отсчёт';
        startBtn.textContent = '🚭 Я БРОСИЛ!';
        startBtn.classList.remove('started');
        return;
    }
    
    // После старта
    startBtn.textContent = '✅ Отлично! Продолжай!';
    startBtn.classList.add('started');
    
    const now = Date.now();
    const diff = now - startDate;
    const totalSeconds = Math.floor(diff / 1000);
    
    // Дни (полные)
    const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
    document.getElementById('days').textContent = days;
    
    // Сигарет НЕ выкурил (ТОЧНО ПО СЕКУНДАМ)
    const totalDaysFraction = totalSeconds / SECONDS_PER_DAY;
    const cigarettesSaved = Math.floor(totalDaysFraction * CIGARETTES_PER_DAY);
    document.getElementById('cigarettes').textContent = cigarettesSaved.toLocaleString();
    
    // Сэкономленные деньги (по сигаретам)
    const saved = Math.floor(cigarettesSaved * CIGARETTE_PRICE);
    document.getElementById('saved').textContent = saved.toLocaleString();
    
    // Время в пределах дня
    const remainingSeconds = totalSeconds % SECONDS_PER_DAY;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    document.getElementById('time').textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Факт дня
    const factKey = `fact_${days}`;
    let dailyFact = localStorage.getItem(factKey);
    if (!dailyFact) {
        dailyFact = getRandomFact();
        localStorage.setItem(factKey, dailyFact);
    }
    document.getElementById('dailyFact').textContent = dailyFact;
}

function startQuit() {
    if (!isStarted) {
        startDate = Date.now();
        localStorage.setItem('quitStartDate', startDate);
        isStarted = true;
        updateUI();
    }
}

// Запуск каждую секунду
updateUI();
setInterval(updateUI, 1000);

function resetCounter() {
    if (confirm('Сбросить счётчик? Это нельзя будет отменить!')) {
        // Удаляем все сохранённые факты
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fact_')) {
                localStorage.removeItem(key);
            }
        });
        localStorage.removeItem('quitStartDate');
        startDate = null;
        isStarted = false;
        updateUI();
    }
}

// Проверяем при загрузке страницы
if (isStarted) {
    updateUI();
}
