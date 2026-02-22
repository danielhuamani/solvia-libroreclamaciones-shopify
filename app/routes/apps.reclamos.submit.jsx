const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}


export async function action({ request }) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const contentType = request.headers.get("content-type") || "";
  let data = {};

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    for (const [key, value] of formData.entries()) {
      if (key !== "documentos[]") {
        data[key] = value;
      }
    }
  } else {
    data = await request.json().catch(() => ({}));
  }

  const required = [
    "tipo_persona",
    "tipo_documento",
    "numero_documento",
    "nombres",
    "apellidos",
    "email",
    "telefono",
    "tipo_bien",
    "descripcion_producto",
    "tipo_reclamo",
    "detalle",
  ];

  const missing = required.filter((f) => !data[f]);
  if (missing.length > 0) {
    return jsonResponse({ error: `Campos requeridos faltantes: ${missing.join(", ")}` }, 400);
  }

  const complaint = {
    id: `RC-${Date.now()}`,
    shop: data.shop,
    createdAt: new Date().toISOString(),
    status: "pending",
    consumer: {
      personType: data.tipo_persona,
      docType: data.tipo_documento,
      docNumber: data.numero_documento,
      names: data.nombres,
      lastNames: data.apellidos,
      isMinor: data.es_menor,
      department: data.departamento,
      province: data.provincia,
      district: data.distrito,
      address: data.direccion,
      email: data.email,
      phone: data.telefono,
    },
    goods: {
      goodType: data.tipo_bien,
      productDescription: data.descripcion_producto,
      receiptType: data.tipo_comprobante,
      receiptNumber: data.numero_comprobante,
      amount: data.monto,
    },
    claim: {
      type: data.tipo_reclamo,
      detail: data.detalle,
      request: data.pedido,
    },
  };

  console.log("[Libro de Reclamaciones] Nuevo reclamo recibido:", complaint);

  return jsonResponse(
    {
      success: true,
      id: complaint.id,
      message: "¡Reclamo enviado exitosamente! Recibirás una confirmación en tu email en breve.",
    },
    201
  );
}

export async function loader({ request }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Accept",
      },
    });
  }
  return jsonResponse({ error: "Not found" }, 404);
}
