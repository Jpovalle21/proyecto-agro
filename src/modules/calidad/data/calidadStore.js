export const RECORDS_KEY = "agro_calidad_formatos_registros";

export const formatTemplates = [
  {
    id: "monitoreo-marcacion-empaques",
    codigo: "FO_TZ-001",
    version: "1",
    fechaElaboracion: "Marzo 2022",
    nombre: "Control de marcacion de empaques para producto",
    descripcion: "Monitoreo diario de la marcacion realizada en los empaques para producto.",
    area: "Calidad",
    frecuencia: "Diario",
    metaDiaria: 1,
    layout: "empaques-table",
    nota:
      "Diligenciar este formato con letra clara, sin tachones y con lapicero de tinta negra. La frecuencia de registro es diaria y las veces en las que se rotule cualquier tipo de empaque. En el campo lote y fecha de vencimiento marcada se debe colocar la informacion directamente con la maquina sobre el registro. En el destino se debe especificar el area de proceso que solicito el empaque.",
    table: {
      valueKey: "muestras",
      minRows: 1,
      columns: [
        { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
        { id: "hora", label: "Hora", type: "auto-time", required: true, locked: true },
        {
          id: "conservacion",
          label: "Forma de conservacion",
          type: "fixed",
          value: "Refrigerado",
          locked: true,
        },
        {
          id: "referenciaEmpaque",
          label: "Referencia de empaque",
          type: "fixed",
          value: "Bolsatina",
          locked: true,
        },
        { id: "numeroMuestra", label: "No. de muestra", type: "text", required: true },
        { id: "lote", label: "Lote", type: "text", required: true },
        { id: "fechaVencimiento", label: "Fecha de vencimiento", type: "date", required: true },
        {
          id: "destino",
          label: "Destino",
          type: "fixed",
          value: "MC Pollo",
          locked: true,
        },
        {
          id: "codificadoPor",
          label: "Codificado por",
          type: "fixed",
          value: "MC Pollo",
          locked: true,
        },
        {
          id: "verificadoPor",
          label: "Verificado por calidad",
          type: "select",
          required: true,
          options: ["Valentina Ospina", "Jhon Janner Villada"],
        },
      ],
    },
  },
  {
    id: "preoperativo-limpieza-desinfeccion",
    codigo: "FO_PLD-001",
    version: "03",
    fechaElaboracion: "Febrero 2023",
    nombre: "Pre-operativo de limpieza y desinfeccion de equipos e instalaciones",
    descripcion: "Control diario mensual de limpieza y desinfeccion por zonas.",
    area: "Calidad",
    frecuencia: "Diario mensual",
    period: "monthly",
    layout: "monthly-checklist",
    nota:
      "Este formato se diligencia diariamente. Cada registro del dia se conserva dentro del formato mensual y al iniciar un nuevo mes la captura inicia de nuevo.",
    verifierOptions: ["Valentina Ospina", "Jhon Janner Villada"],
    markOptions: ["✓", "X"],
    dailyFields: [
      { id: "mes", label: "Mes", type: "text", required: true },
      { id: "autoridadInvima", label: "Autoridad INVIMA", type: "text", required: true },
      { id: "verifico", label: "Verifico", type: "select", required: true, options: ["Valentina Ospina", "Jhon Janner Villada"] },
      { id: "desinfectante", label: "Desinfectante", type: "text", required: true },
      { id: "concentracion", label: "Concentracion", type: "text", required: true },
      { id: "horaLiberacion", label: "Hora liberacion", type: "time", required: true },
      { id: "horaInicioProceso", label: "Hora inicio proceso", type: "time", required: true },
    ],
    actionFields: [
      { id: "fecha", label: "Fecha", type: "date", locked: true },
      { id: "inconformidad", label: "Inconformidad", type: "textarea" },
      { id: "accionCorrectiva", label: "Accion correctiva", type: "textarea" },
      { id: "verifico", label: "Verifico", type: "select", options: ["Valentina Ospina", "Jhon Janner Villada"] },
    ],
    checklist: [
      {
        zone: "Zona sucia",
        items: [
          { id: "zona_sucia_equipos", label: "Equipos" },
          { id: "zona_sucia_puntos_desinfeccion", label: "Puntos de desinfeccion" },
          { id: "zona_sucia_filtros", label: "Filtros sanitario, punto de inspeccion y canecas" },
          { id: "zona_sucia_pisos", label: "Pisos, paredes y techos" },
        ],
      },
      {
        zone: "Zona intermedia",
        items: [
          { id: "zona_intermedia_equipos", label: "Equipos" },
          { id: "zona_intermedia_puntos_desinfeccion", label: "Puntos de desinfeccion" },
          { id: "zona_intermedia_filtros", label: "Filtros sanitario, punto de inspeccion y canecas" },
          { id: "zona_intermedia_pisos", label: "Pisos, paredes y techos" },
        ],
      },
      {
        zone: "Zona de enfriamiento",
        items: [
          { id: "zona_enfriamiento_equipos", label: "Equipos" },
          { id: "zona_enfriamiento_puntos_desinfeccion", label: "Puntos de desinfeccion" },
          { id: "zona_enfriamiento_filtros", label: "Filtros sanitario, punto de inspeccion y canecas" },
          { id: "zona_enfriamiento_pisos", label: "Pisos, paredes y techos" },
        ],
      },
      {
        zone: "Zona social",
        items: [
          { id: "zona_social_servicios_sanitarios", label: "Servicios sanitarios" },
          { id: "zona_social_area_subproductos", label: "Area de subproductos" },
          { id: "zona_social_lavado_canasta", label: "Lavado de canasta" },
          { id: "zona_social_taller_mantenimiento", label: "Taller de mantenimiento" },
        ],
      },
    ],
  },
  {
    id: "monitoreo-agua-potable",
    codigo: "FO_PAP-001",
    version: "4",
    fechaElaboracion: "Febrero de 2023",
    nombre: "Monitoreo diario de cloro residual y PH en agua potable",
    descripcion: "Registro diario de mediciones de cloro residual y PH por area.",
    area: "Calidad",
    frecuencia: "Dos veces al dia, formato mensual",
    period: "monthly",
    layout: "empaques-table",
    nota:
      "La fecha se registra automaticamente. Este formato se diligencia dos veces por dia y se conserva como un solo formato mensual para su descarga.",
    table: {
      valueKey: "mediciones",
      minRows: 1,
      currentTitle: "Medicion actual",
      savedTitle: "Mediciones guardadas este mes",
      currentHelp: "Llena una medicion. Cada dia permite guardar maximo dos mediciones.",
      savedHelp: "Estas mediciones quedan unidas en el formato mensual.",
      saveLabel: "Guardar medicion",
      clearLabel: "Limpiar medicion",
      emptyTitle: "Aun no hay mediciones guardadas este mes",
      emptyHelp: "Guarda la primera medicion para iniciar el formato mensual.",
      maxPerDay: 2,
      columns: [
        { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
        { id: "hora", label: "Hora", type: "time", required: true },
        { id: "cloroResidual", label: "Cloro residual (ppm)", type: "number", required: true, step: "0.01" },
        { id: "ph", label: "PH", type: "number", required: true, step: "0.01" },
        {
          id: "area",
          label: "Area",
          type: "select",
          required: true,
          options: ["Plataforma", "Evicerado", "Empaque", "Despacho", "Generadoras"],
        },
        { id: "accionCorrectiva", label: "Accion correctiva", type: "textarea", required: false },
        {
          id: "verifico",
          label: "Verifico",
          type: "select",
          required: true,
          options: ["Valentina Ospina", "Jhon Janner Villada"],
        },
      ],
    },
  },
  {
    id: "monitoreo-area-eviscerado",
    codigo: "FO_CP-002",
    version: "3",
    fechaElaboracion: "Abril 2022",
    nombre: "Monitoreo en area de eviscerado",
    descripcion: "Registro diario del monitoreo por viajes en el area de eviscerado.",
    area: "Calidad",
    frecuencia: "Diario, segun cantidad de viajes",
    metaDiaria: 1,
    layout: "daily-trip-table",
    nota:
      "La fecha se registra automaticamente. Agrega tantos viajes como se realicen durante el dia y guarda el formato completo al finalizar la jornada.",
    verifierOptions: ["Valentina Ospina", "Jhon Janner Villada"],
    tripTable: {
      valueKey: "viajes",
      title: "Viajes del dia",
      help: "Agrega o elimina viajes segun la operacion real del dia.",
      columns: [
        { id: "hora", label: "Hora", type: "time", required: true },
        { id: "viaje", label: "Viaje", type: "text", required: true },
        { id: "granja", label: "Granja", type: "text", required: true },
        { id: "velocidadLinea", label: "Velocidad linea", type: "text", required: true },
        { id: "canalesEvaluadas", label: "No. canales evaluadas", type: "text", required: true },
        { id: "higadoConHiel", label: "Higado con hiel", type: "text", required: true },
        { id: "higadoContaminadoConHiel", label: "Higado contaminado con hiel", type: "text", required: true },
        { id: "pataResidualCuticula", label: "Pata con residual de cuticula", type: "text", required: true },
        { id: "pataGranuloma", label: "Pata con granuloma", type: "text", required: true },
        { id: "canalResidualViscera", label: "Canal con residual de viscera", type: "text", required: true },
        { id: "canalResidualPulmon", label: "Canal con residual de pulmon", type: "text", required: true },
        { id: "canalResidualPlumas", label: "Canal con residual de plumas", type: "text", required: true },
        { id: "canalMateriaFecalVisible", label: "Canal con materia fecal visible", type: "text", required: true },
        { id: "monitoreadoPor", label: "Monitoreado por", type: "text", required: true },
      ],
    },
    fields: [
      { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
      { id: "observaciones", label: "Observaciones", type: "textarea" },
      {
        id: "verificadoPor",
        label: "Verificado por",
        type: "select",
        required: true,
        options: ["Valentina Ospina", "Jhon Janner Villada"],
      },
    ],
    actionTable: {
      valueKey: "acciones",
      title: "Acciones correctivas",
      help: "Registra las no conformidades encontradas y las acciones aplicadas.",
      columns: [
        { id: "hora", label: "Hora", type: "time", required: true },
        { id: "codigoNoConformidad", label: "Codigo no conformidad encontrada", type: "text", required: true },
        { id: "codigoAccionCorrectiva", label: "Codigo accion correctiva aplicada", type: "text", required: true },
        { id: "ejecutadoPor", label: "Ejecutado por", type: "text", required: true },
      ],
    },
    guide: [
      {
        noConformidad: "Higado con hiel",
        codigoNoConformidad: "EV01",
        accionCorrectiva: "Se verifica el proceso de separacion y se hace observacion al personal encargado de la operacion.",
        codigoAccionCorrectiva: "ACR01",
      },
      {
        noConformidad: "Higado contaminado con hiel",
        codigoNoConformidad: "EV02",
        accionCorrectiva: "Se hace observacion al personal y se refuerza la operacion de separacion de hieles.",
        codigoAccionCorrectiva: "ACR02",
      },
      {
        noConformidad: "Pata con residual de cuticula",
        codigoNoConformidad: "EV03",
        accionCorrectiva: "Se verifica la seleccion, se retira la cuticula y se refuerza el proceso de inspeccion.",
        codigoAccionCorrectiva: "ACR03",
      },
      {
        noConformidad: "Pata con granuloma",
        codigoNoConformidad: "EV04",
        accionCorrectiva: "Se verifica la seleccion, se retiran las unidades con granuloma y se refuerza el proceso de inspeccion.",
        codigoAccionCorrectiva: "ACR04",
      },
      {
        noConformidad: "Canal con residual de visceras",
        codigoNoConformidad: "EV05",
        accionCorrectiva: "Se retira el residual de visceras, se lava en solucion desinfectante y se refuerza la inspeccion.",
        codigoAccionCorrectiva: "ACR05",
      },
      {
        noConformidad: "Canal con pulmones",
        codigoNoConformidad: "EV06",
        accionCorrectiva: "Se verifica el funcionamiento de la pistola extractora, se informa a mantenimiento si aplica y se hace observacion al trabajador.",
        codigoAccionCorrectiva: "ACR06",
      },
      {
        noConformidad: "Canal con residual de plumas",
        codigoNoConformidad: "EV07",
        accionCorrectiva: "Se verifica el retiro, se retira la pluma y se refuerza el proceso de inspeccion.",
        codigoAccionCorrectiva: "ACR07",
      },
      {
        noConformidad: "Canal materia fecal visible",
        codigoNoConformidad: "EV08",
        accionCorrectiva: "Se retira la canal de la linea, se somete a desinfeccion, se revisan duchas de lavado y se refuerza la inspeccion.",
        codigoAccionCorrectiva: "ACR08",
      },
    ],
  },
  {
    id: "poes-operacionales",
    codigo: "FO_PLD-003",
    version: "2",
    fechaElaboracion: "Enero de 2022",
    nombre: "Monitoreo POES operacionales",
    descripcion: "Registro semanal de POES operacionales por area y control diario.",
    area: "Calidad",
    frecuencia: "Diario con cierre semanal",
    period: "weekly",
    layout: "weekly-poes",
    nota:
      "La fecha de semana es editable y se diligencia una sola vez. Cada area permite agregar los controles necesarios por dia, segun la frecuencia real del proceso.",
    verifierOptions: ["Valentina Ospina", "Jhon Janner Villada"],
    days: [
      { id: "lunes", label: "L" },
      { id: "martes", label: "M" },
      { id: "miercoles", label: "M" },
      { id: "jueves", label: "J" },
      { id: "viernes", label: "V" },
      { id: "sabado", label: "S" },
    ],
    weeklyAreas: [
      {
        id: "eviscerado",
        label: "Eviscerado",
        blocks: [
          {
            id: "equipos_eviscerado",
            label: "Equipos",
            items: [
              { id: "extractora_pulmon", label: "Extractora de pulmon" },
              { id: "extractora_cloaca", label: "Extractora de cloaca" },
              { id: "cortadora_cuello", label: "Cortadora de cuello" },
              { id: "cortadora_patas", label: "Cortadora de patas" },
            ],
          },
          {
            id: "utensilios_eviscerado",
            label: "Utensilios y superficies",
            items: [
              { id: "guantes_delantales_eviscerado", label: "Guantes y delantales" },
              { id: "cuchillos", label: "Cuchillos" },
              {
                id: "peladora_mollejas_mesas_ganchos",
                label: "Peladora de mollejas, mesas y ganchos de eviscerado",
              },
            ],
          },
        ],
      },
      {
        id: "enfriamiento_empaque",
        label: "Enfriamiento y empaque",
        blocks: [
          {
            id: "utensilios_enfriamiento_empaque",
            label: "Utensilios y equipos",
            items: [
              { id: "guantes_delantales_enfriamiento", label: "Guantes y delantales" },
              { id: "grameras", label: "Grameras" },
              { id: "tobogan_mesas", label: "Tobogan y mesas" },
            ],
          },
        ],
      },
    ],
    actionTable: {
      valueKey: "acciones",
      title: "Acciones correctivas",
      help: "Registra las no conformidades y la correccion realizada.",
      columns: [
        { id: "fecha", label: "Fecha", type: "date", required: true },
        { id: "areaProceso", label: "Area de proceso", type: "text", required: true },
        { id: "noConformidad", label: "No conformidad evidenciada", type: "textarea", required: true },
        { id: "correccionRealizada", label: "Correccion realizada", type: "textarea", required: true },
        {
          id: "verificadoPor",
          label: "Verificado por",
          type: "select",
          required: true,
          options: ["Valentina Ospina", "Jhon Janner Villada"],
        },
      ],
    },
  },
  {
    id: "prueba-hidratacion-canales",
    codigo: "CP-FR-TZ-02",
    version: "04",
    fechaElaboracion: "20-09-2022",
    nombre: "Prueba de hidratacion para canales",
    descripcion: "Registro diario de hidratacion para canales con 10 muestras.",
    area: "Calidad",
    frecuencia: "Diario, una vez al dia",
    metaDiaria: 1,
    layout: "hydration-test",
    nota:
      "La fecha se registra automaticamente y no se modifica. Este formato se guarda una vez al dia con las 10 muestras completas.",
    verifierOptions: ["Valentina Ospina", "Jhon Janner Villada"],
    sampleCount: 10,
    sampleColumns: [
      { id: "numero", label: "Muestra", locked: true },
      { id: "pesoInicial", label: "Peso inicial", type: "number", required: true, step: "0.01" },
      { id: "pesoFinal", label: "Peso final", type: "number", required: true, step: "0.01" },
    ],
    fields: [
      { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
      { id: "granja", label: "Granja", type: "text", required: true },
      { id: "horaInicial", label: "Hora inicial", type: "time", required: true },
      { id: "horaFinal", label: "Hora final", type: "time", required: true },
      { id: "temperaturaPreChiller", label: "Temperatura pre-chiller", type: "text", required: true },
      { id: "temperaturaChiller", label: "Temperatura chiller", type: "text", required: true },
      { id: "temperaturaIngresoCanales", label: "Temperatura ingreso canales", type: "text", required: true },
      { id: "temperaturaSalidaCanales", label: "Temperatura salida canales", type: "text", required: true },
      { id: "porcentajeHidratacion", label: "% Hidratacion", type: "text", required: true },
      { id: "viaje", label: "Viaje", type: "text", required: true },
      { id: "observaciones", label: "Observaciones", type: "textarea" },
      { id: "responsable", label: "Responsable", type: "text", required: true },
      {
        id: "verifico",
        label: "Verifico",
        type: "select",
        required: true,
        options: ["Valentina Ospina", "Jhon Janner Villada"],
      },
    ],
  },
  {
    id: "control-temperatura-canales-pcc",
    codigo: "FO.CP-003",
    version: "3",
    fechaElaboracion: "Abril de 2022",
    nombre: "Monitoreo de control de temperatura canales PCC",
    descripcion: "Control diario por horas de temperatura de canales en enfriamiento PCC.",
    area: "Calidad",
    frecuencia: "Cada hora durante el dia",
    metaDiaria: 1,
    layout: "temperature-pcc",
    nota:
      "Agrega tantas mediciones como se requieran durante el dia. El formato de hoy se puede abrir nuevamente para continuar registrando horas.",
    fields: [
      { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
      { id: "loteProceso", label: "Lote de proceso", type: "text" },
      { id: "horaInicio", label: "Hora de inicio", type: "time" },
      { id: "verifica", label: "Verifica", type: "text" },
    ],
    monitorTable: {
      valueKey: "mediciones",
      title: "Mediciones de temperatura",
      help: "Registra una fila por cada control realizado durante el dia.",
      columns: [
        { id: "hora", label: "Hora", type: "time", required: true },
        { id: "canalC1", label: "Canal C1", type: "text" },
        { id: "canalC2", label: "Canal C2", type: "text" },
        { id: "canalC3", label: "Canal C3", type: "text" },
        { id: "canalC4", label: "Canal C4", type: "text" },
        { id: "canalC5", label: "Canal C5", type: "text" },
        { id: "canalC6", label: "Canal C6", type: "text" },
        { id: "canalC7", label: "Canal C7", type: "text" },
        { id: "canalC8", label: "Canal C8", type: "text" },
        { id: "canalC9", label: "Canal C9", type: "text" },
        { id: "canalC10", label: "Canal C10", type: "text" },
        { id: "eventosFueraLimite", label: "No. eventos fuera del limite", type: "text" },
        { id: "pesoPromedioAvePie", label: "Peso promedio ave en pie (g)", type: "text" },
        { id: "temperaturaAguaPrechiller", label: "T agua prechiller (max 15 C)", type: "text" },
        { id: "temperaturaAguaChiller", label: "T agua chiller (max 0.6 C)", type: "text" },
        { id: "noConformidadCodigo", label: "No conformidad (codigo)", type: "text" },
        {
          id: "accionesCorrectivasPcc",
          label: "Acciones correctivas al PCC",
          type: "textarea",
        },
        { id: "monitoreadoVerificadoPor", label: "Monitoreado y/o verificado por", type: "text" },
      ],
    },
    actionTable: {
      valueKey: "acciones",
      title: "Acciones correctivas",
      help: "Registra las no conformidades y las acciones aplicadas de acuerdo con la tabla guia.",
      columns: [
        { id: "fecha", label: "Fecha", type: "date", required: true },
        { id: "hora", label: "Hora", type: "time", required: true },
        { id: "noConformidad", label: "No conformidad", type: "textarea", required: true },
        { id: "accionCorrectiva", label: "Accion correctiva", type: "textarea", required: true },
        { id: "responsable", label: "Responsable", type: "text", required: true },
      ],
    },
    guide: [
      {
        noConformidad: "PRODUCTO - Canales salida enfriamiento chiller > 4 C",
        codigoNoConformidad: "ENF01",
        accionCorrectiva:
          "Detener el chiller por lapsos de tiempo para bajar temperatura de canales y aumentar el tiempo de permanencia.",
      },
      {
        noConformidad: "AGUA - Agua de enfriamiento en chiller > 2 C",
        codigoNoConformidad: "ENF02",
        accionCorrectiva:
          "Abrir la entrada de agua, adicionar hielo, bajar la velocidad de la linea de colgado o detener el colgado hasta que la temperatura del agua llegue a su limite operacional.",
      },
      {
        noConformidad: "AGUA - Cloro residual por debajo de 0.6 ppm",
        codigoNoConformidad: "ENF03",
        accionCorrectiva:
          "Dosificar cloro al tanque de enfriamiento de acuerdo con las cantidades adicionadas cada hora durante el proceso.",
      },
    ],
    controlLimits: [
      { label: "Limite critico superior", value: "4 C" },
      { label: "Zona de riesgo", value: "3.8 C a 3.9 C" },
      { label: "Limite de operacion", value: "3.8 C" },
    ],
  },
  {
    id: "control-temperatura-cuartos-frios",
    codigo: "FO_CP-004",
    version: "3",
    fechaElaboracion: "Abril de 2022",
    nombre: "Verificacion de temperatura ambiente y producto en cuartos frios",
    descripcion: "Control diario de temperatura ambiente y producto en cuartos frios.",
    area: "Calidad",
    frecuencia: "Diario, formato mensual",
    period: "monthly",
    layout: "cold-rooms-monthly",
    nota:
      "Este formato se diligencia durante el mes. Normalmente se registran dos controles por dia, pero se pueden agregar mas si la operacion lo requiere.",
    monitorTable: {
      valueKey: "controles",
      title: "Controles de temperatura",
      help: "Agrega cada control realizado. La fecha queda automatica con el dia actual.",
      columns: [
        { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
        { id: "hora", label: "Hora", type: "time", required: true },
        { id: "temperaturaCuarto1", label: "Temperatura cuarto 1 (C)", type: "text" },
        { id: "temperaturaCuarto2", label: "Temperatura cuarto 2 (C)", type: "text" },
        { id: "productoT1", label: "Producto T1", type: "text" },
        { id: "productoT2", label: "Producto T2", type: "text" },
        { id: "productoT3", label: "Producto T3", type: "text" },
        { id: "productoT4", label: "Producto T4", type: "text" },
        { id: "productoT5", label: "Producto T5", type: "text" },
        { id: "productoT6", label: "Producto T6", type: "text" },
        { id: "observaciones", label: "Observaciones", type: "textarea" },
        { id: "responsable", label: "Responsable", type: "text", required: true },
      ],
    },
    actionTable: {
      valueKey: "acciones",
      title: "Acciones correctivas",
      help: "Registra las no conformidades encontradas y la accion correctiva aplicada.",
      columns: [
        { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
        { id: "hora", label: "Hora", type: "time", required: true },
        {
          id: "codigoNoConformidad",
          label: "Codigo no conformidad encontrada",
          type: "text",
          required: true,
        },
        {
          id: "codigoAccionCorrectiva",
          label: "Codigo accion correctiva aplicada",
          type: "text",
          required: true,
        },
        { id: "ejecutadoPor", label: "Ejecutado por", type: "text", required: true },
      ],
    },
    guide: [
      {
        noConformidad: "CUARTO - Temperatura ambiente > 4 C (termometro)",
        codigoNoConformidad: "CFA01",
        accionCorrectiva:
          "Reporte inmediato al area de produccion y mantenimiento para su revision.",
        codigoAccionCorrectiva: "ACR01",
      },
      {
        noConformidad: "PRODUCTO - Temperatura producto > 4 C",
        codigoNoConformidad: "CFP02",
        accionCorrectiva: "Se adiciona hielo al producto.",
        codigoAccionCorrectiva: "ACR02",
      },
    ],
  },
  {
    id: "monitoreo-producto-despachado",
    codigo: "FO_CP-006",
    version: "3",
    fechaElaboracion: "Octubre de 2025",
    nombre: "Monitoreo de producto despachado",
    descripcion: "Control diario de producto despachado, empaque, canastilla y condiciones del vehiculo.",
    area: "Calidad",
    frecuencia: "Diario, normalmente 4 despachos",
    metaDiaria: 1,
    layout: "dispatch-product-daily",
    nota:
      "Este formato se cierra diariamente. Agrega todos los despachos realizados durante el dia; normalmente son 4, pero pueden ser mas.",
    markOptions: ["✓", "X"],
    dispatchTable: {
      valueKey: "despachos",
      title: "Despachos del dia",
      help: "Agrega un registro por cada despacho realizado durante el dia.",
      columns: [
        { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
        { id: "hora", label: "Hora", type: "time", required: true },
        {
          id: "referenciaProducto",
          label: "Referencia producto",
          type: "fixed",
          value: "PSV BLANCO",
          locked: true,
        },
        { id: "destinoProducto", label: "Destino del producto", type: "text", required: true },
        { id: "lote", label: "Lote", type: "auto-date", required: true, locked: true },
        {
          id: "fechaVencimiento",
          label: "Fecha de vencimiento",
          type: "date",
          required: true,
          defaultOffsetDays: 10,
        },
        { id: "temperaturaT1", label: "T1", type: "text" },
        { id: "temperaturaT2", label: "T2", type: "text" },
        { id: "temperaturaT3", label: "T3", type: "text" },
        { id: "temperaturaT4", label: "T4", type: "text" },
        { id: "temperaturaT5", label: "T5", type: "text" },
        { id: "sinTrazabilidad", label: "Sin trazabilidad", type: "mark" },
        { id: "rupturas", label: "Rupturas", type: "mark" },
        { id: "malSellado", label: "Mal sellado", type: "mark" },
        { id: "canastillaLimpieza", label: "Canastilla limpieza", type: "mark" },
        { id: "canastillaAveriada", label: "Canastilla averiada", type: "mark" },
        { id: "numeroPlaca", label: "No. placa", type: "text" },
        { id: "limpiezaDesinfeccion", label: "L y D", type: "text" },
        { id: "temperaturaFurgonVisor", label: "Temperatura furgon visor (C)", type: "text" },
        {
          id: "temperaturaFurgonTermometro",
          label: "Temperatura furgon termometro (C)",
          type: "text",
        },
        { id: "temperaturaAmbienteDespachos", label: "T ambiente despachos (C)", type: "text" },
        { id: "responsable", label: "Responsable", type: "text" },
        { id: "auxiliarCalidad", label: "Auxiliar calidad", type: "text", required: true },
      ],
    },
    fields: [
      { id: "fecha", label: "Fecha", type: "auto-date", required: true, locked: true },
      { id: "observaciones", label: "Observaciones", type: "textarea" },
      { id: "verificadoPor", label: "Verificado por", type: "text" },
    ],
    actionTable: {
      valueKey: "acciones",
      title: "Acciones correctivas",
      help: "Registra las no conformidades encontradas y los codigos de accion aplicados.",
      columns: [
        { id: "hora", label: "Hora", type: "time", required: true },
        {
          id: "codigoNoConformidad",
          label: "Codigo no conformidad encontrada",
          type: "text",
          required: true,
        },
        {
          id: "codigoAccionCorrectiva",
          label: "Codigo accion correctiva aplicada",
          type: "text",
          required: true,
        },
        { id: "ejecutadoPor", label: "Ejecutado por", type: "text", required: true },
      ],
    },
    guide: [
      {
        noConformidad: "PRODUCTO - Temperatura interna mayor > a 4 C producto refrigerado",
        codigoNoConformidad: "DE01",
        accionCorrectiva:
          "Se adiciona hielo al producto en espera o se almacena el producto en el cuarto frio.",
        codigoAccionCorrectiva: "ACR01",
      },
      {
        noConformidad: "EMPAQUE Y EMBALAJE - Sin lote y/o fecha de vencimiento incompleta",
        codigoNoConformidad: "DE02",
        accionCorrectiva:
          "Se desempaca el producto y se cambia o coloca un nuevo empaque con la informacion completa.",
        codigoAccionCorrectiva: "ACR02",
      },
      {
        noConformidad: "EMPAQUE Y EMBALAJE - Ruptura y/o mal sellado",
        codigoNoConformidad: "DE03",
        accionCorrectiva: "Se retira el empaque al producto y se cambia.",
        codigoAccionCorrectiva: "ACR03",
      },
      {
        noConformidad: "EMPAQUE Y EMBALAJE - Canastilla sucia y/o averiada",
        codigoNoConformidad: "DE04",
        accionCorrectiva: "Se cambia la canastilla sucia o averiada.",
        codigoAccionCorrectiva: "ACR04",
      },
      {
        noConformidad:
          "CONDICIONES DEL VEHICULO - Furgon, cortinas o estibas sucias, o no tiene",
        codigoNoConformidad: "DE05",
        accionCorrectiva:
          "Se realiza limpieza al furgon, cortinas y estibas, o se envia informe de novedades al area de transportes.",
        codigoAccionCorrectiva: "ACR05",
      },
      {
        noConformidad: "CONDICIONES DEL VEHICULO - T ambiente furgon mayor > a 4 C",
        codigoNoConformidad: "DE06",
        accionCorrectiva:
          "Se cierran puertas hasta bajar temperatura ambiente o se informa a mantenimiento para revision del equipo.",
        codigoAccionCorrectiva: "ACR06",
      },
    ],
  },
  {
    id: "control-cloro-residual-chiller",
    codigo: "FO_CP-011",
    version: "2",
    fechaElaboracion: "Abril de 2022",
    nombre: "Verificacion cloro residual tanques de enfriamiento",
    descripcion: "Control diario de cloro residual libre y dosificacion en prechiller y chiller.",
    area: "Calidad",
    frecuencia: "Cada hora, cierre diario",
    metaDiaria: 1,
    layout: "chlorine-chiller-daily",
    nota:
      "El lote de proceso se genera automaticamente con la fecha actual. Este formato se cierra diariamente; agrega todos los controles realizados durante el dia, sean 8, 12 o los que requiera la operacion.",
    verifierOptions: ["Valentina Ospina", "Jhon Janner Villada"],
    fields: [
      { id: "loteProceso", label: "Lote proceso", type: "auto-date", required: true, locked: true },
      {
        id: "verifica",
        label: "Verifica",
        type: "select",
        required: true,
        options: ["Valentina Ospina", "Jhon Janner Villada"],
      },
    ],
    chlorineTable: {
      valueKey: "controles",
      title: "Controles de cloro residual",
      help: "Agrega una fila por cada control horario. La cantidad puede cambiar segun la operacion del dia.",
      columns: [
        { id: "hora", label: "Hora", type: "time", required: true },
        {
          id: "dosificacionPrechiller",
          label: "Dosificacion cloro prechiller (ml/hr)",
          type: "text",
        },
        {
          id: "ppmPrechiller",
          label: "PPM cloro residual libre prechiller",
          type: "text",
        },
        {
          id: "dosificacionChiller",
          label: "Dosificacion cloro chiller (ml/hr)",
          type: "text",
        },
        {
          id: "ppmChiller",
          label: "PPM cloro residual libre chiller",
          type: "text",
        },
        { id: "noConformidad", label: "No conformidad", type: "text" },
        { id: "accionesCorrectivas", label: "Acciones correctivas", type: "textarea" },
        { id: "observaciones", label: "Observaciones", type: "textarea" },
        {
          id: "monitoreadoPor",
          label: "Monitoreado por",
          type: "text",
          required: true,
        },
      ],
    },
    guide: [
      {
        noConformidad: "Cloro residual Mayor a >2 ppm",
        codigoNoConformidad: "AP01",
        accionCorrectiva:
          "Abra la valvula de entrada y salida de agua potable/suspenda la dosificacion mientras se estabiliza la residualidad.",
        codigoAccionCorrectiva: "ACR01",
      },
      {
        noConformidad: "Cloro residual menos <0,3 ppm",
        codigoNoConformidad: "AP02",
        accionCorrectiva:
          "Verifique la dosificacion de cloro/adicione de manera manual cloro al tanque hasta que se estabilice la residualidad.",
        codigoAccionCorrectiva: "ACR02",
      },
    ],
  },
  {
    id: "control-temperatura-visceras",
    codigo: "FO_CP-010",
    version: "4",
    fechaElaboracion: "Abril de 2022",
    nombre: "Control PCC enfriamiento visceras",
    descripcion: "Control diario de temperatura de visceras, patas y cabezas en enfriamiento.",
    area: "Calidad",
    frecuencia: "Cierre diario, segun muestreos realizados",
    metaDiaria: 1,
    layout: "viscera-temperature-daily",
    nota:
      "El lote de proceso se genera automaticamente con la fecha actual. Este formato se cierra diariamente y permite agregar todos los muestreos realizados durante la jornada.",
    verifierOptions: ["Valentina Ospina", "Jhon Janner Villada"],
    temperatureColumns: [
      { id: "horaMuestreo", label: "Hora de muestreo", type: "time", required: true },
      { id: "tipoProducto", label: "Tipo de producto", type: "text", required: true },
      { id: "temperaturaT1", label: "T1", type: "text" },
      { id: "temperaturaT2", label: "T2", type: "text" },
      { id: "temperaturaT3", label: "T3", type: "text" },
      { id: "temperaturaT4", label: "T4", type: "text" },
      { id: "temperaturaT5", label: "T5", type: "text" },
      { id: "temperaturaT6", label: "T6", type: "text" },
      { id: "temperaturaT7", label: "T7", type: "text" },
      { id: "temperaturaT8", label: "T8", type: "text" },
      { id: "temperaturaT9", label: "T9", type: "text" },
      { id: "temperaturaT10", label: "T10", type: "text" },
      { id: "temperaturaAguaChiller", label: "T agua chiller (max. 2 C)", type: "text" },
      { id: "noConformidadCodigo", label: "No conformidad (codigo)", type: "text" },
      { id: "accionesCorrectivasCodigo", label: "Acciones correctivas (codigo)", type: "text" },
      {
        id: "monitoreadoPor",
        label: "Monitoreado y/o verificado por",
        type: "text",
        required: true,
      },
    ],
    sections: [
      {
        id: "visceras",
        label: "Higado, corazon y molleja",
        valueKey: "visceras",
        productHelp: "H: Higado / C: Corazon / M: Molleja",
      },
      {
        id: "patasCabezas",
        label: "Patas y cabezas",
        valueKey: "patasCabezas",
        productHelp: "Pa: Patas / Ca: Cabezas",
      },
    ],
    fields: [
      { id: "loteProceso", label: "Lote de proceso", type: "auto-date", required: true, locked: true },
      { id: "observaciones", label: "Observaciones", type: "textarea" },
      {
        id: "verificadoPor",
        label: "Verificado por",
        type: "select",
        required: true,
        options: ["Valentina Ospina", "Jhon Janner Villada"],
      },
    ],
    actionTable: {
      valueKey: "acciones",
      title: "No conformidades y acciones correctivas",
      help: "Registra las novedades del proceso y la accion aplicada segun la tabla guia.",
      columns: [
        { id: "hora", label: "Hora", type: "time", required: true },
        {
          id: "noConformidad",
          label: "No conformidad",
          type: "textarea",
          required: true,
        },
        {
          id: "accionCorrectiva",
          label: "Accion correctiva",
          type: "textarea",
          required: true,
        },
        { id: "responsable", label: "Responsable", type: "text", required: true },
      ],
    },
    guide: [
      {
        noConformidad: "Visceras a la salida enfriamiento de tanques >4 C",
        codigoNoConformidad: "ENF01",
        accionCorrectiva:
          "Retener la salida del producto garantizando mas tiempo de permanencia en los tanques de enfriamiento o adicionar hielo.",
        codigoAccionCorrectiva: "ACR01",
      },
      {
        noConformidad: "Agua de enfriamiento en chiller > 2 C",
        codigoNoConformidad: "ENF02",
        accionCorrectiva:
          "Adicionar hielo hasta garantizar que la temperatura del agua disminuya al limite de operacion de 1.8 C.",
        codigoAccionCorrectiva: "ACR02",
      },
    ],
  },
];

function getCurrentDateParts() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`,
  };
}

function getMonthName(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("es-CO", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMonthKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

function getDayOfMonth(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.getDate();
}

function getDaysInMonth(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 31;

  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getOffsetDateKey(offsetDays = 0, value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  date.setDate(date.getDate() + offsetDays);

  return getDateKey(date);
}

function getWeekKey(value = new Date()) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const day = date.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);

  return getDateKey(date);
}

function getWeekLabel(periodoDesde, periodoHasta, periodoMes, fallbackKey = "") {
  const parts = [
    periodoDesde && `del ${periodoDesde}`,
    periodoHasta && `al ${periodoHasta}`,
    periodoMes && `de ${periodoMes}`,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" ") : `Semana ${fallbackKey}`;
}

export function createInitialTableRow(template) {
  const { date, time } = getCurrentDateParts();
  const columns = template.table?.columns || [];

  return Object.fromEntries(
    columns.map((column) => {
      if (column.type === "auto-date") return [column.id, date];
      if (column.type === "auto-time") return [column.id, time];
      if (column.type === "fixed") return [column.id, column.value || ""];

      return [column.id, ""];
    })
  );
}

export function createInitialDynamicRow(columns = []) {
  return Object.fromEntries(
    columns.map((column) => {
      if (column.type === "auto-date") return [column.id, getCurrentDateParts().date];
      if (column.type === "auto-time") return [column.id, getCurrentDateParts().time];
      if (column.type === "fixed") return [column.id, column.value || ""];
      if (typeof column.defaultOffsetDays === "number") {
        return [column.id, getOffsetDateKey(column.defaultOffsetDays)];
      }

      return [column.id, ""];
    })
  );
}

export function getWeeklyPoesItems(template) {
  return (template.weeklyAreas || []).flatMap((area) =>
    area.blocks.flatMap((block) =>
      block.items.map((item) => ({
        ...item,
        areaId: area.id,
        areaLabel: area.label,
        blockId: block.id,
        blockLabel: block.label,
      }))
    )
  );
}

export function getWeeklyPoesAreaResponsibles(values = {}, template = {}) {
  return (template.weeklyAreas || []).map((area) => ({
    areaId: area.id,
    areaLabel: area.label,
    realizadoPor: values.areaResponsables?.[area.id]?.realizadoPor || values.realizadoPor || "",
    verificadoPor: values.areaResponsables?.[area.id]?.verificadoPor || values.verificadoPor || "",
  }));
}

function createInitialWeeklyPoesValues(template) {
  return {
    periodoDesde: "",
    periodoHasta: "",
    periodoMes: "",
    horasInicio: Object.fromEntries(template.days.map((day) => [day.id, ""])),
    items: Object.fromEntries(
      getWeeklyPoesItems(template).map((item) => [
        item.id,
        {
          principioActivo: "",
          concentracion: "",
          aplicacion: "",
          controles: Object.fromEntries(
            template.days.map((day) => [day.id, []])
          ),
        },
      ])
    ),
    areaResponsables: Object.fromEntries(
      (template.weeklyAreas || []).map((area) => [
        area.id,
        {
          realizadoPor: "",
          verificadoPor: "",
        },
      ])
    ),
    acciones: [],
  };
}

function createInitialHydrationValues(template) {
  const { date } = getCurrentDateParts();

  return {
    fecha: date,
    granja: "",
    horaInicial: "",
    horaFinal: "",
    temperaturaPreChiller: "",
    temperaturaChiller: "",
    temperaturaIngresoCanales: "",
    temperaturaSalidaCanales: "",
    porcentajeHidratacion: "",
    viaje: "",
    observaciones: "",
    responsable: "",
    verifico: "",
    muestras: Array.from({ length: template.sampleCount || 10 }, (_, index) => ({
      numero: index + 1,
      pesoInicial: "",
      pesoFinal: "",
    })),
  };
}

function createInitialTemperaturePccValues(template) {
  const { date } = getCurrentDateParts();

  return {
    fecha: date,
    loteProceso: "",
    horaInicio: "",
    verifica: "",
    [template.monitorTable.valueKey]: [createInitialDynamicRow(template.monitorTable.columns)],
    [template.actionTable.valueKey]: [],
  };
}

function createInitialColdRoomsMonthlyValues(template) {
  return {
    monthKey: getMonthKey(),
    [template.monitorTable.valueKey]: [createInitialDynamicRow(template.monitorTable.columns)],
    [template.actionTable.valueKey]: [],
  };
}

function createInitialDispatchProductValues(template) {
  const { date } = getCurrentDateParts();

  return {
    fecha: date,
    [template.dispatchTable.valueKey]: [
      createInitialDynamicRow(template.dispatchTable.columns),
    ],
    observaciones: "",
    verificadoPor: "",
    [template.actionTable.valueKey]: [],
  };
}

function createInitialChlorineChillerValues(template) {
  const { date } = getCurrentDateParts();

  return {
    loteProceso: date,
    verifica: "",
    [template.chlorineTable.valueKey]: [
      createInitialDynamicRow(template.chlorineTable.columns),
    ],
  };
}

function createInitialVisceraTemperatureValues(template) {
  const { date } = getCurrentDateParts();
  const firstRow = createInitialDynamicRow(template.temperatureColumns);

  return {
    loteProceso: date,
    observaciones: "",
    verificadoPor: "",
    visceras: [firstRow],
    patasCabezas: [createInitialDynamicRow(template.temperatureColumns)],
    [template.actionTable.valueKey]: [],
  };
}

export function getTemplateFields(template) {
  if (template.layout === "empaques-table") {
    return template.table.columns;
  }

  if (template.layout === "weekly-poes") {
    return [
      { id: "periodo", label: "Fecha semana del/al/de", required: true },
      { id: "horaInicioProceso", label: "Hora inicio proceso por dia" },
      { id: "principioActivo", label: "Principio activo" },
      { id: "concentracion", label: "Concent." },
      { id: "aplicacion", label: "Inmersion / Aspersion" },
      { id: "controles", label: "Hora y C/NC por control" },
      { id: "responsablesArea", label: "Responsables por area", required: true },
      ...(template.actionTable?.columns || []),
    ];
  }

  if (template.layout === "hydration-test") {
    return [
      ...(template.fields || []),
      ...(template.sampleColumns || []),
    ];
  }

  if (template.layout === "temperature-pcc") {
    return [
      ...(template.fields || []),
      ...(template.monitorTable?.columns || []),
      ...(template.actionTable?.columns || []),
    ];
  }

  if (template.layout === "cold-rooms-monthly") {
    return [
      ...(template.monitorTable?.columns || []),
      ...(template.actionTable?.columns || []),
    ];
  }

  if (template.layout === "dispatch-product-daily") {
    return [
      ...(template.fields || []),
      ...(template.dispatchTable?.columns || []),
      ...(template.actionTable?.columns || []),
    ];
  }

  if (template.layout === "chlorine-chiller-daily") {
    return [
      ...(template.fields || []),
      ...(template.chlorineTable?.columns || []),
    ];
  }

  if (template.layout === "viscera-temperature-daily") {
    return [
      ...(template.fields || []),
      ...(template.temperatureColumns || []),
      ...(template.actionTable?.columns || []),
    ];
  }

  if (template.layout === "daily-trip-table") {
    return [
      ...(template.fields || []),
      ...(template.tripTable?.columns || []),
      ...(template.actionTable?.columns || []),
    ];
  }

  if (template.layout === "monthly-checklist") {
    return template.checklist.flatMap((group) => group.items);
  }

  return template.fields || [];
}

export function getInitialValues(template) {
  if (template.layout === "empaques-table") {
    return {
      [template.table.valueKey]: Array.from(
        { length: template.table.minRows || 1 },
        () => createInitialTableRow(template)
      ),
    };
  }

  if (template.layout === "monthly-checklist") {
    const { date } = getCurrentDateParts();

    return {
      monthKey: getMonthKey(),
      day: getDayOfMonth(),
      fecha: date,
      mes: getMonthName(),
      autoridadInvima: "",
      verifico: "",
      desinfectante: "",
      concentracion: "",
      horaLiberacion: "",
      horaInicioProceso: "",
      checks: Object.fromEntries(
        template.checklist.flatMap((group) =>
          group.items.map((item) => [item.id, ""])
        )
      ),
      actions: [],
    };
  }

  if (template.layout === "daily-trip-table") {
    const { date } = getCurrentDateParts();

    return {
      fecha: date,
      [template.tripTable.valueKey]: [createInitialDynamicRow(template.tripTable.columns)],
      observaciones: "",
      verificadoPor: "",
      [template.actionTable.valueKey]: [],
    };
  }

  if (template.layout === "weekly-poes") {
    return createInitialWeeklyPoesValues(template);
  }

  if (template.layout === "hydration-test") {
    return createInitialHydrationValues(template);
  }

  if (template.layout === "temperature-pcc") {
    return createInitialTemperaturePccValues(template);
  }

  if (template.layout === "cold-rooms-monthly") {
    return createInitialColdRoomsMonthlyValues(template);
  }

  if (template.layout === "dispatch-product-daily") {
    return createInitialDispatchProductValues(template);
  }

  if (template.layout === "chlorine-chiller-daily") {
    return createInitialChlorineChillerValues(template);
  }

  if (template.layout === "viscera-temperature-daily") {
    return createInitialVisceraTemperatureValues(template);
  }

  return Object.fromEntries(
    (template.fields || []).map((field) => [field.id, field.defaultValue || ""])
  );
}

export function getMissingRequiredField(template, values) {
  if (template.layout === "monthly-checklist") {
    const missingDailyField = template.dailyFields.find(
      (field) => field.required && !String(values[field.id] || "").trim()
    );

    if (missingDailyField) {
      return `Completa el campo: ${missingDailyField.label}.`;
    }

    const missingItem = getTemplateFields(template).find(
      (item) => !String(values.checks?.[item.id] || "").trim()
    );

    if (missingItem) {
      return `Completa el item: ${missingItem.label}.`;
    }

    const incompleteAction = (values.actions || []).find((action) => {
      const hasAnyValue = template.actionFields.some((field) =>
        String(action[field.id] || "").trim()
      );
      const hasMissingValue = template.actionFields.some((field) =>
        !String(action[field.id] || "").trim()
      );

      return hasAnyValue && hasMissingValue;
    });

    if (incompleteAction) {
      return "Completa todos los campos de la accion correctiva o dejala vacia.";
    }

    return "";
  }

  if (template.layout === "empaques-table") {
    const rows = values[template.table.valueKey] || [];
    const rowLabel = template.table.valueKey === "mediciones" ? "medicion" : "muestra";

    if (rows.length === 0) {
      return `Debes registrar al menos una ${rowLabel}.`;
    }

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
      const row = rows[rowIndex];
      const missingColumn = template.table.columns.find(
        (column) => column.required && !String(row[column.id] || "").trim()
      );

      if (missingColumn) {
        return `Completa ${missingColumn.label} en la ${rowLabel} ${rowIndex + 1}.`;
      }
    }

    return "";
  }

  if (template.layout === "daily-trip-table") {
    const trips = values[template.tripTable.valueKey] || [];

    if (trips.length === 0) {
      return "Debes registrar al menos un viaje.";
    }

    for (let rowIndex = 0; rowIndex < trips.length; rowIndex += 1) {
      const row = trips[rowIndex];
      const missingColumn = template.tripTable.columns.find(
        (column) => column.required && !String(row[column.id] || "").trim()
      );

      if (missingColumn) {
        return `Completa ${missingColumn.label} en el viaje ${rowIndex + 1}.`;
      }
    }

    const missingField = (template.fields || []).find(
      (field) => field.required && !String(values[field.id] || "").trim()
    );

    if (missingField) {
      return `Completa el campo: ${missingField.label}.`;
    }

    const incompleteAction = (values[template.actionTable.valueKey] || []).find((action) => {
      const hasAnyValue = template.actionTable.columns.some((field) =>
        String(action[field.id] || "").trim()
      );
      const hasMissingValue = template.actionTable.columns.some(
        (field) => field.required && !String(action[field.id] || "").trim()
      );

      return hasAnyValue && hasMissingValue;
    });

    if (incompleteAction) {
      return "Completa todos los campos de la accion correctiva o dejala vacia.";
    }

    return "";
  }

  if (template.layout === "weekly-poes") {
    if (!String(values.periodoDesde || "").trim()) {
      return "Completa la fecha inicial de la semana.";
    }

    if (!String(values.periodoHasta || "").trim()) {
      return "Completa la fecha final de la semana.";
    }

    if (!String(values.periodoMes || "").trim()) {
      return "Completa el mes de la semana.";
    }

    const missingRealizadoArea = getWeeklyPoesAreaResponsibles(values, template).find(
      (area) => !String(area.realizadoPor || "").trim()
    );

    if (missingRealizadoArea) {
      return `Completa Realizado por en ${missingRealizadoArea.areaLabel}.`;
    }

    const missingVerificadoArea = getWeeklyPoesAreaResponsibles(values, template).find(
      (area) => !String(area.verificadoPor || "").trim()
    );

    if (missingVerificadoArea) {
      return `Completa Verificado por en ${missingVerificadoArea.areaLabel}.`;
    }

    const items = values.items || {};
    const incompleteControl = getWeeklyPoesItems(template).find((item) =>
      template.days.some((day) =>
        (items[item.id]?.controles?.[day.id] || []).some((control) => {
          const hasAnyValue = String(control.hora || "").trim() || String(control.estado || "").trim();
          const hasMissingValue = !String(control.hora || "").trim() || !String(control.estado || "").trim();

          return hasAnyValue && hasMissingValue;
        })
      )
    );

    if (incompleteControl) {
      return `Completa hora y C/NC en los controles de ${incompleteControl.label}.`;
    }

    const incompleteAction = (values[template.actionTable.valueKey] || []).find((action) => {
      const hasAnyValue = template.actionTable.columns.some((field) =>
        String(action[field.id] || "").trim()
      );
      const hasMissingValue = template.actionTable.columns.some(
        (field) => field.required && !String(action[field.id] || "").trim()
      );

      return hasAnyValue && hasMissingValue;
    });

    if (incompleteAction) {
      return "Completa todos los campos de la accion correctiva o dejala vacia.";
    }

    return "";
  }

  if (template.layout === "hydration-test") {
    const missingField = (template.fields || []).find(
      (field) =>
        field.required &&
        !field.locked &&
        !String(values[field.id] || "").trim()
    );

    if (missingField) {
      return `Completa el campo: ${missingField.label}.`;
    }

    const samples = values.muestras || [];

    if (samples.length !== (template.sampleCount || 10)) {
      return `Este formato debe tener ${(template.sampleCount || 10)} muestras.`;
    }

    for (let sampleIndex = 0; sampleIndex < samples.length; sampleIndex += 1) {
      const sample = samples[sampleIndex];
      const missingColumn = (template.sampleColumns || []).find(
        (column) =>
          column.required &&
          !String(sample[column.id] || "").trim()
      );

      if (missingColumn) {
        return `Completa ${missingColumn.label} en la muestra ${sampleIndex + 1}.`;
      }
    }

    return "";
  }

  if (template.layout === "temperature-pcc") {
    const measurements = values[template.monitorTable.valueKey] || [];

    if (measurements.length === 0) {
      return "Debes registrar al menos una medicion.";
    }

    for (let rowIndex = 0; rowIndex < measurements.length; rowIndex += 1) {
      const row = measurements[rowIndex];
      const missingColumn = template.monitorTable.columns.find(
        (column) => column.required && !String(row[column.id] || "").trim()
      );

      if (missingColumn) {
        return `Completa ${missingColumn.label} en la medicion ${rowIndex + 1}.`;
      }
    }

    const incompleteAction = (values[template.actionTable.valueKey] || []).find((action) => {
      const hasAnyValue = template.actionTable.columns.some((field) =>
        String(action[field.id] || "").trim()
      );
      const hasMissingValue = template.actionTable.columns.some(
        (field) => field.required && !String(action[field.id] || "").trim()
      );

      return hasAnyValue && hasMissingValue;
    });

    if (incompleteAction) {
      return "Completa todos los campos de la accion correctiva o dejala vacia.";
    }

    return "";
  }

  if (template.layout === "cold-rooms-monthly") {
    const controls = values[template.monitorTable.valueKey] || [];

    if (controls.length === 0) {
      return "Debes registrar al menos un control de temperatura.";
    }

    for (let rowIndex = 0; rowIndex < controls.length; rowIndex += 1) {
      const row = controls[rowIndex];
      const missingColumn = template.monitorTable.columns.find(
        (column) => column.required && !String(row[column.id] || "").trim()
      );

      if (missingColumn) {
        return `Completa ${missingColumn.label} en el control ${rowIndex + 1}.`;
      }
    }

    const incompleteAction = (values[template.actionTable.valueKey] || []).find((action) => {
      const hasAnyValue = template.actionTable.columns.some((field) =>
        String(action[field.id] || "").trim()
      );
      const hasMissingValue = template.actionTable.columns.some(
        (field) => field.required && !String(action[field.id] || "").trim()
      );

      return hasAnyValue && hasMissingValue;
    });

    if (incompleteAction) {
      return "Completa todos los campos de la accion correctiva o dejala vacia.";
    }

    return "";
  }

  if (template.layout === "dispatch-product-daily") {
    const dispatches = values[template.dispatchTable.valueKey] || [];

    if (dispatches.length === 0) {
      return "Debes registrar al menos un despacho.";
    }

    for (let rowIndex = 0; rowIndex < dispatches.length; rowIndex += 1) {
      const row = dispatches[rowIndex];
      const missingColumn = template.dispatchTable.columns.find(
        (column) => column.required && !String(row[column.id] || "").trim()
      );

      if (missingColumn) {
        return `Completa ${missingColumn.label} en el despacho ${rowIndex + 1}.`;
      }
    }

    const missingField = (template.fields || []).find(
      (field) =>
        field.required &&
        !field.locked &&
        !String(values[field.id] || "").trim()
    );

    if (missingField) {
      return `Completa el campo: ${missingField.label}.`;
    }

    const incompleteAction = (values[template.actionTable.valueKey] || []).find((action) => {
      const hasAnyValue = template.actionTable.columns.some((field) =>
        String(action[field.id] || "").trim()
      );
      const hasMissingValue = template.actionTable.columns.some(
        (field) => field.required && !String(action[field.id] || "").trim()
      );

      return hasAnyValue && hasMissingValue;
    });

    if (incompleteAction) {
      return "Completa todos los campos de la accion correctiva o dejala vacia.";
    }

    return "";
  }

  if (template.layout === "chlorine-chiller-daily") {
    const controls = values[template.chlorineTable.valueKey] || [];

    if (controls.length === 0) {
      return "Debes registrar al menos un control de cloro.";
    }

    const missingField = (template.fields || []).find(
      (field) =>
        field.required &&
        !field.locked &&
        !String(values[field.id] || "").trim()
    );

    if (missingField) {
      return `Completa el campo: ${missingField.label}.`;
    }

    for (let rowIndex = 0; rowIndex < controls.length; rowIndex += 1) {
      const row = controls[rowIndex];
      const missingColumn = template.chlorineTable.columns.find(
        (column) => column.required && !String(row[column.id] || "").trim()
      );

      if (missingColumn) {
        return `Completa ${missingColumn.label} en el control ${rowIndex + 1}.`;
      }
    }

    return "";
  }

  if (template.layout === "viscera-temperature-daily") {
    const sections = template.sections || [];
    const totalRows = sections.reduce(
      (sum, section) => sum + (values[section.valueKey] || []).length,
      0
    );

    if (totalRows === 0) {
      return "Debes registrar al menos un muestreo.";
    }

    const missingField = (template.fields || []).find(
      (field) =>
        field.required &&
        !field.locked &&
        !String(values[field.id] || "").trim()
    );

    if (missingField) {
      return `Completa el campo: ${missingField.label}.`;
    }

    for (const section of sections) {
      const rows = values[section.valueKey] || [];

      for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
        const row = rows[rowIndex];
        const missingColumn = template.temperatureColumns.find(
          (column) => column.required && !String(row[column.id] || "").trim()
        );

        if (missingColumn) {
          return `Completa ${missingColumn.label} en ${section.label}, muestreo ${rowIndex + 1}.`;
        }
      }
    }

    const incompleteAction = (values[template.actionTable.valueKey] || []).find((action) => {
      const hasAnyValue = template.actionTable.columns.some((field) =>
        String(action[field.id] || "").trim()
      );
      const hasMissingValue = template.actionTable.columns.some(
        (field) => field.required && !String(action[field.id] || "").trim()
      );

      return hasAnyValue && hasMissingValue;
    });

    if (incompleteAction) {
      return "Completa todos los campos de la accion correctiva o dejala vacia.";
    }

    return "";
  }

  const missingField = (template.fields || []).find(
    (field) => field.required && !String(values[field.id] || "").trim()
  );

  return missingField ? `Completa el campo obligatorio: ${missingField.label}.` : "";
}

export function getEditableFieldCount(template) {
  if (template.layout === "monthly-checklist") {
    return getTemplateFields(template).length + template.dailyFields.length;
  }

  if (template.layout === "daily-trip-table") {
    return getTemplateFields(template).filter((field) => !field.locked).length;
  }

  if (template.layout === "hydration-test") {
    return (
      (template.fields || []).filter((field) => !field.locked).length +
      ((template.sampleColumns || []).filter((field) => !field.locked).length *
        (template.sampleCount || 10))
    );
  }

  if (template.layout === "temperature-pcc") {
    return getTemplateFields(template).filter((field) => !field.locked).length;
  }

  if (template.layout === "cold-rooms-monthly") {
    return getTemplateFields(template).filter((field) => !field.locked).length;
  }

  if (template.layout === "dispatch-product-daily") {
    return getTemplateFields(template).filter((field) => !field.locked).length;
  }

  if (template.layout === "chlorine-chiller-daily") {
    return getTemplateFields(template).filter((field) => !field.locked).length;
  }

  if (template.layout === "viscera-temperature-daily") {
    return getTemplateFields(template).filter((field) => !field.locked).length;
  }

  if (template.layout === "weekly-poes") {
    return getTemplateFields(template).length;
  }

  return getTemplateFields(template).filter((field) => !field.locked).length;
}

export function getRequiredFieldCount(template) {
  if (template.layout === "monthly-checklist") {
    return getTemplateFields(template).length + template.dailyFields.length;
  }

  if (template.layout === "daily-trip-table") {
    return [
      ...(template.fields || []),
      ...(template.tripTable?.columns || []),
    ].filter((field) => field.required).length;
  }

  if (template.layout === "hydration-test") {
    return (
      (template.fields || []).filter((field) => field.required && !field.locked).length +
      ((template.sampleColumns || []).filter((field) => field.required && !field.locked).length *
        (template.sampleCount || 10))
    );
  }

  if (template.layout === "temperature-pcc") {
    return [
      ...(template.fields || []),
      ...(template.monitorTable?.columns || []),
    ].filter((field) => field.required && !field.locked).length;
  }

  if (template.layout === "cold-rooms-monthly") {
    return [
      ...(template.monitorTable?.columns || []),
      ...(template.actionTable?.columns || []),
    ].filter((field) => field.required && !field.locked).length;
  }

  if (template.layout === "dispatch-product-daily") {
    return [
      ...(template.fields || []),
      ...(template.dispatchTable?.columns || []),
      ...(template.actionTable?.columns || []),
    ].filter((field) => field.required && !field.locked).length;
  }

  if (template.layout === "chlorine-chiller-daily") {
    return [
      ...(template.fields || []),
      ...(template.chlorineTable?.columns || []),
    ].filter((field) => field.required && !field.locked).length;
  }

  if (template.layout === "viscera-temperature-daily") {
    return [
      ...(template.fields || []),
      ...(template.temperatureColumns || []),
      ...(template.actionTable?.columns || []),
    ].filter((field) => field.required && !field.locked).length;
  }

  if (template.layout === "weekly-poes") {
    return 3 + ((template.weeklyAreas || []).length * 2);
  }

  return getTemplateFields(template).filter((field) => field.required).length;
}

export function loadFormatRecords() {
  try {
    const raw = window.localStorage.getItem(RECORDS_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFormatRecords(records) {
  window.localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function getDateKey(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getRecordsForTemplateToday(records, templateId) {
  const today = getDateKey();

  return records.filter(
    (record) =>
      record.formatoId === templateId &&
      getDateKey(record.fechaRegistro) === today
  );
}

export function getRecordsForTemplateCurrentPeriod(records, template) {
  if (template.period === "monthly") {
    const monthKey = getMonthKey();

    return records.filter(
      (record) =>
        record.formatoId === template.id &&
        (record.periodKey || getMonthKey(record.fechaRegistro)) === monthKey
    );
  }

  if (template.period === "weekly") {
    const weekKey = getWeekKey();

    return records.filter(
      (record) =>
        record.formatoId === template.id &&
        (record.periodKey || getWeekKey(record.fechaRegistro)) === weekKey
    );
  }

  return getRecordsForTemplateToday(records, template.id);
}

export function getTemplateProgress(records, template) {
  if (template.period === "weekly") {
    const completed = getRecordsForTemplateCurrentPeriod(records, template).length > 0 ? 1 : 0;

    return {
      completed,
      total: 1,
      percent: completed === 1 ? 100 : 0,
    };
  }

  if (template.period === "monthly") {
    const periodRecords = getRecordsForTemplateCurrentPeriod(records, template);
    const isMonthlyTable = template.layout === "empaques-table";
    const isColdRoomsMonthly = template.layout === "cold-rooms-monthly";
    const completed = isColdRoomsMonthly
      ? new Set(
          periodRecords.flatMap((record) =>
            (record.values?.[template.monitorTable.valueKey] || [])
              .map((row) => row.fecha)
              .filter(Boolean)
          )
        ).size
      : isMonthlyTable
      ? periodRecords.reduce(
          (sum, record) =>
            sum + (record.values?.[template.table.valueKey] || []).length,
          0
        )
      : new Set(
          periodRecords.map((record) => record.day || getDayOfMonth(record.fechaRegistro))
        ).size;
    const total = isMonthlyTable
      ? getDaysInMonth() * (template.table?.maxPerDay || 1)
      : getDaysInMonth();

    return {
      completed,
      total,
      percent: total === 0 ? 0 : Math.min(100, Math.round((completed / total) * 100)),
    };
  }

  const total = template.metaDiaria || 1;
  const completed = getRecordsForTemplateToday(records, template.id).length;

  return {
    completed,
    total,
    percent: Math.min(100, Math.round((completed / total) * 100)),
  };
}

export function getGlobalProgress(records) {
  const total = formatTemplates.reduce((sum, template) => {
    if (template.period === "weekly") return sum + getTemplateProgress(records, template).total;
    if (template.period === "monthly") return sum + getTemplateProgress(records, template).total;

    return sum + (template.metaDiaria || 1);
  }, 0);
  const completed = formatTemplates.reduce((sum, template) => {
    if (template.period === "weekly") {
      return sum + getTemplateProgress(records, template).completed;
    }

    if (template.period === "monthly") {
      return sum + getTemplateProgress(records, template).completed;
    }

    return sum + Math.min(
      getRecordsForTemplateToday(records, template.id).length,
      template.metaDiaria || 1
    );
  }, 0);

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function getPeriodKey(value = new Date()) {
  return getMonthKey(value);
}

export function getWeekPeriodKey(value = new Date()) {
  return getWeekKey(value);
}

export function getWeeklyPoesPeriodLabel(values = {}, fallbackKey = "") {
  return getWeekLabel(
    values.periodoDesde,
    values.periodoHasta,
    values.periodoMes,
    fallbackKey
  );
}

export function getCurrentDayOfMonth() {
  return getDayOfMonth();
}

export function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
