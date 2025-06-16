function ventanaFlotante(selectorFormulario, idModal) {
  document.querySelectorAll(selectorFormulario).forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const idAlbum = form.querySelector('input[name="idAlbum"]').value;
      const idAlbumInput = document.getElementById('idAlbumInput');
      const modalElement = document.getElementById(idModal);

      if (idAlbumInput && modalElement) {
        idAlbumInput.value = idAlbum;

        let modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (!modalInstance) {
          modalInstance = new bootstrap.Modal(modalElement);
        }

        modalInstance.show();
      } else {
        console.error("No se encontró el modal o el input oculto");
      }
    });
  });
}

function ventanaEditarAlbum() {
  document.querySelectorAll('.editar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const titulo = btn.dataset.titulo;
      const descripcion = btn.dataset.descripcion;
      const modo = btn.dataset.modo;
      const destacado = btn.dataset.destacado === 'true';

      document.getElementById('editarIdAlbumInput').value = id;
      document.getElementById('titulo').value = titulo || '';
      document.getElementById('descripcion').value = descripcion || '';
      document.getElementById('modo').value = modo || 'modoVitrina';
      document.getElementById('destacado').checked = destacado;

      const modal = new bootstrap.Modal(document.getElementById('editarAlbumModal'));
      modal.show();
    });
  });
}
