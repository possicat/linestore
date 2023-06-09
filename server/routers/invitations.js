const router = require('express').Router();
const authMiddlewares = require('../middlewares/auth');
const invitationsController = require('../controllers/invitations');
//

router.get('/', authMiddlewares.isAdmin, invitationsController.getInvitations);
router.get('/@me', invitationsController.getMyInvitation);
router.get('/use', invitationsController.useInvitationCode);
router.get('/:inviterId', invitationsController.getInvitation);
router.post('/create', invitationsController.createInvitation);
router.post('/re-create', invitationsController.reCreateInvitationCode);

module.exports = router;
