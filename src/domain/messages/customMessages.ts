export class CustomMessages {
  static msgClean() {
    return ''
  }
  static msgLoading() {
    return 'Espere un momento por favor'
  }
  static msgInsert() {
    return 'Agregando registro...'
  }
  static msgInsertOk() {
    return 'Registro agregado satisfactoriamente.'
  }
  static msgInsertError(msg='')  {
    return `Ocurrió un error, no se pudo agregar registro. ${msg}` 
  }
  static msgUpdate() {
    return 'Actualizando registro...'
  }
  static msgUpdateOk() {
    return 'Registro actualizado satisfactoriamente.'
  }
  static msgUpdateError(msg='')  {
    return `Ocurrió un error, no se pudo actualizar registro. ${msg}` 
  }

  static msgDelete() {
    return 'Eliminando registro...'
  }
  static msgDeleteOk() {
    return 'Registro eliminado satisfactoriamente.'
  }
  static msgDeleteError(msg='')  {
    return `Ocurrió un error, no se pudo eliminar registro. ${msg}` 
  }
}