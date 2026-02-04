import { useLoaderData } from "@shopify/shopify-app-react-router/react";
import { useState, useCallback } from "react";

export default function LibroReclamaciones() {
  const { complaints, counts } = useLoaderData();
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    {
      id: "pending",
      content: "Pendientes",
      badge: counts.pending,
      panelID: "pending-complaints",
    },
    {
      id: "in_progress",
      content: "En proceso",
      badge: counts.inProgress,
      panelID: "in-progress-complaints",
    },
    {
      id: "expiring",
      content: "Por vencer",
      badge: counts.expiring,
      panelID: "expiring-complaints",
    },
    {
      id: "responded",
      content: "Respondidos",
      badge: counts.responded,
      panelID: "responded-complaints",
    },
    {
      id: "completed",
      content: "Completados",
      badge: counts.completed,
      panelID: "completed-complaints",
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex) => {
    setSelectedTab(selectedTabIndex);
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { content: "Pendiente", tone: "warning" },
      in_progress: { content: "En proceso", tone: "info" },
      responded: { content: "Respondido", tone: "success" },
      completed: { content: "Completado", tone: "success" },
    };
    return statusMap[status] || { content: status, tone: "default" };
  };

  const filterComplaints = (complaints, status) => {
    if (status === "expiring") {
      return complaints.filter(complaint => 
        ["pending", "in_progress"].includes(complaint.status) &&
        complaint.dueDate &&
        new Date(complaint.dueDate) <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      );
    }
    return complaints.filter(complaint => complaint.status === status);
  };

  const getFilteredComplaints = () => {
    const currentTab = tabs[selectedTab];
    if (currentTab.id === "pending") {
      return filterComplaints(complaints, "pending");
    } else if (currentTab.id === "in_progress") {
      return filterComplaints(complaints, "in_progress");
    } else if (currentTab.id === "expiring") {
      return filterComplaints(complaints, "expiring");
    } else if (currentTab.id === "responded") {
      return filterComplaints(complaints, "responded");
    } else if (currentTab.id === "completed") {
      return filterComplaints(complaints, "completed");
    }
    return complaints;
  };

  const filteredComplaints = getFilteredComplaints();

  return (
    <shopify-page title="Reclamos">
      <shopify-page-primary-action>
        <shopify-button 
          onClick={() => console.log("New complaint")}
        >
          Nuevo reclamo
        </shopify-button>
      </shopify-page-primary-action>
      
      <shopify-layout>
        <shopify-layout-section>
          <shopify-card>
            <shopify-tabs 
              tabs={JSON.stringify(tabs)}
              selected={selectedTab}
              onSelect={handleTabChange}
            >
              {filteredComplaints.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem" }}>
                  <shopify-text appearance="subdued">No hay reclamaciones en esta categoría</shopify-text>
                </div>
              ) : (
                <shopify-data-table
                  column-content-types='["text", "text", "text", "text", "text", "text", "text"]'
                  headings='["Código", "Fecha", "Cliente", "Tipo", "Estado", "Vencimiento", "Acciones"]'
                  rows={JSON.stringify(filteredComplaints.map((complaint) => [
                    complaint.id.slice(-8),
                    new Date(complaint.createdAt).toLocaleDateString(),
                    complaint.customerName,
                    complaint.complaintType,
                    getStatusBadge(complaint.status),
                    complaint.dueDate ? new Date(complaint.dueDate).toLocaleDateString() : "-",
                    `<shopify-button variant="plain" size="small" onclick="console.log('Manage complaint: ${complaint.id}')">Gestionar</shopify-button>`
                  ]))}
                />
              )}
            </shopify-tabs>
          </shopify-card>
        </shopify-layout-section>
      </shopify-layout>
    </shopify-page>
  );
}
