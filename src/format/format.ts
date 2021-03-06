﻿module format {
	export function detectFormatAsync(asyncStream: AsyncStream): Promise<string> {
		return asyncStream.readChunkAsync(0, 4).then((data):any => {
			var stream = Stream.fromArrayBuffer(data);
			var magic = stream.readString(4);
			switch (magic) {
				case '\u0000PBP': return 'pbp';
				case '\u007FELF': return 'elf';
				case 'CISO': return 'ciso';
				case '\u0000\u0000\u0000\u0000':
					return asyncStream.readChunkAsync(0x10 * 0x800, 6).then(data => {
						var stream = Stream.fromArrayBuffer(data);
						var magic = stream.readString(6);
						switch (magic) {
							case '\u0001CD001':
								return 'iso';
							default:
								throw (sprintf("Unknown format. Magic: '%s'", magic));
						}
					});
				default:
					break;
			}
			throw (sprintf("Unknown format. Magic: '%s'", magic));
		});
	}
} 
