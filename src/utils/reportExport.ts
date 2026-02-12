// Report export utilities for PDF and Excel

export type ReportPeriod = "weekly" | "monthly" | "yearly";

export interface ReportData {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  totalSales: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    sales: number;
    quantity: number;
  }>;
  salesByDate: Array<{
    date: string;
    sales: number;
    orders: number;
  }>;
  comparison?: {
    previousPeriod: {
      startDate: string;
      endDate: string;
      totalSales: number;
      totalOrders: number;
      averageOrderValue: number;
      salesByDate: Array<{
        date: string;
        sales: number;
        orders: number;
      }>;
    };
    salesChange: number;
    ordersChange: number;
    avgOrderValueChange: number;
  };
}

// Generate Excel file
export async function exportToExcel(data: ReportData) {
  try {
    // Dynamic import to avoid SSR issues
    const XLSX = await import("xlsx");
    
    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Summary sheet
    const summaryData = [
      ["Report Period", data.period.charAt(0).toUpperCase() + data.period.slice(1)],
      ["Start Date", data.startDate],
      ["End Date", data.endDate],
      ["Total Sales", `Rs. ${data.totalSales.toLocaleString("en-PK")}`],
      ["Total Orders", data.totalOrders],
      ["Average Order Value", `Rs. ${data.averageOrderValue.toLocaleString("en-PK")}`],
      ...(data.comparison ? [
        ["", ""],
        ["Previous Period Comparison", ""],
        ["Previous Period Sales", `Rs. ${data.comparison.previousPeriod.totalSales.toLocaleString("en-PK")}`],
        ["Sales Change", `${data.comparison.salesChange >= 0 ? "+" : ""}${data.comparison.salesChange.toFixed(2)}%`],
        ["Orders Change", `${data.comparison.ordersChange >= 0 ? "+" : ""}${data.comparison.ordersChange.toFixed(2)}%`],
        ["Avg Order Value Change", `${data.comparison.avgOrderValueChange >= 0 ? "+" : ""}${data.comparison.avgOrderValueChange.toFixed(2)}%`],
      ] : []),
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

    // Top Products sheet
    const productsData = [
      ["Product Name", "Sales (Rs.)", "Quantity Sold"],
      ...data.topProducts.map((p) => [p.name, p.sales, p.quantity]),
    ];
    const productsSheet = XLSX.utils.aoa_to_sheet(productsData);
    XLSX.utils.book_append_sheet(workbook, productsSheet, "Top Products");

    // Sales by Date sheet
    const salesData = [
      ["Date", "Sales (Rs.)", "Orders"],
      ...data.salesByDate.map((s) => [s.date, s.sales, s.orders]),
    ];
    const salesSheet = XLSX.utils.aoa_to_sheet(salesData);
    XLSX.utils.book_append_sheet(workbook, salesSheet, "Sales by Date");

    // Generate file name
    const fileName = `analytics-report-${data.period}-${new Date().toISOString().split("T")[0]}.xlsx`;

    // Write file
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    alert("Error exporting to Excel. Please make sure xlsx package is installed: npm install xlsx");
  }
}

// Generate PDF file
export async function exportToPDF(data: ReportData) {
  try {
    // Dynamic import to avoid SSR issues
    const jsPDF = (await import("jspdf")).default;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Analytics Report", pageWidth / 2, yPos, { align: "center" });
    yPos += 10;

    // Period info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Period: ${data.period.charAt(0).toUpperCase() + data.period.slice(1)}`, 20, yPos);
    yPos += 7;
    doc.text(`Date Range: ${data.startDate} to ${data.endDate}`, 20, yPos);
    yPos += 15;

    // Summary section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", 20, yPos);
    yPos += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Sales: Rs. ${data.totalSales.toLocaleString("en-PK")}`, 20, yPos);
    yPos += 7;
    doc.text(`Total Orders: ${data.totalOrders}`, 20, yPos);
    yPos += 7;
    doc.text(`Average Order Value: Rs. ${data.averageOrderValue.toLocaleString("en-PK")}`, 20, yPos);
    yPos += 15;

    // Comparison section
    if (data.comparison) {
      if (yPos > pageHeight - 60) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Comparison with Previous Period", 20, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.text(`Previous Period Sales: Rs. ${data.comparison.previousPeriod.totalSales.toLocaleString("en-PK")}`, 20, yPos);
      yPos += 7;
      doc.text(`Sales Change: ${data.comparison.salesChange >= 0 ? "+" : ""}${data.comparison.salesChange.toFixed(2)}%`, 20, yPos);
      yPos += 7;
      doc.text(`Orders Change: ${data.comparison.ordersChange >= 0 ? "+" : ""}${data.comparison.ordersChange.toFixed(2)}%`, 20, yPos);
      yPos += 7;
      doc.text(`Avg Order Value Change: ${data.comparison.avgOrderValueChange >= 0 ? "+" : ""}${data.comparison.avgOrderValueChange.toFixed(2)}%`, 20, yPos);
      yPos += 15;
    }

    // Top Products section
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Top Products", 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    data.topProducts.slice(0, 10).forEach((product, index) => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${product.name}`, 25, yPos);
      yPos += 6;
      doc.text(`   Sales: Rs. ${product.sales.toLocaleString("en-PK")} | Quantity: ${product.quantity}`, 25, yPos);
      yPos += 8;
    });

    // Generate file name
    const fileName = `analytics-report-${data.period}-${new Date().toISOString().split("T")[0]}.pdf`;

    // Save PDF
    doc.save(fileName);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    alert("Error exporting to PDF. Please make sure jspdf package is installed: npm install jspdf");
  }
}

// Generate report data based on period
export function generateReportData(
  period: ReportPeriod,
  orders: any[],
  products: any[]
): ReportData {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = new Date(now);
  let previousStartDate: Date;
  let previousEndDate: Date;

  switch (period) {
    case "weekly":
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      previousEndDate = new Date(startDate);
      previousEndDate.setDate(previousEndDate.getDate() - 1);
      previousStartDate = new Date(previousEndDate);
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      break;
    case "monthly":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      previousStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      previousEndDate = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "yearly":
      startDate = new Date(now.getFullYear(), 0, 1);
      previousStartDate = new Date(now.getFullYear() - 1, 0, 1);
      previousEndDate = new Date(now.getFullYear() - 1, 11, 31);
      break;
  }

  // Filter orders by current period
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    return orderDate >= startDate && orderDate <= endDate;
  });

  // Filter orders by previous period
  const previousOrders = orders.filter((order) => {
    const orderDate = new Date(order.date);
    return orderDate >= previousStartDate && orderDate <= previousEndDate;
  });

  // Calculate current period totals
  const totalSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = filteredOrders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  // Calculate previous period totals
  const previousTotalSales = previousOrders.reduce((sum, order) => sum + order.total, 0);
  const previousTotalOrders = previousOrders.length;
  const previousAverageOrderValue = previousTotalOrders > 0 ? previousTotalSales / previousTotalOrders : 0;

  // Calculate changes
  const salesChange = previousTotalSales > 0 
    ? ((totalSales - previousTotalSales) / previousTotalSales) * 100 
    : 0;
  const ordersChange = previousTotalOrders > 0 
    ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100 
    : 0;
  const avgOrderValueChange = previousAverageOrderValue > 0 
    ? ((averageOrderValue - previousAverageOrderValue) / previousAverageOrderValue) * 100 
    : 0;

  // Top products (mock data based on products)
  const topProducts = products
    .slice(0, 10)
    .map((product) => ({
      name: product.name,
      sales: product.price * Math.floor(Math.random() * 20 + 5),
      quantity: Math.floor(Math.random() * 20 + 5),
    }))
    .sort((a, b) => b.sales - a.sales);

  // Sales by date
  const salesByDate: Array<{ date: string; sales: number; orders: number }> = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayOrders = filteredOrders.filter(
      (o) => o.date === dateStr
    );
    salesByDate.push({
      date: dateStr,
      sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Previous period sales by date
  const previousSalesByDate: Array<{ date: string; sales: number; orders: number }> = [];
  const prevDate = new Date(previousStartDate);
  
  while (prevDate <= previousEndDate) {
    const dateStr = prevDate.toISOString().split("T")[0];
    const dayOrders = previousOrders.filter(
      (o) => o.date === dateStr
    );
    previousSalesByDate.push({
      date: dateStr,
      sales: dayOrders.reduce((sum, o) => sum + o.total, 0),
      orders: dayOrders.length,
    });
    prevDate.setDate(prevDate.getDate() + 1);
  }

  return {
    period,
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    totalSales,
    totalOrders,
    averageOrderValue,
    topProducts,
    salesByDate,
    comparison: {
      previousPeriod: {
        startDate: previousStartDate.toISOString().split("T")[0],
        endDate: previousEndDate.toISOString().split("T")[0],
        totalSales: previousTotalSales,
        totalOrders: previousTotalOrders,
        averageOrderValue: previousAverageOrderValue,
        salesByDate: previousSalesByDate,
      },
      salesChange,
      ordersChange,
      avgOrderValueChange,
    },
  };
}

