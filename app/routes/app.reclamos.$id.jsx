import { authenticate } from "../shopify.server";
import { useLoaderData } from "react-router";

export async function loader({ request, params }) {
  await authenticate.admin(request);

  const id = params.id ?? "0025";

  const complaint = {
    code: `RC${String(id).padStart(4, "0")}`,
    status: "Pendiente",
    createdAtText: "Reclamo generado el 12 de enero del 2025 a las 15:30",
    consumer: {
      personType: "Natural",
      docType: "DNI",
      docNumber: "72773489",
      names: "Alexander",
      lastNames: "Villanueva Lopez",
      isMinor: "No",
      department: "Lima",
      province: "Lima",
      district: "Miraflores",
      address: "Jr Juan Montoya 308. Año Nuevo.",
      email: "dersanvll@gmail.com",
      phone: "+51 987 876 767",
    },
    contact: { phone: "+51 987 878 776", email: "dersanvll@gmail.com" },
    goods: {
      goodType: "Producto",
      productDescription: "Polo de algodón talla S en color azul",
      receiptType: "Boleta de venta",
      receiptNumber: "SD0232333",
      amount: "S/ 233.52",
    },
    claim: {
      type: "Reclamo",
      detail:
        "Trato descortés del tendero de la tienda ubicada en el CC Jockey... (texto largo aquí)",
    },
    documents: [
      { name: "rc-0025.pdf", href: "#" },
      { name: "Imagen_1.pdf", href: "#" },
      { name: "foto_2.pdf", href: "#" },
    ],
  };

  return { complaint };
}

function Card({ title, children }) {
  return (
    <s-box>
      <s-stack direction="block" gap="base">
        <s-heading marginBottom="200" size="large">{title}</s-heading>
        {children}
      </s-stack>
    </s-box>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{ padding: "10px 0", borderBottom: last ? "none" : "1px dashed #E1E3E5" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
        <s-text tone="subdued">{label}</s-text>
        <s-text style={{ textAlign: "right", maxWidth: 420 }}>{value ?? "-"}</s-text>
      </div>
    </div>
  );
}

export default function ReclamoDetalle() {
  const { complaint } = useLoaderData();

  return (
<s-page heading={`Reclamo #${complaint.code}`} inlineSize="large">
  {/* fecha */}
    <s-text slot="subtitle" tone="subdued">
      {complaint.createdAtText}
      {" "}
      <span
        style={{
          background: "#FFF7E6",
          color: "#8A6116",
          padding: "2px 8px",
          borderRadius: "999px",
          fontSize: "12px",
          fontWeight: 600,
          marginLeft: 8,
        }}
      >
        {complaint.status}
      </span>
    </s-text>
    <s-link slot="breadcrumb-actions" href="/app/reclamos">
      Reclamos
    </s-link>

    <s-button slot="secondary-actions">
      Descargar reclamo
    </s-button>

    <s-button slot="primary-action" variant="primary">
      Responder reclamo
    </s-button>

      {/* Layout 2 columnas con s-grid */}
      <s-grid gridTemplateColumns="repeat(12, 1fr)" gap="base">
        {/* Left */}
        <s-grid-item gridColumn="span 9" gridRow="span 1">
          <s-section >
            <s-box padding="large-200" >
              <s-stack direction="block" spacing="400">
                <Card title="Información del consumidor">
                  <Row label="Tipo de persona:" value={complaint.consumer.personType} />
                  <Row label="Documento de Identidad:" value={complaint.consumer.docType} />
                  <Row label="Número de documento:" value={complaint.consumer.docNumber} />
                  <Row label="Nombres:" value={complaint.consumer.names} />
                  <Row label="Apellidos:" value={complaint.consumer.lastNames} />
                  <Row label="Es menor de edad:" value={complaint.consumer.isMinor} />
                  <Row label="Departamento:" value={complaint.consumer.department} />
                  <Row label="Provincia:" value={complaint.consumer.province} />
                  <Row label="Distrito:" value={complaint.consumer.district} />
                  <Row label="Dirección:" value={complaint.consumer.address} />
                  <Row label="Email:" value={complaint.consumer.email} />
                  <Row label="Número de teléfono:" value={complaint.consumer.phone} last />
                </Card>

                <Card title="Identificación del bien">
                  <Row label="Tipo de bien:" value={complaint.goods.goodType} />
                  <Row label="Descripción del producto:" value={complaint.goods.productDescription} />
                  <Row label="Tipo de comprobante:" value={complaint.goods.receiptType} />
                  <Row label="Número de comprobante:" value={complaint.goods.receiptNumber} />
                  <div style={{ paddingTop: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                      <s-text tone="subdued">Monto de reclamo:</s-text>
                      <s-text style={{ textAlign: "right", fontWeight: 600 }}>{complaint.goods.amount}</s-text>
                    </div>
                  </div>
                </Card>

                <Card title="Reclamación y pedido">
                  <Row label="Tipo de reclamo:" value={complaint.claim.type} />
                  <div style={{ paddingTop: 10 }}>
                    <s-text tone="subdued">Detalle del reclamo:</s-text>
                    <s-box
                      style={{
                        marginTop: 10,
                        padding: 14,
                        borderRadius: 10,
                        background: "#F6F6F7",
                        border: "1px solid #E1E3E5",
                        lineHeight: 1.5,
                      }}
                    >
                      <s-paragraph>{complaint.claim.detail}</s-paragraph>
                    </s-box>
                  </div>
                </Card>
              </s-stack>
            </s-box>
          </s-section>
        </s-grid-item>
        {/* Right */}
        <s-grid-item gridColumn="span 3" gridRow="span 1">
          <s-stack gap="base">
            <s-section >
              <s-box padding="large-200" >
                <Card title="Datos de contacto">
                  <s-stack gap="base">
                    <s-stack direction="inline" alignment="start" spacing="200">
                      <span aria-hidden="true">📞</span>
                      <s-text>
                        Teléfono: <s-link href={`tel:${complaint.contact.phone}`}>{complaint.contact.phone}</s-link>
                      </s-text>
                    </s-stack>
                    <s-stack direction="inline" alignment="start" spacing="200">
                      <span aria-hidden="true">✉️</span>
                      <s-text>
                        Email: <s-link href={`mailto:${complaint.contact.email}`}>{complaint.contact.email}</s-link>
                      </s-text>
                    </s-stack>
                  </s-stack>
                </Card>
              </s-box>
            </s-section>
            <s-section padding="base" >
              <s-box padding="large-200">
                <Card title="Documentos del reclamo">
                  {complaint.documents.length > 0 ? (
                    <s-unordered-list>
                      {complaint.documents.map((d) => (
                        <s-list-item key={d.name}>
                          <a href={d.url} target="_blank" rel="noopener noreferrer">
                            {d.name}
                          </a>
                        </s-list-item>
                      ))}
                    </s-unordered-list>
                  ) : (
                    <s-text tone="subdued">Sin documentos</s-text>
                  )}
                </Card>
              </s-box>
            </s-section>
            <s-section>
              <s-box padding="large-200">
                <Card title="Notas internas">
                  <s-stack direction="block" spacing="300">
                    <s-text-area  value="" />
                  </s-stack>
                </Card>
              </s-box>
            </s-section>
          </s-stack>
        </s-grid-item>
      </s-grid>

      {/* responsive */}
      <style>{`
        @media (max-width: 900px) {
          s-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </s-page>
  );
}
