const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const usersController = require('../controllers/users');
//

router.get('/', authMiddlewares.isAgent, usersController.getUsersInfo);
router.get('/search', authMiddlewares.isAgent, usersController.searchAboutUsers);
router.get('/@me', usersController.getUserInfo);
router.put('/@me', authMiddlewares.passwordRequired, usersController.changeUserInfo);
router.put('/@me/password', authMiddlewares.passwordRequired, usersController.changeUserPassword);
router.get('/:user_id', authMiddlewares.isAgent, usersController.getUserInfo);
router.use(authMiddlewares.isAdmin);
router.delete('/:user_id', usersController.deleteUser);
router.post('/:user_id/freeze', usersController.freezeUser);
router.delete('/:user_id/freeze', usersController.unFreezeUser);
router.put('/:user_id/roles/:role_name', usersController.addRoleToUser);
router.delete('/:user_id/roles/:role_name', usersController.removeRoleFromUser);


module.exports = router;
