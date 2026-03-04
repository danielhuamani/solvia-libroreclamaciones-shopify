document.addEventListener("DOMContentLoaded", () => {
    const API_ENDPOINT = "http://localhost:3000/api/claims";
    const wrappers = document.querySelectorAll("[id^='libro-reclamaciones-']");

    wrappers.forEach(wrapper => {
        const shop = wrapper.dataset.shop;
        const blockId = wrapper.dataset.blockId;

        const form = document.getElementById(`form-reclamo-${blockId}`);
        const message = document.getElementById(`reclamo-message-${blockId}`);
        const submitBtn = document.getElementById(`btn-submit-${blockId}`);

        const setState = (state, text = "") => {
            message.className = "libro-mensaje";
            submitBtn.disabled = false;

            switch (state) {
                case "loading":
                    message.textContent = "Enviando reclamo...";
                    message.classList.add("loading");
                    submitBtn.disabled = true;
                    break;

                case "success":
                    message.textContent = text || "Reclamo enviado correctamente.";
                    message.classList.add("success");
                    break;

                case "error":
                    message.textContent = text || "Ocurrió un error.";
                    message.classList.add("error");
                    break;

                case "validation_error":
                    message.textContent = text || "Complete todos los campos.";
                    message.classList.add("warning");
                    break;

                default:
                    message.textContent = "";
            }
        };


        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();


            if (!form.checkValidity()) {
                setState("validation_error");
                form.reportValidity();
                return;
            }

            try {
                setState("loading");

                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 8000);
                const formData = new FormData(form);
                console.log("formData 1 entries", Object.fromEntries(formData.entries()));

                

                const response = await fetch(API_ENDPOINT, {
                    method: "POST",
                    body: formData,
                    signal: controller.signal
                });

                

                clearTimeout(timeout);

                if (!response.ok) {
                    throw new Error(await response.text());
                }

                const result = await response.json();
                console.log("submit result",result);

                if (!result.success) {
                    throw new Error(result.message);
                }

                setState("success", result.message);
                form.reset();

            } catch (error) {
                if (error.name === "AbortError") {
                    setState("error", "Tiempo de espera agotado.");
                } else {
                    setState("error", error.message);
                }
            }
        });
    });
});