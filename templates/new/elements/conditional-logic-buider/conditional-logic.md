# Query Builder Documentation

Компонент предназначен для построения булевой логики по заданным пользователем правилам.
Построенная логика сохраняется в виде объекта данных.

## Модель

В качестве v-model компонент принимает объект из которого в дальнейшем он строит нужную выборку с 
заданным уровнем вложенности. Построенная json выборка представляет из себя примерно следующий вид:
```
{
    type: 'group',
    operator: 'AND' or 'OR',
    children: [
        // В качестве вложенных элементов могут выступать объекты правил или групп
        {
            type: 'rule',
            rule: 'ID of the rule',
            inputs: {
                'input 1 name': 'input 1 value',
                'input 2 name': 'input 2 value',
                ...
            }
        }, 
        {
            type: 'group',
            ...
        }
    ]
}
```

## Параметры

```
// Массив правил
rules: {
    type: Array,
    default: () => []
}

// Максимальный уровень вложенности для построения выборки
maxDepth: {
    type: Number,
    default: 20,
    validator: (value) => value > 1,
},
```

### Правила
Правило это объект, который содержит три свойства
```
{
    id: String,
    label: String,
    layout: String,
    inputs: [Array, Function, Promise]
}
```
- **id**: ID правило, которое будет сохранено в построенном json
- **label**: Читаемое название правила
- **layout**: Как будут располагаться инпуты: 'horizontal' (по умолчанию), 'vertical' или 'inline'
- **inputs**: Массив объектов (либо функция / Promise, которая должна возвращать массив объектов) 
с определением инпутов для текущего правила. 

### Инпуты
В правиле могут быть определены один или несколько инпутов. С помощью инпутов пользователь строит
нужную ему булеву логику.
```
{
    type: String,
    name: String,
    label: String,
    as: [String, Function],
    validator: Function,
    placeholder: String,
    default: Any,
    style: [String, Object],
    options: Array,
    multiple: Boolean,
    component: VueComponent,
    tag: String,
    bind: Object,
}
```
- **type**: Тип инпута, может быть `text`, `number`, `date`, `email`, `checkbox`, `radio`, `select`, `component`
- **name**: Ключ, в который будет сохраняться значение инпута в построенном json. Должен быть уникальным для каждого инпута в правиле
- **label**: Название инпута (используется для horizontal / vertical расположения)
- **as**: В какой формат конвертировать значение инпута. Строка вида: `number` или `boolean`. Так же может быть функцией, которая обработает и вернет значение.
- **validator**: Функция с правилами валидации для инпута в формате simple-vue-validator. 
- **placeholder**: Плейсхолдер для инпута
- **default**: Начальное значение для инпута
- **style**: Стиль, который будет применен к контейнеру .rule-filter-container
- **options**: (Только для типа `select`) Массив опций в формате label/value `[{label: '', value: ''}]` или просто value `['1', '2']`
- **multiple**: (Только для типа `select`) Флаг множественного выбора
- **component**: (Только для типа `component`) Объект компонента (импортированный)
- **tag**: (Только для типа `component`) HTML тэг под которым будет зарегистрирован компонент `component`
- **bind**: (Только для типа `component`) Опции, которые передаются компоненту как v-bind