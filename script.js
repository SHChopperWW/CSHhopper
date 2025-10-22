document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------
    // I. КОНСТАНТЫ И ПЕРЕМЕННЫЕ
    // --------------------------------------------------------
    const loginPage = document.getElementById('login-page');
    const cabinetPage = document.getElementById('cabinet-page');
    const loginForm = document.getElementById('login-form');
    const logoutButton = document.getElementById('logout-button');
    const errorMessage = document.getElementById('error-message');
    const appContainer = document.getElementById('app-container');

    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    const welcomeMessage = document.getElementById('welcome-message');
    const userEmailDisplay = document.getElementById('user-email-display');
    const cabinetName = document.getElementById('cabinet-name');
    const cabinetUsername = document.getElementById('cabinet-username');
    const cabinetEmail = document.getElementById('cabinet-email');
    
    let usersData = []; // Для хранения загруженных данных из users.json
    const STORAGE_KEY = 'loggedInUser'; // Ключ для localStorage (Требование 6)

    // --------------------------------------------------------
    // II. ФУНКЦИИ УПРАВЛЕНИЯ ИНТЕРФЕЙСОМ И ДАННЫМИ
    // --------------------------------------------------------

    /**
     * Асинхронная загрузка данных пользователей из users.json (Требование 3.1)
     */
    async function loadUsers() {
        try {
            const response = await fetch('users.json');
            if (!response.ok) {
                throw new Error('Не удалось загрузить users.json');
            }
            usersData = await response.json();
            console.log('Данные пользователей загружены:', usersData);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            alert('Критическая ошибка: не удалось загрузить данные пользователей!');
        }
    }

    /**
     * Показывает страницу Личного кабинета (Требование 2.3)
     * @param {Object} user - объект с данными пользователя
     */
    function showCabinet(user) {
        // Заполнение данных личного кабинета
        welcomeMessage.textContent = `С возвращением, ${user.name}!`;
        userEmailDisplay.textContent = user.email; // Доп. возможность (Требование 6)
        
        cabinetName.textContent = user.name;
        cabinetUsername.textContent = user.username;
        cabinetEmail.textContent = user.email;

        // Переключение страниц
        loginPage.classList.remove('active');
        cabinetPage.classList.add('active');
    }

    /**
     * Показывает страницу Входа (Требование 2.3)
     */
    function showLogin() {
        // Очистка формы и сообщений
        loginForm.reset();
        hideError();
        
        // Переключение страниц
        cabinetPage.classList.remove('active');
        loginPage.classList.add('active');
    }

    /**
     * Показывает сообщение об ошибке (Требование 8)
     * @param {string} message - текст ошибки
     */
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    /**
     * Скрывает сообщение об ошибке
     */
    function hideError() {
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';
    }

    /**
     * Проверяет, авторизован ли пользователь (Требование 6)
     */
    function checkLoginStatus() {
        // Чтение из localStorage (Требование 6)
        const storedUser = localStorage.getItem(STORAGE_KEY);
        
        // Доп. возможность (анимация появления)
        appContainer.classList.add('visible');
        appContainer.classList.remove('hidden');

        if (storedUser) {
            const user = JSON.parse(storedUser);
            // Если есть данные в хранилище, сразу переходим в кабинет
            showCabinet(user);
        } else {
            // Иначе остаемся на странице входа
            showLogin();
        }
    }

    // --------------------------------------------------------
    // III. ОБРАБОТЧИКИ СОБЫТИЙ
    // --------------------------------------------------------

    /**
     * Обработчик отправки формы входа (Требование 2)
     */
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        hideError();

        const inputUsername = usernameInput.value.trim();
        const inputPassword = passwordInput.value.trim();

        // 3. Проверка логина и пароля (Требование 3.2)
        const user = usersData.find(u => 
            (u.username === inputUsername || u.email === inputUsername) && u.password === inputPassword
        );

        if (user) {
            // Авторизация успешна (Требование 7)
            
            // 4. Хранение состояния входа через localStorage (Требование 6)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
            
            // 5. Скрыть форму и показать кабинет
            showCabinet(user);
        } else {
            // Некорректные данные (Требование 8)
            showError('Неверный логин или пароль. Попробуйте еще раз.');
        }
    });

    /**
     * Обработчик кнопки "Выйти" (Требование 9)
     */
    logoutButton.addEventListener('click', () => {
        // Удаление состояния из localStorage
        localStorage.removeItem(STORAGE_KEY);
        
        // Возврат на форму входа
        showLogin();
    });

    // --------------------------------------------------------
    // IV. ЗАПУСК ПРИЛОЖЕНИЯ
    // --------------------------------------------------------

    // Загружаем данные и проверяем статус входа
    loadUsers().then(() => {
        // После загрузки данных проверяем, был ли пользователь уже авторизован
        checkLoginStatus(); 
    });
});