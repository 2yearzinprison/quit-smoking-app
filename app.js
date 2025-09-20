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

// ПЛАВНАЯ АНИМАЦИЯ (только для целых изменений)
function animateCounter(elementId, startValue, endValue, duration = 800) {
    let startTime = null;
    
    function animate(currentTime) {
        if (startTime === null) startTime = currentTime;
        
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (endValue - startValue) * easeOut);
        
        const element = document.getElementById(elementId);
        if (elementId === 'saved') {
            element.textContent = currentValue.toLocaleString() + ' ₽';
        } else {
            element.textContent = currentValue;
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (elementId === 'saved') {
                element.textContent = endValue.toLocaleString() + ' ₽';
            } else {
                element.textContent = endValue;
            }
        }
    }
    
    requestAnimationFrame(animate);
}

function formatMoney(money) {
    // Форматируем деньги с копейками: 123,45 ₽
    return money.toFixed(2).replace('.', ',') + ' ₽';
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
    
    // ДЕНЬГИ: показываем копейки, но анимируем только при изменении рублей
    const moneyExact = totalSeconds * MONEY_PER_SECOND;
    const moneyRubles = Math.floor(moneyExact);
    const moneyFormatted = formatMoney(moneyExact);
    
    const remainingSeconds = totalSeconds % SECONDS_PER_DAY;
    const hours = Math.floor(remainingSeconds / 3600);
    const minutes = Math.floor((remainingSeconds % 3600) / 60);
    const seconds = remainingSeconds % 60;
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // АНИМАЦИЯ ДЛЯ ДНЕЙ
    const daysEl = document.getElementById('days');
    const currentDays = parseInt(daysEl.textContent) || 0;
    if (currentDays !== days) {
        animateCounter('days', currentDays, days, 600);
    }
    
    // АНИМАЦИЯ ДЛЯ СИГАРЕТ
    const cigarettesEl = document.getElementById('cigarettes');
    const currentCigarettes = parseInt(cigarettesEl.textContent) || 0;
    if (currentCigarettes !== cigarettes) {
        animateCounter('cigarettes', currentCigarettes, cigarettes, 600);
    }
    
    // ДЕНЬГИ: анимируем только при изменении рублей, копейки обновляем тихо
    const moneyEl = document.getElementById('saved');
    const currentMoneyText = moneyEl.textContent.replace(/[,\s₽]/g, '');
    const [currentRublesStr, currentKopecks] = currentMoneyText.split(',');
    const currentRubles = parseInt(currentRublesStr) || 0;
    
    if (currentRubles !== moneyRubles) {
        // Анимация при изменении рублей
        animateCounter('saved', currentRubles, moneyRubles, 400);
        // После анимации обновляем копейки
        setTimeout(() => {
            moneyEl.textContent = formatMoney(moneyExact);
        }, 400);
    } else {
        // Тихо обновляем копейки
        moneyEl.textContent = formatMoney(moneyExact);
    }
    
    // ВРЕМЯ
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
