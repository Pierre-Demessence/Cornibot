import { Transform, TransformOptions } from "stream";

function convertBufferTo1Channel(buffer: Buffer): Buffer {
  const convertedBuffer = Buffer.alloc(buffer.length / 2);

  for (let i = 0; i < convertedBuffer.length / 2; i++) {
    const uint16 = buffer.readUInt16LE(i * 4);
    convertedBuffer.writeUInt16LE(uint16, i * 2);
  }

  return convertedBuffer;
}

export default class ConvertTo1ChannelStream extends Transform {
  constructor(source?: any, options?: TransformOptions) {
    super(options);
  }

  public _transform(data: Buffer, encoding: any, next: (arg0: null, arg1: Buffer) => void) {
    next(null, convertBufferTo1Channel(data));
  }
}
