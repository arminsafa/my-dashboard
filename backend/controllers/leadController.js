const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getLeads = async (req, res) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json({
      success: true,
      data: leads,
      message: "Leads retrieved successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred while fetching leads."
    });
  }
};

exports.createLead = async (req, res) => {
  const { client_name, phone_number, country, status, assigned_agent } = req.body;

  if (!client_name || !phone_number || !country) {
    return res.status(400).json({
      success: false,
      data: null,
      message: "Client name, phone number, and country are required."
    });
  }

  try {
    const lead = await prisma.lead.create({
      data: {
        client_name,
        phone_number,
        country,
        status: status || "New",
        assigned_agent
      }
    });
    res.status(201).json({
      success: true,
      data: lead,
      message: "Lead created successfully."
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred while creating the lead."
    });
  }
};

exports.updateLead = async (req, res) => {
  const { id } = req.params;
  const { client_name, phone_number, country, status, assigned_agent } = req.body;

  try {
    const lead = await prisma.lead.update({
      where: { id: parseInt(id) },
      data: {
        client_name,
        phone_number,
        country,
        status,
        assigned_agent
      }
    });
    res.json({
      success: true,
      data: lead,
      message: "Lead updated successfully."
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Lead not found."
      });
    }
    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred while updating the lead."
    });
  }
};

exports.deleteLead = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.lead.delete({
      where: { id: parseInt(id) }
    });
    res.json({
      success: true,
      data: null,
      message: "Lead deleted successfully."
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        data: null,
        message: "Lead not found."
      });
    }
    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred while deleting the lead."
    });
  }
};
