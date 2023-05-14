import express from 'express';
import UserController from "../User/UserController"

const router = express.Router();

// POST request um user zu registrieren
router.post("/user/registration", UserController.registration);

// POST /users/login
router.post('/user/login', UserController.login);

// Route für das Abrufen eines einzelnen Benutzers
router.get('/user/:id', UserController.getUser);

// Route für das Abrufen aller Benutzer
router.get('/users', UserController.getUsers);

// Route für das Erstellen eines Benutzers
router.post('/user', UserController.createUser);

// Route für das Aktualisieren eines Benutzers
router.put('/user/:id', UserController.updateUser);

// Route für das Löschen eines Benutzers
router.delete('/user/:id', UserController.deleteUser);

export default router;