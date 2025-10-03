let registros = [];

async function procesar() {
  registros = [];
  const files = document.getElementById("fileInput").files;
  const salida = document.getElementById("output");
  const progreso = document.getElementById("progress");

  salida.textContent = "";
  progreso.textContent = "";

  if (!files.length) {
    alert("Selecciona al menos una imagen");
    return;
  }

  for (let file of files) {
    salida.textContent += `\n=== Procesando: ${file.name} ===\n`;

    const result = await Tesseract.recognize(file, "spa", {
      logger: m => {
        if (m.status === "recognizing text") {
          progreso.textContent = `Procesando ${file.name}: ${Math.round(m.progress * 100)}%`;
        }
      }
    });

    const texto = result.data.text;
    salida.textContent += `\n--- TEXTO OCR ---\n${texto}\n`;

    // Por ahora guardamos el texto completo en el Excel
    registros.push({ Archivo: file.name, Texto: texto });
  }

  progreso.textContent = "✅ Procesamiento terminado";
}

function descargarExcel() {
  if (!registros.length) {
    alert("Primero procesa al menos una imagen");
    return;
  }
  const ws = XLSX.utils.json_to_sheet(registros);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Planillas");
  XLSX.writeFile(wb, "planillas.xlsx");
}