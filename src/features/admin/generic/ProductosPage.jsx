import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import { categorias, estadosProducto, marcas, productos, tiposVehiculo } from '../../../data/mockData';

const columns = [
  { key: 'id', label: 'ID' },
  { key: 'nombre', label: 'Producto' },
  { key: 'marca', label: 'Marca' },
  { key: 'medida', label: 'Medida' },
  { key: 'categoria', label: 'Categoría' },
  { key: 'estado', label: 'Estado' },
];

// Tabla `producto`: codigo_producto, id_marcas, id_tipo_vehiculo, nombre,
// rin, perfil, ancho, descripcion, activo. La medida ya no es un campo
// único: se arma con ancho/perfil/rin. Las categorías son M:N
// (producto_categoria) y la foto vive en producto_imagen.
const formSections = [
  {
    title: 'Identificación del producto',
    fields: [
      { key: 'codigo', label: 'Código de producto', required: true, placeholder: 'PRD-0012' },
      { key: 'marca', label: 'Marca', type: 'select', required: true, options: marcas },
      { key: 'nombre', label: 'Nombre', required: true, span: 2, placeholder: 'Michelin Energy XM2+' },
      { key: 'vehiculo', label: 'Tipo de vehículo', type: 'select', required: true, options: tiposVehiculo },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosProducto },
    ],
  },
  {
    title: 'Medidas',
    fields: [
      { key: 'ancho', label: 'Ancho (mm)', type: 'number', required: true, placeholder: '205' },
      { key: 'perfil', label: 'Perfil (%)', type: 'number', required: true, placeholder: '65' },
      { key: 'rin', label: 'Rin (pulg)', type: 'number', required: true, placeholder: '15' },
    ],
  },
  {
    title: 'Clasificación y ficha',
    fields: [
      {
        key: 'categorias',
        label: 'Categorías',
        type: 'checkboxes',
        span: 2,
        options: categorias.map((c) => c.nombre),
        hint: 'Un producto puede pertenecer a varias categorías (producto_categoria).',
      },
      {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        span: 2,
        placeholder: 'Características, uso recomendado, banda de rodamiento...',
      },
      { key: 'imagen', label: 'Foto del producto', type: 'image', span: 2 },
    ],
  },
];

/** Deriva las columnas del listado (medida, categoría, estado). */
function normalize(values) {
  const { ancho, perfil, rin, categorias: cats } = values;
  return {
    ...values,
    medida: ancho && perfil && rin ? `${ancho}/${perfil}R${rin}` : values.medida ?? '',
    categoria: String(cats ?? '').split(',')[0]?.trim() || values.categoria || '',
    estado: values.estado || 'Disponible',
  };
}

export default function ProductosPage() {
  return (
    <div>
      <PageHeader crumbs={['Inicio', 'Productos']} />
      <DataTable
        title="Productos"
        columns={columns}
        data={productos}
        statusKey="estado"
        newLabel="Nuevo producto"
        formSections={formSections}
        entityName="producto"
        statusOptions={estadosProducto}
        filters={[
          { key: 'estado', label: 'Estado', options: estadosProducto },
          { key: 'marca', label: 'Marca' },
        ]}
        normalize={normalize}
      />
    </div>
  );
}
