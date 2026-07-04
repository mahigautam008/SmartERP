const prisma = require("../config/db");

exports.getSales = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        customer: true,
        items: {
          include: { item: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(sales);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSale = async (req, res) => {
  try {
    const { customerId, items } = req.body;

    if (!customerId || !items || items.length === 0) {
      return res.status(400).json({
        message: "Customer and items are required",
      });
    }

    for (const saleItem of items) {
      const item = await prisma.item.findUnique({
        where: { id: Number(saleItem.itemId) },
      });

      if (!item || item.stock < Number(saleItem.quantity)) {
        return res.status(400).json({
          message: `Insufficient stock for ${item?.name || "item"}`,
        });
      }
    }

    const total = items.reduce(
      (sum, item) => sum + Number(item.quantity) * Number(item.price),
      0
    );

    const invoiceNo = `INV-${Date.now()}`;

    const sale = await prisma.$transaction(async (tx) => {
      const newSale = await tx.sale.create({
        data: {
          invoiceNo,
          customerId: Number(customerId),
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
          customer: true,
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
              decrement: Number(item.quantity),
            },
          },
        });
      }

      await tx.customer.update({
        where: { id: Number(customerId) },
        data: {
          outstanding: {
            increment: total,
          },
        },
      });

      return newSale;
    });

    res.status(201).json(sale);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};