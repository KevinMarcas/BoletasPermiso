document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Flatpickr para las fechas
    flatpickr("#startDate", {
        dateFormat: "d/m/Y",
        locale: "es",
        altInput: false,
        altFormat: "d/m/Y",
        placeholder: "dd/mm/aaaa"
    });
    flatpickr("#endDate", {
        dateFormat: "d/m/Y",
        locale: "es",
        altInput: true,
        altFormat: "d/m/Y",
        placeholder: "dd/mm/aaaa"
    });

    // Inicializar Flatpickr para las horas
    flatpickr("#startTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        placeholder: "--:--"
    });
    flatpickr("#endTime", {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        time_24hr: true,
        placeholder: "--:--"
    });

    const form = document.getElementById('permissionForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evitar el envío por defecto del formulario
        generatePdf();
    });

    function generatePdf() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Obtener datos del formulario
        const fullName = document.getElementById('fullName').value.toUpperCase();
        const dependency = document.getElementById('dependency').value.toUpperCase();
        const position = document.getElementById('position').value.toUpperCase();
        const escalafon = document.getElementById('escalafon').value;
        const reasonRadios = document.querySelectorAll('input[name="reason"]:checked');
        const reason = reasonRadios.length > 0 ? reasonRadios[0].value : '';
        const reasonDetail = document.getElementById('reasonDetail').value;
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;

        // --- Configuración General del PDF ---
        const marginX = 15;
        const marginY = 15;
        const pageWidth = doc.internal.pageSize.getWidth();
        const lineHeight = 7;
        let y = marginY;

        // Función para dibujar un rectángulo con texto
        const drawRectWithText = (x, y, width, height, text, align = 'left', style = 'normal', color = '#000000', bgColor = null) => {
            if (bgColor) {
                doc.setFillColor(bgColor);
                doc.rect(x, y, width, height, 'F');
            }
            doc.setTextColor(color);
            doc.setFont(undefined, style);
            doc.text(text, x + (align === 'center' ? width / 2 : 2), y + height / 2 + 2.5, { align: align });
            doc.setDrawColor(0); // Restablecer color del borde
            doc.rect(x, y, width, height);
            doc.setTextColor(0); // Restablecer color del texto
        };

        // Función para dibujar una casilla de verificación
        const drawCheckbox = (x, y, checked) => {
            const size = 5;
            doc.rect(x, y, size, size);
            if (checked) {
                doc.setFontSize(14);
                doc.text("X", x + size / 2, y + size / 2 + 1.5, { align: 'center' });
                doc.setFontSize(10); // Restablecer tamaño de fuente
            }
        };

        // --- Cabecera del Documento ---
        // Logo (simulado con texto, puedes añadir una imagen real si tienes una URL base64)
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("CORTE SUPERIOR DE JUSTICIA DE LIMA SUR", marginX + 50, y);
        y += 4;
        doc.text("Modulo Penal", marginX, y);
        y += lineHeight * 1.5;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text("BOLETA DE PERMISO", pageWidth / 2, y, { align: 'center' });
        y += lineHeight * 1.5;

        // --- Sección de Datos Personales (Amarillo) ---
        const personalSectionY = y;
        const personalRectHeight = lineHeight * 4.5;
        doc.setFillColor(255, 255, 255); // Amarillo claro
        doc.rect(marginX, personalSectionY, pageWidth - marginX * 2, personalRectHeight, 'F');
        doc.setDrawColor(0); // Borde negro
        doc.rect(marginX, personalSectionY, pageWidth - marginX * 2, personalRectHeight);

        y = personalSectionY + 2;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        doc.text("Apellidos y Nombres: ", marginX + 2, y + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        doc.text(fullName, marginX + 45, y + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        doc.text("Dependencia: ", marginX + 2, y + lineHeight + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        doc.text(dependency, marginX + 45, y + lineHeight + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        doc.text("Cargo: ", marginX + 2, y + lineHeight * 2 + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        doc.text(position, marginX + 45, y + lineHeight * 2 + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        doc.text("N° Escalafón: ", marginX + 2, y + lineHeight * 3 + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        doc.text(escalafon, marginX + 45, y + lineHeight * 3 + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        // Sección "Marca con una (X)"
        //const markX = pageWidth - marginX - 45; // Posición para el cuadro
        //doc.text("Marca con una (X)", markX - 30, personalSectionY + 5);
        //drawRectWithText(markX - 10, personalSectionY + 10, 20, 7, "728", 'center', 'bold', '#000000', 200); // Color de fondo gris claro para los encabezados
        //drawRectWithText(markX + 10, personalSectionY + 10, 20, 7, "CAS (X)", 'center', 'bold', '#000000', 200);
        //drawRectWithText(markX + 30, personalSectionY + 10, 20, 7, escalafon, 'center', 'bold', '#000000', 200); // El valor de escalafon también aquí
        // Celdas debajo de 728, CAS(X), Escalafón
        //doc.rect(markX - 10, personalSectionY + 17, 20, 7);
        //doc.rect(markX + 10, personalSectionY + 17, 20, 7);
        //doc.rect(markX + 30, personalSectionY + 17, 20, 7);


        y = personalSectionY + personalRectHeight + lineHeight; // Actualizar 'y' después de la sección personal

        // --- Sección MOTIVO ---
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text("MOTIVO", marginX, y);
        y += lineHeight;

        const reasonCol1X = marginX;
        const reasonCol2X = pageWidth / 2 + 10;
        let currentReasonY = y;

        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("DESCRIPCION", reasonCol1X + 10, currentReasonY);
        doc.text("DESCRIPCION", reasonCol2X + 10, currentReasonY);
        currentReasonY += lineHeight;

        doc.setFont(undefined, 'normal');

        const reasonsLeft = [
            "Autorización de Ingreso",
            "Permiso Personal o Particular",
            "Permiso Personal (Por día completo)",
            "Omisión de Marcado (Entrada)",
            "Omisión de Marcado (Salida)"
        ];
        const reasonsRight = [
            "Comisión de Servicio por horas",
            "Comisión de Servicio por día completo",
            "Cita Médica",
            "Capacitación Oficializada",
            "Otros (Detallar)"
        ];

        let maxReasonHeight = 0; // Para ajustar la altura de la sección

        reasonsLeft.forEach((r, index) => {
            const checkboxY = currentReasonY + (index * lineHeight);
            drawCheckbox(reasonCol1X, checkboxY, reason === r);
            doc.text(r, reasonCol1X + 8, checkboxY + 4);
            maxReasonHeight = Math.max(maxReasonHeight, checkboxY);
        });

        reasonsRight.forEach((r, index) => {
            const checkboxY = currentReasonY + (index * lineHeight);
            drawCheckbox(reasonCol2X, checkboxY, reason === r);
            doc.text(r, reasonCol2X + 8, checkboxY + 4);
            maxReasonHeight = Math.max(maxReasonHeight, checkboxY);
        });

        y = maxReasonHeight + lineHeight * 2; // Espacio después de las razones

        // --- Sección DETALLE MOTIVO (Amarillo) ---
        const detailSectionY = y;
        const detailRectHeight = lineHeight * 3.5;
        doc.setFillColor(255, 255, 255); // Amarillo claro
        doc.rect(marginX, detailSectionY, (pageWidth - marginX * 2) / 2 - 5, detailRectHeight, 'F'); // Mitad izquierda
        doc.setDrawColor(0);
        doc.rect(marginX, detailSectionY, (pageWidth - marginX * 2) / 2 - 5, detailRectHeight);

        y = detailSectionY + 2;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("DETALLE MOTIVO", marginX + 2, y + lineHeight / 2);
        //doc.setFont(undefined, 'bold'); // Asumiendo que el motivo seleccionado va en negrita
        //doc.text(reason.toUpperCase(), marginX + 2, y + lineHeight + lineHeight / 2); // Motivo seleccionado
        //doc.setFont(undefined, 'normal');
        doc.text(reasonDetail, marginX + 2, y + lineHeight * 2 + lineHeight / 20, { maxWidth: (pageWidth - marginX * 2) / 2 - 10 }); // Detalle del motivo
        doc.setFontSize(8);
        doc.text("(Adjunta el sustento en casos de Comisión de servicio, Omisión de marcado, cita médica, capacitación oficializada)", marginX + 2, y + lineHeight * 3.5, { maxWidth: (pageWidth - marginX * 2) / 2 - 10 });

        // --- Sección FECHAS Y HORAS (Amarillo, lado derecho) ---
        const dateTimesX = (pageWidth - marginX * 2) / 2 + marginX + 5; // Inicio del lado derecho
        const dateTimesY = detailSectionY;
        const dateTimesRectHeight = lineHeight * 4.5;
        doc.setFillColor(255, 255, 255); // Amarillo claro
        doc.rect(dateTimesX, dateTimesY, (pageWidth - marginX * 2) / 2 - 5, dateTimesRectHeight, 'F');
        doc.setDrawColor(0);
        doc.rect(dateTimesX, dateTimesY, (pageWidth - marginX * 2) / 2 - 5, dateTimesRectHeight);

        let currentDateTimeY = dateTimesY + 2;
        doc.setFontSize(8);
        doc.setFont(undefined, 'bold');
        doc.text("FECHA DE INICIO", dateTimesX + 1, currentDateTimeY + lineHeight / 2);
        doc.text("FECHA DE TERMINO", dateTimesX + 32, currentDateTimeY + lineHeight / 2);
        doc.text("HORAS", dateTimesX + 69, currentDateTimeY + lineHeight / 2);
        currentDateTimeY += lineHeight;

        doc.setFont(undefined, 'normal');

        // Rectángulos para las fechas
        doc.rect(dateTimesX + 2, currentDateTimeY, 20, lineHeight);
        doc.text(startDate, dateTimesX + 3, currentDateTimeY + 4);
        doc.rect(dateTimesX + 32, currentDateTimeY, 20, lineHeight);
        doc.text(endDate, dateTimesX + 33, currentDateTimeY + 4);

        // Horas
        doc.text("DE: " + startTime, dateTimesX + 68, currentDateTimeY + 4);
        currentDateTimeY += lineHeight;
        doc.text("A: " + endTime, dateTimesX + 68, currentDateTimeY + 4);

        doc.setFontSize(8);
        doc.text('"Registrar el horario en el que registras tu marcación por (BIOMETRICO)"', dateTimesX + 5, currentDateTimeY + lineHeight + 11, { maxWidth: (pageWidth - marginX * 2) / 2 - 15 });





        //Cuadro para el sello del centro de control
        doc.rect(dateTimesX + (pageWidth - marginX * 2) / 3, currentDateTimeY + lineHeight * 2 + 5, 30, 20); // Posicionarlo un poco más abajo
        doc.setFontSize(9);
        //doc.text("Sello del Centro de Control", dateTimesX + (pageWidth - marginX * 2) / 4 - 15, currentDateTimeY + lineHeight * 2 + 28, { align: 'center', maxWidth: 30});
        doc.text("Sello del Centro de Control", dateTimesX + (pageWidth - marginX * 2) / 3 + 15, currentDateTimeY + lineHeight * 2 + 30, { align: 'center', maxWidth: 30});


        y = Math.max(detailSectionY + detailRectHeight, dateTimesY + dateTimesRectHeight) + lineHeight * 2; // Ajustar 'y' después de ambas secciones

        // --- Secciones de Firmas ---
        const signatureY = y + 10;
        const signatureLineLength = 40;

        // Firma del Trabajador
        doc.line(marginX + 2, signatureY, marginX + 1 + signatureLineLength, signatureY);
        doc.setFontSize(9);
        doc.text("Firma del Trabajador", marginX + 2 + signatureLineLength / 2, signatureY + 5, { align: 'center' });

        // Firma y sello del jefe inmediato
        doc.line(marginX + 50, signatureY, marginX + 50 + signatureLineLength, signatureY);
        doc.text("Firma y sello \n del Jefe Inmediato", marginX + 50 + signatureLineLength / 2, signatureY + 5, { align: 'center' });

        // Firma y sello del responsable del personal
        doc.line(marginX + 100, signatureY, marginX + 100 + signatureLineLength, signatureY);
        doc.text("Firma y sello del \n responsable del personal", marginX + 100 + signatureLineLength / 2, signatureY + 5, { align: 'center' });


        // Guardar el PDF
        doc.save('BoletaDePermiso.pdf');
    }
});