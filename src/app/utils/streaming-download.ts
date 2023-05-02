import * as streamSaver from 'streamsaver';

export function saveStreamingResponse(response: Response, filename: string): void {
  response.body.pipeTo(streamSaver.createWriteStream(filename));
}
