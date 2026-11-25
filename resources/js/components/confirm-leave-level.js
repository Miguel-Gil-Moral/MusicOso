export function iniciarConfirmacionesSalida() {
    document.querySelectorAll("[data-leave-dialog]").forEach((trigger) => {
        const dialog = document.getElementById(trigger.dataset.leaveDialog);

        if (!dialog) {
            return;
        }

        trigger.addEventListener("click", () => dialog.showModal());

        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });
    });
}

iniciarConfirmacionesSalida();
