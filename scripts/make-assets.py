"""Generate the original geometric TubeQuiet mark; standard-library only."""
import struct,zlib,pathlib,math
ROOT=pathlib.Path(__file__).resolve().parents[1]
def png(path,w,h,color):
    scale=3; rows=[]
    for y in range(h):
        row=bytearray([0])
        for x in range(w):
            samples=[color((x+(i+.5)/scale)/w,(y+(j+.5)/scale)/h) for j in range(scale) for i in range(scale)]
            row.extend(round(sum(s[c] for s in samples)/len(samples)) for c in range(4))
        rows.append(bytes(row))
    def chunk(kind,data):return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data)&0xffffffff)
    path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(rows),9))+chunk(b'IEND',b''))
def mark(x,y):
    # A mint Q with a play-shaped counter, distinct from the YouTube logo.
    r=math.hypot(x-.48,y-.47)
    ring=.20<r<.35
    tail=.55<x<.81 and abs(y-x+.015)<.065
    if ring or tail:return (128,228,192,255)
    if .405<x<.59 and abs(y-.47)<(.59-x)*.7:return (235,252,243,255)
    return (0,0,0,0)
for n in (16,32,48,128):png(ROOT/f'extension/icons/icon-{n}.png',n,n,mark)
def promo(x,y):
    base=(int(16+9*x),int(29+21*y),int(29+15*x),255)
    sx=(x-.5)*1.8+.5;sy=(y-.5)*1.15+.5
    if 0<sx<1 and 0<sy<1:
        c=mark(sx,sy)
        if c[3]:return c
    return base
png(ROOT/'store/assets/promo-440x280.png',440,280,promo)
(ROOT/'store/assets/icon.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><circle cx="61" cy="60" r="35" fill="none" stroke="#80e4c0" stroke-width="19"/><path d="m75 79 22 22" stroke="#80e4c0" stroke-width="16"/><path d="m52 44 24 16-24 16z" fill="#ebfcf3"/></svg>')
print('Generated 4 extension icons and 440x280 promotional image.')
