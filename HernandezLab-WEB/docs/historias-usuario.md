# Historias de usuario — HernandezLab

Roles del sistema:
- **Administrativo**: acceso total (Usuarios, Sucursales, Inventario, Proveedores, Solicitudes).
- **Recepción**: acceso limitado a Solicitudes e Inventario, siempre acotado a su sucursal asignada.

Formato: *Como [rol], quiero [acción], para [beneficio].*

## Módulo Usuarios (administrativo)

1. Como administrativo, quiero crear un usuario nuevo mediante un formulario (cédula, nombre,
   apellido, cargo, sucursal y rol), para darle acceso al sistema a un empleado.
2. Como administrativo, quiero que el formulario de creación pida la cédula como primer campo y
   la valide como identificador único, para evitar registros duplicados o incompletos.
3. Como administrativo, quiero que el campo nombre/apellido rechace números y símbolos, para
   mantener los datos de identidad limpios.
4. Como administrativo, quiero editar los datos de un usuario existente (cargo, sucursal, rol,
   estado activo/inactivo), para mantener su información al día sin tener que recrearlo.
5. Como administrativo, quiero ver el listado total de usuarios registrados con un contador, para
   conocer de un vistazo cuántos empleados tienen acceso al sistema.
6. Como administrativo, quiero eliminar un usuario, para revocarle el acceso cuando deja de
   trabajar en el laboratorio.

## Módulo Sucursales (administrativo)

7. Como administrativo, quiero registrar una nueva sucursal (nombre, dirección, teléfono), para
   habilitar sus propios datos de inventario y solicitudes.
8. Como administrativo, quiero editar y eliminar sucursales existentes, para corregir datos o
   dar de baja una sede que cierra.
9. Como administrativo, quiero seleccionar la sucursal activa desde un selector global, para que
   todos los módulos (Inventario, Solicitudes) muestren solo la información de esa sede.
10. Como recepción, quiero que el sistema fije automáticamente mi sucursal asignada sin mostrarme
    un selector, para no operar por error sobre datos de otra sede.

## Módulo Inventario (administrativo y recepción)

11. Como administrativo o recepción, quiero ver el inventario organizado en 4 apartados (insumos,
    reactivos, mobiliario, maquinaria), para ubicar rápidamente el tipo de artículo que busco.
12. Como administrativo o recepción, quiero registrar un nuevo ítem de inventario (código, nombre,
    categoría, stock actual, stock mínimo, lote y fecha de vencimiento cuando aplique), para
    llevar control de existencias por sucursal.
13. Como administrativo o recepción, quiero editar y eliminar un ítem de inventario, para corregir
    datos o dar de baja artículos que ya no se usan.
14. Como administrativo o recepción, quiero ver una alerta cuando el stock actual de un ítem cae
    por debajo del stock mínimo, para reponerlo a tiempo.
15. Como administrativo, quiero registrar una compra a un proveedor con el detalle de los ítems
    comprados, para que el stock se incremente automáticamente al recibir mercancía.

## Módulo Solicitudes (administrativo y recepción)

16. Como recepción, quiero crear una solicitud de examen ingresando los datos del paciente
    (cédula, nombre, apellido, fecha de nacimiento, género), para iniciar el proceso de atención.
17. Como recepción, quiero seleccionar de un menú desplegable los exámenes solicitados por el
    paciente, para asociar cada examen con su costo y tiempo de entrega.
18. Como recepción, quiero que al elegir un examen el sistema muestre automáticamente los insumos
    o reactivos que se emplearán (según lo definido por examen), para no tener que seleccionarlos
    manualmente uno por uno.
19. Como recepción, quiero que al confirmar una solicitud el sistema descuente del inventario los
    insumos/reactivos usados, para que el stock quede siempre actualizado en el momento exacto en
    que se consumen.
20. Como administrativo o recepción, quiero consultar el historial de solicitudes con su estado
    (pendiente, en proceso, entregado), para dar seguimiento a los resultados de cada paciente.

## Módulo Proveedores (administrativo)

21. Como administrativo, quiero registrar un proveedor (RIF/cédula, razón social, persona de
    contacto), para poder asociarlo a compras de inventario.
22. Como administrativo, quiero editar, listar y eliminar proveedores, para mantener actualizado
    el directorio de abastecimiento.
   *(Nota: el modelo de proveedores fue solicitado como "aún no definido"; estas historias cubren
   el CRUD mínimo mientras se termina de precisar con el equipo.)*

## Reglas de validación transversales

23. Como usuario del sistema, quiero que ningún formulario permita guardar una fecha vacía o
    inválida, para que los registros históricos sean confiables.
24. Como usuario del sistema, quiero que el campo género solo permita elegir entre "M" y "F" desde
    una lista cerrada, para evitar valores inconsistentes.
