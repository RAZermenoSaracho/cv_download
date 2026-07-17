const Fastify = require("fastify");
const PdfPrinter = require("pdfmake");
const { buildCvDocDefinition, fonts } = require("./cv-content");

const PORT = process.env.PORT || 8421;
const HOST = process.env.HOST || "127.0.0.1";

const fastify = Fastify({ logger: true });
const printer = new PdfPrinter(fonts);

function generateCvPdfBuffer() {
  const pdfDoc = printer.createPdfKitDocument(buildCvDocDefinition());

  return new Promise((resolve, reject) => {
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
    pdfDoc.on("error", reject);
    pdfDoc.end();
  });
}

fastify.get("/cv", async (request, reply) => {
  const pdfBuffer = await generateCvPdfBuffer();

  reply
    .header("Content-Type", "application/pdf")
    .header("Content-Disposition", 'attachment; filename="Ricardo-Zermeno-CV.pdf"')
    .send(pdfBuffer);
});

fastify.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
