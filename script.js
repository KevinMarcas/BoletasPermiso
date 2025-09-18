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
        //const escalafon = document.getElementById('escalafon').value;
        const regimenRadios = document.querySelectorAll('input[name="regimen"]:checked');
        const regimen = regimenRadios.length > 0 ? regimenRadios[0].value : '';
        
        
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

        // --- Logo y Cabecera del Documento ---
        // 🚨 REEMPLAZA ESTA CADENA CON EL BASE64 DE TU IMAGEN logo.png
        const logoBase64 = 'data:image/png;base64,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'; // Ejemplo

        // Ajustar 'y' para el logo y el texto de la cabecera
        y += 10;
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.text("CORTE SUPERIOR DE JUSTICIA DE LIMA SUR", marginX + 50, y);
        //Fecha impresion
        var horaNow = new Date();
        //doc.text(horaNow.toLocaleDateString() +" " + horaNow.toLocaleTimeString() , marginX + 150, y);
        
        y += 4;
        doc.text("Modulo Penal", marginX, y);
        y += lineHeight * 1.5;

        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text("BOLETA DE PERMISO", pageWidth / 2, y, { align: 'center' });

        // Insertar la imagen del logo en la esquina superior izquierda
        // Posición y = 20 para alinear con la sección de cabecera
        doc.addImage(logoBase64, 'PNG', marginX, 20, 50, 30); // x, y, ancho, alto

        y += lineHeight * 1.5;

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

        // --- Sección de Datos Personales (Amarillo) ---
        const personalSectionY = y;
        const personalRectHeight = lineHeight * 4.5;
        doc.setFillColor(255, 255, 255); // Amarillo claro
        doc.rect(marginX, personalSectionY, pageWidth - marginX * 2, personalRectHeight, 'F');
        doc.setDrawColor(0); // Borde negro
        doc.rect(marginX, personalSectionY, pageWidth - marginX * 2, personalRectHeight - 5);
        doc.rect(marginX, personalSectionY + 7, pageWidth - marginX * 2, personalRectHeight - 20);
        //doc.rect(marginX + 118, personalSectionY + 7,  62, personalRectHeight - 25);  //cuadro derecha
        doc.rect(marginX + 118, personalSectionY + 7,  62, personalRectHeight - 12); //cuadro derecha
        doc.rect(marginX + 118, personalSectionY + 7,  62, personalRectHeight - 26); 

        doc.rect(marginX + 118, personalSectionY + 12.5,  20, personalRectHeight - 25.5);
        doc.rect(marginX + 138, personalSectionY + 12.5,  20, personalRectHeight - 25.5);


        y = personalSectionY + 2;
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');

        doc.text("Apellidos y Nombres: ", marginX + 2, y + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        doc.text(fullName, marginX + 45, y + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        doc.text("Dependencia: ", marginX + 2, y + lineHeight * 1.7 + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        doc.text(dependency, marginX + 45, y + lineHeight * 1.7 + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        doc.text("Cargo: ", marginX + 2, y + lineHeight * 2.8 + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        doc.text(position, marginX + 45, y + lineHeight * 2.8 + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        doc.text("Marca con una (x):", marginX + 120, y + lineHeight * 0.8 + lineHeight / 2);


        //REGIMEN CHECK RADIO
        const regimenCol1X = marginX + 120;
        const regimenCol2X = pageWidth / 2 + 10;
        let currentRegimenY  = y + lineHeight * 2.8 + lineHeight / 2;
        
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        //doc.text("Regimen", regimenCol1X + 5 , currentRegimenY - 7);
        //currentRegimenY += lineHeight;

        doc.setFont(undefined, 'normal');

        const regimenLeft = [
            "276",
            "CAS",
            "728"
        ];

        let maxRegimenHeight = 0 ;
        
regimenLeft.forEach((r, index) => {
    const checkboxX = regimenCol1X + (index * 20);
    // Posición para dibujar el paréntesis de apertura.
    const openParenX = checkboxX;
    // Posición para dibujar la 'x' central.
    const xTextX = openParenX + 2; 
    // Posición para dibujar el paréntesis de cierre.
    const closeParenX = xTextX + 2; 
    
    // Dibuja el paréntesis de apertura.
    doc.text('(', openParenX, currentRegimenY - 8);
    
    // Dibuja la 'x' solo si el régimen coincide.
    if (regimen == r) {
        doc.text('x', xTextX, currentRegimenY - 8); 
    }
    
    // Dibuja el paréntesis de cierre.
    doc.text(')', closeParenX, currentRegimenY - 8);
    
    // Dibuja el texto del régimen.
    doc.text(r, closeParenX + 2, currentRegimenY - 8);
    
    maxRegimenHeight = Math.max(maxRegimenHeight, checkboxX);
});

       //final REGIMEN CHECK RADIO

        //doc.text("728  (  )", marginX + 120, y + lineHeight * 1.7 + lineHeight / 2);
        //doc.text("CAS  (  )", marginX + 142, y + lineHeight * 1.7 + lineHeight / 2);
        //doc.text("276  (  )", marginX + 162, y + lineHeight * 1.7 + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        //doc.text(escalafon, marginX + 155, y + lineHeight + lineHeight / 2);
        doc.setFont(undefined, 'normal');

        //escalafon derecha
        doc.text("N° Escalafon: ", marginX + 120, y + lineHeight * 2.8 + lineHeight / 2);
        doc.setFont(undefined, 'bold');
        //doc.text(escalafon, marginX + 155, y + lineHeight * 2.8 + lineHeight / 2);
        doc.setFont(undefined, 'normal');

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
        doc.setFont(undefined, 'normal');
        doc.text(reasonDetail, marginX + 2, y + lineHeight * 1 + lineHeight / 20, { maxWidth: (pageWidth - marginX * 2) / 2 - 10 }); // Detalle del motivo
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text("(Adjunta el sustento en casos de Comisión de servicio, Omisión de marcado, cita médica, capacitación oficializada)", marginX + 2, y + lineHeight * 3.7, { maxWidth: (pageWidth - marginX * 2) / 2 - 10 });

        // --- Sección FECHAS Y HORAS (Amarillo, lado derecho) ---
        const dateTimesX = (pageWidth - marginX * 2) / 2 + marginX + 5; // Inicio del lado derecho
        const dateTimesY = detailSectionY;
        const dateTimesRectHeight = lineHeight * 3.5;
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
        doc.rect(dateTimesX, currentDateTimeY - 9, 28, lineHeight + 2); //arriba Fecha inicio
        doc.rect(dateTimesX, currentDateTimeY, 28, lineHeight + 8.5);
        doc.text(startDate, dateTimesX + 5, currentDateTimeY + 6);
        doc.rect(dateTimesX + 28, currentDateTimeY - 9, 35, lineHeight + 2); //arriba fecha fin
        doc.rect(dateTimesX + 28, currentDateTimeY, 35, lineHeight + 8.5);
        doc.text(endDate, dateTimesX + 37, currentDateTimeY + 6);

        // Horas
        doc.rect(dateTimesX + 63, currentDateTimeY - 9, 22, lineHeight + 2); //arriba hora
        doc.rect(dateTimesX + 63, currentDateTimeY, 22, lineHeight + 1);
        doc.text("DE: " + startTime, dateTimesX + 68, currentDateTimeY + 4);
        currentDateTimeY += lineHeight;
        doc.text("A: " + endTime, dateTimesX + 68, currentDateTimeY + 5);

        doc.setFontSize(8);
        doc.text('"Registrar el horario en el que registras tu marcación por (BIOMETRICO)"', dateTimesX + 5, currentDateTimeY + lineHeight + 5, { maxWidth: (pageWidth - marginX * 2) / 2 - 15 });

        //Cuadro para el sello del centro de control
        doc.rect(dateTimesX + (pageWidth - marginX * 2) / 3 - 7, currentDateTimeY + lineHeight * 2 + 6, 30, 20); // Posicionarlo un poco más abajo
        doc.setFontSize(9);
        doc.text("Sello del Centro de Control", dateTimesX + (pageWidth - marginX * 2) / 3 + 7, currentDateTimeY + lineHeight * 2 + 30, { align: 'center', maxWidth: 30});

        y = Math.max(detailSectionY + detailRectHeight, dateTimesY + dateTimesRectHeight) + lineHeight * 2; // Ajustar 'y' después de ambas secciones

        // --- Secciones de Firmas ---
        const signatureY = y + 10;
        const signatureLineLength = 40;

        // Firma del Trabajador
        doc.line(marginX + 2, signatureY + 8, marginX + 1 + signatureLineLength, signatureY + 8); //linea trabajador
        doc.setFontSize(9);
        doc.text("Firma del Trabajador", marginX + 2 + signatureLineLength / 2, signatureY + 11.5, { align: 'center' });

        // Firma y sello del jefe inmediato
        doc.line(marginX + 50, signatureY + 8, marginX + 50 + signatureLineLength, signatureY + 8); //linea jefe inmediato
        doc.text("Firma y sello \n del Jefe Inmediato", marginX + 50 + signatureLineLength / 2, signatureY + 11.5, { align: 'center' });

        // Firma y sello del responsable del personal
        doc.line(marginX + 100, signatureY + 8, marginX + 100 + signatureLineLength, signatureY + 8); //linea responsable del personal
        doc.text("Firma y sello del \n responsable del personal", marginX + 100 + signatureLineLength / 2, signatureY + 11.5, { align: 'center' });

        // Guardar el PDF
        doc.save('BoletaDePermiso.pdf');
    }

});
