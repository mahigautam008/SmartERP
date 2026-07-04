const prisma = require("../config/db");

exports.getItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createItem = async (req, res) => {
  try {
    const {
      name,
      sku,
      purchasePrice,
      sellingPrice,
      gst,
      stock,
    } = req.body;

    if (!name || !sku) {
      return res.status(400).json({
        message: "Item name and SKU are required",
      });
    }

    const item = await prisma.item.create({
      data: {
        name,
        sku,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        gst: Number(gst || 0),
        stock: Number(stock || 0),
      },
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      name,
      sku,
      purchasePrice,
      sellingPrice,
      gst,
      stock,
    } = req.body;

    const item = await prisma.item.update({
      where: { id },
      data: {
        name,
        sku,
        purchasePrice: Number(purchasePrice),
        sellingPrice: Number(sellingPrice),
        gst: Number(gst || 0),
        stock: Number(stock || 0),
      },
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.item.delete({
      where: { id },
    });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};