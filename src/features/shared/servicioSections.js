import { estadosEvidenciaCarcasa, servicios } from '../../data/mockData';

/**
 * Formulario de una solicitud de servicio (reencauche).
 *
 * Corresponde al `detalle_servicio` de la venta —servicio, cantidad y
 * precio— más la evidencia de la carcasa que exige el proceso de servicios
 * de la ficha: foto de la llanta usada, descripción y aptitud.
 *
 * Hay dos variantes porque cliente y administrador no llenan lo mismo:
 *
 * - **Cliente**: describe la llanta que quiere reencauchar. No elige el
 *   servicio ni pone precio —eso lo define el asesor al cotizar— y tampoco
 *   califica la evidencia, que entra como "Pendiente de revisión".
 * - **Admin**: además elige la modalidad del servicio y marca la aptitud de
 *   la carcasa tras revisar la foto.
 */

const CANTIDAD = {
  key: 'cantidad',
  label: 'Cantidad de llantas',
  type: 'number',
  required: true,
  placeholder: '4',
};

const MEDIDAS = { key: 'medidas', label: 'Medidas de la llanta', placeholder: '295/80R22.5' };

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

// ---- Variante del portal del cliente ------------------------------------
export const servicioSectionsCliente = [
  {
    title: 'Servicio solicitado',
    fields: [CANTIDAD, MEDIDAS],
  },
  {
    title: 'Evidencia de la carcasa',
    fields: [FOTO, DESCRIPCION],
  },
];

// ---- Variante del administrador -----------------------------------------
export const servicioSectionsAdmin = [
  {
    title: 'Servicio solicitado',
    fields: [
      {
        key: 'servicio',
        label: 'Modalidad del servicio',
        type: 'select',
        required: true,
        span: 2,
        options: servicios.filter((s) => s.estado === 'Activo').map((s) => s.nombre),
        emptyLabel: 'servicio',
      },
      CANTIDAD,
      MEDIDAS,
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
        span: 2,
        options: estadosEvidenciaCarcasa,
        hint: 'Lo confirma el asesor tras revisar la foto.',
      },
    ],
  },
];

export const servicioInitialValues = { estadoEvidencia: 'Pendiente de revisión', cantidad: '1' };

/** "$ 320.000" o "320000" → 320000 */
export function toNumber(value) {
  return Number(String(value ?? '').replace(/\D/g, '')) || 0;
}
