const router = require('express').Router();
const Postit = require('../models/Postit');

// Récupère tous les postits jusqu'à 15 maximum
router.get('/', async (req, res) => {
  try {
    const postits = await Postit.find().limit(15);
    res.json(postits);
  } catch (err) {
    res.json({ message: err });
  }
});

// Envoie un postit champs nécessaire avant l'envoie: title, description
router.post('/', async (req, res) => {
  const postit = new Postit({
    title: req.body.title,
    description: req.body.description,
  });

  try {
    const savedPostit = await postit.save();
    res.json(savedPostit);
  } catch (err) {
    res.json({ message: err });
  }
});

// Trouve un Postit spécifique
router.get('/:postitId', async (req, res) => {
  try {
    const postit = await Postit.findById(req.params.postitId);
    res.json(postit);
  } catch (err) {
    res.json({ message: err });
  }
});

// Efface un Postit
router.delete('/:postitId', async (req, res) => {
  try {
    const removedPostit = await Postit.remove({ _id: req.params.postitId });
    res.json(removedPostit);
  } catch (err) {
    res.json({ message: err });
  }
});

// Edite un Postit
router.patch('/:postitId', async (req, res) => {
  try {
    const updatedPostit = await Postit.updateOne(
      { _id: req.params.postitId },
      { $set: { title: req.body.title, description: req.body.description } },
    );
    res.json(updatedPostit);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
