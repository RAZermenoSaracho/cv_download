const Fastify = require("fastify");
const cors = require("@fastify/cors");
const PdfPrinter = require("pdfmake");
const { buildCvDocDefinition, fonts } = require("./cv-content");
const { loadContent, listContentSlugs } = require("./content");

const PORT = process.env.PORT || 8421;
const HOST = process.env.HOST || "127.0.0.1";

const fastify = Fastify({ logger: true });
const printer = new PdfPrinter(fonts);

fastify.register(cors, {
  origin: ["https://razs.dev", "http://localhost:5173"],
  methods: ["GET"],
});

function generateCvPdfBuffer(content) {
  const pdfDoc = printer.createPdfKitDocument(buildCvDocDefinition(content));

  return new Promise((resolve, reject) => {
    const chunks = [];
    pdfDoc.on("data", (chunk) => chunks.push(chunk));
    pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
    pdfDoc.on("error", reject);
    pdfDoc.end();
  });
}

fastify.get("/cv", async (request, reply) => {
  const pdfBuffer = await generateCvPdfBuffer(loadContent("base"));

  reply
    .header("Content-Type", "application/pdf")
    .header("Content-Disposition", 'attachment; filename="Ricardo-Zermeno-CV.pdf"')
    .send(pdfBuffer);
});

// One GET /{slug} route per directory under src/content/ (excluding base/).
// Adding a new vacante directory does not require touching this file.
for (const slug of listContentSlugs()) {
  fastify.get(`/${slug}`, async (request, reply) => {
    const pdfBuffer = await generateCvPdfBuffer(loadContent(slug));

    reply
      .header("Content-Type", "application/pdf")
      .header("Content-Disposition", `attachment; filename="Ricardo_Zermeno_CV_${slug}.pdf"`)
      .send(pdfBuffer);
  });
}

fastify.listen({ port: PORT, host: HOST }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
