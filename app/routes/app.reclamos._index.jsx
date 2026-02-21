import { authenticate } from "../shopify.server";
import { useLoaderData } from "react-router";

const mockComplaints = [
  {
    id: 1,
    shop: "test-shop.myshopify.com",
    customerName: "Juan Pérez",
    complaintType: "Producto defectuoso",
    status: "pending",
    createdAt: "2024-01-15",
    dueDate: "2024-01-22",
  },
  {
    id: 2,
    shop: "test-shop.myshopify.com",
    customerName: "María García",
    complaintType: "Envío retrasado",
    status: "in_progress",
    createdAt: "2024-01-10",
    dueDate: "2024-01-17",
  },
  {
    id: 3,
    shop: "test-shop.myshopify.com",
    customerName: "Carlos López",
    complaintType: "Producto incorrecto",
    status: "responded",
    createdAt: "2024-01-05",
    dueDate: "2024-01-12",
  },
];

export async function loader({ request }) {
  await authenticate.admin(request);
 
  const complaints = mockComplaints;

  const EXPIRING_DAYS = 3;
  const expiringLimit = new Date(Date.now() + EXPIRING_DAYS * 24 * 60 * 60 * 1000);
  const isExpiring = (c) =>
    ["pending", "in_progress"].includes(c.status) &&
    c.dueDate &&
    new Date(c.dueDate) <= expiringLimit;

  return {
    complaints,
    counts: {
      pending: complaints.filter((c) => c.status === "pending").length,
      inProgress: complaints.filter((c) => c.status === "in_progress").length,
      expiring: complaints.filter(isExpiring).length,
      responded: complaints.filter((c) => c.status === "responded").length,
      completed: complaints.filter((c) => c.status === "completed").length,
    },
  };
}

export default function ReclamosPage() {
  const { complaints, counts } = useLoaderData();

  return (
    <s-page heading="Reclamos" inlineSize="large">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <s-text padding="base" tone="subdued">Gestiona aquí todos tus reclamos</s-text>
      </div>

      <s-section padding="none">
        <s-section padding="base">
          <s-tabs padding="base">
            <s-tabs-header
              style={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "12px",
                padding: "20px",
                alignItems: "center",
                overflowX: "auto",
                whiteSpace: "nowrap",
                borderBottom: "1px solid #E1E3E5",
              }}
            >
              <s-tabs-item
                selected
                style={{
                  flex: "0 0 auto",
                  borderBottom: "2px solid transparent",
                  borderBottom: "2px solid #008060",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                  <span>Pendientes</span>
                  <s-badge tone="subdued">{counts?.pending ?? 0}</s-badge>
                </span>
              </s-tabs-item>
              <s-tabs-item
                style={{
                  flex: "0 0 auto",
                  borderBottom: "2px solid transparent",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                  <span>En proceso</span>
                  <s-badge tone="subdued">{counts?.inProgress ?? 0}</s-badge>
                </span>
              </s-tabs-item>
              <s-tabs-item
                style={{
                  flex: "0 0 auto",
                  borderBottom: "2px solid transparent",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                  <span>Por vencer</span>
                  <s-badge tone="subdued">{counts?.expiring ?? 0}</s-badge>
                </span>
              </s-tabs-item>
              <s-tabs-item
                style={{
                  flex: "0 0 auto",
                  borderBottom: "2px solid transparent",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                  <span>Respondidos</span>
                  <s-badge tone="subdued">{counts?.responded ?? 0}</s-badge>
                </span>
              </s-tabs-item>
              <s-tabs-item
                style={{
                  flex: "0 0 auto",
                  borderBottom: "2px solid transparent",
                  paddingBottom: "8px",
                }}
              >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "8px", whiteSpace: "nowrap" }}>
                  <span>Completados</span>
                  <s-badge tone="subdued">{counts?.completed ?? 0}</s-badge>
                </span>
              </s-tabs-item>
          </s-tabs-header>
        </s-tabs>
        </s-section>
        <s-table>
          <s-table-header-row>
            <s-table-header listSlot="primary">Código</s-table-header>
            <s-table-header listSlot="primary">Fecha</s-table-header>
            <s-table-header listSlot="primary">Cliente</s-table-header>
            <s-table-header listSlot="primary">Tipo</s-table-header>
            <s-table-header listSlot="inline">Estado</s-table-header>
            <s-table-header listSlot="labeled">Vencimiento</s-table-header>
            <s-table-header listSlot="labeled">Acciones</s-table-header>
          </s-table-header-row>

          <s-table-body>
            {complaints.map((c) => (
              <s-table-row key={c.id}>
                <s-table-cell>
                  <s-link href="/app/reclamos/2">
                    {c.id}
                  </s-link>
                </s-table-cell>
                <s-table-cell>24 Ene, 2026</s-table-cell>
                <s-table-cell>{c.customerName}</s-table-cell>
                <s-table-cell>Reclamo</s-table-cell>
                <s-table-cell>
                  <s-badge tone="warning">Pendiente</s-badge>
                </s-table-cell>
                <s-table-cell>
                  <s-inline-stack alignment="center" spacing="200">
                    <s-icon tone="warning">⚠️</s-icon>
                    <s-text>Faltan 4 días</s-text>
                  </s-inline-stack>
                </s-table-cell>
                <s-table-cell>
                  <s-button variant="plain">Gestionar</s-button>
                </s-table-cell>
              </s-table-row>
            ))}
          </s-table-body>
        </s-table>
       
      </s-section>
    </s-page>
  );
}
