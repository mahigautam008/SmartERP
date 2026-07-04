const prisma = require("../config/db");

exports.getPurchases = async (req, res) => {
  try {
    const purchases = await prisma.purchase.findMany({
      include: {
        supplier: true,
        items: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const { supplierId, items } = req.body;

    if (!supplierId || !items || items.length === 0) {
      return res.status(400).json({
        message: "Supplier and items are required",
      });
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.price),
      0
    );

    const purchase = await prisma.$transaction(async (tx) => {
      const newPurchase = await tx.purchase.create({
        data: {
          supplierId: Number(supplierId),
          total,
          items: {
            create: items.map((item) => ({
              itemId: Number(item.itemId),
              quantity: Number(item.quantity),
              price: Number(item.price),
            })),
          },
        },
        include: {
          supplier: true,
          items: {
            include: { item: true },
          },
        },
      });

      for (const item of items) {
        await tx.item.update({
          where: { id: Number(item.itemId) },
          data: {
            stock: {
              increment: Number(item.quantity),
            },
          },
        });
      }

      await tx.supplier.update({
        where: { id: Number(supplierId) },
        data: {
          outstanding: {
            increment: total,
          },
        },
      });

      return newPurchase;
    });

    res.status(201).json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};