import { GenotypePreview } from '../genotype-preview-model/genotype-preview';

function splitStream(splitOn: string) {
  let buffer = '';
  return new TransformStream({
    transform(chunk, controller) {
      buffer += chunk;
      const parts = buffer.split(splitOn);
      parts.slice(0, -1).forEach(part => controller.enqueue(part));
      buffer = parts[parts.length - 1];
    },
    flush(controller) {
      if (buffer) controller.enqueue(buffer);
    }
  });
}

function parseJSON() {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(JSON.parse(chunk));
    }
  });
}

export function jsonStream(url: string, body: object, accessToken: string = null): Promise<ReadableStream> {
  const headers = {'Content-Type': 'application/json'};
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: headers,
    body: JSON.stringify(body)
  }).then(response => {
    return response.body
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(splitStream('\n'))
      .pipeThrough(parseJSON())
  });
}

export function variantFromJSON(columns: string[]) {
  return new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(GenotypePreview.fromJson(chunk, columns));
    }
  });
}

export function consumeReader(reader: ReadableStreamDefaultReader, onValue: Function, onDone: Function) {
  reader.read().then(({ value, done }) => {
    if (done) {
      onDone();
      return;
    }
    onValue(value);
    consumeReader(reader, onValue, onDone);
  }, e => {
    console.error("Encountered error while streaming:", e);
  });
}
