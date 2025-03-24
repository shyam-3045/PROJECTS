const express = require ("express");
const router = express.Router();
const controller = require("../constrollers/project.js"); 

router.get("/", controller.login);
router.get("/signup", controller.signup);

router.get("/admin_dash/:id", controller.dashboard_admin);
router.get("/doctor_dash/:id", controller.dashboard_doc);
router.get("/patient_dash/:id", controller.dashboard_pat);
router.get("/patient_appointments/:id",controller.appointment_pat)
router.get("/patient_appointments/patient_profile/:id", controller.pat_Profile);
router.get("/patient_billing/:id", controller.pat_billing);
router.get("/patient_medical_Record/:id", controller.pat_MedRecord);

router.post("/appointment_booked/:id",controller.appoitnment_booked)
router.post("/confirm_app/:id",controller.confirm_app)
router.post("/cancel_app/:id",controller.cancel_app)
router.post("/save_medicalrecords_doc/:id",controller.save_medicalRecords_doc)
router.post("/save_doc_profile/:id",controller.save_doc_profile)
router.post("/signup", controller.post_signup);
router.post("/", controller.post_login);
router.post("/delete-appointment",controller.delete_appointment)
router.post("/update-profile/:id",controller.update_pat_profile)
router.post("/billing_payment/:id",controller.make_payment)

router.post('/del_pat_admin/:id',controller.del_pat_admin)
router.post('/del_doc_admin/:id',controller.del_doc_admin)
router.post('/del_med_admin/:id',controller.del_med_admin)
router.post('/edit_pat_med/:id',controller.edit_pat_admin)
router.post('/add_med/:id',controller.add_med)
router.post('/edit_doc_med/:id',controller.edit_doc_admin)


router.get("/logout", controller.logout);


module.exports = router;
