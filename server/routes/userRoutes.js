const express = require('express');
const { postEnrollment, getEnrollment, getEnrollmentByEmail, deleteEnrollment, updateEnrollment } = require('../controllers');
const { EnrollmentRequest } = require('../middlewares');
const userRouter = express.Router();

userRouter.post("/enrollment", EnrollmentRequest, postEnrollment); 
userRouter.get("/enrollment/all", getEnrollment );
userRouter.get("/enrollment/one/:email", getEnrollmentByEmail );
userRouter.delete("/enrollment/drop/:id", deleteEnrollment );
userRouter.put("/enrollment/update/:id", updateEnrollment );

module.exports = userRouter;
