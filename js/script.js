let currentUser = null;
let selectedSubjects = new Set();
let selectedTeachers = new Set();
let selectedTimes = new Set();

// Alternar entre secciones
function toggleRegister() {
    document.getElementById('registerSection').classList.remove('hidden');
    document.getElementById('loginSection').classList.add('hidden');
}

function toggleLogin() {
    document.getElementById('registerSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
}

// Registro
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[email]) {
        alert("Este correo ya está registrado.");
        toggleLogin();
    } else {
        users[email] = { password, schedules: [] };
        localStorage.setItem('users', JSON.stringify(users));
        alert("Registro exitoso. Ahora inicia sesión.");
        toggleLogin();
    }
});

// Inicio de sesión
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[email] && users[email].password === password) {
        currentUser = email;
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('scheduleSection').classList.remove('hidden');
        resetSelections();
        loadUserSchedules();
    } else {
        alert("Correo o contraseña incorrectos.");
    }
});

// Cerrar sesión
document.getElementById('logoutButton').addEventListener('click', function () {
    currentUser = null;
    document.getElementById('scheduleSection').classList.add('hidden');
    document.getElementById('loginSection').classList.remove('hidden');
    document.getElementById('loginForm').reset();
    alert("Sesión cerrada.");
});

// Resetear opciones
function resetSelections() {
    selectedSubjects.clear();
    selectedTeachers.clear();
    selectedTimes.clear();

    const subjectOptions = Array.from(subjectDropdown.options);
    subjectOptions.forEach(option => {
        option.disabled = false;
    });
}

// Cargar horarios guardados
function loadUserSchedules() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const userSchedules = users[currentUser]?.schedules || [];

    const tableBody = document.getElementById('scheduleTable').querySelector('tbody');
    tableBody.innerHTML = '';

    userSchedules.forEach(schedule => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${schedule.subject}</td>
            <td>${schedule.teacher}</td>
            <td>${schedule.room}</td>
            <td>${schedule.day}</td>
            <td>${schedule.time}</td>
        `;
        tableBody.appendChild(row);

        selectedSubjects.add(schedule.subject);
        selectedTeachers.add(schedule.teacher);
        selectedTimes.add(schedule.time);

        const subjectOptions = Array.from(subjectDropdown.options);
        subjectOptions.forEach(option => {
            if (option.value === schedule.subject) {
                option.disabled = true;
            }
        });
    });
}

// Mapeo de materias a docentes
const subjectToTeacherMap = {
    "Matemáticas Especiales": "Jonathan Eduarco",
    "Creación de Empresas": "Arnaldo Andres",
    "Redes Inalámbricas": "Luz Elena",
    "Calidad de Software": "DACARTH RAFAEL SARMIENTO PORTO",
    "Bases de Datos": "Hernando Fuentes"
};

const subjectDropdown = document.getElementById('subject');
const teacherDropdown = document.getElementById('teacher');

// Asignar docente automáticamente
subjectDropdown.addEventListener('change', function () {
    const selectedSubject = this.value;
    teacherDropdown.innerHTML = "";

    if (subjectToTeacherMap[selectedSubject]) {
        const option = document.createElement("option");
        option.value = subjectToTeacherMap[selectedSubject];
        option.text = subjectToTeacherMap[selectedSubject];
        teacherDropdown.add(option);
    } else {
        const defaultOption = document.createElement("option");
        defaultOption.text = "Selecciona una materia";
        teacherDropdown.add(defaultOption);
    }
});

// Guardar nuevo horario
document.getElementById('scheduleForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const subject = document.getElementById('subject').value;
    const teacher = document.getElementById('teacher').value;
    const room = document.getElementById('room').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;

    if (!subject || !teacher || !room || !day || !time) {
        alert("Completa todos los campos.");
        return;
    }

    if (selectedSubjects.has(subject) || selectedTeachers.has(teacher) || selectedTimes.has(time)) {
        alert("Este horario ya está ocupado. Intenta con otros datos.");
        return;
    }

    selectedSubjects.add(subject);
    selectedTeachers.add(teacher);
    selectedTimes.add(time);

    const users = JSON.parse(localStorage.getItem('users')) || {};
    const userSchedules = users[currentUser].schedules || [];
    userSchedules.push({ subject, teacher, room, day, time });
    users[currentUser].schedules = userSchedules;
    localStorage.setItem('users', JSON.stringify(users));

    const tableBody = document.getElementById('scheduleTable').querySelector('tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${subject}</td>
        <td>${teacher}</td>
        <td>${room}</td>
        <td>${day}</td>
        <td>${time}</td>
    `;
    tableBody.appendChild(row);

    const subjectOptions = Array.from(subjectDropdown.options);
    subjectOptions.forEach(option => {
        if (option.value === subject) option.disabled = true;
    });

    document.getElementById('scheduleForm').reset();
    alert("Horario guardado.");
});
