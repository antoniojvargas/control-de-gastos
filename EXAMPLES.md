# Ejemplos

Ejemplos de código del mundo real que demuestran los cuatro principios. Cada ejemplo muestra lo que los LLMs suelen hacer mal y cómo corregirlo.

---

## 1. Piensa Antes de Programar

### Ejemplo 1: Suposiciones Ocultas

**Solicitud del Usuario:** "Agrega una función para exportar datos de usuarios"

**❌ Lo que hacen los LLMs (Suposiciones incorrectas)**

```python
def export_users(format='json'):
    """Export all users to a file."""
    users = User.query.all()
    
    if format == 'json':
        with open('users.json', 'w') as f:
            json.dump([u.to_dict() for u in users], f)
    elif format == 'csv':
        with open('users.csv', 'w') as f:
            writer = csv.DictWriter(f, fieldnames=['id', 'email', 'name'])
            writer.writeheader()
            writer.writerows([u.to_dict() for u in users])
    
    return f"Exported {len(users)} users"
```

**Problemas:**
- Asumió que debía exportar TODOS los usuarios (¿qué pasa con paginación o privacidad?)
- Asumió la ubicación del archivo sin preguntar
- Asumió qué campos incluir
- Asumió los campos del CSV sin verificar la estructura real de los datos

**✅ Lo que debería pasar (Expresar las suposiciones)**

```
Antes de implementar, necesito aclarar:

1. **Alcance**: ¿Exportar todos los usuarios o solo un subconjunto filtrado? (implicaciones de privacidad)
2. **Formato**: Mencionaste "exportar", ¿te refieres a:
   - Descargar un archivo en el navegador?
   - Trabajo en segundo plano con notificación por email?
   - Endpoint API que devuelve datos?
3. **Campos**: ¿Qué campos de usuario deben incluirse? (algunos podrían ser sensibles)
4. **Volumen**: ¿Cuántos usuarios hay típicamente? (afecta el enfoque)

El enfoque más simple: agregar un endpoint API que devuelva JSON paginado.
Necesitaría más información para exportaciones basadas en archivos.

¿Cuál prefieres?
```

### Ejemplo 2: Múltiples Interpretaciones

**Solicitud del Usuario:** "Haz la búsqueda más rápida"

**❌ Lo que hacen los LLMs (Eligen silenciosamente)**

```python
# Adds caching, database indexes, and async processing
# without asking which "faster" matters
@lru_cache(maxsize=1000)
async def search(query: str) -> List[Result]:
    # ... 200 lines of optimization code
```

**✅ Lo que debería pasar**

```
"Hacer la búsqueda más rápida" puede significar:

1. **Menor tiempo de respuesta** (< 100ms en lugar de 500ms)
   - Agregar índices en la base de datos
   - Cachear consultas frecuentes
   - Esfuerzo estimado: 2 horas

2. **Manejar más búsquedas concurrentes** (throughput)
   - Agregar async/await
   - Pooling de conexiones
   - Esfuerzo estimado: 4 horas

3. **Mayor velocidad percibida** (UX)
   - Mostrar resultados parciales inmediatamente
   - Carga progresiva
   - Esfuerzo estimado: 3 horas

La búsqueda actual tarda ~500ms para consultas típicas.

¿Qué aspecto es el más importante para tu caso de uso?
```

---

## 2. Simplicidad Primero

### Ejemplo 1: Sobre-abstracción

**Solicitud del Usuario:** "Agrega una función para calcular descuentos"

**❌ Lo que hacen los LLMs (Sobreingeniería)**

```python
from abc import ABC, abstractmethod
from enum import Enum
from typing import Protocol, Union
from dataclasses import dataclass

class DiscountStrategy(ABC):
    @abstractmethod
    def calculate(self, amount: float) -> float:
        pass

class PercentageDiscount(DiscountStrategy):
    def __init__(self, percentage: float):
        self.percentage = percentage
    
    def calculate(self, amount: float) -> float:
        return amount * (self.percentage / 100)

class FixedDiscount(DiscountStrategy):
    def __init__(self, fixed_amount: float):
        self.fixed_amount = fixed_amount
    
    def calculate(self, amount: float) -> float:
        return min(self.fixed_amount, amount)

@dataclass
class DiscountConfig:
    strategy: DiscountStrategy
    min_purchase: float = 0.0
    max_discount: float = float('inf')

class DiscountCalculator:
    def __init__(self, config: DiscountConfig):
        self.config = config
    
    def apply_discount(self, amount: float) -> float:
        if amount < self.config.min_purchase:
            return 0
        discount = self.config.strategy.calculate(amount)
        return min(discount, self.config.max_discount)

# Usage requires 30+ lines of setup for a simple calculation
```

**✅ Lo que debería pasar (Simple)**

```python
def calculate_discount(amount: float, percent: float) -> float:
    """Calculate discount amount. percent should be 0-100."""
    return amount * (percent / 100)

# Usage
discount = calculate_discount(100.0, 10.0)  # $10 off
```

**Cuándo agregar complejidad:** OSolo cuando realmente necesites múltiples tipos de descuento. Si ese requerimiento aparece después, refactoriza entonces.

### Ejemplo 2: Funcionalidades Especulativas

**Solicitud del Usuario:** "Guardar preferencias del usuario en la base de datos"

**❌ Lo que hacen los LLMs (Funciones innecesarias)**

```python
class PreferenceManager:
    def __init__(self, db, cache=None, validator=None):
        self.db = db
        self.cache = cache or InMemoryCache()
        self.validator = validator or DefaultValidator()
    
    def save(self, user_id: int, prefs: dict, 
             merge: bool = True, 
             validate: bool = True,
             notify: bool = False) -> bool:
        """Save preferences with optional merging, validation, and notifications."""
        
        if validate:
            errors = self.validator.validate(prefs)
            if errors:
                raise ValidationError(errors)
        
        existing = self.get(user_id) if merge else {}
        
        if merge:
            existing.update(prefs)
            prefs = existing
        
        self.db.execute(
            "UPDATE users SET preferences = ? WHERE id = ?",
            (json.dumps(prefs), user_id)
        )
        
        if self.cache:
            self.cache.set(f"prefs:{user_id}", prefs)
        
        if notify:
            self.notify_preference_change(user_id, prefs)
        
        return True
    
    def notify_preference_change(self, user_id: int, prefs: dict):
        # Another 30 lines for a feature nobody asked for
        pass
```

**✅ Lo que debería pasar (Solo lo solicitado)**

```python
def save_preferences(db, user_id: int, preferences: dict):
    """Save user preferences to database."""
    db.execute(
        "UPDATE users SET preferences = ? WHERE id = ?",
        (json.dumps(preferences), user_id)
    )
```

**Agregar después si es necesario:** CCaché (cuando el rendimiento importe), validación (cuando aparezcan datos inválidos), merge (cuando el requerimiento exista).

---

## 3. Cambios Quirúrgicos

### Ejemplo 1: Refactorización accidental

**Solicitud del Usuario:** "Corrige el bug donde emails vacíos rompen el validador"

**❌ Lo que hacen los LLMs (Demasiado cambio)**

```diff
  def validate_user(user_data):
-     # Check email format
-     if not user_data.get('email'):
+     """Validate user data."""
+     email = user_data.get('email', '').strip()
+     
+     # Validate email
+     if not email:
          raise ValueError("Email required")
-     
-     # Basic email validation
-     if '@' not in user_data['email']:
+     if '@' not in email or '.' not in email.split('@')[1]:
          raise ValueError("Invalid email")
      
-     # Check username
-     if not user_data.get('username'):
+     # Validate username
+     username = user_data.get('username', '').strip()
+     if not username:
          raise ValueError("Username required")
+     if len(username) < 3:
+         raise ValueError("Username too short")
+     if not username.isalnum():
+         raise ValueError("Username must be alphanumeric")
      
      return True
```

**Problemas:**
- “Mejoró” la validación de email más allá del bug reportado
- Agregó validación de username que nadie pidió
- Cambió comentarios
- Agregó docstring

**✅ Lo que debería pasar (Quirúrgico)**

```diff
  def validate_user(user_data):
      # Check email format
-     if not user_data.get('email'):
+     email = user_data.get('email', '')
+     if not email or not email.strip():
          raise ValueError("Email required")
      
      # Basic email validation
-     if '@' not in user_data['email']:
+     if '@' not in email:
          raise ValueError("Invalid email")
      
      # Check username
      if not user_data.get('username'):
          raise ValueError("Username required")
      
      return True
```

**Solo se cambió:** Las líneas específicas necesarias para corregir el manejo de emails vacíos.

### Ejemplo 2: Deriva de Estilo

**Solicitud del Usuario:** "Agrega logging a la función de subida"

**❌ Lo que hacen los LLMs (Reformatean todo)**

```diff
- def upload_file(file_path, destination):
+ def upload_file(file_path: str, destination: str) -> bool:
+     """Upload file to destination with logging."""
+     logger.info(f"Uploading {file_path} to {destination}")
+     
      try:
-         with open(file_path, 'rb') as f:
-             data = f.read()
-         
-         response = requests.post(destination, files={'file': data})
-         
-         if response.status_code == 200:
-             return True
-         else:
-             return False
+         with open(file_path, "rb") as f:
+             data = f.read()
+         response = requests.post(destination, files={"file": data})
+         success = response.status_code == 200
+         
+         if success:
+             logger.info(f"Upload successful: {file_path}")
+         else:
+             logger.error(f"Upload failed: {file_path}, status={response.status_code}")
+         
+         return success
      except Exception as e:
-         print(f"Error: {e}")
+         logger.exception(f"Upload error for {file_path}: {e}")
          return False
```

**Problemas:**
- Cambió el estilo de comillas ('' → "")
- Agregó type hints que nadie pidió
- Agregó docstring
- Reformateó espacios
- Cambió la lógica del booleano de retorno

**✅ Lo que debería pasar (Mantener el estilo existente)**

```diff
+ import logging
+ 
+ logger = logging.getLogger(__name__)
+ 
  def upload_file(file_path, destination):
+     logger.info(f'Starting upload: {file_path}')
      try:
          with open(file_path, 'rb') as f:
              data = f.read()
          
          response = requests.post(destination, files={'file': data})
          
          if response.status_code == 200:
+             logger.info(f'Upload successful: {file_path}')
              return True
          else:
+             logger.error(f'Upload failed: {file_path}, status={response.status_code}')
              return False
      except Exception as e:
-         print(f"Error: {e}")
+         logger.exception(f'Upload error: {file_path}')
          return False
```

**Se mantuvo:** Comillas simples, sin type hints, mismo patrón booleano y estilo de espaciado.

---

## 4. Ejecución Orientada a Objetivos

### Ejemplo 1: Vago vs. Verificable

**Solicitud del Usuario:** "Corrige el sistema de autenticación"

**❌ Lo que hacen los LLMs (Enfoque vago)**

```
Voy a corregir el sistema de autenticación:
1. Revisando el código
2. Identificando problemas
3. Haciendo mejoras
4. Probando los cambios

[Procede a hacer cambios sin criterios claros de éxito]
```

**✅ Lo que debería pasar (Objetivos verificables)**

```
Para "corregir autenticación", necesito definir criterios de éxito.
¿Qué problema específico estamos resolviendo?

Si el problema es "los usuarios permanecen logueados después de cambiar la contraseña":

Plan:
1. Escribir prueba: Cambiar contraseña → verificar que la sesión antigua se invalide
   Verificar: La prueba falla (reproduce el bug)

2. Implementar: Invalidar sesiones al cambiar contraseña
   Verificar: La prueba pasa

3. Revisar casos límite: múltiples sesiones activas, cambios concurrentes
   Verificar: Las pruebas adicionales pasan

4. Verificar que no haya regresiones: las pruebas existentes de auth siguen pasando
   Verificar: Suite completa en verde

Cobertura actual de pruebas para auth: [muestra cobertura]

¿Cuál es el problema específico de autenticación que estás viendo?
```

### Ejemplo 2: Múltiples pasos con verificación

**Solicitud del Usuario:** "Agrega rate limiting a la API"

**❌ Lo que hacen los LLMs (Todo de una vez)**

```python
# Implements full rate limiting with Redis, multiple strategies,
# configuration system, and monitoring in one 300-line commit
# No clear verification steps
```

**✅ What Should Happen (Incremental with Verification)**

```
Plan para rate limiting:

1. Agregar rate limiting básico en memoria (un endpoint)
   Verificar:
   - Test: 100 requests → las primeras 10 funcionan, el resto devuelve 429
   - Manual: ejecutar curl 11 veces y ver el error de rate limit

2. Extraer a middleware (aplicar a todos los endpoints)
   Verificar:
   - Test: Rate limiting aplica a /users y /posts
   - Las pruebas existentes siguen pasando

3. Agregar backend con Redis (multi-servidor)
   Verificar:
   - Test: El límite persiste después de reiniciar la app
   - Test: Dos instancias comparten el contador

4. Agregar configuración (límites por endpoint)
   Verificar:
   - Test: /search permite 10/min, /users permite 100/min
   - El archivo de configuración se parsea correctamente

Cada paso es verificable y desplegable de manera independiente.
¿Comenzamos con el paso 1?
```

### Ejemplo 3: Verificación primero con pruebas

**Solicitud del Usuario:** "El ordenamiento falla cuando hay puntuaciones duplicadas"

**❌ Lo que hacen los LLMs (Corrigen sin reproducir)**

```python
# Immediately changes sort logic without confirming the bug
def sort_scores(scores):
    return sorted(scores, key=lambda x: (-x['score'], x['name']))
```

**✅ Lo que debería pasar (Reproducir primero)**

```python
# 1. First, write a test that reproduces the issue
def test_sort_with_duplicate_scores():
    """Test sorting when multiple items have same score."""
    scores = [
        {'name': 'Alice', 'score': 100},
        {'name': 'Bob', 'score': 100},
        {'name': 'Charlie', 'score': 90},
    ]
    
    result = sort_scores(scores)
    
    # The bug: order is non-deterministic for duplicates
    # Run this test multiple times, it should be consistent
    assert result[0]['score'] == 100
    assert result[1]['score'] == 100
    assert result[2]['score'] == 90

# Verify: Run test 10 times → fails with inconsistent ordering

# 2. Now fix with stable sort
def sort_scores(scores):
    """Sort by score descending, then name ascending for ties."""
    return sorted(scores, key=lambda x: (-x['score'], x['name']))

# Verify: Test passes consistently
```

---

## Resumen de Anti-Patrones

| Principio                 | Anti-Patrón                       |Solución                           |
| ------------------------- | --------------------------------- | --------------------------------- |
| Piensa Antes de Programar | Asume silenciosamente formato de archivo, campos y alcance      | Expón las suposiciones explícitamente y pide aclaraciones                         |
| Simplicidad Primero       | Patrón Strategy para un solo cálculo de descuento               | Una función hasta que la complejidad realmente sea necesaria                      |
| Cambios Quirúrgicos       | Reformatea comillas y agrega type hints mientras corrige un bug | Cambia únicamente las líneas necesarias para resolver el problema                 |
| Orientado a Objetivos     | "Voy a revisar y mejorar el código"                             | "Escribir test para el bug X → hacerlo pasar → verificar que no haya regresiones" |


## Idea Clave

Los ejemplos “sobrecomplicados” no están obviamente mal: siguen patrones de diseño y buenas prácticas. El problema es el momento: agregan complejidad antes de que sea necesaria, lo que:

- Hace el código más difícil de entender
- Introduce más bugs
- Toma más tiempo implementar
- Hace más difícil probarlo

Las versiones “simples” son:
- Más fáciles de entender
- Más rápidas de implementar
- Más fáciles de probar
- Pueden refactorizarse después cuando la complejidad realmente sea necesaria

**El buen código es aquel que resuelve el problema de hoy de manera simple, no el problema de mañana prematuramente.**