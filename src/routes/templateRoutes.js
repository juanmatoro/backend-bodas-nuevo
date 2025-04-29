const router = require("express").Router();
const ctrl = require("../controllers/templateController");
const validate = require("../middlewares//validateTemplateMarkers");

router.post("/", validate, ctrl.createTemplate);
router.get("/", ctrl.getTemplates);
router.patch(":id", validate, ctrl.updateTemplate);

module.exports = router;
