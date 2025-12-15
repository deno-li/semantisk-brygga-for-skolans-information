import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Student, PDFExportOptions } from './types';

export const usePDFExport = () => {
  const exportToPDF = async (student: Student, options: PDFExportOptions) => {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: options.format === 'A4' ? 'a4' : 'letter'
      });

      let yPosition = 20;

      // Add title
      pdf.setFontSize(24);
      pdf.setTextColor(59, 130, 246);
      pdf.text('Välbefinnandehjulet - Rapport', 20, yPosition);
      yPosition += 15;

      // Add a line separator
      pdf.setDrawColor(200, 200, 200);
      pdf.line(20, yPosition, 190, yPosition);
      yPosition += 10;

      // Add student info
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Elevuppgifter', 20, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Namn: ${student.profile.name}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Ålder: ${student.profile.age} år`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Årskurs: ${student.profile.grade}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Skola: ${student.profile.school}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Datum: ${new Date().toLocaleDateString('sv-SE')}`, 20, yPosition);
      yPosition += 6;

      if (student.profile.sipActive) {
        pdf.setTextColor(147, 51, 234);
        pdf.text('SIP: Aktiv', 20, yPosition);
        yPosition += 6;
      }

      yPosition += 5;

      // Add risk level
      pdf.setFontSize(12);
      const riskColors = {
        low: [34, 197, 94],
        medium: [234, 179, 8],
        high: [239, 68, 68]
      };
      const riskLabels = {
        low: 'Låg risk',
        medium: 'Viss risk',
        high: 'Hög risk'
      };
      const color = riskColors[student.riskLevel];
      pdf.setTextColor(color[0], color[1], color[2]);
      pdf.text(`Risknivå: ${riskLabels[student.riskLevel]}`, 20, yPosition);
      yPosition += 10;

      // Add statistics
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('Statistik', 20, yPosition);
      yPosition += 8;

      const totalIndicators = Object.values(student.dimensions).flat().length;
      const dimensionCount = Object.keys(student.dimensions).length;
      const historyCount = student.history?.length || 0;

      pdf.setFontSize(11);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`Antal indikatorer: ${totalIndicators}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Antal dimensioner: ${dimensionCount}`, 20, yPosition);
      yPosition += 6;
      pdf.text(`Antal mätningar: ${historyCount}`, 20, yPosition);
      yPosition += 10;

      // Capture welfare wheel if requested and element exists
      if (options.includeWheel) {
        const wheelElement = document.getElementById('welfare-wheel');
        if (wheelElement) {
          try {
            pdf.addPage();
            yPosition = 20;

            pdf.setFontSize(16);
            pdf.setTextColor(59, 130, 246);
            pdf.text('Välbefinnandehjul', 20, yPosition);
            yPosition += 15;

            const canvas = await html2canvas(wheelElement, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 170;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          } catch (error) {
            console.error('Error capturing welfare wheel:', error);
          }
        }
      }

      // Capture timeline if requested
      if (options.includeTimeline && student.timeline && student.timeline.length > 0) {
        pdf.addPage();
        yPosition = 20;

        pdf.setFontSize(16);
        pdf.setTextColor(59, 130, 246);
        pdf.text('Tidslinje', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(11);
        pdf.setTextColor(80, 80, 80);

        student.timeline.slice(0, 10).forEach((event, index) => {
          if (yPosition > 260) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setTextColor(0, 0, 0);
          pdf.setFont(undefined, 'bold');
          pdf.text(`${event.date} - ${event.title}`, 20, yPosition);
          yPosition += 6;

          pdf.setFont(undefined, 'normal');
          pdf.setTextColor(80, 80, 80);

          const lines = pdf.splitTextToSize(event.description, 170);
          lines.forEach((line: string) => {
            if (yPosition > 260) {
              pdf.addPage();
              yPosition = 20;
            }
            pdf.text(line, 20, yPosition);
            yPosition += 5;
          });

          yPosition += 5;
        });
      }

      // Capture trends chart if requested
      if (options.includeTrends && student.history && student.history.length > 0) {
        const trendsElement = document.getElementById('trends-chart');
        if (trendsElement) {
          try {
            pdf.addPage();
            yPosition = 20;

            pdf.setFontSize(16);
            pdf.setTextColor(59, 130, 246);
            pdf.text('Trendanalys', 20, yPosition);
            yPosition += 15;

            const canvas = await html2canvas(trendsElement, {
              scale: 2,
              useCORS: true,
              backgroundColor: '#ffffff'
            });
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 170;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
          } catch (error) {
            console.error('Error capturing trends chart:', error);
          }
        }
      }

      // Add footer on last page
      const pageCount = (pdf as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Sida ${i} av ${pageCount}`,
          pdf.internal.pageSize.width / 2,
          pdf.internal.pageSize.height - 10,
          { align: 'center' }
        );
      }

      // Generate filename
      const filename = `valbefinnandehjul-${student.profile.name.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;

      // Save the PDF
      pdf.save(filename);

      return { success: true, filename };
    } catch (error) {
      console.error('Error generating PDF:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  };

  return { exportToPDF };
};
