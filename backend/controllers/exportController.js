const Expense = require('../models/Expense');
const Income = require('../models/Income');

// @desc    Export expenses to CSV
// @route   GET /api/export/csv
exports.exportCSV = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const query = { user: req.user.id };
    if (category && category !== 'All') query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });

    const header = 'Title,Amount,Category,Date,Notes\n';
    const rows = expenses.map(e =>
      `"${e.title}",${e.amount},${e.category},${e.date.toISOString().split('T')[0]},"${e.notes || ''}"`
    ).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.csv');
    res.send(header + rows);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export expenses to PDF
// @route   GET /api/export/pdf
exports.exportPDF = async (req, res) => {
  try {
    const PDFDocument = require('pdfkit');
    const { startDate, endDate, category } = req.query;
    const query = { user: req.user.id };
    if (category && category !== 'All') query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query).sort({ date: -1 });
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=expenses.pdf');
    doc.pipe(res);

    doc.fontSize(22).text('Expense Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).text(`Generated on ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(14).text(`Total: $${total.toFixed(2)}`, { align: 'right' });
    doc.moveDown(1);

    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Title', 50, doc.y, { width: 180, continued: true });
    doc.text('Amount', 230, doc.y, { width: 80, continued: true });
    doc.text('Category', 310, doc.y, { width: 100, continued: true });
    doc.text('Date', 410, doc.y, { width: 100 });
    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(510, doc.y).stroke();

    doc.font('Helvetica');
    expenses.forEach(e => {
      if (doc.y > 720) doc.addPage();
      doc.text(e.title, 50, doc.y, { width: 180, continued: true });
      doc.text(`$${e.amount.toFixed(2)}`, 230, doc.y, { width: 80, continued: true });
      doc.text(e.category, 310, doc.y, { width: 100, continued: true });
      doc.text(e.date.toLocaleDateString(), 410, doc.y, { width: 100 });
    });

    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
