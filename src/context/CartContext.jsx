import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

let servicioSeq = 0;

/**
 * Carrito de la cotización-pedido en curso.
 *
 * Refleja las dos tablas de detalle del modelo:
 *   - `productos` → detalle_venta (producto, cantidad y precio unitario)
 *   - `servicios` → detalle_servicio más la evidencia de la carcasa
 *     (foto y descripción de la llanta usada)
 *
 * Vive en el ClientLayout, así que sobrevive mientras el cliente navega
 * entre el catálogo y el resto del portal. Como los productos ya tienen
 * precio de venta, el carrito calcula el subtotal.
 */
export function CartProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);

  const addProducto = useCallback((producto, cantidad = 1) => {
    setProductos((prev) => {
      const encontrado = prev.find((p) => p.id === producto.id);
      if (encontrado) {
        return prev.map((p) => (p.id === producto.id ? { ...p, cantidad: p.cantidad + cantidad } : p));
      }
      return [
        ...prev,
        {
          id: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          marca: producto.marca,
          medidas: producto.medidas,
          categoria: producto.categoria,
          precioVenta: producto.precioVenta,
          cantidad,
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

  const value = useMemo(() => {
    const subtotalProductos = productos.reduce((acc, p) => acc + p.precioVenta * p.cantidad, 0);
    const subtotalServicios = servicios.reduce((acc, s) => acc + (s.precio ?? 0) * s.cantidad, 0);
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
      subtotal: subtotalProductos + subtotalServicios,
    };
  }, [productos, servicios, addProducto, setCantidad, removeProducto, addServicio, removeServicio, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de un <CartProvider>');
  return ctx;
}
