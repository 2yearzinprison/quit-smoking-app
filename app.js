let startDate = localStorage.getItem('quitStartDate');
let isStarted = startDate ? true : false;

const CIGARETTES_PER_DAY = 20;
const PACK_PRICE = 170;
const SECONDS_PER_DAY = 24 * 60 * 60;
const MONEY_PER_SECOND = PACK_PRICE / SECONDS_PER_DAY; // 0.0019652777777777777₽/сек

function getRandomFact() {
    const allFacts = [
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
        "Лёгкие курильщика покрыты смолой толщиной 1 мм",
        "Ты уже сэкономил на сигаретах больше, чем многие за месяц!",
        "Каждый день без курения твои лёгкие дышат свободнее",
        "Ты уже на пути к более здоровому сердцу и сосудам",
        "Каждый отказ от сигареты — это победа над зависимостью"
    ];
    return allFacts[Math.floor(Math.random() * allFacts.length)];
}

// ПЛАВНАЯ АНИМАЦИЯ ЧИСЕЛ (с копейками)
function animateCounter(elementId, startValue, endValue, duration = 800) {
    let startTime = null;
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Плавная функция (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        // Для денег показываем копейки (2 знака после запятой)
        let currentValue;
        if (elementId === 'saved') {
            // Точное значение с копейками
            currentValue = (startValue + (endValue - startValue) * easeOut).toFixed(2);
            const [rubles, kopecks] = currentValue.split('.');
            document.getElementById(elementId).textContent = rubles + ',' + kopecks + ' ₽';
        } else {
            // Для целых чисел
            currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
            document.getElementById(elementId).textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Финальное значение
            if (elementId === 'saved') {
                const [rubles, kopecks] = endValue.toFixed(2).split('.');
                document.getElementById(elementId).textContent = rubles + ',' + kopecks + ' ₽';
            } else {
                document.getElementById(elementId).textContent = endValue;
            }
        }
    }
    
    requestAnimationFrame(animate);
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    
    if (!isStarted) {
        document.getElementById('days').textContent = '0';
        document.getElementById('time').textContent = '00:00:00';
        document.getElementById('saved').textContent = '0,00 ₽';
        document.getElementById('cigarettes').textContent = '0';
        document.getElementById('dailyFact').textContent = 'Нажми "Я БРОСИЛ!" чтобы начать отсчёт';
        startBtn.textContent = '🚭 Я БРОСИЛ!';
        startBtn.classList.remove('started');
        return;
    }
    
    startBtn.textContent = '✅ Отлично! Продолжай!';
    startBtn.classList.add('started');
    
    const now = Date.now();
    const diff = now - startDate;
    const totalSeconds = Math.floor(diff / 1000);
    
    const days = Math.floor(totalSeconds / SECONDS_PER_DAY);
    const cigarettes = Math.floor((totalSeconds / SECONDS_PER_DAY) * CIGARETTES_PER_DAY);
    
    // ДЕНЬГИ С КОПЕЙКАМИ (точный расчёт)
    const moneyExact = totalSeconds * MONEY_PER_SECOND;
    const moneyFormatted = moneyExact.toFixed(2);
    
    const remainingSeconds = totalSeconds % SECONDS_PER_DAY;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // ПЛАВНАЯ АНИМАЦИЯ ДЛЯ ДНЕЙ
    const daysEl = document.getElementById('days');
    const currentDays = parseInt(daysEl.textContent) || 0;
    if (currentDays !== days) {
        animateCounter('days', currentDays, days, 600);
    }
    
    // ПЛАВНАЯ АНИМАЦИЯ ДЛЯ СИГАРЕТ
    const cigarettesEl = document.getElementById('cigarettes');
    const currentCigarettes = parseInt(cigarettesEl.textContent) || 0;
    if (currentCigarettes !== cigarettes) {
        animateCounter('cigarettes', currentCigarettes, cigarettes, 600);
    }
    
    // ПЛАВНАЯ АНИМАЦИЯ ДЛЯ ДЕНЕГ (с копейками)
    const moneyEl = document.getElementById('saved');
    const currentMoneyText = moneyEl.textContent.replace(/[,\s₽]/g, '');
    const [currentRubles, currentKopecks] = currentMoneyText.split(',');
    const currentMoney = parseFloat(currentRubles + '.' + (currentKopecks || '00')) || 0;
    
    if (Math.abs(currentMoney - moneyExact) > 0.01) { // Анимируем если изменилось больше 1 копейки
        animateCounter('saved', currentMoney, moneyExact, 400);
    } else {
        // Обновляем только копейки без анимации
        const [rubles, kopecks] = moneyFormatted.split('.');
        moneyEl.textContent = rubles + ',' + kopecks + ' ₽';
    }
    
    // ВРЕМЯ (плавный transition)
    const timeEl = document.getElementById('time');
    if (timeEl.textContent !== timeString) {
        timeEl.style.transition = 'all 0.3s ease';
        timeEl.textContent = timeString;
    }
    
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

updateUI();
setInterval(updateUI, 1000);

function resetCounter() {
    if (confirm('Сбросить счётчик? Это нельзя будет отменить!')) {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('fact_') || key === 'quitStartDate') {
                localStorage.removeItem(key);
            }
        });
        startDate = null;
        isStarted = false;
        updateUI();
    }
}

if (isStarted) {
    updateUI();
}
