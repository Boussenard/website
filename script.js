// Открытие модального окна авторизации
document.getElementById('loginBtn').addEventListener('click', function() {
    document.getElementById('loginModal').style.display = 'block';
});

// Открытие модального окна регистрации
document.getElementById('registerBtn').addEventListener('click', function() {
    document.getElementById('registerModal').style.display = 'block';
});

// Закрытие модальных окон
document.querySelectorAll('.close').forEach(function(closeBtn) {
    closeBtn.addEventListener('click', function() {
        this.closest('.modal').style.display = 'none';
    });
});

// Обработка формы авторизации
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    authenticateUser(username, password);
});

// Обработка формы регистрации
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    registerUser(username, email, password);

    alert('Регистрация успешна!');
});

let cart = [];

// Функция для обновления счетчика корзины
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Функция для сохранения корзины в localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функция для загрузки корзины из localStorage
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}
// Функция для очищения корзины
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    updateCartCount();
    saveCart();
}
// Обработчик для кнопок "Добавить в корзину"
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        const product = {
            name: this.dataset.name,
            price: parseFloat(this.dataset.price)
        };

        fetch('add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            updateCartCount();
        });
    });
});

// Обработчик для иконки корзины
document.getElementById('cartIcon').addEventListener('click', function() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
    } else {
        const cartContent = cart.map(item =>
            `${item.name} - ${item.quantity} шт. - ${item.price * item.quantity} руб.`
        ).join('\n');
        alert(`Товары в корзине:\n${cartContent}`);
    }
});

// Загружаем корзину при загрузке страницы
window.addEventListener('load', loadCart);

const db = require('./db_config'); // Подключаем конфигурацию базы данных

function registerUser(username, email, password) {
    const hashedPassword = hashPassword(password); // Функция для хэширования пароля

    const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) throw err;
        console.log('Пользователь зарегистрирован!');
    });
}

function hashPassword(password) {
    // Простая имитация хэширования (используйте bcrypt в реальном проекте)
    return password + 'hashed';
}

function authenticateUser(username, password) {
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            const storedPassword = results[0].password;
            if (comparePasswords(password, storedPassword)) {
                console.log('Авторизация успешна!');
            } else {
                console.log('Неверный пароль.');
            }
        } else {
            console.log('Пользователь не найден.');
        }
    });
}

function comparePasswords(inputPassword, storedPassword) {
    // Простая проверка (замените на bcrypt.compare в реальном проекте)
    return inputPassword + 'hashed' === storedPassword;
}

function addToCart(userId, product) {
    const sql = 'INSERT INTO cart_items (user_id, product_name, price, quantity) VALUES (?, ?, ?, ?)';
    db.query(sql, [userId, product.name, product.price, product.quantity], (err, result) => {
        if (err) throw err;
        console.log('Товар добавлен в корзину!');
    });
}

function getCartItems(userId) {
    const sql = 'SELECT * FROM cart_items WHERE user_id = ?';
    db.query(sql, [userId], (err, results) => {
        if (err) throw err;
        console.log('Товары в корзине:', results);
    });
}

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    registerUser(username, email, password);

    alert('Регистрация успешна!');
});
