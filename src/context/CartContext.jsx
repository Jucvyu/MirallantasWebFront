import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

let servicioSeq = 0;

/**
 * Carrito del pedido-cotización en curso.
 *
 * Refleja las dos tablas de detalle del modelo v2:
 *   - `productos`  → cotizacion_detalle_producto (producto y cantidad)
 *   - `servicios`  → cotizacion_detalle_servicio + evidencia_carcasa
 *     (foto de la carcasa, descripción y estado de aptitud)
 *
 * Vive en el ClientLayout, así que sobrevive mientras el cliente navega
 * entre catálogo y el formulario del pedido.
 */
export function CartProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);

  const addProducto = useCallback((producto, cantidad = 1) => {
    setProductos((prev) => {
      const found = prev.find((p) => p.id === producto.id);
      if (found) {
        return prev.map((p) => (p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p));
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.nombre,
          marca: producto.marca,
          medida: producto.medida,
          categoria: producto.categoria,
          cantidad,
          descripcionLlanta: '',
          observaciones: '',
        },
      ];
    });
  }, []);

  const setCantidad = useCallback((id, cantidad) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, cantidad: Math.max(1, Number(cantidad) || 1) } : p)),
    );
  }, []);

  const removeProducto = useCallback((id) => {
    setProductos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addServicio = useCallback((servicio) => {
    servicioSeq += 1;
    setServicios((prev) => [...prev, { ...servicio, id: `SRVL-${servicioSeq}` }]);
  }, []);

  const removeServicio = useCallback((id) => {
    setServicios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clear = useCallback(() => {
    setProductos([]);
    setServicios([]);
  }, []);

  // El pedido no lleva valores: el asesor cotiza después, así que aquí
  // solo se cuentan líneas y unidades.
  const value = useMemo(() => {
    return {
      productos,
      servicios,
      addProducto,
      setCantidad,
      removeProducto,
      addServicio,
      removeServicio,
      clear,
      count: productos.length + servicios.length,
      unidades:
        productos.reduce((acc, p) => acc + p.cantidad, 0) + servicios.reduce((acc, s) => acc + s.cantidad, 0),
    };
  }, [productos, servicios, addProducto, setCantidad, removeProducto, addServicio, removeServicio, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un <CartProvider>');
  return ctx;
}
