import { authenticate } from "../shopify.server";
import { useLoaderData, useNavigate } from "react-router";

const mockComplaints = [
  {
    id: 1,
    shop: "test-shop.myshopify.com",
    customerName: "Juan Pérez",
    complaintType: "Producto defectuoso",
    status: "pending",
    createdAt: "2024-01-15",
    dueDate: "2024-01-22",
  }
];

const STATUS_MAP = {
  PENDING: { tone: "caution", label: "Pendiente" },
  IN_PROGRESS: { tone: "warning", label: "En progresso" },
  EXPIRING: { tone: "critical", label: "Por vencer" },
  RESPONDED: { tone: "info", label: "Respondido" },
  COMPLETED: { tone: "success", label: "Completados" }
};

export async function loader({ request }) {
  const { session } = await authenticate.admin(request);
  //await authenticate.admin(request);

  const API_BASE_URL = "http://localhost:3000";
  //const complaints = mockComplaints; 
  const EXPIRING_DAYS = 3;
  const expiringLimit = new Date(Date.now() + EXPIRING_DAYS * 24 * 60 * 60 * 1000);
  const isExpiring = (c) =>
    ["pending", "in_progress"].includes(c.status) &&
    c.dueDate &&
    new Date(c.dueDate) <= expiringLimit; 


  try {
    const response = await fetch(
      `${API_BASE_URL}/api/claims?shop=${session.shop}`
    );

    if (!response.ok) {
      throw new Error("Error al obtener reclamos");
    }

    const complaints = await response.json();

    console.log("loader complaints", complaints);

    return {
      complaints,
      counts: {
        pending: complaints.filter((c) => c.status === "PENDING").length,
        inProgress: complaints.filter((c) => c.status === "IN_PROGRESS").length,
        expiring: complaints.filter(isExpiring).length,
        responded: complaints.filter((c) => c.status === "RESPONDED").length,
        completed: complaints.filter((c) => c.status === "COMPLETED").length,
      },
    };



    //return json({ claims });
  } catch (error) {
    console.error("Error loader reclamos:", error);
    return json({ claims: [], error: "No se pudo cargar la data" });
  }
}

export default function ReclamosPage() {
  const { complaints, counts } = useLoaderData();
  const navigate = useNavigate();

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);

    const formatted = date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Capitalizar mes y agregar coma
    const [day, month, year] = formatted.split(" ");
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

    return `${day} ${capitalizedMonth}, ${year}`;
  };

  const formatFullname = (nombres, apellidos) =>{
    const mergeName = `${nombres} ${apellidos}`;
    return mergeName;
  }


  const getStatusBadge= (status) => {
    const normalizedStatus = status?.toUpperCase();

    return STATUS_MAP[normalizedStatus] || {
      tone: "info",
      label: normalizedStatus || "Sin estado"
    };
  }

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
            {complaints.map((c) => {
              const badge = getStatusBadge(c.status);

              return (
                <s-table-row key={c.id}>
                  <s-table-cell>
                    <s-link href={`/app/reclamos/${c.id}`}>
                      {c.id}
                    </s-link>
                  </s-table-cell>
                  <s-table-cell>{formatDate(c.createdAt)}</s-table-cell>
                  <s-table-cell>{formatFullname(c.nombres, c.apellidos)}</s-table-cell>
                  <s-table-cell>{c.tipo_reclamo}</s-table-cell>
                  <s-table-cell>
                    <s-badge tone={badge.tone}>{badge.label}</s-badge>                    
                  </s-table-cell>
                  <s-table-cell>
                    <s-inline-stack alignment="center" spacing="200">
                      <s-icon tone="warning">⚠️</s-icon>
                      <s-text>Faltan 4 días</s-text>
                    </s-inline-stack>
                  </s-table-cell>
                  <s-table-cell>
                    <s-button variant="plain" onClick={() => navigate(`/app/reclamos/${c.id}`)}>Gestionar</s-button>
                  </s-table-cell>
                </s-table-row>
              );
            })}
          </s-table-body>
        </s-table>

      </s-section>
    </s-page>
  );
}
