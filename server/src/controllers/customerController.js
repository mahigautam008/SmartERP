const prisma = require("../config/db");

exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(customers);
  } catch (error) {
    console.error("CUSTOMER API ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Customer name is required" });
    }

    const customer = await prisma.customer.create({
      data: { name, phone, address },
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, phone, address } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: { name, phone, address },
    });

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.customer.delete({
      where: { id },
    });

    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};