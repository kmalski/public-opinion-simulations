export const CORS = {
  origin: [/localhost:\d{4}/, /127\.0\.0\.1:\d{4}/, /simulations-api:\d{4}/, /\.malski\.pl$/],
  httpMethods: ['GET', 'POST']
};

export const MAX_PROCESS_COUNT = 3;

export const STEP_REGEX = /^\[STEP] (.*)$/gm;
