import { estadosEvidenciaCarcasa, servicios } from '../../data/mockData';

/**
 * Formulario de una línea de servicio (reencauche).
 *
 * Corresponde a `cotizacion_detalle_servicio` (servicio, cantidad de llantas,
 * precio unitario) más `evidencia_carcasa` (foto, descripción, estado de
 * aptitud y observaciones).
 *
 * Hay dos variantes porque cliente y administrador no llenan lo mismo:
 *
 * - **Cliente**: solo describe la llanta que quiere reencauchar. No elige el
 *   servicio ni pone precio —eso lo define el asesor al cotizar— y tampoco
 *   califica la evidencia, que entra siempre como "Pendiente de revisión".
 * - **Admin**: elige el servicio concreto y puede marcar la aptitud de la
 *   carcasa. El valor no se captura aquí: el total de la cotización se fija
 *   después, desde el listado de Pedidos-Cotización.
 */

// ---- Campos comunes a las dos variantes ---------------------------------
const CANTIDAD = {
  key: 'cantidad',
  label: 'Cantidad de llantas',
  type: 'number',
  required: true,
  placeholder: '4',
};

const FOTO = {
  key: 'foto',
  label: 'Foto de la llanta',
  type: 'image',
  required: true,
  span: 2,
  placeholder: 'Sube una foto de la carcasa (JPG o PNG)',
};

const DESCRIPCION = {
  key: 'descripcion',
  label: 'Descripción de la llanta',
  type: 'textarea',
  required: true,
  span: 2,
  placeholder: 'Marca, medida, kilometraje aproximado, estado del labrado...',
};

const OBSERVACIONES = { key: 'observaciones', label: 'Observaciones', placeholder: 'Notas adicionales' };

// ---- Variante del portal del cliente ------------------------------------
export const servicioSectionsCliente = [
  {
    title: 'Servicio solicitado',
    fields: [{ ...CANTIDAD, span: 2 }],
  },
  {
    title: 'Evidencia de la carcasa',
    fields: [FOTO, DESCRIPCION, { ...OBSERVACIONES, span: 2 }],
  },
];

// ---- Variante del administrador -----------------------------------------
export const servicioSectionsAdmin = [
  {
    title: 'Servicio solicitado',
    fields: [
      {
        key: 'servicio',
        label: 'Servicio',
        type: 'select',
        required: true,
        span: 2,
        options: servicios.map((s) => s.nombre),
      },
      CANTIDAD,
    ],
  },
  {
    title: 'Evidencia de la carcasa',
    fields: [
      FOTO,
      DESCRIPCION,
      {
        key: 'estadoEvidencia',
        label: 'Estado de la evidencia',
        type: 'select',
        options: estadosEvidenciaCarcasa,
        hint: 'Lo confirma el asesor tras revisar la foto.',
      },
      OBSERVACIONES,
    ],
  },
];

export const servicioInitialValues = { estadoEvidencia: 'Pendiente de revisión', cantidad: '1' };

/** Nombre que lleva la línea cuando el cliente no elige el servicio. */
export const SERVICIO_POR_DEFECTO = 'Reencauche';

/** "$ 320.000" o "320000" → 320000 */
export function toNumber(value) {
  return Number(String(value ?? '').replace(/\D/g, '')) || 0;
}
