let imagenActualSeleccionada = null;
document.addEventListener('DOMContentLoaded', () => {

  
  document.querySelectorAll('a[href^="/usuario/"]').forEach(enlace => {
  enlace.addEventListener('click', () => {
    const modal = bootstrap.Modal.getInstance(document.getElementById('detalleAlbumModal'));
    if (modal) modal.hide();
  });
});

if(document.getElementById('imagenes')){
  document.getElementById('imagenes').addEventListener('change', function (event) {
    const archivos = event.target.files;
   
    const previewContainer = document.getElementById('previewImagenes');
    previewContainer.innerHTML = '';

    for (let i = 0; i < archivos.length; i++) {
      const archivo = archivos[i];

      if (!archivo.type.startsWith('image/')) continue;

      const li = document.createElement('li');
      li.style.position = 'relative';
      const img = document.createElement('img');
      img.style.width = '100px';
      img.style.height = '100px';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '8px';
      img.style.cursor = 'pointer';
      img.title = 'Hacé click para seleccionar como portada';

      img.src = URL.createObjectURL(archivo);
      
      img.dataset.index = i;

      img.addEventListener('click', () => {
        const imgPortada = document.getElementById('imgPortadaSeleccionada');
        imgPortada.src = img.src;
        imgPortada.style.display = 'block';


        document.getElementById('imagenPortada').value = img.dataset.index;

      });

      li.appendChild(img);
      console.log(li);
      previewContainer.appendChild(li);


    }
  });
}
  const btnDetalle = document.querySelectorAll('.btnDetalle');
  btnDetalle.forEach(boton => {
    boton.addEventListener('click', () => {
      const albumId = boton.dataset.id;
      mostrarDetalleAlbum(albumId);
    });
  });

  nuevoComentario();


  document.getElementById('formBuscarUsuario').addEventListener('submit', async function (e) {
  e.preventDefault();
  const termino = document.getElementById('inputBuscarUsuario').value;
  const lista = document.getElementById('resultadoBusqueda');
  lista.innerHTML = '<li class="list-group-item">Buscando...</li>';

  try {
    const res = await fetch(`/buscar?termino=${encodeURIComponent(termino)}`);
    const usuarios = await res.json();

    if (usuarios.length === 0) {
      lista.innerHTML = '<li class="list-group-item text-muted">No se encontraron usuarios.</li>';
      return;
    }

    lista.innerHTML = '';
    usuarios.forEach(u => {
      const item = document.createElement('li');
      item.className = 'list-group-item';
      item.innerHTML = `<a href="/usuario/${u.idUsuario}">${u.nombre} ${u.apellido}</a>`;
      lista.appendChild(item);
    });

  } catch (err) {
    lista.innerHTML = '<li class="list-group-item text-danger">Error en la búsqueda.</li>';
    console.error(err);
  }
});

});



let listenerCarrusel = null;



async function mostrarDetalleAlbum(albumId) {

  const respuesta = await fetch(`/album/info/${albumId}`);
  const album = await respuesta.json();

  const respuestaImagen = await fetch(`/album/${albumId}/imagenes`);
  const imagenes = await respuestaImagen.json();

  const descripcion = document.querySelector('#infoDescripcionAlbum');
  const tituloModal = document.querySelector('#detalleAlbumLabel');
  const carouselInner = document.querySelector('#carouselInner');
  const caption = document.querySelector('#infoCaptionImagen');

  tituloModal.textContent = album.titulo;
  carouselInner.innerHTML = '';

  const portada = imagenes.find(img => img.idImg === album.portada);
  const otras = imagenes.filter(img => img.idImg !== album.portada);
  const imagenesOrdenadas = portada ? [portada, ...otras] : imagenes;

  imagenActualSeleccionada = imagenesOrdenadas[0];

  caption.textContent = imagenesOrdenadas[0]?.caption || '';
  await cargarComentario(imagenesOrdenadas[0]);

  imagenesOrdenadas.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'carousel-item' + (index === 0 ? ' active' : '');
    item.innerHTML = `
      <img src="${img.rutaImagen}" class="d-block w-100" alt="${img.caption || ''}">
    `;
    carouselInner.appendChild(item);
  });

  descripcion.textContent = album.descripcion || 'Sin descripcion';

  mostrarComentarios(imagenesOrdenadas);
}


function mostrarComentarios(imagenesOrdenadas) {
  const carrusel = document.getElementById('carouselAlbum');

  if (listenerCarrusel) {
    carrusel.removeEventListener('slid.bs.carousel', listenerCarrusel);
  }

  listenerCarrusel = function (event) {
    const index = event.to;
    const imgActual = imagenesOrdenadas[index];
    const contenedorCaption = document.querySelector('#infoCaptionImagen');

    contenedorCaption.textContent = imgActual?.caption || '';
    cargarComentario(imgActual);
  };

  carrusel.addEventListener('slid.bs.carousel', listenerCarrusel);
}

async function cargarComentario(imgActual) {

  const respuesta = await fetch(`/imagen/${imgActual.idImg}/comentarios`);
  const respuestaComentarios = await respuesta.json();

  const innerComentario = document.getElementById('comentariosContainer');
  imagenActualSeleccionada = imgActual;

  if (respuestaComentarios.length > 0) {
  innerComentario.innerHTML = '';
    for (const com of respuestaComentarios) {

      const respuesta = await fetch(`/usuario/info/${com.idUsuario}`);
      const usuario = await respuesta.json();

      const div = document.createElement('div');
      div.classList.add('mb-2', 'border', 'rounded', 'p-2');
      div.innerHTML = `
          <p><strong>${usuario.nombre}</strong>: ${com.txt}</p>
        `;

      const btnBorrar = document.createElement('button');
      btnBorrar.className = 'btn btn-sm btn-danger ms-2';
      btnBorrar.textContent = 'Eliminar';
      btnBorrar.addEventListener('click', () => {
        borrarComentario(com.idComentario, imgActual);
      });

      div.appendChild(btnBorrar);
      innerComentario.appendChild(div);
    };

  } else {
          innerComentario.innerHTML = '';
    const div = document.createElement('div');
    div.classList.add('mb-2', 'border', 'rounded', 'p-2');
    div.innerHTML = ` <p>Sin Comentario</p>`;
    innerComentario.appendChild(div);
  }
};

async function borrarComentario(idComentario, img) {
  await fetch(`/comentario/${idComentario}/borrar`);
  cargarComentario(img);
}

async function nuevoComentario() {
  const formComentario = document.getElementById('formComentario');
  formComentario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const txt = document.getElementById('txtComentario').value;

    if (!txt.trim() || !imagenActualSeleccionada) return;
    const ahora = new Date();
    const fechaFormateada = ahora.toISOString().slice(0, 10);
    const datos = {
      idImg: imagenActualSeleccionada.idImg,
      status: 1,
      fecha: fechaFormateada,
      comentarioPadre: null,
      txt,
    };

    const respuesta = await fetch('/enviarComentario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });
    const resultado = await respuesta.json();
    if (respuesta.ok) {
      document.getElementById('txtComentario').value = '';
      await cargarComentario(imagenActualSeleccionada);
    } else {
      console.error('Error al enviar comentario:', resultado.mensaje);
    }
  });


}
