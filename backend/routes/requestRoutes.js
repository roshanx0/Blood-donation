const express = require('express');
const router = express.Router();
const {
  createRequest,
  getAllRequests,
  getMatchingRequests,
  getMyRequests,
  getRequestById,
  updateRequestStatus,
  respondToRequest,
  deleteRequest,
} = require('../controllers/requestController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

router.route('/').post(createRequest).get(getAllRequests);

router.get('/matching', getMatchingRequests);
router.get('/my-requests', getMyRequests);

router
  .route('/:id')
  .get(getRequestById)
  .delete(deleteRequest);

router.put('/:id/status', updateRequestStatus);
router.post('/:id/respond', respondToRequest);

module.exports = router;