export function responseSuccessful(message: string): Response {
  return Response.json(
    {
      success: true,
      message,
    },
    {
      status: 200,
    },
  );
}

export function responseSuccessfulForPost(message: string): Response {
  return Response.json(
    {
      success: true,
      message,
    },
    {
      status: 201,
    },
  );
}

export function responseBadRequest(message: string): Response {
  console.error(message);

  return Response.json(
    {
      success: false,
      message,
    },
    {
      status: 400,
    },
  );
}

export function responseUnauthorized(message: string): Response {
  console.error(message);

  return Response.json(
    {
      success: false,
      message,
    },
    {
      status: 401,
    },
  );
}

export function responseNotFound(message: string): Response {
  console.error(message);

  return Response.json(
    {
      success: false,
      message,
    },
    {
      status: 404,
    },
  );
}

export function responseInternalServerError(message: string): Response {
  console.error(message);

  return Response.json(
    {
      success: false,
      message,
    },
    {
      status: 500,
    },
  );
}

interface bodyForResponse {
  message: string;
  data: unknown;
  headers?: HeadersInit;
}

export function responseSuccessfulWithData({
  message,
  data,
  headers,
}: bodyForResponse): Response {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    {
      status: 200,
      headers,
    },
  );
}

export function responseSuccessfulForPostWithData({
  message,
  data,
}: bodyForResponse): Response {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    {
      status: 201,
    },
  );
}
