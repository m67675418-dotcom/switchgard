// routes/demandeRoutes/demandeRoutes.js
const express = require('express');
const router = express.Router();
const Demande = require('../../models/Demande'); // تأكد من المسار الصحيح
const Garde = require('../../models/Garde');
const Notification = require('../../models/Notification');
const DDS = require('../../models/DDS');

// ✅ افترضنا أنك قمت بتهيئة Socket.io في ملف server.js وأصبحت io متاحاً هنا
// إذا لم تقم بذلك بعد، سنحتاج لتمرير io إلى هذا الملف (سأشرح لك كيف لاحقاً)
let io; 
module.exports.setIo = (socketIo) => { io = socketIo; };

// ==========================================
// 1. إنشاء طلب جديد (عند الضغط على زر Demende)
// ==========================================
router.post('/', async (req, res) => {
  try {
    const { gardeId, gardeDate, gardeOwner, proprietaireId, demandeurId, demandeurName, role } = req.body;

    // التحقق من عدم وجود طلب مكرر
    const existingDemande = await Demande.findOne({ gardeId, demandeurId, status: 'pending' });
    if (existingDemande) return res.status(400).json({ message: 'لقد قمت بإرسال طلب بالفعل لهذه المناوبة.' });

    const newDemande = new Demande({
      gardeId, gardeDate, gardeOwner, proprietaireId, demandeurId, demandeurName, role
    });
    await newDemande.save();

    // إرسال إشعار إلى صاحب المناوبة (المستخدم A)
    const notification = new Notification({
      userId: proprietaireId,
      type: 'demande_received',
      message: `لديك طلب جديد لتبديل/بيع المناوبة من ${demandeurName}`,
      demandeId: newDemande._id.toString()
    });
    await notification.save();

    // إرسال إشعار فوري عبر Socket.io إذا كان المتصل متاحاً
    if (io) {
      io.to(proprietaireId).emit('new_notification', notification);
    }

    res.status(201).json(newDemande);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إنشاء الطلب', error: error.message });
  }
});

// ==========================================
// 2. قبول الطلب (من قبل المستخدم A)
// ==========================================
router.put('/:id/accept', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'الطلب غير موجود' });

    demande.status = 'accepted';
    await demande.save();

    // إرسال إشعار إلى الطالب (المستخدم B)
    const notification = new Notification({
      userId: demande.demandeurId,
      type: 'demande_accepted',
      message: `تم قبول طلبك للمناوبة بتاريخ ${demande.gardeDate}. يمكنك الآن الدردشة مع ${demande.gardeOwner}.`,
      demandeId: demande._id.toString()
    });
    await notification.save();

    if (io) {
      io.to(demande.demandeurId).emit('new_notification', notification);
    }

    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في قبول الطلب', error: error.message });
  }
});

// ==========================================
// 3. إرسال الطلب إلى DDS (بعد الاتفاق في الدردشة)
// ==========================================
router.put('/:id/send-to-director', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'الطلب غير موجود' });

    // جلب معرف الـ DDS (افترضنا أن هناك DDS واحد فقط، أو يمكنك جلبهم جميعاً)
    const director = await DDS.findOne(); 
    if (!director) return res.status(404).json({ message: 'لم يتم العثور على المدير (DDS)' });

    demande.directorStatus = 'pending';
    demande.directorId = director._id.toString();
    await demande.save();

    // إرسال إشعار إلى DDS
    const notification = new Notification({
      userId: director._id.toString(),
      type: 'director_review',
      message: `طلب جديد للموافقة على تبديل مناوبة من ${demande.demandeurName} إلى ${demande.gardeOwner}`,
      demandeId: demande._id.toString()
    });
    await notification.save();

    if (io) {
      io.to(director._id.toString()).emit('new_notification', notification);
    }

    res.json(demande);
  } catch (error) {
    res.status(500).json({ message: 'خطأ في إرسال الطلب للمدير', error: error.message });
  }
});

// ==========================================
// 4. موافقة DDS (تحديث المناوبة وأرشفة الطلب)
// ==========================================
router.put('/:id/director-approve', async (req, res) => {
  try {
    const demande = await Demande.findById(req.params.id);
    if (!demande) return res.status(404).json({ message: 'الطلب غير موجود' });

    // 1. تحديث حالة الطلب
    demande.directorStatus = 'approved';
    demande.archived = true; // أرشفة الطلب
    await demande.save();

    // 2. تحديث المناوبة (Garde) ونقل الملكية
    const garde = await Garde.findById(demande.gardeId);
    if (garde) {
      garde.ownerId = demande.demandeurId; // نقل الملكية إلى الطالب
      garde.owner = demande.demandeurName; // تحديث الاسم
      garde.transferredTo = demande.demandeurId;
      garde.archived = true; // أرشفة المناوبة القديمة
      garde.archivedAt = new Date();
      garde.status = 'Transferred'; // أو أي حالة أخرى تناسبك
      await garde.save();
    }

    // 3. إرسال إشعارات نهائية للطرفين
    const notifOwner = new Notification({
      userId: demande.proprietaireId,
      type: 'final_approved',
      message: `تمت الموافقة على طلبك. تم نقل المناوبة بنجاح إلى ${demande.demandeurName}.`,
      demandeId: demande._id.toString()
    });
    await notifOwner.save();

    const notifDemandeur = new Notification({
      userId: demande.demandeurId,
      type: 'final_approved',
      message: `تهانينا! تمت الموافقة على طلبك وأصبحت المناوبة ملكك الآن.`,
      demandeId: demande._id.toString()
    });
    await notifDemandeur.save();

    if (io) {
      io.to(demande.proprietaireId).emit('new_notification', notifOwner);
      io.to(demande.demandeurId).emit('new_notification', notifDemandeur);
    }

    res.json({ message: 'تمت الموافقة على الطلب وتحديث المناوبة بنجاح' });
  } catch (error) {
    res.status(500).json({ message: 'خطأ في موافقة المدير', error: error.message });
  }
});

module.exports = router;