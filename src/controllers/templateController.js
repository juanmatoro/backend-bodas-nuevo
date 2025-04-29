const MessageTemplate = require("../models/MessageTemplate");

exports.createTemplate = async (req, res) => {
  try {
    const plantilla = await MessageTemplate.create(req.body);
    res.status(201).json(plantilla);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTemplates = async (req, res) => {
  const { bodaId } = req.query;
  const filtros = bodaId ? { bodaId } : {};
  const ts = await MessageTemplate.find(filtros);
  res.json(ts);
};

exports.updateTemplate = async (req, res) => {
  try {
    const doc = await MessageTemplate.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(doc);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
