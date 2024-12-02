const calendar = document.getElementById('calendar').querySelector('tbody');
const currentMonthElement = document.getElementById('current-month');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
// Récupérer l'utilisateur connecté depuis le localStorage
const currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
    // Si aucun utilisateur connecté, rediriger vers la page de connexion
    window.location.href = 'index.html';
}


let currentDate = new Date();

function generateCalendar(date) {
    calendar.innerHTML = ''; // Efface le contenu précédent

    const year = date.getFullYear();
    const month = date.getMonth();

    currentMonthElement.textContent = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let day = 1;
    for (let i = 0; i < 6; i++) { // 6 lignes pour les semaines
        const row = document.createElement('tr');

        for (let j = 0; j < 7; j++) { // 7 colonnes pour les jours
            const cell = document.createElement('td');

            if (i === 0 && j < firstDayOfMonth || day > daysInMonth) {
                row.appendChild(cell);
                continue;
            }

            const formattedDate = `${day}/${month + 1}/${year}`;
            cell.textContent = day;

            // Ajouter les tâches existantes pour cette date
            const tasks = getTasks(formattedDate);
            tasks.forEach(task => displayTask(cell, task, formattedDate)); // Affiche un point par tâche

            // Ajouter un clic pour ajouter un devoir
            cell.addEventListener('click', () => {
                // Premier message : Ajouter un devoir
                const task = prompt(`Ajouter un devoir pour le ${formattedDate}:`);
                if (!task) return;
            
                // Deuxième message : Choisir le groupe
                const groupChoice = prompt(
                    `Groupe pour le devoir :\n` +
                    `1. Groupe 1\n` +
                    `2. Groupe 2\n` +
                    `3. Devoir commun\n\n` +
                    `Entrez 1, 2 ou 3 :`
                );
            
                let group;
                if (groupChoice === '1') {
                    group = 'Groupe 1';
                } else if (groupChoice === '2') {
                    group = 'Groupe 2';
                } else if (groupChoice === '3') {
                    group = 'Devoir commun';
                } else {
                    alert('Choix invalide. Le groupe sera par défaut "Devoir commun".');
                    group = 'Devoir commun';
                }
            
                // Troisième message : Niveau de difficulté
                const difficultyChoice = prompt(
                    `Niveau de difficulté pour "${task}" :\n` +
                    `1. Court à préparer (1 à 2 jours) => Vert\n` +
                    `2. Moyen à préparer (2 à 4 jours) => Orange\n` +
                    `3. Long à préparer (1 semaine ou plus) => Rouge\n\n` +
                    `Entrez 1, 2 ou 3 :`
                );
                
                let color;
                if (difficultyChoice === '1') {
                    color = '#1abc9c'; // Vert prononcé (ex : turquoise)
                } else if (difficultyChoice === '2') {
                    color = '#e67e22'; // Orange vif
                } else if (difficultyChoice === '3') {
                    color = '#e74c3c'; // Rouge vif
                } else {
                    alert('Choix invalide, la tâche sera enregistrée sans couleur.');
                    color = '#007bff'; // Couleur par défaut (bleu)
                }
                
            
                // Sauvegarder la tâche avec le texte, la couleur, le groupe et l'utilisateur
                saveTask(formattedDate, { text: task, color, group, user: localStorage.getItem('currentUser') });
            
                // Afficher la tâche avec sa couleur
                displayTask(cell, { text: task, color, group }, formattedDate);
            });
            
            row.appendChild(cell);
            day++;
        }
        calendar.appendChild(row);

        if (day > daysInMonth) break;
    }
}


// Navigation entre les mois
prevMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    generateCalendar(currentDate);
});

nextMonthButton.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    generateCalendar(currentDate);
});

// Générer le calendrier pour le mois actuel
generateCalendar(currentDate);

// Fonction pour sauvegarder un devoir
function saveTask(date, task) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (!tasks[date]) {
        tasks[date] = [];
    }
    tasks[date].push(task); // Ajouter l'objet tâche avec texte, couleur, groupe et utilisateur
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


// Fonction pour récupérer les devoirs d'une date
function getTasks(date) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    return tasks[date] || [];
}

// Fonction pour afficher une tâche sous forme de point distinct
function displayTask(cell, task, date) {
    let container = cell.querySelector('.task-dots-container');
    if (!container) {
        container = document.createElement('div');
        container.classList.add('task-dots-container');
        cell.appendChild(container);
    }

    const taskDot = document.createElement('span');
    taskDot.classList.add('task-dot');
    taskDot.style.backgroundColor = task.color; // Couleur basée sur la tâche
    taskDot.title = task.text; // Texte au survol

    // Ajout du texte (1, 2 ou C) dans le cercle
    taskDot.textContent = task.group === 'Groupe 1' ? '1' :
                          task.group === 'Groupe 2' ? '2' : 'C';
    taskDot.style.color = 'white'; // Texte blanc pour être lisible
    taskDot.style.fontWeight = 'bold'; // Met en gras
    taskDot.style.fontSize = '12px'; // Taille du texte

    // Clique pour afficher les tâches
    taskDot.addEventListener('click', (event) => {
        event.stopPropagation();
        showTasks(date);
    });

    container.appendChild(taskDot); // Ajoute le point dans le conteneur
}

function addTaskToDate(cell, formattedDate) {
    const task = prompt(`Ajouter un devoir pour le ${formattedDate}:`);
    if (!task) return;

    const group = prompt(
        `Groupe :\n` +
        `1. Groupe 1\n` +
        `2. Groupe 2\n` +
        `3. Devoir commun\n\n` +
        `Entrez 1, 2 ou 3 :`
    );

    const difficulty = prompt(
        `Niveau de difficulté pour "${task}" :\n` +
        `1. Court à préparer (1 à 2 jours) => Vert\n` +
        `2. Moyen à préparer (2 à 4 jours) => Orange\n` +
        `3. Long à préparer (1 semaine ou plus) => Rouge\n\n` +
        `Entrez 1, 2 ou 3 :`
    );

    let color;
    if (difficulty === '1') {
        color = 'green';
    } else if (difficulty === '2') {
        color = 'orange';
    } else if (difficulty === '3') {
        color = 'red';
    } else {
        alert('Choix invalide, la tâche sera enregistrée sans couleur.');
        color = 'blue'; // Couleur par défaut
    }

    let groupText;
    if (group === '1') {
        groupText = 'Groupe 1';
    } else if (group === '2') {
        groupText = 'Groupe 2';
    } else if (group === '3') {
        groupText = 'Commun';
    } else {
        alert('Groupe invalide, tâche non ajoutée.');
        return;
    }

    const taskData = {
        text: task,
        color: color,
        group: groupText,
        user: localStorage.getItem('currentUser') || 'Anonyme',
    };

    saveTask(formattedDate, taskData); // Enregistre la tâche
    displayTask(cell, taskData, formattedDate); // Affiche le point
}




// Fonction pour afficher les tâches dans la fenêtre modale
function showTasks(date) {
    const tasks = getTasks(date); // Récupère les tâches pour la date
    const modal = document.getElementById('task-modal');
    const taskList = document.getElementById('task-list');
    const modalDate = document.getElementById('modal-date');

    // Afficher la date dans la modale
    modalDate.textContent = date;

    // Vider la liste actuelle pour éviter les doublons
    taskList.innerHTML = '';

    // Ajouter les tâches dans la liste
    if (tasks.length > 0) {
        tasks.forEach((task, index) => {
            const listItem = document.createElement('li');
    
            // Texte de la tâche
            const taskText = document.createElement('span');
            taskText.textContent = task.text;
            taskText.style.color = 'black'; // Toujours en noir
            taskText.style.marginRight = '10px';
    
            // Groupe de la tâche
            const taskGroup = document.createElement('span');
            taskGroup.textContent = `(${task.group})`;
            taskGroup.style.color = 'gray'; // Gris pour le groupe
            taskGroup.style.marginRight = '10px';
    
            // Utilisateur
            const userName = document.createElement('span');
            userName.textContent = `(${task.user})`;
            userName.style.color = 'gray'; // Style en gris clair
            userName.style.marginRight = '10px';
    
            // Bouton "Supprimer"
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Supprimer';
            deleteButton.addEventListener('click', () => {
                deleteTask(date, index);
                showTasks(date);
            });
    
            // Ajouter tout dans la liste
            listItem.appendChild(taskText);
            listItem.appendChild(taskGroup);
            listItem.appendChild(userName);
            listItem.appendChild(deleteButton);
            taskList.appendChild(listItem);
        });
    } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'Aucune tâche pour cette date.';
        taskList.appendChild(listItem);
    }
    
    
    // Afficher la fenêtre modale
    modal.style.display = 'block';
    }


// Fonction pour supprimer une tâche
function deleteTask(date, taskIndex) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    if (tasks[date]) {
        tasks[date].splice(taskIndex, 1); // Supprime la tâche à l'index donné
        if (tasks[date].length === 0) {
            delete tasks[date]; // Supprime la date si aucune tâche n’y est associée
        }
        localStorage.setItem('tasks', JSON.stringify(tasks)); // Met à jour le stockage
    }

    // Mettre à jour le calendrier après suppression
    generateCalendar(currentDate); // Regénère le calendrier pour actualiser les cercles
    showTasks(date); // Met à jour la modale avec les nouvelles tâches
}



// Fermer la modale
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('close-modal-button').addEventListener('click', () => {
        document.getElementById('task-modal').style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    const modal = document.getElementById('task-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});


function refreshCell(date) {
    // Trouver la cellule correspondant à la date
    const [day, month, year] = date.split('/').map(Number);

    // Rechercher la cellule dans le calendrier
    const cells = calendar.querySelectorAll('td');
    cells.forEach((cell) => {
        if (cell.textContent == day && currentDate.getMonth() + 1 === month && currentDate.getFullYear() === year) {
            // Supprimer tous les points existants dans la cellule
            const taskDots = cell.querySelectorAll('span');
            taskDots.forEach((dot) => dot.remove());

            // Ajouter à nouveau les points si des tâches existent encore pour la date
            const tasks = getTasks(date);
            tasks.forEach((task) => displayTask(cell, task, date));
        }
    });
}
