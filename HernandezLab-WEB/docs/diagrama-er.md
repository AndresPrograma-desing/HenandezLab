# Diagrama entidad-relación — HernandezLab

> Punto de partida: diagrama de referencia (Eraser) con `pacientes`, `solicitudes`,
> `detalle_solicitud`, `examenes`, `reactivos_por_examen`, `empleados`, `inventario_reactivos`,
> `proveedores`, `compras_reactivos`, `detalle_compra`.
>
> Cambios propuestos respecto al original (a revisar con Santander antes de darlo por definitivo):
> 1. `empleados` gana `id_sucursal` y `rol` (administrativo/recepción) — es la misma tabla que
>    respalda el login del sistema (no se crea una tabla `usuarios` aparte).
> 2. Se agrega `sucursales`, de la cual dependen `empleados`, `inventario` y `solicitudes`.
> 3. `inventario_reactivos` se generaliza a `inventario`, con una columna `categoria` (insumos,
>    reactivos, mobiliario, maquinaria) en vez de ser una tabla exclusiva de reactivos. Esto
>    también implica que `reactivos_por_examen`, `detalle_compra` y `compras_reactivos` ahora
>    referencian `inventario` en vez de `inventario_reactivos`.
> 4. `proveedores` se mantiene igual (aún por terminar de definir con el equipo).

```mermaid
erDiagram
    SUCURSALES ||--o{ EMPLEADOS : "asigna"
    SUCURSALES ||--o{ INVENTARIO : "posee"
    SUCURSALES ||--o{ SOLICITUDES : "atiende en"

    PACIENTES ||--o{ SOLICITUDES : "solicita"
    EMPLEADOS ||--o{ SOLICITUDES : "atiende"
    SOLICITUDES ||--|{ DETALLE_SOLICITUD : "contiene"
    EXAMENES ||--o{ DETALLE_SOLICITUD : "es pedido en"

    EXAMENES ||--|{ REACTIVOS_POR_EXAMEN : "requiere"
    INVENTARIO ||--o{ REACTIVOS_POR_EXAMEN : "es requerido por"

    PROVEEDORES ||--o{ INVENTARIO : "suministra"
    PROVEEDORES ||--o{ COMPRAS_REACTIVOS : "recibe orden de"
    EMPLEADOS ||--o{ COMPRAS_REACTIVOS : "registra"
    COMPRAS_REACTIVOS ||--|{ DETALLE_COMPRA : "contiene"
    INVENTARIO ||--o{ DETALLE_COMPRA : "es comprado en"

    SUCURSALES {
        uuid id_sucursal PK
        string nombre
        string direccion
        string telefono
        boolean activo
    }

    EMPLEADOS {
        string cedula PK
        string nombre
        string apellido
        string cargo
        boolean estado_activo
        string rol
        uuid id_sucursal FK
        uuid auth_user_id FK
    }

    PACIENTES {
        string cedula PK
        string nombre
        string apellido
        date fecha_nacimiento
        string genero
    }

    EXAMENES {
        uuid id_examen PK
        string codigo_examen
        string nombre_examen
        decimal precio
        string tiempo_entrega
    }

    SOLICITUDES {
        uuid id_solicitud PK
        string cedula_paciente FK
        string cedula_empleado FK
        uuid id_sucursal FK
        date fecha_solicitud
        string estado
        decimal total_pagar
    }

    DETALLE_SOLICITUD {
        uuid id_detalle PK
        uuid id_solicitud FK
        uuid id_examen FK
        string resultado
        string estado_examen
    }

    INVENTARIO {
        uuid id_item PK
        uuid id_sucursal FK
        uuid id_proveedor FK
        string categoria
        string codigo
        string nombre
        decimal stock_actual
        decimal stock_minimo
        date fecha_vencimiento
        string lote
    }

    REACTIVOS_POR_EXAMEN {
        uuid id_relacion PK
        uuid id_examen FK
        uuid id_item FK
        decimal cantidad_requerida
    }

    PROVEEDORES {
        uuid id_proveedor PK
        string rif_cedula
        string razon_social
        string persona_contacto
    }

    COMPRAS_REACTIVOS {
        uuid id_compra PK
        uuid id_proveedor FK
        string cedula_empleado FK
        date fecha_compra
        string numero_factura
        decimal monto_total
    }

    DETALLE_COMPRA {
        uuid id_detalle_compra PK
        uuid id_compra FK
        uuid id_item FK
        decimal cantidad_comprada
        decimal costo_unitario
    }
```
