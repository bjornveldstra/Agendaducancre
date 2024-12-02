// script.js

// Hachages des mots de passe au lieu des mots de passe en clair
const users = {
    antonin: { password: '3dba2d2e96e3a37e36af293826144bf2fcf6e54b279558e8f571acf707881cef'}, // 
    bjorn: { password: '5a36b0948fb336a71b15b545c6d868426ab0807d03deddc432d34dd55aa45ec4'}, // 
    evan: { password: '5a36b0948fb336a71b15b545c6d868426ab0807d03deddc432d34dd55aa45ec4'}, // 
    ilan: { password: '3bc7340909846468d373e08825e2730bed6ac07179965983d06f1c834538870a'}, //
    jules: { password: '027d59970c306e9cb23b9fcf0bddbae5616f8623d54cf43a9b66fbcdaedee3ba'}, // 
    tom: { password: 'b5695e9bfa02bed587f107c6babe2815ad3288ddaf53597803f8e06ca8ad515e'}, // 
    tristan: { password: '1737c9131c29400721db46a5f7ac4b11b19cdca36c3d07e481f92d18e3ea8f69'}, // 
};

// pour ajouter un utilisateur, copier et coller une des lignes ci-dessus, faire les modifs et créer un mot de passe haché avec le site ci-dessous
// site pour hacher les mots de passe : https://cryptage.online-convert.com/fr/generateur-sha256

let currentUser = null;

document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;
    const hashedPassword = CryptoJS.SHA256(password).toString(); // Hachage du mot de passe entré

    if (users[username] && users[username].password === hashedPassword) {
        // Connexion réussie
        currentUser = users[username];
        localStorage.setItem('currentUser', username); // Stocker l'utilisateur dans le localStorage
        window.location.href = 'calendar.html'; // Rediriger vers la page du calendrier
    } else {
        // Erreur de connexion
        document.getElementById('error-message').innerText = 'ID ou mot de passe incorrect';
    }
});



