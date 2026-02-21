document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.libro-reclamaciones__form').forEach(function (form) {
    var blockId = form.id.replace('form-reclamo-', '');
    var messageEl = document.getElementById('reclamo-message-' + blockId);
    var submitBtn = form.querySelector('.libro-reclamaciones__submit');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
      messageEl.hidden = true;
      messageEl.className = 'libro-reclamaciones__message';

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Error al enviar el reclamo.');
          return res.json();
        })
        .then(function (data) {
          messageEl.textContent = data.message || '¡Reclamo enviado exitosamente! Recibirás una confirmación por email.';
          messageEl.classList.add('libro-reclamaciones__message--success');
          messageEl.hidden = false;
          form.reset();
        })
        .catch(function (err) {
          messageEl.textContent = err.message || 'Ocurrió un error. Por favor intenta nuevamente.';
          messageEl.classList.add('libro-reclamaciones__message--error');
          messageEl.hidden = false;
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.label || 'Enviar reclamo';
        });
    });
  });
});
