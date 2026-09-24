import { TriangleAlert } from 'lucide-react';
import PageHeader from '../../../components/base/PageHeader';
import DataTable from '../../../components/base/DataTable';
import {
  categorias,
  estadosActivo,
  marcas,
  productos,
  tiposVehiculo,
} from '../../../data/mockData';

/** Formatea un importe guardado como número. */
const pesos = (valor) =>
  typeof valor === 'number' ? `$ ${valor.toLocaleString('es-CO')}` : valor || '—';

// Tabla `producto`: id_categoria, codigo, nombre, descripcion, medidas,
// marca, precio_compra, precio_venta, stock, estado. Las fotos viven en la
// tabla `imagen`, que cuelga del producto.
const columns = [
  { key: 'codigo', label: 'Código' },
  {
    key: 'nombre',
    label: 'Producto',
    // Aviso discreto cuando el producto no tiene ninguna imagen cargada
    render: (row) => (
      <span className="flex items-center gap-2">
        {row.nombre}
        {!row.imagenes?.length && (
          <span
            title="El producto no tiene imágenes cargadas"
            className="inline-flex items-center gap-1 rounded-md bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400"
          >
            <TriangleAlert size={10} /> Sin foto
          </span>
        )}
      </span>
    ),
  },
  { key: 'categoria', label: 'Categoría' },
  { key: 'marca', label: 'Marca' },
  { key: 'medidas', label: 'Medidas' },
  { key: 'precioVenta', label: 'Precio venta', render: (row) => pesos(row.precioVenta) },
  { key: 'stock', label: 'Stock' },
  { key: 'estado', label: 'Estado' },
];

const formSections = [
  {
    title: 'Identificación',
    fields: [
      { key: 'codigo', label: 'Código del producto', required: true, placeholder: 'ML-19565R15' },
      { key: 'nombre', label: 'Nombre', required: true },
      { key: 'descripcion', label: 'Descripción', type: 'textarea', span: 2 },
      {
        key: 'categoria',
        label: 'Categoría',
        type: 'select',
        required: true,
        options: categorias.map((c) => c.nombre),
        emptyLabel: 'categoría',
      },
      {
        key: 'marca',
        label: 'Marca',
        type: 'select',
        required: true,
        options: marcas.map((m) => m.nombre),
        emptyLabel: 'marca',
      },
      { key: 'medidas', label: 'Medidas', required: true, placeholder: '195/65R15' },
      { key: 'tipoVehiculo', label: 'Tipo de vehículo', type: 'select', options: tiposVehiculo },
    ],
  },
  {
    title: 'Precios e inventario',
    fields: [
      { key: 'precioCompra', label: 'Precio de compra (COP)', type: 'money', required: true, placeholder: '218.000' },
      { key: 'precioVenta', label: 'Precio de venta (COP)', type: 'money', required: true, placeholder: '280.000' },
      { key: 'stock', label: 'Stock disponible', type: 'number', required: true, placeholder: '24' },
      { key: 'estado', label: 'Estado', type: 'select', options: estadosActivo, only: ['edit', 'view'] },
    ],
  },
  {
    title: 'Imagen',
    fields: [
      {
        key: 'foto',
        label: 'Foto del producto',
        type: 'image',
        span: 2,
        placeholder: 'Sube la foto de la llanta (JPG o PNG)',
        hint: 'Cada foto se guarda como un registro de la tabla imagen.',
      },
    ],
  },
];

/**
 * Los productos nuevos entran activos y la foto cargada se convierte en el
 * primer registro de su galería de imágenes.
 */
function normalize(values) {
  return {
    estado: 'Activo',
    ...values,
    imagenes: values.foto ? [values.foto] : [],
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
        newLabel="Nuevo producto"
        formSections={formSections}
        entityName="producto"
        normalize={normalize}
        exportable={false}
        statusKey="estado"
        statusOptions={estadosActivo}
        statusVariant="switch"
        filters={[
          { key: 'categoria', label: 'Categoría', options: categorias.map((c) => c.nombre) },
          { key: 'marca', label: 'Marca', options: marcas.map((m) => m.nombre) },
          { key: 'tipoVehiculo', label: 'Vehículo', options: tiposVehiculo },
          { key: 'estado', label: 'Estado', options: estadosActivo },
        ]}
      />
    </div>
  );
}
