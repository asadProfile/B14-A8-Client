import type { Booking } from './types';
import { formatCurrency, formatDate, formatTimeRange } from './utils';

export const invoiceNumber = (bookingId: string) =>
  `SS-${bookingId.slice(-8).toUpperCase()}`;

/**
 * Builds a one-page A4 invoice in the browser. jsPDF is imported lazily so the
 * booking page does not pay for it until someone downloads a document.
 */
export async function downloadBookingInvoice(
  booking: Booking,
  customer: { name: string; email: string },
) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const ink: [number, number, number] = [27, 23, 19];
  const muted: [number, number, number] = [108, 100, 89];
  const accent: [number, number, number] = [205, 78, 44];
  const paper: [number, number, number] = [253, 248, 238];

  // Header band
  doc.setFillColor(20, 17, 14);
  doc.rect(0, 0, 210, 42, 'F');

  doc.setTextColor(...paper);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('StudioSpace', 14, 19);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(242, 169, 126);
  doc.text('SPACE TO MAKE. TIME TO CREATE.', 14, 25);

  doc.setFontSize(15);
  doc.setTextColor(...paper);
  doc.text('BOOKING INVOICE', 196, 18, { align: 'right' });

  doc.setFontSize(8);
  doc.setTextColor(190, 180, 165);
  doc.text(invoiceNumber(booking.id), 196, 24, { align: 'right' });

  // Billed to / issued
  doc.setTextColor(...muted);
  doc.setFontSize(7);
  doc.text('BILLED TO', 14, 56);
  doc.text('ISSUED', 196, 56, { align: 'right' });

  doc.setTextColor(...ink);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.text(customer.name || booking.userName, 14, 62);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(customer.email || booking.userEmail, 14, 67);

  doc.setFontSize(9);
  doc.text(
    new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    196,
    62,
    { align: 'right' },
  );
  doc.setTextColor(...accent);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(booking.status.toUpperCase(), 196, 67, { align: 'right' });

  // Session panel
  doc.setFillColor(247, 243, 234);
  doc.setDrawColor(228, 221, 208);
  doc.roundedRect(14, 78, 182, 52, 3, 3, 'FD');

  doc.setTextColor(...muted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('THE SPACE', 20, 88);
  doc.text('SESSION', 122, 88);

  doc.setTextColor(...ink);
  doc.setFontSize(11);
  const titleLines = doc.splitTextToSize(booking.studioSnapshot.title, 92) as string[];
  doc.text(titleLines.slice(0, 2), 20, 95);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...muted);
  doc.text(
    `${booking.studioSnapshot.category} · ${booking.studioSnapshot.location}`,
    20,
    106,
  );

  doc.setTextColor(...ink);
  doc.setFontSize(9.5);
  doc.text(formatDate(booking.date), 122, 95);
  doc.text(formatTimeRange(booking.startTime, booking.endTime), 122, 101);
  doc.setTextColor(...muted);
  doc.setFontSize(8.5);
  doc.text(`${booking.hours} ${booking.hours === 1 ? 'hour' : 'hours'} booked`, 122, 107);

  // Line items
  const tableTop = 146;
  doc.setDrawColor(228, 221, 208);
  doc.line(14, tableTop, 196, tableTop);

  doc.setTextColor(...muted);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('DESCRIPTION', 14, tableTop + 7);
  doc.text('AMOUNT', 196, tableTop + 7, { align: 'right' });

  const rows: [string, string][] = [
    [
      `${booking.studioSnapshot.title} — ${booking.hours}h at ${formatCurrency(booking.hourlyRate)}/hr`,
      formatCurrency(booking.subtotal),
    ],
    ['Service fee (5%)', formatCurrency(booking.serviceFee)],
  ];

  let y = tableTop + 17;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...ink);
  rows.forEach(([label, amount]) => {
    doc.text(label, 14, y, { maxWidth: 148 });
    doc.text(amount, 196, y, { align: 'right' });
    y += 9;
  });

  doc.line(120, y - 3, 196, y - 3);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total', 120, y + 5);
  doc.setFontSize(13);
  doc.text(formatCurrency(booking.total), 196, y + 5, { align: 'right' });

  if (booking.securityDeposit > 0) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...muted);
    doc.text(
      `Refundable security deposit recorded separately: ${formatCurrency(booking.securityDeposit)}`,
      196,
      y + 12,
      { align: 'right' },
    );
  }

  // Notes + footer
  doc.setFillColor(253, 246, 238);
  doc.setDrawColor(242, 213, 196);
  doc.roundedRect(14, y + 22, 182, 24, 3, 3, 'FD');
  doc.setTextColor(140, 78, 50);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('GOOD TO KNOW', 20, y + 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(
    'Confirmed hours are protected from overlapping bookings. Bring this invoice or show it on your phone.',
    20,
    y + 36,
    { maxWidth: 170 },
  );

  doc.setDrawColor(228, 221, 208);
  doc.line(14, 274, 196, 274);
  doc.setTextColor(...muted);
  doc.setFontSize(7.5);
  doc.text('StudioSpace · studiosspace.com · hello@studiosspace.com', 14, 281);
  doc.text(`Invoice ${invoiceNumber(booking.id)}`, 196, 281, { align: 'right' });

  doc.save(`StudioSpace-${invoiceNumber(booking.id)}.pdf`);
}
