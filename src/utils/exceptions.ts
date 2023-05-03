export class InvalidParamsError extends Error {
  statusCode: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || 400;
    if (!message) this.message = "요청한 데이터 형식이 올바르지 않습니다.";
  }
}

export class InvalidAccessError extends Error {
  statusCode: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || 412;
    if (!message) this.message = "인증 헤더 오류";
  }
}

export class InternalError extends Error {
  statusCode: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode || 500;
    if (!message) this.message = "서버 내부 오류";
  }
}
