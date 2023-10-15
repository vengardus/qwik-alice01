export class AppConfig {
  static PAGINATION = {
    limit: 7,
    next: 'next',
    prev: 'prev'
  }

  static ACTION = {
    insert: 'insert',
    update: 'update',
    delete: 'delete',
  }

  static LABELS = {
    buttonCloseModalInfo: 'Ok',
    buttonCloseModalForm: 'Regresar'
  }

  static KEYS = {
    cokieNameJwt: 'jwtToken'
  }

  static JWT = {
    alg:'HS256',
    expiration:'365d'
  }

}