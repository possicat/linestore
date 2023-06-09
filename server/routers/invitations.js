const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const invitationsController = require('../controllers/invitations');
//

router.get('/', authMiddlewares.isAdmin, invitationsController.getInvitations);
router.post('/create', invitationsController.createInvitation);
router.post('/re-create', invitationsController.reCreateInvitationCode);
router.get('/use', invitationsController.useInvitationCode);

module.exports = router;
