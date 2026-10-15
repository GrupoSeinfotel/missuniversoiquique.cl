import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function generateSponsorDiploma(sponsorName: string, candidateName: string) {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([842, 595]); // A4 Landscape
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Background color (Light cream/gold-ish)
    page.drawRectangle({
        x: 0,
        y: 0,
        width,
        height,
        color: rgb(0.98, 0.95, 0.9),
    });

    // Elegant Border
    page.drawRectangle({
        x: 20,
        y: 20,
        width: width - 40,
        height: height - 40,
        borderColor: rgb(0.8, 0.6, 0.2), // Gold
        borderWidth: 5,
    });

    // Header
    page.drawText('MISS UNIVERSE IQUIQUE', {
        x: width / 2 - 150,
        y: height - 100,
        size: 30,
        font: fontBold,
        color: rgb(0.1, 0.1, 0.1),
    });

    page.drawText('CERTIFICADO DE COLABORACIÓN OFICIAL', {
        x: width / 2 - 180,
        y: height - 140,
        size: 18,
        font: fontRegular,
        color: rgb(0.3, 0.3, 0.3),
    });

    // Content
    page.drawText('Este diploma reconoce gratamente a:', {
        x: width / 2 - 120,
        y: height - 220,
        size: 14,
        font: fontRegular,
    });

    page.drawText(sponsorName.toUpperCase(), {
        x: width / 2 - (sponsorName.length * 6),
        y: height - 260,
        size: 24,
        font: fontBold,
        color: rgb(0.7, 0.1, 0.3), // Accent Pink-ish
    });

    page.drawText('Por su valioso apoyo y patrocinio a nuestra candidata:', {
        x: width / 2 - 160,
        y: height - 320,
        size: 14,
        font: fontRegular,
    });

    page.drawText(candidateName, {
        x: width / 2 - (candidateName.length * 6),
        y: height - 360,
        size: 20,
        font: fontBold,
    });

    page.drawText('En su camino hacia la corona de Miss Universe Iquique 2026', {
        x: width / 2 - 180,
        y: height - 400,
        size: 12,
        font: fontRegular,
    });

    // Signatures
    page.drawLine({
        start: { x: 150, y: 100 },
        end: { x: 300, y: 100 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
    page.drawText('Nelson Velásquez', { x: 170, y: 80, size: 10, font: fontRegular });
    page.drawText('Director Regional', { x: 180, y: 65, size: 8, font: fontRegular });

    page.drawLine({
        start: { x: 550, y: 100 },
        end: { x: 700, y: 100 },
        thickness: 1,
        color: rgb(0, 0, 0),
    });
    page.drawText('Michael Morales', { x: 580, y: 80, size: 10, font: fontRegular });
    page.drawText('Director de Marketing', { x: 585, y: 65, size: 8, font: fontRegular });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
}
