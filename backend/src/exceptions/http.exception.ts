export class HttpException extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = 'Recurso no encontrado.') {
    super(404, message);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message = 'No autorizado.') {
    super(401, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = 'No tiene permisos para realizar esta acción.') {
    super(403, message);
  }
}

export class ConflictException extends HttpException {
  constructor(message = 'Conflicto en la solicitud.') {
    super(409, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message = 'Solicitud incorrecta.') {
    super(400, message);
  }
}
