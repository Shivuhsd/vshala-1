import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const ProfessionalReceiptGenerator = () => {
  const [schoolName, setSchoolName] = useState('Prestige International School');
  const [schoolAddress, setSchoolAddress] = useState('123 Education Street, Academic City, AC 54321');
  const [studentName, setStudentName] = useState('Rahul Sharma');
  const [studentClass, setStudentClass] = useState('XII');
  const [studentSection, setStudentSection] = useState('A');
  const [billName, setBillName] = useState('Quarterly Tuition Fee');
  const [billNumber, setBillNumber] = useState('FEE-2023-089');
  const [paymentDate, setPaymentDate] = useState('2023-10-15');
  const [paymentMode, setPaymentMode] = useState('Online Transfer');
  const [referenceNumber, setReferenceNumber] = useState('TX9823467');
  const [amountPaid, setAmountPaid] = useState(12500);

  const handlePrintPDF = () => {
    // Simulate transaction data
    const txn = {
      id: 'TXN-2023-001',
      created_on: new Date().toISOString(),
      modeofpayment: paymentMode,
      referencenumber: referenceNumber,
      fees_paid: amountPaid
    };
    
    // Simulate student data
    const student = {
      name: studentName,
      class_link: studentClass,
      section: studentSection
    };
    
    // Simulate selected bill
    const selectedBill = {
      name: billName,
      number: billNumber
    };
    
    // Simulate selected school
    const selectedSchool = {
      label: schoolName
    };

    // Create PDF in landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    // Student information
    const studentData = [
      ["Student Name", student.name],
      ["Class", student.class_link || "N/A"],
      ["Section", student.section || "N/A"],
      ["Bill Name", selectedBill?.name || "N/A"],
      ["Bill Number", selectedBill?.number || "N/A"],
      ["Date of Payment", new Date(txn.created_on).toLocaleDateString('en-IN')],
      ["Mode of Payment", txn.modeofpayment],
      ["Reference No.", txn.referencenumber || "N/A"],
      ["Amount Paid", `₹${parseFloat(txn.fees_paid).toLocaleString('en-IN')}`]
    ];

    // Professional header design
    doc.setFillColor(26, 58, 108); // Dark blue background
    doc.rect(0, 0, pageWidth, 22, 'F');
    
    // School name
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255); // White text
    doc.setFont("helvetica", "bold");
    doc.text(schoolName, centerX, 14, { align: "center" });
    
    // School address
    doc.setFontSize(10);
    doc.text(schoolAddress, centerX, 19, { align: "center" });

    // Main title
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255); // White text
    doc.text("FEE PAYMENT RECEIPT", centerX, 32, { align: "center" });

    // Add decorative line
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.5);
    doc.line(centerX - 60, 35, centerX + 60, 35);

    // Draw center divider (dashed line)
    doc.setDrawColor(180);
    doc.setLineWidth(0.3);
    doc.setLineDashPattern([5, 3]);
    doc.line(centerX, 45, centerX, pageHeight - 20);
    doc.setLineDashPattern([]); // Reset dash pattern

    // Generate both receipts
    generateReceipt(doc, studentData, 15, 45, "STUDENT COPY", centerX - 30);
    generateReceipt(doc, studentData, centerX + 15, 45, "SCHOOL COPY", centerX - 30);

    // Add watermark to prevent forgery
    doc.setGState(new doc.GState({ opacity: 0.05 }));
    doc.setFontSize(48);
    doc.setTextColor(100);
    doc.text("OFFICIAL RECEIPT", centerX, pageHeight/2, { 
      angle: 45,
      align: "center"
    });
    doc.setGState(new doc.GState({ opacity: 1 }));

    // Footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, centerX, pageHeight - 10, { align: "center" });

    doc.save(`Receipt_${student.name.replace(/\s+/g, "_")}_${txn.id}.pdf`);
  };

  // Helper function to generate identical receipts
  const generateReceipt = (doc, data, startX, startY, copyType, tableWidth) => {
    // Draw receipt background
    doc.setFillColor(245, 248, 252);
    doc.rect(startX - 5, startY - 8, tableWidth + 10, 115, 'F');
    
    // Draw receipt border
    doc.setDrawColor(200);
    doc.setLineWidth(0.3);
    doc.rect(startX - 5, startY - 8, tableWidth + 10, 115);
    
    // Copy type header
    doc.setFillColor(26, 58, 108);
    doc.rect(startX - 5, startY - 8, tableWidth + 10, 8, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.text(copyType, startX + tableWidth/2, startY - 3, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    // Create table
    doc.autoTable({
      startY: startY,
      startX: startX,
      tableWidth: tableWidth,
      styles: { 
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle',
        lineColor: [200, 200, 200],
        lineWidth: 0.2
      },
      headStyles: {
        fillColor: [26, 58, 108],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        lineWidth: 0.2
      },
      body: data.map(row => [row[0], row[1]]),
      theme: 'grid',
      columnStyles: {
        0: { cellWidth: 45, fontStyle: 'bold' },
        1: { cellWidth: 55 }
      }
    });

    // Add signature area
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const signatureY = doc.lastAutoTable.finalY + 10;
    doc.text("Authorized Signature:", startX, signatureY);
    doc.setLineWidth(0.5);
    doc.line(startX, signatureY + 5, startX + 60, signatureY + 5);
    
    // Add receipt footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("This is a computer generated receipt", startX, signatureY + 15);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Professional School Fee Receipt Generator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate professional fee receipts with dual copies for student and school records
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview Panel */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 p-4 text-white">
              <h2 className="text-xl font-bold">Receipt Preview</h2>
              <p className="text-blue-200 text-sm">Landscape layout with dual copies</p>
            </div>
            
            <div className="p-6">
              <div className="relative w-full h-[500px] bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                {/* Mock Receipt */}
                <div className="absolute inset-0 bg-white">
                  {/* Header */}
                  <div className="bg-blue-900 py-4 text-center">
                    <div className="text-xl font-bold text-white">{schoolName}</div>
                    <div className="text-xs text-blue-200 mt-1">{schoolAddress}</div>
                  </div>
                  
                  <div className="text-center py-3">
                    <div className="text-lg font-bold text-blue-900">FEE PAYMENT RECEIPT</div>
                    <div className="h-px bg-blue-700 w-48 mx-auto my-2"></div>
                  </div>
                  
                  <div className="flex h-[380px]">
                    {/* Student Copy */}
                    <div className="w-1/2 p-4 relative">
                      <div className="absolute top-4 left-0 right-0">
                        <div className="bg-blue-900 text-white text-center py-1 text-sm font-bold">
                          STUDENT COPY
                        </div>
                      </div>
                      
                      <div className="mt-10 space-y-3">
                        <div className="flex">
                          <div className="w-40 font-semibold">Student Name:</div>
                          <div>{studentName}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Class:</div>
                          <div>{studentClass}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Section:</div>
                          <div>{studentSection}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Bill Name:</div>
                          <div>{billName}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Bill Number:</div>
                          <div>{billNumber}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Date of Payment:</div>
                          <div>{new Date(paymentDate).toLocaleDateString('en-IN')}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Mode of Payment:</div>
                          <div>{paymentMode}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Reference No.:</div>
                          <div>{referenceNumber}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Amount Paid:</div>
                          <div className="font-bold">₹{parseFloat(amountPaid).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      
                      <div className="mt-16 text-center">
                        <div className="text-sm text-gray-600">Authorized Signature</div>
                        <div className="border-t border-gray-400 w-48 mx-auto mt-1"></div>
                      </div>
                    </div>
                    
                    {/* Vertical Divider */}
                    <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 border-l-2 border-dashed border-gray-300"></div>
                    
                    {/* School Copy */}
                    <div className="w-1/2 p-4 relative">
                      <div className="absolute top-4 left-0 right-0">
                        <div className="bg-green-800 text-white text-center py-1 text-sm font-bold">
                          SCHOOL COPY
                        </div>
                      </div>
                      
                      <div className="mt-10 space-y-3">
                        <div className="flex">
                          <div className="w-40 font-semibold">Student Name:</div>
                          <div>{studentName}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Class:</div>
                          <div>{studentClass}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Section:</div>
                          <div>{studentSection}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Bill Name:</div>
                          <div>{billName}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Bill Number:</div>
                          <div>{billNumber}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Date of Payment:</div>
                          <div>{new Date(paymentDate).toLocaleDateString('en-IN')}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Mode of Payment:</div>
                          <div>{paymentMode}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Reference No.:</div>
                          <div>{referenceNumber}</div>
                        </div>
                        <div className="flex">
                          <div className="w-40 font-semibold">Amount Paid:</div>
                          <div className="font-bold">₹{parseFloat(amountPaid).toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                      
                      <div className="mt-16 text-center">
                        <div className="text-sm text-gray-600">Authorized Signature</div>
                        <div className="border-t border-gray-400 w-48 mx-auto mt-1"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-gray-500">
                    Generated on: {new Date().toLocaleDateString()} | {schoolName}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Form Panel */}
          <div className="bg-white rounded-xl shadow-lg">
            <div className="bg-gradient-to-r from-indigo-800 to-purple-800 p-4 text-white">
              <h2 className="text-xl font-bold">Generate Receipt</h2>
              <p className="text-indigo-200 text-sm">Fill in the details to create a professional receipt</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">School Name</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">School Address</label>
                <input
                  type="text"
                  value={schoolAddress}
                  onChange={(e) => setSchoolAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Student Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Class</label>
                  <input
                    type="text"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Section</label>
                  <input
                    type="text"
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Bill Name</label>
                  <input
                    type="text"
                    value={billName}
                    onChange={(e) => setBillName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Bill Number</label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Date of Payment</label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Mode of Payment</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                    <option value="Online Transfer">Online Transfer</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Debit Card">Debit Card</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Reference Number</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={amountPaid}
                  onChange={(e) => setAmountPaid(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <button
                onClick={handlePrintPDF}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                </svg>
                Generate PDF Receipt
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-10 text-center text-gray-600">
          <p>Professional School Fee Receipt Generator • Dual Copy System • Landscape Layout</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReceiptGenerator;