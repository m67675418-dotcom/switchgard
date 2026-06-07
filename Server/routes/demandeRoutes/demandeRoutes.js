const express = require('express');
const router = express.Router();
const Demande = require('../../models/Demande');
const Garde = require('../../models/Garde');
const Notification = require('../../models/Notification');

// Create demande
router.post('/', async (req, res) => {
  try {
    const { gardeId, gardeDate, gardeOwner, proprietaireId, demandeurId, demandeurName, role, type } = req.body;

    const existingDemande = await Demande.findOne({ gardeId, demandeurId, status: 'pending' });
    if (existingDemande) {
      return res.status(400).json({ message: 'Vous avez déjà envoyé une demande pour cette garde' });
    }

    const newDemande = new Demande({
      gardeId,
      gardeDate,
      gardeOwner,
      proprietaireId,
      demandeurId,
      demandeurName,
      role,
      type: type || 'echange'
    });
    await newDemande.save();

    const notification = new Notification({
      userId: proprietaireId,
      type: 'demande_received',
      message: `📩 Vous avez une nouvelle demande de ${demandeurName}`,
      demandeId: newDemande._id.toString()
    });
    await notification.save();

    res.status(201).json(newDemande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Get all demandes
router.get('/', async (req, res) => {
  try {
    const demandes = await Demande.find().sort({ createdAt: -1 });
    res.json(demandes);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// Check if demande exists
router.get('/check', async (req, res) => {
  try {
    const { gardeId, demandeurId } = req.query;
    const demande = await Demande.findOne({ gardeId, demandeurId });
    res.json({ exists: !!demande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// ✅ Accepter la demande (User A)
router.put('/:id/accept', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) {
      return res.status(404).json({ message: 'Demande non trouvée' });
    }

    demande.status = 'accepted';
    await demande.save();

    // Send notification to User B (demandeur)
    const notificationB = new Notification({
      userId: demande.demandeurId,
      type: 'demande_accepted',
      message: `✅ ${demande.gardeOwner} a accepté votre demande`,
      demandeId: demande._id.toString()
    });
    await notificationB.save();

    // Emit via Socket.io
    if (global.io) {
      global.io.to(demande.demandeurId).emit('new_notification', notificationB);
    }

    console.log('✅ Demande acceptée, notification envoyée à User B');

    res.json({ message: 'Demande acceptée', demande, notification: notificationB });

  } catch (error) {
    console.error('❌ Error accepting demande:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Reject demande
router.put('/:id/reject', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

    demande.status = 'rejected';
    await demande.save();

    const notification = new Notification({
      userId: demande.demandeurId,
      type: 'demande_rejected',
      message: `❌ ${demande.gardeOwner} a rejeté votre demande`,
      demandeId: demande._id.toString()
    });
    await notification.save();

    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// Send to director
router.put('/:id/send-to-director', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

    demande.directorStatus = 'pending';
    await demande.save();

    res.json({ message: 'Demande envoyée au directeur', demande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

// Director approve
router.put('/:id/director-approve', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

    const garde = await Garde.findById(demande.gardeId);
    if (!garde) return res.status(404).json({ message: 'Garde non trouvée' });

    garde.ownerId = demande.demandeurId;
    garde.owner = demande.demandeurName;
    garde.status = 'Transferred';
    garde.archived = true;
    garde.archivedAt = new Date();
    garde.transferredTo = demande.demandeurId;
    await garde.save();

    demande.directorStatus = 'approved';
    demande.status = 'completed';
    demande.archived = true;
    await demande.save();

    const notifOwner = new Notification({
      userId: demande.proprietaireId,
      type: 'final_approved',
      message: `✅ Demande approuvée! Garde transférée à ${demande.demandeurName}`,
      demandeId: demande._id.toString()
    });
    await notifOwner.save();

    const notifDemandeur = new Notification({
      userId: demande.demandeurId,
      type: 'final_approved',
      message: `🎉 Félicitations! Vous êtes maintenant propriétaire de la garde`,
      demandeId: demande._id.toString()
    });
    await notifDemandeur.save();

    res.json({ success: true, message: 'Approuvé avec succès', demande, garde });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Director reject
router.put('/:id/director-reject', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'Demande non trouvée' });

    demande.directorStatus = 'rejected';
    demande.status = 'rejected';
    await demande.save();

    const notif = new Notification({
      userId: demande.demandeurId,
      type: 'final_rejected',
      message: `❌ Demande rejetée par le directeur`,
      demandeId: demande._id.toString()
    });
    await notif.save();

    res.json({ success: true, message: 'Rejeté', demande });
  } catch (error) {
    res.status(500).json({ message: 'Erreur', error: error.message });
  }
});

module.exports = router;